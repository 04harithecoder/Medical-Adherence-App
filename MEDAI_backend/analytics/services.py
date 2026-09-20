"""
Rule-based adherence analytics engine.

Everything here is deliberately simple, transparent arithmetic and
threshold checks — no black-box scoring. This is what the Phase 1 spec
calls "Adherence Pattern Risk", explicitly NOT a medical/health risk
score, and explicitly NOT ML (that's a later, opt-in phase — see
Phase 1 section 6: "Do NOT create fake AI functionality").

Thresholds are pulled from a single dict below so a later admin-config
screen just has to write to this shape, not touch the logic.
"""
from datetime import date, timedelta
from collections import defaultdict

from doses.models import DoseRecord

# ---------------------------------------------------------------------------
# Configurable thresholds (Phase 1 section 10: "exact thresholds should be
# configurable"). Swap this for a DB-backed config later without touching
# the functions below.
# ---------------------------------------------------------------------------
THRESHOLDS = {
    'risk_period_days': 7,          # window used for the risk indicator
    'high_missed_count': 3,         # >= this many misses in the window -> HIGH
    'moderate_missed_count': 1,     # >= this many misses in the window -> MODERATE
    'pattern_period_days': 14,      # window used for pattern detection
    'evening_miss_threshold': 2,    # repeated evening misses to flag
    'morning_miss_threshold': 2,    # repeated morning misses to flag
    'medication_miss_threshold': 2, # misses for one medication to flag it specifically
    'short_period_days': 2,         # "multiple missed doses within a short period"
    'short_period_count': 2,        # that many misses inside short_period_days
    'evening_hour': 17,             # >= this hour counts as "evening"
    'morning_hour': 12,             # < this hour counts as "morning"
}


def _due_doses(patient, start_date, end_date):
    """
    Only doses whose scheduled_date has actually arrived can meaningfully
    be "adhered to" or not — a dose scheduled for tomorrow isn't missed yet.
    """
    return DoseRecord.objects.filter(
        patient=patient,
        scheduled_date__gte=start_date,
        scheduled_date__lte=min(end_date, date.today()),
    )


def compute_adherence(patient, start_date, end_date):
    """Adherence % = Taken / Total scheduled (due) doses * 100."""
    qs = _due_doses(patient, start_date, end_date)
    total = qs.count()
    taken = qs.filter(status='taken').count()
    missed = qs.filter(status='missed').count()
    percentage = round((taken / total) * 100, 2) if total else 0.0
    return {
        'period_start': start_date,
        'period_end': end_date,
        'total_scheduled': total,
        'total_taken': taken,
        'total_missed': missed,
        'adherence_percentage': percentage,
    }


def compute_risk_level(patient):
    """
    LOW / MODERATE / HIGH — an "Adherence Pattern Risk" only. Never a
    medical/health risk claim (see Phase 1 section 10).
    """
    start = date.today() - timedelta(days=THRESHOLDS['risk_period_days'] - 1)
    missed = _due_doses(patient, start, date.today()).filter(status='missed').count()

    if missed >= THRESHOLDS['high_missed_count']:
        level = 'high'
    elif missed >= THRESHOLDS['moderate_missed_count']:
        level = 'moderate'
    else:
        level = 'low'

    return {
        'risk_level': level,
        'label': 'Adherence Pattern Risk',
        'missed_count': missed,
        'period_days': THRESHOLDS['risk_period_days'],
    }


def get_daily_trend(patient, days=7):
    """One adherence-% point per day for the last `days` days — feeds the
    weekly adherence line chart."""
    end = date.today()
    start = end - timedelta(days=days - 1)
    points = []
    cursor = start
    while cursor <= end:
        day_stats = compute_adherence(patient, cursor, cursor)
        points.append({
            'date': cursor.isoformat(),
            'adherence_percentage': day_stats['adherence_percentage'],
            'taken': day_stats['total_taken'],
            'missed': day_stats['total_missed'],
        })
        cursor += timedelta(days=1)
    return points


