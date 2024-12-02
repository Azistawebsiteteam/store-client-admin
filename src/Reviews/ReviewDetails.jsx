import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

import AdminSideBar from "../Pages/AdminSideBar";
import BackBtn from "../Components/BackBtn";
import ErrorHandler from "../Pages/ErrorHandler";
import Rating from "@mui/material/Rating";

import "./review.css";
import { onStatusUpdate } from "./ReviwFun";

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
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec pb-5">
        <div className="d-flex align-items-center mb-3">
          <BackBtn />
          <h4>Review Details</h4>
        </div>
        {Object.keys(review).length && (
          <div className="row">
            <div className="col-md-7">
              <div className="bgStyle">
                <div className="d-flex form-group">
                  <img
                    src={review.product_image}
                    className="product-image"
                    alt="productImage"
                  />
                  <div>
                    <a
                      href={review.url_handle}
                      target="__blank"
                      className="product-link"
                    >
                      <p>{review.product_title}</p>
                    </a>

                    <Rating
                      name="read-only"
                      value={review.review_points}
                      precision={0.5}
                      readOnly
                      style={{ fontSize: "3rem" }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    <strong>Title</strong>
                  </label>
                  <p>{review.review_title}</p>

                  <label>
                    <strong>Description</strong>
                  </label>
                  <p> {review.review_content}</p>
                  <p>
                    <strong>Review Images</strong>
                  </p>
                  <div className="displayIeviewImgsCont my-3">
                    {review.review_images.map((img, i) => (
                      <img
                        key={i}
                        className="displayIeviewImg"
                        src={img}
                        alt="reviewImg"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-5">
              <div className="bgStyle">
                <p>
                  <strong> Created By :</strong> {review.azst_customer_fname}{" "}
                  {review.azst_customer_lname}
                </p>
                <p>
                  <strong> Reviewed on :</strong> {review.created_on}
                </p>
                <div className="d-flex align-items-center">
                  <p className="mb-0">
                    <strong>Action : </strong>
                  </p>
                  <button
                    className="reviewBtn hideReviewBtn"
                    style={
                      review.review_approval_status === 0
                        ? { opacity: "0.4" }
                        : { opacity: "0.8" }
                    }
                    disabled={review.review_approval_status === 0}
                    onClick={updateReviewStatus}
                  >
                    Hide
                  </button>
                  <button
                    className="reviewBtn publishReviewBtn"
                    style={
                      review.review_approval_status === 1
                        ? { opacity: "0.4" }
                        : { opacity: "1" }
                    }
                    disabled={review.review_approval_status === 1}
                    onClick={updateReviewStatus}
                  >
                    Publilsh
                  </button>
                </div>
                <p></p>
                <p>
                  <strong>
                    {" "}
                    {review.review_approval_status === 1
                      ? "Published"
                      : "Hidden"}{" "}
                    By :
                  </strong>{" "}
                  {review.approve_by}
                </p>
                <p>
                  <strong>
                    {" "}
                    {review.review_approval_status === 1
                      ? "Published"
                      : "Hidden"}{" "}
                    On :
                  </strong>{" "}
                  {review.approve_on}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewDetails;
