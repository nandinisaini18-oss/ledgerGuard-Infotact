import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import FormContainer from '../components/form/FormContainer'
import TransactionForm from '../components/form/TransactionForm'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import { createTransaction } from '../services/transaction'

const emptyForm = {
  title: '',
  amount: '',
  type: '',
  category: '',
  description: '',
}

export default function CreateTransaction() {
  const [success, setSuccess] = useState(false)
  const [showResetMessage, setShowResetMessage] = useState(false)

  useEffect(() => {
    if (success) {
      setShowResetMessage(true)
      const timeout = setTimeout(() => {
        setShowResetMessage(false)
      }, 3000)
      return () => clearTimeout(timeout)
    }
  }, [success])

  function handleReset() {
    setSuccess(false)
    setShowResetMessage(false)
  }

  async function handleSubmit(payload) {
    await createTransaction(payload)
    setSuccess(true)
  }

  if (success) {
    return (
      <FormContainer
        title="Transaction created"
        subtitle="The transaction has been created successfully."
        footer={
          <p className="form-container__footer-text">
            <Link to="/transactions" className="form-container__footer-link">
              Return to transactions
            </Link>
          </p>
        }
      >
        <Alert
          variant="success"
          title="Transaction created"
          message="The transaction has been added and will appear in your list."
        />
        <div className="form-container__actions">
          <Link to="/transactions/new">
            <Button variant="primary" fullWidth style={{ marginBottom: 'var(--space-4)' }} onClick={handleReset}>
              {showResetMessage ? 'Creating another transaction\u2026' : 'Create Another Transaction'}
            </Button>
          </Link>
          <Link to="/transactions">
            <Button variant="secondary" fullWidth onClick={handleReset}>
              Back to Transactions
            </Button>
          </Link>
        </div>
      </FormContainer>
    )
  }

  return (
    <TransactionForm
      initialData={emptyForm}
      onSubmit={handleSubmit}
      title="Create transaction"
      subtitle="Add a new income or expense transaction for your company."
      submitLabel="Create Transaction"
    />
  )
}
