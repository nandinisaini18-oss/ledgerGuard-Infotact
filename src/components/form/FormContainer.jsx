function FormContainer({ title, subtitle, children, footer }) {
  return (
    <div className="form-container">
      <div className="form-container__header">
        <h1 className="form-container__title">{title}</h1>
        {subtitle && <p className="form-container__subtitle">{subtitle}</p>}
      </div>
      <div className="form-container__body">
        {children}
      </div>
      {footer && <div className="form-container__footer">{footer}</div>}
    </div>
  )
}

export default FormContainer
