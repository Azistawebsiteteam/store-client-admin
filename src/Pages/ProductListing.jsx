import React, { useEffect, useState } from 'react';
import AdminSideBar from './AdminSideBar';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { IoMdEye } from 'react-icons/io';
import swalHandle from './ErrorHandler';
import './Admin.css';

const ProductListing = () => {
  const [productsList, setProductsList] = useState([]);

  const baseUrl = process.env.REACT_APP_API_URL;
  //const localUrl = process.env.REACT_APP_LOCAL_URL;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  useEffect(() => {
    const productDetails = async () => {
      try {
        const url = `${baseUrl}/product/all-products`;
        const headers = {
          Authorization: `Bearer ${token} `,
        };
        swalHandle.onLoading();
        const response = await axios.post(url, {}, { headers });
        swalHandle.onLoadingClose();
        setProductsList(response.data.products);
      } catch (error) {
        swalHandle.onLoadingClose();
        swalHandle.onError(error);
        console.log(error);
      }
    };
    productDetails();
  }, [token, baseUrl]);

  return (
    <div className='adminSec'>
      <AdminSideBar />
      <div className='commonSec'>
        <div className='container'>
          <div className='row'>
            <div className='productsTopbar'>
              <h3>Products</h3>
              <Link to='/product/create'>Add Products</Link>
            </div>
            <div className='col-sm-12'>
              <table className='table'>
                <thead>
                  <tr>
                    <th scope='col'>#</th>
                    <th scope='col'>Product</th>
                    <th scope='col'></th>
                    <th scope='col'>Status</th>
                    <th scope='col'>Inventory</th>
                    <th scope='col'>Sales channels</th>
                    <th scope='col'>Markets</th>
                    <th scope='col'>Category</th>
                    <th scope='col'>Vendor</th>
                    <th scope='col'>Actons</th>
                  </tr>
                </thead>
                <tbody>
                  {productsList.map((p) => (
                    <tr key={p.product_id}>
                      <th className='col-1'>
                        <img
                          src={p.image_src}
                          alt='product'
                          className='productThumbnail'
                        />
                      </th>
                      <td className='col-2'>
                        <Link
                          className='productLink'
                          to={`/product/update/${p.product_id}`}>
                          {p.product_title}
                        </Link>
                      </td>
                      <td>
                        <a target='__blank' href={p.url_handle}>
                          <IoMdEye />
                        </a>
                      </td>
                      <td>{p.status === 1 ? 'Active' : 'Draft'}</td>
                      <td>
                        {p.total_variants === 0 || null
                          ? `${p.total_variant_quantity} in stock`
                          : `${p.total_variant_quantity} in stock for ${p.total_variants} variants`}
                      </td>
                      <td>null</td>
                      <td>Indian Market</td>
                      <td>{p.product_category}</td>
                      <td>{p.azst_vendor_name}</td>
                      <td>
                        <Link to={`/product/info/${p.product_id}`}>
                          <input type='button' value='Add Info' />
                        </Link>
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
  );
};

export default ProductListing;
