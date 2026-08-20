export default function Spinner({ label }) {
  return (
    <div className="flex flex-col items-center gap-3" role="status" aria-live="polite">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-primary/15 border-t-accent"
        aria-hidden="true"
      />
      {label && <p className="text-sm text-primary/60">{label}</p>}
    </div>
  )
}
