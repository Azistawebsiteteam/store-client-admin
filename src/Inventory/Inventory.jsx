/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from 'react';
import Form from 'react-bootstrap/Form';
import AdminSideBar from '../Pages/AdminSideBar';
import axios from 'axios';
import { RiArrowUpDownLine } from 'react-icons/ri';
import Table from 'react-bootstrap/Table';
import Cookies from 'js-cookie';
import errorHandle from '../Pages/ErrorHandler';
import { GoArrowUp, GoArrowDown } from 'react-icons/go';
import Pagination from '../Components/Pagination';
import './index.css';
import './../Pages/Admin.css';
import { downloadExcel } from 'react-export-table-to-excel';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [inventoryId, setInventoryId] = useState('');
  const [inventoryData, setInventoryData] = useState([]);
  const [totalInventory, setTotalInventory] = useState(0);
  const [displayFilterDropdown, setDisplayFilterDropdown] = useState(false);
  const [changedInventories, setChangedInventories] = useState([]);
  const [filtersOrder, setFiltersOrder] = useState('DESC');
  const [filteredVal, setFilteredValue] = useState('productTitle');
  const [filteredInventoryList, setFilteredInventoryList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const baseUrl = process.env.REACT_APP_API_URL;
  const localUrl = process.env.REACT_APP_LOCAL_URL;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const logsPerPage = 10;

  useEffect(() => {
    const getInventoryLocations = async () => {
      try {
        const url = `${baseUrl}/inventory/locations`;

        const headers = {
          Authorization: `Bearer ${token}`,
        };
        errorHandle.onLoading();
        const response = await axios.get(url, { headers });
        setInventory(response.data);
        if (response.data.length > 0) {
          setInventoryId(response.data[0].inventory_id);
        }
        errorHandle.onLoadingClose();
      } catch (error) {
        errorHandle.onLoadingClose();
        errorHandle.onError(error);
      }
    };
    getInventoryLocations();
  }, [baseUrl, token]);

  useEffect(() => {
    const getInventoryData = async () => {
      try {
        const url = `${baseUrl}/inventory/get/product-qty`;

        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const body = {
          inventoryId,
          orderbyKey: filteredVal,
          sort: filtersOrder,
          collection: '',
        };

        errorHandle.onLoading();
        const response = await axios.post(url, body, { headers });
        const inventory = response.data;
        setInventoryData(inventory);
        setTotalInventory(inventory.length);
        setCurrentPage(1);
        errorHandle.onLoadingClose();
      } catch (error) {
        errorHandle.onLoadingClose();
        errorHandle.onError(error);
      }
    };
    getInventoryData();
  }, [baseUrl, token, inventoryId, filteredVal, filtersOrder]);

  const handleInventory = (e) => {
    setInventoryId(e.target.value);
  };

  const handleInventoryInput = (e, productId, compare) => {
    const newValue = parseInt(e.target.value, 10);

    // Determine the correct comparison key
    const compareKey =
      compare === 'avbl'
        ? 'azst_ipm_avbl_quantity'
        : 'azst_ipm_onhand_quantity';

    if (!changedInventories.includes(productId)) {
      setChangedInventories([...changedInventories, productId]);
    }

    if (!isNaN(newValue)) {
      const updatedInventory = inventoryData.map((eachProduct) => {
        if (eachProduct.azst_ipm_id === productId) {
          // Determine the updated quantities based on comparison
          const isNewValueGreater = newValue > eachProduct[compareKey];
          const avblQuantityChange = isNewValueGreater ? 2 : -2;
          const onhandQuantityChange = isNewValueGreater ? 2 : -2;

          return {
            ...eachProduct,
            azst_ipm_avbl_quantity:
              eachProduct.azst_ipm_avbl_quantity + avblQuantityChange,
            azst_ipm_onhand_quantity:
              eachProduct.azst_ipm_onhand_quantity + onhandQuantityChange,
          };
        }
        return eachProduct;
      });

      setInventoryData(updatedInventory);
    }
  };

  const saveValues = async () => {
    try {
      const url = `${baseUrl}/inventory/update/product-qty`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const body = {
        changedInventories: inventoryData
          .filter((inv) => changedInventories.includes(inv.azst_ipm_id))
          .map((inv) => ({
            ipmId: inv.azst_ipm_id,
            onHandQty: inv.azst_ipm_onhand_quantity,
            availableQty: inv.azst_ipm_avbl_quantity,
          })),
      };

      errorHandle.onLoading();
      const response = await axios.post(url, body, { headers });
      errorHandle.onLoadingClose();
      errorHandle.onSuccess();
      setChangedInventories([]);
    } catch (error) {
      errorHandle.onError(error);
      errorHandle.onLoadingClose();
    }
  };

  const handleFilters = (e) => {
    setFilteredValue(e.target.value);
  };

  const handleFiltersOrder = (txt) => {
    setFiltersOrder(txt);
  };

  const header = [
    'Product Name',
    'SKU',
    'Committed Quantity',
    'Available Quantity',
    'OnHand Quantity',
  ];

  function handleDownloadExcel() {
    downloadExcel({
      fileName: 'inventory',
      sheet: 'quantity-list',
      tablePayload: {
        header,
        body: inventoryData.map((i) => ({
          product_title: `${i.product_title}\n ${
            i.is_varaints_aval
              ? `\n${[i.option1, i.option2, i.option3]
                  .filter(Boolean)
                  .join(' / ')}`
              : ''
          }`,
          sku_code: i.sku_code,
          commitedQty: i.azst_ipm_commit_quantity,
          availableQty: i.azst_ipm_avbl_quantity,
          onHandQty: i.azst_ipm_onhand_quantity,
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
          <div className='leftSec'>
            <h4 className='d-inline'>Inventory:</h4>
            <Form.Select
              className='inventoryDropdown'
              value={inventoryId}
              onChange={handleInventory}>
              {inventory.map((each, i) => (
                <option key={i} value={each.inventory_id}>
                  {each.inventory_name}
                </option>
              ))}
            </Form.Select>
          </div>
          <button className='exportBtn' onClick={handleDownloadExcel}>
            Export
          </button>
          <div className='saveBtnCont'>
            {changedInventories.length > 0 && (
              <button className='infoBtn' onClick={saveValues}>
                Save
              </button>
            )}
          </div>
          <button
            className='sortBtn'
            onClick={() => setDisplayFilterDropdown(!displayFilterDropdown)}>
            <RiArrowUpDownLine />
          </button>
          {displayFilterDropdown && (
            <div className='dropDown'>
              <p>Sort by</p>
              <div className='form-check'>
                <input
                  className='form-check-input'
                  type='radio'
                  name='filterSec'
                  id='producttitle'
                  value='producttitle'
                  onChange={handleFilters}
                  checked={'producttitle' === filteredVal}
                />
                <label className='form-check-label' htmlFor='producttitle'>
                  Product title
                </label>
              </div>
              <div className='form-check'>
                <input
                  className='form-check-input'
                  type='radio'
                  name='filterSec'
                  id='sku'
                  value='sku'
                  onChange={handleFilters}
                  checked={'sku' === filteredVal}
                />
                <label className='form-check-label' htmlFor='sku'>
                  SKU
                </label>
              </div>
              <div className='form-check'>
                <input
                  className='form-check-input'
                  type='radio'
                  name='filterSec'
                  id='unavailable'
                  value='unavailable'
                  onChange={handleFilters}
                  checked={'unavailable' === filteredVal}
                />
                <label className='form-check-label' htmlFor='unavailable'>
                  Unavailable
                </label>
              </div>
              <div className='form-check'>
                <input
                  className='form-check-input'
                  type='radio'
                  name='filterSec'
                  id='commited'
                  value='commited'
                  onChange={handleFilters}
                  checked={'commited' === filteredVal}
                />
                <label className='form-check-label' htmlFor='commited'>
                  Committed
                </label>
              </div>
              <div className='form-check'>
                <input
                  className='form-check-input'
                  type='radio'
                  name='filterSec'
                  id='available'
                  value='available'
                  onChange={handleFilters}
                  checked={'available' === filteredVal}
                />
                <label className='form-check-label' htmlFor='available'>
                  Available
                </label>
              </div>
              <div className='form-check'>
                <input
                  className='form-check-input'
                  type='radio'
                  name='filterSec'
                  id='onhand'
                  value='onhand'
                  onChange={handleFilters}
                  checked={'onhand' === filteredVal}
                />
                <label className='form-check-label' htmlFor='onhand'>
                  On hand
                </label>
              </div>
              <div className='mt-1'>
                <GoArrowUp />
                <label
                  className={filtersOrder === 'ASC' && 'active'}
                  onClick={() => handleFiltersOrder('ASC')}>
                  A - Z
                </label>
              </div>
              <div className='mt-1'>
                <GoArrowDown />
                <label
                  className={filtersOrder === 'DESC' && 'active'}
                  onClick={() => handleFiltersOrder('DESC')}>
                  Z - A
                </label>
              </div>
            </div>
          )}
        </div>
        <div className='middleSec'>
          {filteredInventoryList.length ? (
            <div className='tableCont'>
              <table
                className='table table-hover'
                style={{ minWidth: '1200px' }}>
                <thead>
                  <tr className='tableHeader'>
                    <th
                      className='sticky-column'
                      style={{ width: '  10%' }}
                      scope='col'>
                      Image
                    </th>
                    <th scope='col'>Product</th>
                    <th scope='col' style={{ width: '  10%' }}>
                      SKU
                    </th>
                    <th scope='col' style={{ width: '  10%' }}>
                      Unavailable
                    </th>
                    <th scope='col' style={{ width: '  10%' }}>
                      Committed
                    </th>
                    <th scope='col' style={{ width: '  10%' }}>
                      Available
                    </th>
                    <th scope='col' style={{ width: '  10%' }}>
                      On hand
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventoryList.map((each, i) => (
                    <tr key={each.azst_ipm_id}>
                      <td className='sticky-column' style={{ width: '  10%' }}>
                        {each.is_varaints_aval === 1 ? (
                          <img
                            className='invSecImg'
                            src={each.variant_image}
                            alt='productImg'
                          />
                        ) : (
                          <img
                            src={each.product_image}
                            alt='productImg'
                            className='invSecImg'
                          />
                        )}
                      </td>
                      <td className='productTitle'>
                        <span>{each.product_title}</span>
                        {each.is_varaints_aval ? (
                          <p className='variantsOpt'>
                            {each.option1 && <span>{each.option1}</span>}
                            {each.option2 && <span>/{each.option2}</span>}
                            {each.option3 && <span>/{each.option1}</span>}
                          </p>
                        ) : null}
                      </td>
                      <td className='productSku'>{each.sku_code}</td>
                      <td style={{ width: '  10%' }}>
                        {each.azst_ipm_unavbl_quantity}
                      </td>
                      <td style={{ width: '  10%' }}>
                        {each.azst_ipm_commit_quantity}
                      </td>

                      <td style={{ width: '  10%' }}>
                        <input
                          id='onHandQty'
                          type='number'
                          className='inventoryInput'
                          value={each.azst_ipm_avbl_quantity}
                          onInput={(e) =>
                            handleInventoryInput(e, each.azst_ipm_id, 'avbl')
                          }
                        />
                      </td>

                      <td className='inventoryInputCont'>
                        <input
                          id='onHandQty'
                          type='number'
                          className='inventoryInput'
                          value={each.azst_ipm_onhand_quantity}
                          onInput={(e) =>
                            handleInventoryInput(e, each.azst_ipm_id, 'onhand')
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No Products in the Inventory</p>
          )}
        </div>
        <Pagination
          logsPerPage={logsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={totalInventory}
          listOfItems={inventoryData}
          setFilteredItemsList={setFilteredInventoryList}
        />
      </div>
    </div>
  );
};

export default Inventory;
