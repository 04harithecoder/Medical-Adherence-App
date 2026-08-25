export default function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`skeuo-card rounded-2xl p-5 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

