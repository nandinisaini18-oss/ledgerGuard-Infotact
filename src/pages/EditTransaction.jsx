import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import TransactionForm from '../components/form/TransactionForm'
import FormContainer from '../components/form/FormContainer'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import Spinner from '../components/ui/Spinner'
import { getTransactionById, updateTransaction } from '../services/transaction'

export default function EditTransaction() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function fetchTransaction() {
      setLoading(true)
      setError('')
      try {
        const response = await getTransactionById(id)
        if (cancelled) return

        if (response.data?.success && response.data?.transaction) {
          const t = response.data.transaction
          setTransaction({
            title: t.title || '',
            amount: t.amount != null ? String(t.amount) : '',
            type: t.type || '',
            category: t.category || '',
            description: t.description || '',
          })
        } else {
          setError('Transaction not found')
        }
      } catch (err) {
        if (cancelled) return
        setError(err.message || 'Failed to load transaction')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchTransaction()
    return () => { cancelled = true }
  }, [id])

  async function handleSubmit(payload) {
    await updateTransaction(id, payload)
    navigate('/transactions', { state: { fromEdit: true } })
  }

  if (loading) {
    return (
      <FormContainer
        title="Edit transaction"
        subtitle="Loading transaction\u2026"
      >
        <div className="form-container__loading">
          <Spinner />
        </div>
      </FormContainer>
    )
  }

  if (error) {
    return (
      <FormContainer
        title="Edit transaction"
        subtitle="Unable to load transaction"
      >
        <Alert variant="error" message={error} />
        <div className="form-container__actions">
          <Link to="/transactions">
            <Button variant="secondary" fullWidth>
              Back to Transactions
            </Button>
          </Link>
        </div>
      </FormContainer>
    )
  }

  return (
    <TransactionForm
      initialData={transaction}
      onSubmit={handleSubmit}
      title="Edit transaction"
      subtitle="Update the details of this transaction."
      submitLabel="Update Transaction"
    />
  )
}
