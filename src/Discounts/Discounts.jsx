import React, { useCallback, useEffect, useRef, useState } from 'react';
import AdminSideBar from '../Pages/AdminSideBar';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import '../Pages/Admin.css';
import ErrorHandler from '../Pages/ErrorHandler';
import { MdEdit, MdDelete } from 'react-icons/md';
import moment from 'moment';

const Discounts = () => {
  const [discounts, setDiscount] = useState([]);

  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_API_URL;
  const jwtToken = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const tableRef = useRef(null);

  const getDiscount = useCallback(async () => {
    try {
      const url = `${baseUrl}/discount`;
      const headers = {
        Authorization: `Bearer ${jwtToken}`,
      };
      ErrorHandler.onLoading();
      const response = await axios.get(url, { headers });
      ErrorHandler.onLoadingClose();
      if (response.status === 200) {
        setDiscount(response.data);
      }
    } catch (error) {
      ErrorHandler.onLoadingClose();
      ErrorHandler.onError(error);
    }
  }, [baseUrl, jwtToken]);

  useEffect(() => {
    getDiscount();
  }, [getDiscount]);

  const deleteDiscount = async (id) => {
    try {
      const url = `${baseUrl}/discount`;
      const headers = {
        Authorization: `Bearer ${jwtToken}`,
      };
      const formData = new FormData();
      formData.append('discountId', id);
      ErrorHandler.onLoading();
      await axios.patch(url, formData, { headers });
      ErrorHandler.onLoadingClose();
      getDiscount();
    } catch (error) {
      ErrorHandler.onLoadingClose();
      ErrorHandler.onError(error);
    }
  };

  // const discount = [
  //   {
  //     id: 27,
  //     title: 'Dhasara Sale dfrgh',
  //     code: 'DSP2024SD',
  //     method: 'Manual',
  //     type: 'percentage',
  //     value: '5.00',
  //     usage_count: 3,
  //     start_time: '2024-08-31T18:30:00.000Z',
  //     end_time: '2025-01-30T18:30:00.000Z',
  //     created_by: 'BalajiDev',
  //     updated_by: 'BalajiDev',
  //     created_on: '2024-11-14T08:44:13.000Z',
  //     updated_on: '2024-11-15T10:20:43.000Z',
  //     status: 1,
  //     eligible_customers: 'all',
  //     product_dsc_type: '',
  //     discount_id: 55,
  //     scope: 'buy_x_get_y',
  //     min_cart_value: null,
  //     min_qty: null,
  //     buy_x_product_id: '[34,56,78]',
  //     min_buy_x_qty: 2,
  //     get_y_product_id:
  //       '[{"productId":"39","variantId":260},{"productId":79,"variantId":20}]',
  //     max_get_y_qty: 2,
  //     x_product_type: 'collection',
  //     y_product_type: 'product',
  //     dsc_id: 55,
  //   },
  //   {
  //     id: 28,
  //     title: 'Testing',
  //     code: 'Rajendra',
  //     method: 'Automatic',
  //     type: 'flat',
  //     value: '10000.00',
  //     usage_count: 1,
  //     start_time: '2024-11-14T11:30:00.000Z',
  //     end_time: '2024-11-30T12:30:00.000Z',
  //     created_by: 'BalajiDev',
  //     updated_by: null,
  //     created_on: '2024-11-14T11:49:59.000Z',
  //     updated_on: null,
  //     status: 1,
  //     eligible_customers: '[27]',
  //     product_dsc_type: '',
  //     discount_id: 59,
  //     scope: 'product',
  //     min_cart_value: null,
  //     min_qty: null,
  //     buy_x_product_id:
  //       '[{"productId":91,"variantId":122},{"productId":91,"variantId":123}]',
  //     min_buy_x_qty: 1,
  //     get_y_product_id: '[]',
  //     max_get_y_qty: 10,
  //     x_product_type: 'product',
  //     y_product_type: 'collection',
  //     dsc_id: 59,
  //   },
  //   {
  //     id: 29,
  //     title: 'Testing2',
  //     code: 'BALAJI',
  //     method: 'Automatic',
  //     type: 'percentage',
  //     value: '100.00',
  //     usage_count: 1,
  //     start_time: '2024-11-14T15:00:00.000Z',
  //     end_time: '2024-11-30T16:30:00.000Z',
  //     created_by: 'BalajiDev',
  //     updated_by: null,
  //     created_on: '2024-11-14T11:58:16.000Z',
  //     updated_on: null,
  //     status: 1,
  //     eligible_customers: 'all',
  //     product_dsc_type: '',
  //     discount_id: 61,
  //     scope: 'buy_x_get_y',
  //     min_cart_value: null,
  //     min_qty: null,
  //     buy_x_product_id: '[{"productId":91,"variantId":122}]',
  //     min_buy_x_qty: 2,
  //     get_y_product_id:
  //       '[{"productId":91,"variantId":122},{"productId":91,"variantId":124}]',
  //     max_get_y_qty: 10,
  //     x_product_type: 'product',
  //     y_product_type: 'product',
  //     dsc_id: 61,
  //   },
  //   {
  //     id: 30,
  //     title: 'Testing3',
  //     code: '4QB3X1I7QM',
  //     method: 'Manual',
  //     type: 'product',
  //     value: '1000.00',
  //     usage_count: 1,
  //     start_time: '2024-11-14T12:30:00.000Z',
  //     end_time: '2024-11-30T14:30:00.000Z',
  //     created_by: 'BalajiDev',
  //     updated_by: null,
  //     created_on: '2024-11-14T12:02:16.000Z',
  //     updated_on: null,
  //     status: 1,
  //     eligible_customers: 'all',
  //     product_dsc_type: 'flat',
  //     discount_id: 62,
  //     scope: 'cart',
  //     min_cart_value: '1000.00',
  //     min_qty: null,
  //     buy_x_product_id: '[]',
  //     min_buy_x_qty: null,
  //     get_y_product_id: '[{"productId":91,"variantId":122}]',
  //     max_get_y_qty: 10,
  //     x_product_type: 'collection',
  //     y_product_type: 'product',
  //     dsc_id: 62,
  //   },
  // ];

  return (
    <div className='adminSec'>
      <AdminSideBar />
      <div className='commonSec'>
        <div className='container'>
          <div className='row'>
            <div className='col-sm-12'>
              <div className='col-sm-12'>
                <div className='commonTopSec'>
                  <h4>List of Discounts</h4>
                  <DownloadTableExcel
                    filename='Discounts'
                    sheet='Discounts-list'
                    currentTableRef={tableRef.current}>
                    <button className='exportBtn'> Export</button>
                  </DownloadTableExcel>
                  <Link to='/discount/create' className='infoBtn'>
                    Create Discount
                  </Link>
                </div>
              </div>
              <div className='col-sm-12'>
                {discounts?.length > 0 ? (
                  <div className='tableCont'>
                    <table
                      className='table table-hover'
                      style={{ minWidth: '1000px' }}>
                      <thead>
                        <tr>
                          <th scope='col'>S.No</th>
                          <th scope='col'>Title</th>
                          <th scope='col'>Discount Code</th>

                          <th scope='col'>Method</th>
                          <th scope='col'>Type</th>
                          <th scope='col'>Created On</th>
                          <th scope='col'>Status</th>
                          <th scope='col'></th>
                        </tr>
                      </thead>
                      <tbody>
                        {discounts.map((each, i) => (
                          <tr key={i}>
                            <th scope='row'>{i + 1}</th>
                            <td>{each.title}</td>
                            <td>{each.code}</td>

                            <td>{each.method}</td>
                            <td>{each.scope}</td>
                            <td>
                              {moment(each.created_on).format('DD MMM, YYYY')}
                            </td>
                            <td>
                              {each.status === 1 ? 'Active' : 'In Active'}
                            </td>
                            <td>
                              <MdEdit
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  navigate(`/discounts-edit/${each.dsc_id}`);
                                }}
                              />
                              <MdDelete
                                style={{ cursor: 'pointer', marginLeft: '4px' }}
                                onClick={() => deleteDiscount(each.dsc_id)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className='noContentSec'>
                    <h6>No Discounts Available</h6>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discounts;
