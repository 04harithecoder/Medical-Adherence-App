import { forwardRef } from 'react'

const Input = forwardRef(function Input({ label, error, id, className = '', ...props }, ref) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-primary/80">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={`rounded-lg border bg-white/60 px-3.5 py-2.5 text-sm text-primary
          placeholder:text-primary/35 focus:border-accent focus:bg-white
          focus:outline-none focus:ring-2 focus:ring-accent/25
          ${error ? 'border-accent' : 'border-primary/15'} ${className}`}
        {...props}
      />
      {error && <p className="text-xs font-medium text-accent">{error}</p>}
    </div>
  )
})

export default Input
