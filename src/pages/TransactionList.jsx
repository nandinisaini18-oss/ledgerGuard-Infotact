import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getTransactions, deleteTransaction } from '../services/transaction'
import useIsAdmin from '../hooks/useIsAdmin'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Alert from '../components/ui/Alert'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'

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

function TransactionRow({ transaction, onDelete, isAdmin }) {
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
        <div className="transaction-table__actions">
          {isAdmin && (
            <Link to={`/transactions/${transaction._id}/edit`} className="transaction-table__action">
              Edit
            </Link>
          )}
          <Link to={`/transactions/${transaction._id}`} className="transaction-table__action">
            View
          </Link>
          {isAdmin && (
            <button
              type="button"
              className="transaction-table__action transaction-table__action--danger"
              onClick={() => onDelete(transaction)}
            >
              Delete
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}

export default function TransactionList() {
  const location = useLocation()
  const isAdmin = useIsAdmin()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [flash, setFlash] = useState(
    location.state?.fromEdit
      ? 'Transaction updated successfully'
      : location.state?.permissionDenied
        ? location.state?.message
        : location.state?.fromDelete
          ? location.state?.message
          : ''
  )
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

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

  useEffect(() => {
    if (!flash) return
    const timer = setTimeout(() => setFlash(''), 5000)
    return () => clearTimeout(timer)
  }, [flash])

  function handleDeleteClick(transaction) {
    setTransactionToDelete(transaction)
    setDeleteDialogOpen(true)
  }

  async function handleConfirmDelete() {
    if (!transactionToDelete) return

    setDeleting(true)
    try {
      const response = await deleteTransaction(transactionToDelete._id)
      if (response.data?.success) {
        setTransactions((prev) => prev.filter((t) => t._id !== transactionToDelete._id))
        setFlash('Transaction deleted successfully')
      } else {
        setError('Failed to delete transaction')
      }
    } catch (err) {
      setError(err.message || 'Failed to delete transaction')
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
      setTransactionToDelete(null)
    }
  }

  function handleCancelDelete() {
    setDeleteDialogOpen(false)
    setTransactionToDelete(null)
  }

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
        {isAdmin && (
          <Link to="/transactions/new">
            <Button variant="primary">New Transaction</Button>
          </Link>
        )}
      </div>

      {flash && (
        <div className="transaction-list__flash" role="status">
          <Alert variant={location.state?.permissionDenied ? 'warning' : 'success'} message={flash} />
        </div>
      )}

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
            description={isAdmin ? 'Get started by creating your first transaction.' : 'Transactions will appear here once an admin creates them.'}
            action={
              isAdmin ? (
                <Link to="/transactions/new">
                  <Button variant="primary">Create Transaction</Button>
                </Link>
              ) : null
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
                  {isAdmin && (
                    <th scope="col" className="transaction-table__header-cell">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <TransactionRow
                    key={transaction._id}
                    transaction={transaction}
                    onDelete={handleDeleteClick}
                    isAdmin={isAdmin}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        isOpen={deleteDialogOpen}
        onClose={handleCancelDelete}
        title="Delete Transaction"
        size="sm"
      >
        <div className="delete-dialog">
          <p className="delete-dialog__message">
            Are you sure you want to permanently delete this transaction?
          </p>
          <p className="delete-dialog__warning">This action cannot be undone.</p>
          <div className="delete-dialog__transaction-info">
            <span className="delete-dialog__label">Transaction:</span>
            <span className="delete-dialog__title">{transactionToDelete?.title}</span>
            <span className={`delete-dialog__amount ${transactionToDelete?.type === 'income' ? 'income' : 'expense'}`}>
              {transactionToDelete?.type === 'income' ? '+' : '-'}${transactionToDelete?.amount.toFixed(2)}
            </span>
          </div>
          <div className="modal__actions">
            <Button variant="secondary" onClick={handleCancelDelete} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete} loading={deleting} disabled={deleting}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
