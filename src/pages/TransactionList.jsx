import { useEffect, useState, useCallback, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getTransactions, deleteTransaction } from '../services/transaction'
import useIsAdmin from '../hooks/useIsAdmin'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Alert from '../components/ui/Alert'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'
import { PageTitleSkeleton, FilterSectionSkeleton, TransactionTableSkeleton, PaginationSkeleton } from '../components/ui/Skeleton'

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
  const [filterType, setFilterType] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [debouncedCategory, setDebouncedCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sort, setSort] = useState('-createdAt')
  const debounceTimer = useRef(null)
  const searchDebounceTimer = useRef(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [filterLoading, setFilterLoading] = useState(false)
  const hasLoaded = useRef(false)

  const handleCategoryChange = useCallback((e) => {
    const value = e.target.value
    setFilterCategory(value)
    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => setDebouncedCategory(value), 400)
  }, [])

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value
    setSearchQuery(value)
    clearTimeout(searchDebounceTimer.current)
    searchDebounceTimer.current = setTimeout(() => setDebouncedSearch(value), 400)
  }, [])

  useEffect(() => {
    return () => {
      clearTimeout(debounceTimer.current)
      clearTimeout(searchDebounceTimer.current)
    }
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [filterType, debouncedCategory, debouncedSearch, sort, limit])

  useEffect(() => {
    async function fetchTransactions() {
      if (!hasLoaded.current) {
        setLoading(true)
      } else {
        setFilterLoading(true)
      }
      setError('')
      try {
        const params = { page: currentPage, limit }
        if (filterType) params.type = filterType
        if (debouncedCategory) params.category = debouncedCategory
        if (debouncedSearch) params.search = debouncedSearch
        if (sort) params.sort = sort
        const response = await getTransactions(params)
        if (response.data?.success && response.data?.transactions) {
          setTransactions(response.data.transactions)
          setTotalPages(response.data.totalPages || 1)
          setTotalTransactions(response.data.totalTransactions || 0)
          hasLoaded.current = true
        } else {
          setError('Failed to load transactions')
        }
      } catch (err) {
        setError(err.message || 'An unexpected error occurred')
      } finally {
        setLoading(false)
        setFilterLoading(false)
      }
    }

    fetchTransactions()
  }, [currentPage, limit, filterType, debouncedCategory, debouncedSearch, sort])

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

  const initialLoading = loading && !hasLoaded.current

  if (initialLoading) {
    return (
      <div className="transaction-list">
        <PageTitleSkeleton isAdmin={isAdmin} />
        <FilterSectionSkeleton />
        <TransactionTableSkeleton isAdmin={isAdmin} />
        <PaginationSkeleton />
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

      <div className="transaction-list__filters">
        <div className="transaction-list__filter transaction-list__filter--search">
          <label htmlFor="filter-search" className="transaction-list__filter-label">Search</label>
          <div className="transaction-list__search-wrapper">
            <svg className="transaction-list__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="filter-search"
              type="text"
              className="form-field__input transaction-list__filter-input transaction-list__filter-search"
              placeholder="Search by title"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="transaction-list__filter">
          <label htmlFor="filter-type" className="transaction-list__filter-label">Type</label>
          <select
            id="filter-type"
            className="form-field__input transaction-list__filter-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="transaction-list__filter">
          <label htmlFor="filter-category" className="transaction-list__filter-label">Category</label>
          <input
            id="filter-category"
            type="text"
            className="form-field__input transaction-list__filter-input"
            placeholder="Filter by category"
            value={filterCategory}
            onChange={handleCategoryChange}
          />
        </div>
        <div className="transaction-list__filter">
          <label htmlFor="filter-sort" className="transaction-list__filter-label">Sort</label>
          <select
            id="filter-sort"
            className="form-field__input transaction-list__filter-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="-createdAt">Date (Newest)</option>
            <option value="createdAt">Date (Oldest)</option>
            <option value="-amount">Amount (Highest)</option>
            <option value="amount">Amount (Lowest)</option>
          </select>
        </div>
        <div className="transaction-list__filter">
          <label htmlFor="filter-limit" className="transaction-list__filter-label">Per page</label>
          <select
            id="filter-limit"
            className="form-field__input transaction-list__filter-select"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {filterLoading ? (
        <TransactionTableSkeleton isAdmin={isAdmin} />
      ) : transactions.length === 0 ? (
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

      {!filterLoading && totalPages > 1 && (
        <div className="pagination">
          <div className="pagination__info">
            Page {currentPage} of {totalPages} ({totalTransactions} transactions)
          </div>
          <div className="pagination__controls">
            <button
              type="button"
              className="pagination__btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </button>
            <div className="pagination__pages">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  if (totalPages <= 7) return true
                  if (p === 1 || p === totalPages) return true
                  if (Math.abs(p - currentPage) <= 1) return true
                  return false
                })
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) {
                    acc.push('...')
                  }
                  acc.push(p)
                  return acc
                }, [])
                .map((item, idx) =>
                  item === '...' ? (
                    <span key={`ellipsis-${idx}`} className="pagination__ellipsis">...</span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      className={`pagination__page ${item === currentPage ? 'pagination__page--active' : ''}`}
                      onClick={() => setCurrentPage(item)}
                    >
                      {item}
                    </button>
                  )
                )}
            </div>
            <button
              type="button"
              className="pagination__btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
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
