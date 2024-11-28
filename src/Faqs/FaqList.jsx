import React, { useRef, useEffect, useCallback, useState } from "react";
import { downloadExcel } from "react-export-table-to-excel";
import Cookies from "js-cookie";
import axios from "axios";
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import swalHandle from "../Pages/ErrorHandler";
import AdminSideBar from "../Pages/AdminSideBar";
import Pagination from "../Components/Pagination";

const FaqList = () => {
  const [totalFaqs, setTotalFaqs] = useState(0); //totalItems
  const [fullFaqsList, setFullFaqsList] = useState([]); // Store full list listOfItems
  const [filteredFaqsList, setFilteredFaqsList] = useState([]); // For pagination
  const [faqType, setFaqType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const tableRef = useRef(null);

  const logsPerPage = 10; // number of logs per page
  // const maxPagesToShow = 10; // Maximum number of page buttons to display

  // const totalPages = Math.ceil(totalFaqs / logsPerPage);

  // const handlePageChange = (page) => {
  //   if (page > 0 && page <= totalPages) {
  //     setCurrentPage(page);
  //   }
  // };

  const changeFaqType = (e) => {
    setCurrentPage(1);
    setFaqType(e.target.value);
  };

  // const renderPageNumbers = () => {
  //   const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);
  //   let startPage = Math.max(currentPage - halfMaxPagesToShow, 1);
  //   let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

  //   if (endPage - startPage + 1 < maxPagesToShow) {
  //     startPage = Math.max(endPage - maxPagesToShow + 1, 1);
  //   }

  //   const pageNumbers = [];
  //   for (let i = startPage; i <= endPage; i++) {
  //     pageNumbers.push(
  //       <li
  //         key={i}
  //         className={`page-item ${
  //           i === currentPage ? "active activePage" : ""
  //         }`}
  //       >
  //         <span className="page-link" onClick={() => handlePageChange(i)}>
  //           {i}
  //         </span>
  //       </li>
  //     );
  //   }
  //   return pageNumbers;
  // };

  const faqTypes = [
    "General",
    "Order",
    "Tracking",
    "Payment",
    "Return",
    "Product",
  ];

  const baseUrl = `${process.env.REACT_APP_API_URL}/faqs`;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const getFaqs = useCallback(async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      swalHandle.onLoading();
      const body = { faqType };
      const response = await axios.post(`${baseUrl}/admin`, body, { headers });
      const faqs = response.data;
      setFullFaqsList(faqs);
      setTotalFaqs(faqs.length);
      setCurrentPage(1); // Reset page to 1 after fetching new data
      swalHandle.onLoadingClose();
    } catch (error) {
      swalHandle.onLoadingClose();
      swalHandle.onError(error.message);
    }
  }, [faqType, token, baseUrl]);

  useEffect(() => {
    getFaqs();
  }, [getFaqs]);

  // useEffect(() => {
  //   const startIndex = (currentPage - 1) * logsPerPage;
  //   const endIndex = startIndex + logsPerPage;
  //   const filfaq = fullFaqsList.slice(startIndex, endIndex);
  //   setFilteredFaqsList(filfaq);
  // }, [fullFaqsList, currentPage]);

  const deleteFaq = async (id) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      swalHandle.onLoading();
      await axios.patch(baseUrl, { id }, { headers });
      swalHandle.onLoadingClose();
      getFaqs();
      swalHandle.onSuccess();
    } catch (error) {
      swalHandle.onLoadingClose();
      swalHandle.onError(error.message);
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const header = ["FAQ Question", "FAQ Answer", "FAQ Type"];
  const handleDownloadExcel = () => {
    downloadExcel({
      fileName: "faqs",
      sheet: "faqs-list",
      tablePayload: {
        header,
        body: fullFaqsList.map((faq) => ({
          Question: faq.azst_faq_question,
          Answer: faq.azst_faq_ans,
          Type: faq.azst_faq_type,
        })),
      },
    });
  };

  return (
    <div className="adminSec">
      <div>
        <AdminSideBar />
      </div>
      <div className="commonSec">
        <div className="commonTopSec">
          <h4 style={{ marginBottom: "0px" }}>FAQ's</h4>
          <button
            className="exportBtn"
            disabled={!fullFaqsList.length}
            onClick={handleDownloadExcel}
          >
            Export
          </button>
          <select
            value={faqType}
            onChange={changeFaqType}
            style={{
              border: "1px solid rgb(142, 142, 142)",
              borderRadius: "0.6rem",
              marginLeft: "0.2rem",
              fontSize: "1.2rem",
            }}
          >
            <option value="">All</option>
            {faqTypes.map((faq, index) => (
              <option key={index} value={faq}>
                {faq}
              </option>
            ))}
          </select>
          <Link to="/faqs/create" className="adminBtn">
            Create FAQ
          </Link>
        </div>
        <div className="middleSec">
          {filteredFaqsList.length ? (
            <div className="tableCont">
              <table className="table custom-table table-hover" ref={tableRef}>
                <thead>
                  <tr className="tableHeader">
                    <th style={{ width: "8%" }} scope="col">
                      S.No
                    </th>
                    <th scope="col" style={{ width: "30%" }}>
                      FAQ Question
                    </th>
                    <th scope="col" style={{ width: "40%" }}>
                      FAQ Answer
                    </th>
                    <th style={{ width: "12%" }} scope="col">
                      FAQ Type
                    </th>
                    <th style={{ width: "10%" }} scope="col">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFaqsList.map((faq, i) => (
                    <tr key={faq.azst_faq_id}>
                      <td style={{ width: "5%" }}>
                        {(currentPage - 1) * logsPerPage + i + 1}
                      </td>
                      <td style={{ width: "30%" }}>
                        {truncateText(faq.azst_faq_question, 50)}
                      </td>
                      <td style={{ width: "45%" }}>
                        {truncateText(faq.azst_faq_ans, 100)}
                      </td>
                      <td style={{ width: "10%" }}>{faq.azst_faq_type}</td>
                      <td style={{ width: "10%" }}>
                        <MdDelete
                          className="icons"
                          onClick={() => deleteFaq(faq.azst_faq_id)}
                        />{" "}
                        <Link to={`/edit-faq/${faq.azst_faq_id}`}>
                          <MdModeEditOutline className="icons" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No FAQs Found</p>
          )}
        </div>
        <Pagination
          logsPerPage={logsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={totalFaqs}
          listOfItems={fullFaqsList}
          setFilteredItemsList={setFilteredFaqsList}
        />
        {/* <div className="paginationCont">
          <div className="col-sm-12 d-flex justify-content-between align-items-center">
            <p>
              Showing {Math.min(currentPage * logsPerPage, totalFaqs)} out of{" "}
              {totalFaqs}
            </p>

            {totalPages > 1 && (
              <div className="mt-2 d-flex justify-content-end">
                <nav aria-label="Page navigation">
                  <ul className="pagination">
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
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
        </div> */}
      </div>
    </div>
  );
};

export default FaqList;
