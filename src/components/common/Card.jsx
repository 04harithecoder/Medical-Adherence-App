export default function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`rounded-2xl border border-primary/10 bg-surface p-5 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
