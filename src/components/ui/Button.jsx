import { forwardRef } from 'react'

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    type = 'button',
    className = '',
    ...props
  },
  ref
) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    loading && 'btn--loading',
    (disabled || loading) && 'btn--disabled',
    fullWidth && 'btn--full',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="btn__spinner" />}
      <span className={loading ? 'btn__text--hidden' : ''}>{children}</span>
    </button>
  )
})

export default Button
