export default function EmptyState({ title, description, action }) {
  return (
    <div className="skeuo-well flex flex-col items-center gap-2 rounded-2xl p-8 md:p-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 shadow-xs text-xl mb-1">
        📦
      </div>
      <h3
        className="font-display text-lg font-bold text-primary"
        style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.9)' }}
      >
        {title}
      </h3>
      {description && (
        <p className="max-w-sm text-sm font-medium text-primary/65" style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.7)' }}>
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

