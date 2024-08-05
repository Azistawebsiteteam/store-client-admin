import React, { useEffect, useCallback, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

import { MdDelete, MdModeEditOutline } from 'react-icons/md';
import { Link } from 'react-router-dom';

import swalHandle from '../Pages/ErrorHandler';
import AdminSideBar from '../Pages/AdminSideBar';

const FaqList = () => {
  const [faqsList, setFaqsList] = useState([]);

  const baseUrl = `${process.env.REACT_APP_API_URL}/faqs`;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const getFaqs = useCallback(async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      swalHandle.onLoading();
      const response = await axios.get(baseUrl, { headers });
      setFaqsList(response.data);
      swalHandle.onLoadingClose();
    } catch (error) {
      swalHandle.onLoadingClose();
      swalHandle.onError(error.message);
    }
  }, [baseUrl, token, setFaqsList]); // Add all dependencies

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
          <Link to='/faqs/create'>Create Faq</Link>
        </div>
        <div className='col-sm-12'>
          <table className='table'>
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
        </div>
      </div>
    </div>
  );
};

export default FaqList;
