import React from "react";
import AdminSideBar from "./AdminSideBar";
import Rating from "@mui/material/Rating";
import Cookies from "js-cookie";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import ErrorHandler from "./ErrorHandler";

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

  const onStatusUpdate = async (status, id) => {
    try {
      const url = `${baseUrl}/admin/reviews/approve`;
      const headers = {
        Authorization: `Bearer ${jwtToken}`,
      };
      const body = {
        reviewId: id,
        isApproved: status,
      };
      const response = await axios.post(url, body, { headers });
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
    } catch (error) {
      ErrorHandler.onError(error);
    }
  };

  const handleReviewStatus = (e, id) => {
    let status = e.target.value;
    onStatusUpdate(status, id);
  };

  return (
    <div>
      <div className="adminSec">
        <AdminSideBar />
        <div className="commonSec">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Customer</th>
                <th scope="col">Created</th>
                <th scope="col">Rating</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {reviewsList.map((review, index) => (
                <tr key={index}>
                  <td>
                    <h6>
                      {review.azst_customer_fname} {review.azst_customer_lname}
                    </h6>
                    <p>
                      <Link to={review.url_handle}>{review.product_title}</Link>
                    </p>
                  </td>
                  <td>{review.created_on}</td>
                  <td>
                    <Rating
                      name="read-only"
                      value={review.review_points}
                      precision={0.5}
                      readOnly
                    />
                    <p>{review.review_content}</p>
                  </td>
                  <td>
                    <div class="form-group">
                      <select
                        class="form-control"
                        id="reviewStatus"
                        value={review.review_approval_status}
                        onChange={(e) =>
                          handleReviewStatus(e, review.review_id)
                        }
                      >
                        <option value={0}>Hidden</option>
                        <option value={1}>Publish Review</option>
                      </select>
                    </div>
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

export default ReviewList;