def get_medication_wise(patient, days=30):
    """Per-medication adherence % over the last `days` days."""
    start = date.today() - timedelta(days=days - 1)
    qs = _due_doses(patient, start, date.today()).select_related('medication')

    by_medication = defaultdict(lambda: {'taken': 0, 'total': 0, 'name': ''})
    for dose in qs:
        bucket = by_medication[dose.medication_id]
        bucket['name'] = dose.medication.medicine_name
        bucket['total'] += 1
        if dose.status == 'taken':
            bucket['taken'] += 1

    return [
        {
            'medication_id': med_id,
            'medicine_name': data['name'],
            'adherence_percentage': round((data['taken'] / data['total']) * 100, 2) if data['total'] else 0.0,
            'total_scheduled': data['total'],
            'total_taken': data['taken'],
        }
        for med_id, data in by_medication.items()
    ]


def detect_patterns(patient):
    """
    Rule-based behavioral pattern detection over the last
    THRESHOLDS['pattern_period_days'] days. Returns plain-language
    descriptions, per Phase 1 section 9 — never a diagnosis, only an
    adherence-behavior observation.
    """
    days = THRESHOLDS['pattern_period_days']
    start = date.today() - timedelta(days=days - 1)
    missed_doses = _due_doses(patient, start, date.today()).filter(
        status='missed'
    ).select_related('medication').order_by('scheduled_date')

    missed_list = list(missed_doses)
    patterns = []

    # Repeated missed doses overall
    if len(missed_list) >= THRESHOLDS['high_missed_count']:
        patterns.append({
            'type': 'repeated_missed_dose',
            'message': f'Repeated missed doses detected over the last {days} days.',
        })

    # Evening vs morning skew
    evening_misses = [d for d in missed_list if d.scheduled_time.hour >= THRESHOLDS['evening_hour']]
    morning_misses = [d for d in missed_list if d.scheduled_time.hour < THRESHOLDS['morning_hour']]

    if len(evening_misses) >= THRESHOLDS['evening_miss_threshold']:
        patterns.append({
            'type': 'evening_miss_pattern',
            'message': 'Repeated missed-dose pattern detected for evening medication.',
        })
    if len(morning_misses) >= THRESHOLDS['morning_miss_threshold']:
        patterns.append({
            'type': 'morning_miss_pattern',
            'message': 'Repeated missed-dose pattern detected for morning medication.',
        })

    # Medication-specific problems
    by_medication = defaultdict(list)
    for d in missed_list:
        by_medication[d.medication.medicine_name].append(d)
    for med_name, doses in by_medication.items():
        if len(doses) >= THRESHOLDS['medication_miss_threshold']:
            patterns.append({
                'type': 'medication_specific',
                'message': f'Adherence issue detected for {med_name} — repeated missed doses.',
            })

    # Multiple missed doses within a short window
    dates_sorted = sorted(d.scheduled_date for d in missed_list)
    window = timedelta(days=THRESHOLDS['short_period_days'])
    for i in range(len(dates_sorted)):
        cluster = [d for d in dates_sorted if dates_sorted[i] <= d <= dates_sorted[i] + window]
        if len(cluster) >= THRESHOLDS['short_period_count']:
            patterns.append({
                'type': 'short_period_cluster',
                'message': f'Multiple missed doses within a {THRESHOLDS["short_period_days"]}-day period.',
            })
            break

    # Increasing frequency: compare this week vs previous week
    this_week_start = date.today() - timedelta(days=6)
    prev_week_start = this_week_start - timedelta(days=7)
    prev_week_end = this_week_start - timedelta(days=1)
    this_week_missed = _due_doses(patient, this_week_start, date.today()).filter(status='missed').count()
    prev_week_missed = _due_doses(patient, prev_week_start, prev_week_end).filter(status='missed').count()
    if this_week_missed > prev_week_missed and this_week_missed >= THRESHOLDS['moderate_missed_count']:
        patterns.append({
            'type': 'increasing_frequency',
            'message': 'Missed-dose frequency is increasing compared to the previous week.',
        })

    return patterns
