import React, { useState } from 'react';
import AdminSideBar from '../Pages/AdminSideBar';
import InvenforyFrom from './invenforyFrom';

const InventoryAdd = () => {
  const [locationData, setLocationData] = useState({
    inventoryId: '',
    inventoryName: '',
    inventoryLocation: '',
    inventoryLongitude: '',
    inventoryLatitude: '',
    inventoryAddress: '',
    inventoryEmail: '',
    inventoryPhone: '',
    pinCode: '',
  });

  const onSubmitInvtDetails = () => {};

  return (
    <div className='adminSec'>
      <AdminSideBar />
      <div className='commonSec'>
        <div className='addCustomerSection'>
          <InvenforyFrom
            locationData={locationData}
            setLocationData={setLocationData}
            // permissions={permissions}
            // setPermissions={setPermissions}
            // errors={errors}
            // setErrors={setErrors}
          />
          <div className='d-flex justify-content-end mb-5'>
            <button onClick={onSubmitInvtDetails} className='adminBtn'>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryAdd;
