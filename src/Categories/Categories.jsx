import React from 'react';

import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { downloadExcel } from 'react-export-table-to-excel';
import { MdModeEditOutline } from 'react-icons/md';
import swalHandle from '../Pages/ErrorHandler';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import AdminSideBar from '../Pages/AdminSideBar';
import ErrorHandler from '../Pages/ErrorHandler';

const Categories = () => {
  const [categories, setCategories] = useState();
  const tableRef = useRef(null);

  const baseUrl = process.env.REACT_APP_API_URL;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const getCategories = useCallback(async () => {
    try {
      const url = `${baseUrl}/category/data`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(url, { headers });
      setCategories(response.data);
    } catch (error) {
      ErrorHandler.onError(error);
    }
  }, [baseUrl, token]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const deleteBrand = async (index) => {
    try {
      const url = `${baseUrl}/category/`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const body = {
        categoryId: index,
      };
      swalHandle.onLoading();
      const response = await axios.patch(url, body, { headers });
      if (response.status === 200) {
        swalHandle.onSuccess();
        Swal.close();
      }
      getCategories();
    } catch (error) {
      Swal.close();
      swalHandle.onError(error);
    }
  };

  const header = ['Category Name', 'Number of Products'];
  function handleDownloadExcel() {
    downloadExcel({
      fileName: 'categories',
      sheet: 'categories-list',
      tablePayload: {
        header,
        body: categories.map((c) => ({
          azst_category_name: c.azst_category_name,
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
        <div className='col-12 mt-2 mb-2 d-flex justify-content-between'>
          <h4>Categories</h4>
          <button onClick={handleDownloadExcel}>Export excel</button>
          <Link to='/category/create'>Create category</Link>
        </div>
        <div className='col-sm-12'>
          <table className='table' ref={tableRef}>
            <thead>
              <tr>
                <th scope='col'>#</th>
                <th scope='col'>Category Image</th>
                <th scope='col'>Category Name</th>
                <th scope='col'>No. Products</th>
                <th scope='col'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories?.map((each, i) => (
                <tr className='item' key={i}>
                  <td>{i + 1}</td>
                  <td style={{ width: '20%' }}>
                    <img
                      className='brandThumbnail'
                      src={each.azst_category_img}
                      alt={each.azst_category_name}
                    />
                  </td>
                  <td>{each.azst_category_name}</td>
                  <td style={{ textAlign: 'center' }}>{each.no_products}</td>
                  <td>
                    <MdDelete
                      className='icons'
                      onClick={() => deleteBrand(each.azst_category_id)}
                    />{' '}
                    <Link to={`/edit-category/${each.azst_category_id}`}>
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

export default Categories;
