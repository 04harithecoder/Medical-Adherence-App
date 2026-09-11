import { forwardRef } from 'react'

const Input = forwardRef(function Input({ label, error, id, className = '', ...props }, ref) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-bold uppercase tracking-wider text-primary/80"
          style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.8)' }}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={`skeuo-input rounded-xl px-3.5 py-2.5 text-sm text-primary
          placeholder:text-primary/40
          ${error ? 'skeuo-input-error' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs font-semibold text-accent" style={{ textShadow: '0 1px 0 rgba(255,255,255,0.6)' }}>
          {error}
        </p>
      )}
    </div>
  )
})

export default Input

