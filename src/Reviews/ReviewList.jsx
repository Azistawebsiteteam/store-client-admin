import React from 'react';
import AdminSideBar from '../Pages/AdminSideBar';
import Rating from '@mui/material/Rating';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';

import { IoIosEyeOff, IoMdEye } from 'react-icons/io';
import { onStatusUpdate } from './ReviwFun';

const ReviewList = () => {
  const [reviewsList, setReviewsList] = useState([]);

  const baseUrl = process.env.REACT_APP_API_URL;
  const jwtToken = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  useEffect(() => {
    const getReviews = async () => {
      const url = `${baseUrl}/admin/reviews/all`;
      const headers = {
        Authorization: `Bearer ${jwtToken}`,
      };
      const response = await axios.post(url, {}, { headers });
      setReviewsList(response.data);
    };
    getReviews();
  }, [baseUrl, jwtToken]);

  const updateReviewStatus = async (id, status) => {
    const response = await onStatusUpdate(id, status);
    if (response.status === 200) {
      const updatedReviews = reviewsList.map((review) => {
        if (review.review_id === id) {
          return { ...review, review_approval_status: status };
        } else {
          return review;
        }
      });

      setReviewsList(updatedReviews);
    }
  };

  return (
    <div>
      <div className='adminSec'>
        <AdminSideBar />
        <div className='commonSec'>
          <div className='container'>
            <div className='row'>
              <div className='mb-4'>
                <h4>Customer Reviews</h4>
              </div>
              <div className='tableCont'>
                <table
                  className='table table-hover'
                  style={{ minWidth: '1000px' }}>
                  <thead>
                    <tr>
                      <th scope='col'>Customer</th>
                      <th scope='col'>Created</th>
                      <th scope='col'>Rating</th>
                      <th> Visibility status</th>
                      <th scope='col'>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviewsList.map((review, index) => (
                      <tr key={index}>
                        <td>
                          <h6>
                            {review.azst_customer_fname}{' '}
                            {review.azst_customer_lname}
                          </h6>
                          <p>
                            <Link to={review.url_handle}>
                              {review.product_title}
                            </Link>
                          </p>
                        </td>
                        <td>{review.created_on}</td>
                        <td>
                          <Rating
                            name='read-only'
                            value={review.review_points}
                            precision={0.5}
                            readOnly
                          />
                          <p>{review.review_content}</p>
                        </td>
                        <td>
                          {' '}
                          <p
                            className={
                              review.review_approval_status === 1
                                ? 'published'
                                : 'scheduled'
                            }>
                            {review.review_approval_status === 1
                              ? 'published'
                              : 'Hide'}
                          </p>
                        </td>
                        <td>
                          <div className='d-flex justify-content-center align-items-center'>
                            <span className='password-toggle-icon'>
                              {review.review_approval_status === 1 ? (
                                <IoMdEye
                                  onClick={() =>
                                    updateReviewStatus(review.review_id, 0)
                                  }
                                />
                              ) : (
                                <IoIosEyeOff
                                  onClick={() =>
                                    updateReviewStatus(review.review_id, 1)
                                  }
                                />
                              )}
                            </span>
                            <span className='password-toggle-icon'>
                              <Link to={`/review-details/${review.review_id}`}>
                                View Details
                              </Link>
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewList;
