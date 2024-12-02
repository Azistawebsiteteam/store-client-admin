import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { IoMdEye } from "react-icons/io";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoIosEyeOff } from "react-icons/io";
import { MdModeEditOutline } from "react-icons/md";
import swalHandle from "../Pages/ErrorHandler";
import Swal from "sweetalert2";

const BannersForm = (props) => {
  const { sliders, mainTitle, linkTitle, sliderDetails } = props;
  const baseUrl = process.env.REACT_APP_API_URL;
  let token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const deleteBanner = (id) => {
    try {
      const url = `${baseUrl}/banners`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const body = {
        bannerId: id,
      };

      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          swalHandle.onLoading();
          const response = await axios.delete(url, { headers, data: body });
          Swal.close();
          if (response.status === 200) {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
            sliderDetails();
          }
        }
      });
    } catch (error) {
      Swal.close();
      swalHandle.onError(error);
    }
  };

  const hideBanner = async (id, status) => {
    try {
      const isHide = status === 1 ? true : false;
      const url = `${baseUrl}/banners`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const body = {
        bannerId: id,
        isHide,
      };
      swalHandle.onLoading();
      await axios.put(url, body, { headers });
      Swal.close();
      sliderDetails();
    } catch (error) {
      Swal.close();
      swalHandle.onError(error);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-12">
          <div className="commonTopSec">
            <h4>{mainTitle}</h4>
            <Link to="/slider/create" className="adminBtn">
              Create {linkTitle}
            </Link>
          </div>
        </div>
        <div className="col-sm-12">
          <div className="tableCont" style={{ maxHeight: "76vh" }}>
            <table
              className="table custom-table table-hover"
              style={{ minWidth: "1000px" }}
            >
              <thead>
                <tr>
                  <th scope="col" style={{ width: "5%" }}>
                    #
                  </th>
                  <th scope="col" style={{ width: "20%" }}>
                    Thumbnail
                  </th>
                  <th scope="col" style={{ width: "30%" }}>
                    Title
                  </th>
                  <th scope="col" style={{ width: "12%" }}>
                    Visibility status
                  </th>
                  <th scope="col" style={{ width: "12%" }}>
                    Status
                  </th>
                  <th scope="col" style={{ width: "12%" }}>
                    Banner Visibility
                  </th>
                </tr>
              </thead>
              <tbody>
                {sliders.map((slider, i) => (
                  <tr key={i} className="item">
                    <td>{i + 1}</td>
                    <td>
                      <img
                        className="bannerThumbnail"
                        src={slider.azst_web_image}
                        alt={slider.azst_alt_text}
                      />
                    </td>
                    <td>
                      {" "}
                      <h6>{slider.azst_banner_title}</h6>
                      <span className="d-block">{`Publication date ${slider.start_date}`}</span>
                      <span className="d-block">{`End date ${slider.end_date}`}</span>
                    </td>
                    <td>
                      <p
                      // className={
                      //   slider.is_default === 1 ? "published" : "scheduled"
                      // }
                      >
                        {slider.is_default === 1 ? "Published" : "Scheduled"}
                      </p>
                    </td>
                    <td>
                      {" "}
                      <p
                        className={
                          slider.status === 1 ? "activeBtn" : "inactiveBtn"
                        }
                      >
                        {slider.status === 1 ? "Active" : "Inactive"}
                      </p>
                    </td>
                    <td>
                      <span
                        className="password-toggle-icon"
                        onClick={() =>
                          hideBanner(slider.banner_id, slider.status)
                        }
                      >
                        {slider.status === 1 ? <IoMdEye /> : <IoIosEyeOff />}
                      </span>
                      <span
                        className="password-toggle-icon"
                        onClick={() => deleteBanner(slider.banner_id)}
                      >
                        <RiDeleteBin6Fill />
                      </span>
                      <span className="password-toggle-icon">
                        <Link to={`/edit/slider/${slider.banner_id}`}>
                          <MdModeEditOutline />
                        </Link>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannersForm;
