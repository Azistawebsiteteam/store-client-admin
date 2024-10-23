import React, { useCallback } from "react";
import AdminSideBar from "../Pages/AdminSideBar";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import ErrorHandler from "../Pages/ErrorHandler";
import { MdDelete } from "react-icons/md";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);

  const baseUrl = `${process.env.REACT_APP_API_URL}/announcement`;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const getAnnouncements = useCallback(async () => {
    const url = `${baseUrl}`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.get(url, { headers });
    setAnnouncements(response.data);
  }, [baseUrl, token]);

  useEffect(() => {
    getAnnouncements();
  }, [baseUrl, getAnnouncements]);

  const handleAnnouncementDisplay = async (id, action) => {
    try {
      const url = `${baseUrl}/viewstatus`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const body = {
        announcementId: id,
        showAnnouncement: action,
      };
      const response = await axios.post(url, body, { headers });
      if (response.status === 200) {
        getAnnouncements();
      }
    } catch (error) {
      ErrorHandler.onError(error);
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      const url = `${baseUrl}/delete`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      ErrorHandler.onLoading();

      await axios.post(url, { announcementId: id }, { headers });
      getAnnouncements();
      ErrorHandler.onLoadingClose();
    } catch (error) {
      ErrorHandler.onLoadingClose();
      ErrorHandler.onError(error);
    }
  };

  return (
    <div className="adminSec">
      <div>
        <AdminSideBar />
      </div>
      <div className="commonSec">
        <div className="collectionTopbar">
          <h4>Announcements</h4>
          <Link to="/announcement/create" className="btn bg-dark text-light">
            Create Announcement
          </Link>
        </div>
        <div className="tableCont">
          <table className="table table-hover" style={{ minWidth: "1000px" }}>
            <thead>
              <tr>
                <th scope="col">S.no</th>
                <th scope="col">Announcement</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((each, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{each.announcement_web_text}</td>
                  <td>
                    <span className="me-4">
                      {each.announcement_status === 1 ? (
                        <IoIosEye
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            handleAnnouncementDisplay(
                              each.announcement_id,
                              false
                            )
                          }
                        />
                      ) : (
                        <IoIosEyeOff
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            handleAnnouncementDisplay(
                              each.announcement_id,
                              true
                            )
                          }
                        />
                      )}
                    </span>
                    <span className="me-4">
                      <Link to={`/announcement/edit/${each.announcement_id}`}>
                        <MdEdit />
                      </Link>
                    </span>
                    <span style={{ cursor: "pointer" }}>
                      <MdDelete
                        onClick={() => deleteAnnouncement(each.announcement_id)}
                      />
                    </span>
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

export default Announcements;
