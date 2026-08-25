const variants = {
  primary: 'skeuo-btn-primary',
  secondary: 'skeuo-btn-secondary',
  outline: 'skeuo-btn-outline',
  ghost: 'skeuo-btn-ghost',
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
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5
        text-sm font-semibold select-none disabled:cursor-not-allowed
        ${variants[variant] ?? variants.primary} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

