import React, { useRef, useEffect, useCallback, useState } from 'react';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import Cookies from 'js-cookie';
import axios from 'axios';

import { MdDelete, MdModeEditOutline } from 'react-icons/md';
import { Link } from 'react-router-dom';

import swalHandle from '../Pages/ErrorHandler';
import AdminSideBar from '../Pages/AdminSideBar';

const FaqList = () => {
  const [totalFaqs, setTotalFaqs] = useState(0);
  const [faqsList, setFaqsList] = useState([]);
  const [faqType, setFaqType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const tableRef = useRef(null);

  const logsPerPage = 10; // number of logs per page
  const maxPagesToShow = 10; // Maximum number of page buttons to display

  const totalPages = Math.ceil(totalFaqs / logsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const changeFaqType = (e) => {
    setCurrentPage(1);
    setFaqType(e.target.value);
  };

  const renderPageNumbers = () => {
    const activePage = currentPage;
    const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);
    let startPage = Math.max(activePage - halfMaxPagesToShow, 1);
    let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    // Adjust startPage and endPage when nearing the beginning or end of totalPages
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(endPage - maxPagesToShow + 1, 1);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li key={i} className={`page-item ${i === activePage ? 'active' : ''}`}>
          <span className='page-link' onClick={() => handlePageChange(i)}>
            {i}
          </span>
        </li>
      );
    }
    return pageNumbers;
  };

  const faqTypes = [
    'General',
    'Order',
    'Tracking',
    'Payment',
    'Return',
    'Product',
  ];

  const baseUrl = `${process.env.REACT_APP_API_URL}/faqs`;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const getFaqs = useCallback(async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      swalHandle.onLoading();
      const body = { faqType, pageNum: currentPage };
      //console.log(baseUrl);
      const response = await axios.post(`${baseUrl}/admin`, body, {
        headers,
      });
      const { total_rec, faqs } = response.data;
      setFaqsList(faqs);
      setTotalFaqs(total_rec);
      swalHandle.onLoadingClose();
    } catch (error) {
      console.log(error);
      swalHandle.onLoadingClose();
      swalHandle.onError(error.message);
    }
  }, [baseUrl, token, setFaqsList, faqType, currentPage]); // Add all dependencies

  useEffect(() => {
    getFaqs();
  }, [getFaqs]);

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
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className='adminSec'>
      <div>
        <AdminSideBar />
      </div>
      <div className='commonSec'>
        {' '}
        <div className='col-12 mt-2 mb-2 d-flex justify-content-between'>
          <h4>Faq's</h4>
          <DownloadTableExcel
            filename='Faqsheets'
            sheet='FaqsList'
            currentTableRef={tableRef.current}>
            <button disabled={!faqsList.length}> Export excel </button>
          </DownloadTableExcel>
          <select value={faqType} onChange={changeFaqType}>
            <option value=''>All</option>
            {faqTypes.map((faq, index) => (
              <option key={index} value={faq}>
                {faq}
              </option>
            ))}
          </select>

          <Link to='/faqs/create'>Create Faq</Link>
        </div>
        <div className='col-sm-12'>
          {faqsList.length ? (
            <>
              <table className='table' ref={tableRef}>
                <thead>
                  <tr>
                    <th scope='col'>S.No</th>
                    <th scope='col'>Faq Question</th>
                    <th scope='col'>Faq Answer</th>
                    <th scope='col'>Faq Type</th>
                    <th scope='col'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {faqsList?.map((each, i) => (
                    <tr className='item' key={i}>
                      <td>{i + 1}</td>
                      <td>{truncateText(each.azst_faq_question, 80)}</td>
                      <td>{truncateText(each.azst_faq_ans, 100)}</td>
                      <td>{each.azst_faq_type}</td>
                      <td>
                        <MdDelete
                          className='icons'
                          onClick={() => deleteFaq(each.azst_faq_id)}
                        />{' '}
                        <Link to={`/edit-faq/${each.azst_faq_id}`}>
                          <MdModeEditOutline className='icons' />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>
                showing{' '}
                {totalFaqs > currentPage * 10 ? currentPage * 10 : totalFaqs}{' '}
                out of {totalFaqs}
              </p>
              {faqsList.length > 0 && totalPages > 1 && (
                <div className='mt-2 d-flex justify-content-end'>
                  <nav aria-label='Page navigation example'>
                    <ul className='pagination'>
                      <li
                        className={`page-item ${
                          currentPage === 1 && 'disabled'
                        }`}>
                        <span
                          className='page-link'
                          aria-label='Previous'
                          onClick={() => handlePageChange(currentPage - 1)}>
                          <span aria-hidden='true'>&laquo;</span>
                        </span>
                      </li>
                      {renderPageNumbers()}
                      <li
                        className={`page-item ${
                          currentPage === totalPages && 'disabled'
                        }`}>
                        <span
                          className='page-link'
                          aria-label='Next'
                          onClick={() => handlePageChange(currentPage + 1)}>
                          <span aria-hidden='true'>&raquo;</span>
                        </span>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <p>No Faq's Found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaqList;
