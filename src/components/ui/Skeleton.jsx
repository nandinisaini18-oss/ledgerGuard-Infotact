import Card from './Card'

function PageTitleSkeleton({ isAdmin }) {
  return (
    <div className="transaction-list__header">
      <div>
        <div className="shimmer shimmer-title" style={{ width: "160px", height: "28px", marginBottom: "8px" }} />
        <div className="shimmer shimmer-subtitle" style={{ width: "240px", height: "16px" }} />
      </div>
      {isAdmin && (
        <div className="shimmer shimmer-button" style={{ width: "120px", height: "40px" }} />
      )}
    </div>
  )
}

function FilterSectionSkeleton() {
  return (
    <div className="transaction-list__filters">
      <div className="transaction-list__filter">
        <div className="shimmer shimmer-label" style={{ width: "60px", height: "14px", marginBottom: "8px" }} />
        <div className="shimmer shimmer-select" style={{ width: "160px", height: "40px" }} />
      </div>
      <div className="transaction-list__filter">
        <div className="shimmer shimmer-label" style={{ width: "80px", height: "14px", marginBottom: "8px" }} />
        <div className="shimmer shimmer-input" style={{ width: "160px", height: "40px" }} />
      </div>
      <div className="transaction-list__filter">
        <div className="shimmer shimmer-label" style={{ width: "100px", height: "14px", marginBottom: "8px" }} />
        <div className="shimmer shimmer-select" style={{ width: "100px", height: "40px" }} />
      </div>
    </div>
  )
}

function TransactionTableSkeleton({ isAdmin }) {
  return (
    <Card className="transaction-list__table-wrapper">
      <div className="transaction-table-container">
        <div className="transaction-table" role="table">
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
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="transaction-table__row">
                <td className="transaction-table__cell">
                  <div className="shimmer shimmer-cell" style={{ width: "140px", height: "20px" }} />
                </td>
                <td className="transaction-table__cell">
                  <div className="shimmer shimmer-cell" style={{ width: "100px", height: "24px" }} />
                </td>
                <td className="transaction-table__cell">
                  <div className="shimmer shimmer-cell" style={{ width: "80px", height: "20px" }} />
                </td>
                <td className="transaction-table__cell">
                  <div className="shimmer shimmer-cell" style={{ width: "90px", height: "20px" }} />
                </td>
                <td className="transaction-table__cell">
                  <div className="shimmer shimmer-cell" style={{ width: "100px", height: "20px" }} />
                </td>
                {isAdmin && (
                  <td className="transaction-table__cell">
                    <div className="shimmer shimmer-cell" style={{ width: "120px", height: "20px" }} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </div>
      </div>
    </Card>
  )
}

function PaginationSkeleton() {
  return (
    <div className="pagination">
      <div className="pagination__controls">
        <div className="shimmer shimmer-button" style={{ width: "80px", height: "36px" }} />
        <div className="pagination__pages">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="shimmer shimmer-page" style={{ width: "40px", height: "34px" }} />
          ))}
        </div>
        <div className="shimmer shimmer-button" style={{ width: "80px", height: "36px" }} />
      </div>
    </div>
  )
}

export { PageTitleSkeleton, FilterSectionSkeleton, TransactionTableSkeleton, PaginationSkeleton }
