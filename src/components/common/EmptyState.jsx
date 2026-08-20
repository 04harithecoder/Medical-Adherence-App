export default function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed
      border-primary/20 bg-surface/50 px-6 py-12 text-center">
      <h3 className="font-display text-lg text-primary">{title}</h3>
      {description && <p className="max-w-sm text-sm text-primary/60">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
