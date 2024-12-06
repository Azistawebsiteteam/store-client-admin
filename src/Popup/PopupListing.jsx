import React, { useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import ErrorHandler from '../Pages/ErrorHandler';
import AdminSideBar from '../Pages/AdminSideBar';
import { v4 } from 'uuid';
import '../Pages/Admin.css';
import { FaRegFileImage } from 'react-icons/fa';
import { CiSquarePlus } from 'react-icons/ci';
import { LuSave } from 'react-icons/lu';
import { MdEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import './Popup.css';

const PopupListing = () => {
  const [popups, setPopups] = useState([
    {
      isNew: true,
      popup_image: '',
      popup_name: '',
      popup_url: '',
      popup_btn_color: '',
      mode: 'edit',
    },
  ]);
  // const [errorMsg, setError] = useState("");

  const baseUrl = process.env.REACT_APP_API_URL;
  const jwtToken = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const displayPopups = useCallback(async () => {
    try {
      const url = `${baseUrl}/popups/data`;
      const headers = {
        Authorization: `Bearer ${jwtToken}`,
      };

      ErrorHandler.onLoading();

      const response = await axios.get(url, { headers });

      if (response.status === 200) {
        const { data } = response;
        const popus = data.map((pop) => ({ ...pop, mode: 'normal' }));
        setPopups(popus);
      }
      ErrorHandler.onLoadingClose();
    } catch (error) {
      ErrorHandler.onLoadingClose();
      ErrorHandler.onError(error);
    }
  }, [baseUrl, jwtToken]);

  useEffect(() => {
    displayPopups();
  }, [displayPopups]);

  const onCreatePopup = async (i) => {
    try {
      const url = `${baseUrl}/popups`;
      const headers = {
        Authorization: `Bearer ${jwtToken}`,
      };

      const popup = popups[i];
      const formdata = new FormData();
      formdata.append('Name', popup.popup_name);
      formdata.append('popupImage', popup.popup_image);
      formdata.append('Url', popup.popup_url);
      formdata.append('btnColor', popup.popup_btn_color);

      ErrorHandler.onLoading();
      // eslint-disable-next-line no-unused-vars

      if (popup.isNew) {
        await axios.post(`${url}/create`, formdata, {
          headers,
        });
        displayPopups();
      } else {
        formdata.append('popupId', popup.id);
        await axios.put(url, formdata, {
          headers,
        });
      }

      ErrorHandler.onLoadingClose();
      ErrorHandler.onSuccess();
      setPopups(
        popups.map((p) => (p.id === popup.id ? { ...p, mode: 'normal' } : p))
      );
    } catch (error) {
      ErrorHandler.onLoadingClose();
      ErrorHandler.onError(error);
      // setError(error.response?.data?.message);
    }
  };

  const editPopup = (id) => {
    const updatedPopups = popups.map((popup) => {
      if (popup.id === id) {
        if (popup.mode === 'edit') {
          return { ...popup, mode: 'normal' };
        } else {
          return { ...popup, mode: 'edit' };
        }
      }
      return popup;
    });
    setPopups(updatedPopups);
  };

  const deletePopup = async (id) => {
    try {
      const url = `${baseUrl}/popups`;
      const headers = {
        Authorization: `Bearer ${jwtToken}`,
      };
      ErrorHandler.onLoading();
      await axios.patch(url, { popupId: id }, { headers });
      ErrorHandler.onLoadingClose();
      const newPopups = popups.filter((popup) => popup.id !== id);
      setPopups(newPopups);
    } catch (error) {
      ErrorHandler.onLoadingClose();
      ErrorHandler.onError(error);
    }
  };

  const handleStatus = async (popupId) => {
    try {
      const url = `${baseUrl}/popups/status`;
      const headers = {
        Authorization: `Bearer ${jwtToken}`,
      };
      let activeStatus = null;

      const updatePopups = popups.map((each) => {
        if (each.id === popupId && each.is_active === 0) {
          activeStatus = 1;
          return { ...each, is_active: 1 };
        } else if (each.id === popupId && each.is_active === 1) {
          activeStatus = 0;
          return { ...each, is_active: 0 };
        } else {
          return each;
        }
      });

      setPopups(updatePopups);

      ErrorHandler.onLoading();
      const response = await axios.patch(
        url,
        { popupId, activeStatus },
        { headers }
      );
      if (response.status === 200) {
      }
      ErrorHandler.onLoadingClose();
    } catch (error) {
      ErrorHandler.onLoadingClose();
      ErrorHandler.onError(error);
    }
  };

  const handlePopupDetails = (e, popupId) => {
    const { id, value, files } = e.target;
    const updatedPopupDetails = popups.map((each) => {
      if (each.id === popupId) {
        if (files) {
          return { ...each, popup_image: files[0] };
        } else {
          return { ...each, [id]: value };
        }
      } else {
        return each;
      }
    });
    setPopups(updatedPopupDetails);
  };

  const addPopup = () => {
    const newPopup = {
      id: v4(),
      popup_image: '',
      popup_name: '',
      popup_url: '',
      popup_btn_color: '',
      mode: 'edit',
      activeStatus: 0,
      isNew: true,
    };
    setPopups([...popups, newPopup]);
  };

  const getImageLink = (popImg) => {
    const url = URL.createObjectURL(popImg);
    return url;
  };

  return (
    <div className='adminSec'>
      <div>
        <AdminSideBar />
      </div>
      <div className='commonSec'>
        <div className='collectionTopbar'>
          <h4>Popup</h4>
        </div>
        <div className='popups'>
          <div className='row'>
            {popups.map((each, i) => (
              <div className='popupCard col-sm-3' key={i}>
                <div className='card'>
                  {each.mode === 'normal' ? (
                    <>
                      <div className='card-image'>
                        <div className='popupImgCont'>
                          <img
                            src={each.popup_image}
                            className='card-img-top popupImg'
                            alt='popupImg'
                          />
                        </div>
                      </div>
                      <div className='card-body'>
                        <label className='d-block popupInfo'>
                          <strong>Name :</strong> {each.popup_name}
                        </label>
                        <label
                          className='d-block popupInfo'
                          style={{ whiteSpace: 'normal' }}>
                          <strong>URL :</strong> {each.popup_url}
                        </label>
                        <label className='d-flex aligin-items-center popupInfo'>
                          <strong>Color :</strong>{' '}
                          <input
                            type='color'
                            disabled={true}
                            value={each.popup_btn_color}
                            className='popupColor'
                            placeholder='Color'
                            id='popup_btn_color'
                          />
                        </label>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className='card-image'>
                        {each.popup_image ? (
                          typeof each.popup_image === 'string' ? (
                            <div className='popupImgCont'>
                              <img
                                src={each.popup_image}
                                className='card-img-top popupImg'
                                alt='popupImg'
                              />
                              <div className='uploadNewPopup'>
                                <input
                                  type='file'
                                  accept='image/*'
                                  className='card-img-top popupImgSelect'
                                  alt='popupImage'
                                  onChange={(e) =>
                                    handlePopupDetails(e, each.id)
                                  }
                                  id='popup_image'
                                />
                              </div>
                            </div>
                          ) : (
                            <div className='popupImgCont'>
                              <img
                                src={getImageLink(each.popup_image)}
                                className='card-img-top popupImg'
                                alt='popupImg'
                              />
                              <div className='uploadNewPopup'>
                                <input
                                  type='file'
                                  accept='image/*'
                                  className='card-img-top popupImgSelect'
                                  alt='popupImage'
                                  onChange={(e) =>
                                    handlePopupDetails(e, each.id)
                                  }
                                  id='popup_image'
                                />
                              </div>
                            </div>
                          )
                        ) : (
                          <div className='cardThumbnail'>
                            <FaRegFileImage size={60} />
                            <div className='uploadNewPopup'>
                              <input
                                type='file'
                                accept='image/*'
                                className='card-img-top popupImgSelect'
                                alt='popupImage'
                                onChange={(e) => handlePopupDetails(e, each.id)}
                                id='popup_image'
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className='card-body'>
                        <input
                          type='text'
                          onChange={(e) => handlePopupDetails(e, each.id)}
                          value={each.popup_name}
                          className='popupContent form-control'
                          placeholder='Title'
                          id='popup_name'
                        />
                        <input
                          type='text'
                          onChange={(e) => handlePopupDetails(e, each.id)}
                          value={each.popup_url}
                          className='popupContent form-control'
                          placeholder='URL'
                          id='popup_url'
                        />
                        <input
                          type='color'
                          onChange={(e) => handlePopupDetails(e, each.id)}
                          value={each.popup_btn_color}
                          className='popupContent'
                          placeholder='Color'
                          id='popup_btn_color'
                        />
                      </div>
                    </>
                  )}
                  <div className='popupActionBtns'>
                    <button
                      style={{
                        border: 'none',
                        backgroundColor: 'transparent',
                        margin: '2px 8px 0 0',
                        cursor: 'pointer',
                      }}
                      onClick={() => onCreatePopup(i)}>
                      <LuSave size={20} />
                    </button>
                    <button
                      style={{
                        border: 'none',
                        backgroundColor: 'transparent',
                        margin: '2px 8px 0 0',
                        cursor: 'pointer',
                      }}
                      onClick={() => deletePopup(each.id)}>
                      <MdDelete size={20} />
                    </button>
                    <button
                      style={{
                        border: 'none',
                        backgroundColor: 'transparent',
                        margin: '2px 8px 0 0',
                        cursor: 'pointer',
                      }}
                      onClick={() => editPopup(each.id)}>
                      <MdEdit size={20} />
                    </button>
                    <button
                      style={{
                        border: 'none',
                        backgroundColor: 'transparent',
                        margin: '2px 8px 0 0',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleStatus(each.id)}>
                      {each.is_active === 0 ? (
                        <IoEyeOff size={20} />
                      ) : (
                        <IoEye size={20} />
                      )}
                    </button>
                  </div>
                </div>
                {/* {errorMsg && <label>{errorMsg}</label>} */}
              </div>
            ))}
            <div className='popupCard col-sm-3'>
              <div
                className='popupAddBtn d-flex align-items-center justify-content-center'
                style={{ height: '100%' }}>
                <CiSquarePlus
                  style={{
                    fontSize: '40px',
                    cursor: 'pointer',
                    margin: '10px',
                  }}
                  onClick={addPopup}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupListing;
