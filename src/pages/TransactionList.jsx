import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTransactions } from '../services/transaction'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Alert from '../components/ui/Alert'
import EmptyState from '../components/ui/EmptyState'

const typeIcons = {
  income: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="19 12 12 5 5 12" />
    </svg>
  ),
  expense: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  ),
}

function TransactionRow({ transaction }) {
  const isIncome = transaction.type === 'income'
  const formattedDate = new Date(transaction.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <tr className="transaction-table__row">
      <td className="transaction-table__cell">
        <div className="transaction-table__title">{transaction.title}</div>
        {transaction.description && (
          <div className="transaction-table__description">{transaction.description}</div>
        )}
      </td>
      <td className="transaction-table__cell">
        <span className={`transaction-table__category ${isIncome ? 'income' : 'expense'}`}>
          {transaction.category}
        </span>
      </td>
      <td className="transaction-table__cell">
        <span className={`transaction-table__amount ${isIncome ? 'income' : 'expense'}`}>
          {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
        </span>
      </td>
      <td className="transaction-table__cell">
        <span className="transaction-table__type">
          {typeIcons[transaction.type]}
          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
        </span>
      </td>
      <td className="transaction-table__cell">
        <time className="transaction-table__date" dateTime={transaction.createdAt}>
          {formattedDate}
        </time>
      </td>
      <td className="transaction-table__cell">
        <Link to={`/transactions/${transaction._id}`} className="transaction-table__action">
          View
        </Link>
      </td>
    </tr>
  )
}

export default function TransactionList() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true)
      setError('')
      try {
        const response = await getTransactions()
        if (response.data?.success && response.data?.transactions) {
          setTransactions(response.data.transactions)
        } else {
          setError('Failed to load transactions')
        }
      } catch (err) {
        setError(err.message || 'An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  if (loading) {
    return (
      <div className="transaction-list__loading">
        <div className="spinner" role="status" aria-label="Loading transactions" />
      </div>
    )
  }

  return (
    <div className="transaction-list">
      <div className="transaction-list__header">
        <div>
          <h1 className="transaction-list__title">Transactions</h1>
          <p className="transaction-list__subtitle">
            View and manage all transactions for your company
          </p>
        </div>
        <Link to="/transactions/new">
          <Button variant="primary">New Transaction</Button>
        </Link>
      </div>

      {error && (
        <div className="transaction-list__error" role="alert">
          <Alert variant="error" message={error} />
        </div>
      )}

      {transactions.length === 0 ? (
        <Card className="transaction-list__empty">
          <EmptyState
            icon={
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            }
            title="No transactions yet"
            description="Get started by creating your first transaction."
            action={
              <Link to="/transactions/new">
                <Button variant="primary">Create Transaction</Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <Card className="transaction-list__table-wrapper">
          <div className="transaction-table-container">
            <table className="transaction-table" role="table">
              <thead>
                <tr className="transaction-table__header">
                  <th scope="col" className="transaction-table__header-cell">Title</th>
                  <th scope="col" className="transaction-table__header-cell">Category</th>
                  <th scope="col" className="transaction-table__header-cell">Amount</th>
                  <th scope="col" className="transaction-table__header-cell">Type</th>
                  <th scope="col" className="transaction-table__header-cell">Date</th>
                  <th scope="col" className="transaction-table__header-cell">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <TransactionRow key={transaction._id} transaction={transaction} />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}