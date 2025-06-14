import { useState } from "react";
import "./Pagination.css";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const [gotoPage, setGotoPage] = useState("");

  const handleClick = (page) => {
    if (page !== currentPage) onPageChange(page);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const page = Number(gotoPage);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setGotoPage("");
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    const buffer = 2;

    const start = Math.max(1, currentPage - buffer);
    const end = Math.min(totalPages, start + maxVisible - 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="pagination-container">
      <button onClick={() => handleClick(currentPage - 1)} disabled={currentPage === 1}>
        ← Previous
      </button>

      {getPageNumbers().map((page) => (
        <button key={page} onClick={() => handleClick(page)} className={page === currentPage ? "active" : ""}>
          {page}
        </button>
      ))}

      {currentPage + 2 < totalPages && <span>...</span>}

      {currentPage !== totalPages && <button onClick={() => handleClick(totalPages)}>{totalPages}</button>}

      <button onClick={() => handleClick(currentPage + 1)} disabled={currentPage === totalPages}>
        Next →
      </button>

      <form onSubmit={handleSubmit} className="goto-form">
        <input type="number" min="1" max={totalPages} value={gotoPage} onChange={(e) => setGotoPage(e.target.value)} placeholder="Go to" />
        <button type="submit">Go</button>
      </form>
    </div>
  );
}
