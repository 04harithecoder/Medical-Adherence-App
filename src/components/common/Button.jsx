const variants = {
  primary: 'bg-accent text-white hover:bg-accent/90 disabled:bg-accent/40',
  secondary: 'bg-primary text-white hover:bg-primary/90 disabled:bg-primary/40',
  outline: 'border border-primary/25 text-primary hover:bg-primary/5 disabled:opacity-40',
  ghost: 'text-primary hover:bg-primary/5 disabled:opacity-40',
}

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  className = '',
  children,
  ...props
}) {
  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5
        text-sm font-semibold transition-colors duration-150 disabled:cursor-not-allowed
        ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}
