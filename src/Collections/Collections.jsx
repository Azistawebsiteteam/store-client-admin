import React, { useEffect, useState } from 'react';
import AdminSideBar from '../Pages/AdminSideBar';
import { Link } from 'react-router-dom';
import { FaRegFileImage } from 'react-icons/fa';
import Cookies from 'js-cookie';
import axios from 'axios';
import swalErr from '../Pages/ErrorHandler';
// import { ProductState } from "../Context/ProductContext";
import { MdDelete } from 'react-icons/md';
import { MdModeEditOutline } from 'react-icons/md';
import '../Pages/Admin.css';
import { useCallback } from 'react';
import { downloadExcel } from 'react-export-table-to-excel';

const Collections = () => {
  const [collectionData, setCollectionData] = useState([]);
  const baseUrl = process.env.REACT_APP_API_URL;
  const tokenKey = process.env.REACT_APP_ADMIN_JWT_TOKEN;
  const token = Cookies.get(tokenKey);

  // const { setProductsDropdownItems } = ProductState();

  const collectionsApi = useCallback(async () => {
    try {
      const url = `${baseUrl}/collections/data`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      swalErr.onLoading();
      const response = await axios.get(url, { headers });
      swalErr.onLoadingClose();
      setCollectionData(response.data);
    } catch (error) {
      swalErr.onLoadingClose();
      swalErr.onError(error);
    }
  }, [baseUrl, token]);

  useEffect(() => {
    // setProductsDropdownItems(true);
    collectionsApi();
  }, [collectionsApi]);

  const deleteCollection = async (id) => {
    try {
      const url = `${baseUrl}/collections`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const body = { collectionId: id };
      const response = await axios.patch(url, body, { headers });
      if (response.status === 200) {
        swalErr.onSuccess();
        swalErr.onLoadingClose();
      }
      collectionsApi();
    } catch (error) {
      swalErr.onLoadingClose();
      swalErr.onError(error);
    }
  };

  const header = ['Category Name', 'Number of Products'];
  function handleDownloadExcel() {
    downloadExcel({
      fileName: 'collections',
      sheet: 'collections-list',
      tablePayload: {
        header,
        body: collectionData.map((c) => ({
          azst_collection_name: c.azst_collection_name,
          no_products: c.no_products,
        })),
      },
    });
  }

  return (
    <div className='adminSec'>
      <div>
        <AdminSideBar />
      </div>
      <div className='commonSec'>
        <div className='commonTopSec'>
          <h4>Collections</h4>
          <button className='exportBtn' onClick={handleDownloadExcel}>
            Export
          </button>
          <Link to='/collections/create' className='adminBtn'>
            Create collection
          </Link>
        </div>
        <div className='tableCont' style={{ maxHeight: '76vh' }}>
          <table
            className='table custom-table table-hover'
            style={{ minWidth: '1000px' }}>
            <thead>
              <tr>
                <th scope='col' style={{ width: '8%' }}>
                  #
                </th>
                <th scope='col' style={{ width: '20%' }}>
                  Collection Image
                </th>
                <th scope='col' style={{ width: '40%' }}>
                  Collection Name
                </th>
                <th scope='col' style={{ width: '20%' }}>
                  No. Products
                </th>
                <th scope='col' style={{ width: '12%' }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {collectionData.map((eachCollection, i) => (
                <tr key={i} className='item'>
                  <td>{i + 1}</td>
                  <td>
                    {eachCollection.azst_collection_img ? (
                      <img
                        src={eachCollection.azst_collection_img}
                        width={40}
                        height={40}
                        alt='Collection'
                        className='collectionImg'
                      />
                    ) : (
                      <div className='imgThumbnail'>
                        <FaRegFileImage />
                      </div>
                    )}
                  </td>
                  <td>{eachCollection.azst_collection_name}</td>
                  <td>{eachCollection.no_products}</td>
                  <td>
                    <MdDelete
                      className='icons'
                      onClick={() =>
                        deleteCollection(eachCollection.azst_collection_id)
                      }
                    />{' '}
                    <Link
                      to={`/collection/update/${eachCollection.azst_collection_id}`}>
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

export default Collections;
