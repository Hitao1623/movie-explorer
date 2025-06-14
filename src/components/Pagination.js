import React from "react";
import "./Pagination.css";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPages = () => {
    const pages = [];
    const maxPages = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxPages - 1);
    if (end - start < maxPages - 1) {
      start = Math.max(1, end - maxPages + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPages();

  return (
    <div className="pagination">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="nav-button">
        ← Previous
      </button>

      {pages.map((page) => (
        <button key={page} onClick={() => onPageChange(page)} className={`page-button ${page === currentPage ? "active" : ""}`}>
          {page}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          <span className="ellipsis">...</span>
          <button onClick={() => onPageChange(totalPages)} className="page-button">
            {totalPages}
          </button>
        </>
      )}

      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="nav-button">
        Next →
      </button>
    </div>
  );
}
