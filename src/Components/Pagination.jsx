import React, { useEffect } from "react";
import "./compont.css";

const Pagination = ({
  logsPerPage,
  currentPage,
  setCurrentPage,
  totalItems,
  listOfItems,
  setFilteredItemsList,
}) => {
  const maxPagesToShow = 10; // Maximum number of page buttons to display

  const totalPages = Math.ceil(totalItems / logsPerPage);

  const renderPageNumbers = () => {
    const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);
    let startPage = Math.max(currentPage - halfMaxPagesToShow, 1);
    let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(endPage - maxPagesToShow + 1, 1);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li
          key={i}
          className={`page-item ${
            i === currentPage ? "active activePage" : ""
          }`}
        >
          <span
            className="page-link"
            style={{ cursor: "pointer" }}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </span>
        </li>
      );
    }
    return pageNumbers;
  };

  useEffect(() => {
    const startIndex = (currentPage - 1) * logsPerPage;
    const endIndex = startIndex + logsPerPage;
    const filfaq = listOfItems.slice(startIndex, endIndex);
    setFilteredItemsList(filfaq);
  }, [listOfItems, currentPage, logsPerPage, setFilteredItemsList]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  return (
    <div className="paginationCont">
      <div className="d-flex justify-content-between align-items-center">
        {totalPages > 1 && (
          <p>
            Showing {Math.min(currentPage * logsPerPage, totalItems)} out of{" "}
            {totalItems}
          </p>
        )}
        {totalPages > 1 && (
          <div className="mt-2 d-flex justify-content-end">
            <nav aria-label="Page navigation">
              <ul className="pagination">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                  style={{ cursor: "pointer" }}
                >
                  <span
                    className="page-link"
                    aria-label="Previous"
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    &laquo;
                  </span>
                </li>
                {renderPageNumbers()}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  <span
                    className="page-link"
                    aria-label="Next"
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    &raquo;
                  </span>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagination;
