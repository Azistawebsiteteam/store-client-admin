import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Pagination from '../Components/Pagination';

import AdminSideBar from './AdminSideBar';
import { downloadExcel } from 'react-export-table-to-excel';
import axios from 'axios';
import ErrorHandler from './ErrorHandler';

const Checkouts = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [filteredProductsList, setFilteredItemsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const baseUrl = process.env.REACT_APP_API_URL;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const logsPerPage = 10;

  useEffect(() => {
    const abandonmentCheckouts = async () => {
      try {
        const url = `http://192.168.214.16:5018/api/v1/cart/abandonment`;
        ErrorHandler.onLoading();
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.post(url, {}, { headers });
        const { data } = response;
        setCartProducts(data);
        setFilteredItemsList(data);
        setTotalProducts(data.length);
        ErrorHandler.onLoadingClose();
      } catch (error) {
        ErrorHandler.onLoadingClose();
        ErrorHandler.onError(error);
      }
    };
    abandonmentCheckouts();
  }, [baseUrl, token]);

  const header = [
    'Product Name',
    'Quantity',
    'customer Name',
    'contact',
    'Email',
    'Added On',
  ];

  function handleDownloadExcel() {
    downloadExcel({
      fileName: 'abandonment cart',
      sheet: 'abandonment cart-list',
      tablePayload: {
        header,
        body: cartProducts.map((p) => ({
          product_title: `${p.product_main_title}\n ${
            p.is_varaints_aval
              ? `\n${[p.option1, p.option2, p.option3]
                  .filter(Boolean)
                  .join(' / ')}`
              : ''
          }`,
          quantity: p.azst_cart_quantity,
          product_category: p.azst_customer_name,
          azst_customer_mobile: p.azst_customer_mobile,
          azst_customer_email: p.azst_customer_email,
          azst_cart_added_on: p.azst_cart_added_on,
        })),
      },
    });
  }

  return (
    <div className='adminSec'>
      <AdminSideBar />
      <div className='commonSec'>
        <div className='container'>
          <div className='row'>
            <div className='commonTopSec'>
              <h4>checkouts</h4>
              <button className='exportBtn' onClick={handleDownloadExcel}>
                Export
              </button>
            </div>
            <div className='middleSec'>
              <div className='tableCont'>
                <table
                  className='table table-hover'
                  style={{ minWidth: '1200px' }}>
                  <thead>
                    <tr className='tableHeader'>
                      <th className='sticky-column' scope='col'>
                        #
                      </th>
                      <th scope='col'></th>
                      <th scope='col'>Product</th>
                      <th scope='col'>Quantity</th>
                      <th scope='col'>Customer Name</th>
                      <th scope='col' style={{ width: '10%' }}>
                        contact
                      </th>
                      <th scope='col'>Email</th>
                      <th>Added On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProductsList.map((p) => (
                      <tr key={p.product_id}>
                        <td></td>
                        <td
                          className='sticky-column'
                          style={{ width: '120px' }}>
                          <img
                            src={p.product_image}
                            alt='product'
                            className='productThumbnail'
                          />
                        </td>
                        <td style={{ width: '360px' }}>
                          <Link
                            className='productLink'
                            to={`http://20.235.149.147:5021/product/${p.product_url_title}`}
                            target='__blank'>
                            <span>{p.product_main_title}</span>
                            {p.is_varaints_aval ? (
                              <p className='variantsOpt'>
                                {p.option1 && <span>{p.option1}</span>}
                                {p.option2 && <span>/{p.option2}</span>}
                                {p.option3 && <span>/{p.option1}</span>}
                              </p>
                            ) : null}
                          </Link>
                        </td>
                        <td>{p.azst_cart_quantity}</td>
                        <td>{p.azst_customer_name}</td>
                        <td>{p.azst_customer_mobile}</td>
                        <td>{p.azst_customer_email}</td>
                        <td>{p.azst_cart_added_on}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <Pagination
              logsPerPage={logsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={totalProducts}
              listOfItems={cartProducts}
              setFilteredItemsList={setFilteredItemsList}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkouts;
