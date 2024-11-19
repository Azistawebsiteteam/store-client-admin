import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

import AdminSideBar from '../Pages/AdminSideBar';
import BackBtn from '../Components/BackBtn';
import ErrorHandler from '../Pages/ErrorHandler';
import Rating from '@mui/material/Rating';

import './review.css';
import { onStatusUpdate } from './ReviwFun';

const ReviewDetails = () => {
  const [review, setReviewData] = useState({});

  const { reviewId } = useParams();

  const baseUrl = process.env.REACT_APP_API_URL;
  const jwtToken = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  useEffect(() => {
    const getReviewDetails = async () => {
      try {
        const url = `${baseUrl}/admin/reviews/review`;
        const headers = {
          Authorization: `Bearer ${jwtToken}`,
        };

        ErrorHandler.onLoading();
        const response = await axios.post(url, { reviewId }, { headers });
        const { data } = response;
        setReviewData(data);
      } catch (error) {
        ErrorHandler.onError(error);
      } finally {
        ErrorHandler.onLoadingClose();
      }
    };

    getReviewDetails();
  }, [baseUrl, reviewId, jwtToken]);

  const updateReviewStatus = async () => {
    const status = review.review_approval_status === 0 ? 1 : 0;
    const response = await onStatusUpdate(reviewId, status);
    if (response.status === 200) {
      const updatedReview = { ...review, review_approval_status: status };
      setReviewData(updatedReview);
    }
  };

  return (
    <div className='adminSec'>
      <AdminSideBar />
      <div className='commonSec'>
        <div className='detailsSec'>
          <BackBtn />
          <div className='details'>
            <h3 className='profile-name'>Review Details</h3>
          </div>
        </div>
        {Object.keys(review).length && (
          <div className='row m-3'>
            <div className='col-md-7'>
              <div>
                <div className='d-flex'>
                  <img
                    src={review.product_image}
                    className='product-image'
                    alt='productImage'
                  />
                  <div>
                    <a
                      href={review.url_handle}
                      target='__blank'
                      className='product-link'>
                      <p>{review.product_title}</p>
                    </a>

                    <Rating
                      name='read-only'
                      value={review.review_points}
                      precision={0.5}
                      readOnly
                    />
                  </div>
                </div>
                <div className='my-3'>
                  <p>
                    <strong>Title : </strong>
                    {review.review_title}
                  </p>
                  <p className='truncate'>
                    <strong>Description : </strong> {review.review_content}
                  </p>
                </div>
              </div>
            </div>
            <div className='col-md-5'>
              <strong>Review Images</strong>
              <div className='displayIeviewImgsCont my-3'>
                {review.review_images.map((img, i) => (
                  <img
                    key={i}
                    className='displayIeviewImg'
                    src={img}
                    alt='reviewImg'
                  />
                ))}
              </div>
              <p>
                <strong> Created By :</strong> {review.azst_customer_fname}{' '}
                {review.azst_customer_lname}
              </p>
              <p>
                <strong> Reviewed on :</strong> {review.created_on}
              </p>
              <strong>Action : </strong>
              <button
                className='btn btn-primary mx-2'
                disabled={review.review_approval_status === 0}
                onClick={updateReviewStatus}>
                Hide
              </button>
              <button
                className='btn btn-success mx-2'
                disabled={review.review_approval_status === 1}
                onClick={updateReviewStatus}>
                Publilsh
              </button>
              <p></p>
              <p>
                <strong>
                  {' '}
                  {review.review_approval_status === 1
                    ? 'Published'
                    : 'Hidden'}{' '}
                  By :
                </strong>{' '}
                {review.approve_by}
              </p>
              <p>
                <strong>
                  {' '}
                  {review.review_approval_status === 1
                    ? 'Published'
                    : 'Hidden'}{' '}
                  On :
                </strong>{' '}
                {review.approve_on}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewDetails;
