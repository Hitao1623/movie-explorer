import { useState } from "react";
import "../styles/components/Pagination.css";

// Pagination component receives currentPage, totalPages, and onPageChange as props
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // State to store value of "Go to page" input box
  const [gotoPage, setGotoPage] = useState("");

  // Handler for clicking a page number or navigation button (prev/next/last)
  const handleClick = (page) => {
    if (page !== currentPage) onPageChange(page); // Call parent function if page changes
  };

  // Handler for submitting the "Go to page" form
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    const page = Number(gotoPage); // Convert input to number
    if (page >= 1 && page <= totalPages) {
      onPageChange(page); // Call parent function to go to target page
      setGotoPage(""); // Clear input field
    }
  };

  // Function to generate visible page numbers (max 5)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Maximum number of page buttons to show
    const buffer = 2; // Show currentPage +/- 2

    const start = Math.max(1, currentPage - buffer);
    const end = Math.min(totalPages, start + maxVisible - 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  // Render pagination UI
  return (
    <div className="pagination-container">
      {/* Previous button */}
      <button onClick={() => handleClick(currentPage - 1)} disabled={currentPage === 1}>
        ← Previous
      </button>

      {/* Page number buttons */}
      {getPageNumbers().map((page) => (
        <button key={page} onClick={() => handleClick(page)} className={page === currentPage ? "active" : ""}>
          {page}
        </button>
      ))}

      {/* Dots if there are more pages beyond current range */}
      {currentPage + 2 < totalPages && <span>...</span>}

      {/* Last page button */}
      {currentPage !== totalPages && <button onClick={() => handleClick(totalPages)}>{totalPages}</button>}

      {/* Next button */}
      <button onClick={() => handleClick(currentPage + 1)} disabled={currentPage === totalPages}>
        Next →
      </button>

      {/* Go to page form */}
      <form onSubmit={handleSubmit} className="goto-form">
        <input type="number" min="1" max={totalPages} value={gotoPage} onChange={(e) => setGotoPage(e.target.value)} placeholder="Go to" />
        <button type="submit">Go</button>
      </form>
    </div>
  );
}
