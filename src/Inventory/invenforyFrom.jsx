import React from 'react';
import BackBtn from '../Components/BackBtn';

const InventoryForm = (props) => {
  const { locationData, setLocationData, errors } = props;

  const handleChangeInput = (e) => {
    const { id, value } = e.target;
    setLocationData({ ...locationData, [id]: value });
  };

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-12'>
          <div className='d-flex align-items-center mb-3'>
            <BackBtn />
            <h5>Inventory Location</h5>
          </div>
        </div>
        {locationData && Object.keys(locationData).length > 0 && (
          <div className='col-12'>
            <div className='bgStyle'>
              <div className='row g-3'>
                <div className='col-md-6'>
                  <label htmlFor='inventoryId' className='form-label'>
                    Inventory ID
                  </label>
                  <input
                    type='text'
                    className='form-control'
                    id='inventoryId'
                    onChange={handleChangeInput}
                    value={locationData.inventoryId || ''}
                    maxLength={50}
                  />
                  {errors?.inventoryId && (
                    <label className='errorValue'>{errors.inventoryId}</label>
                  )}
                </div>

                <div className='col-md-6'>
                  <label htmlFor='inventoryName' className='form-label'>
                    Inventory Name
                  </label>
                  <input
                    type='text'
                    className='form-control'
                    id='inventoryName'
                    onChange={handleChangeInput}
                    value={locationData.inventoryName || ''}
                    maxLength={50}
                  />
                  {errors?.inventoryName && (
                    <label className='errorValue'>{errors.inventoryName}</label>
                  )}
                </div>

                <div className='col-md-6'>
                  <label htmlFor='inventoryLocation' className='form-label'>
                    Inventory Location
                  </label>
                  <input
                    type='text'
                    className='form-control'
                    id='inventoryLocation'
                    onChange={handleChangeInput}
                    value={locationData.inventoryLocation || ''}
                    maxLength={50}
                  />
                  {errors?.inventoryLocation && (
                    <label className='errorValue'>
                      {errors.inventoryLocation}
                    </label>
                  )}
                </div>

                <div className='col-md-6'>
                  <label htmlFor='inventoryAddress' className='form-label'>
                    Address
                  </label>
                  <input
                    type='text'
                    className='form-control'
                    id='inventoryAddress'
                    onChange={handleChangeInput}
                    value={locationData.inventoryAddress || ''}
                  />
                </div>

                <div className='col-md-6'>
                  <label htmlFor='inventoryLongitude' className='form-label'>
                    Longitude
                  </label>
                  <input
                    type='text'
                    className='form-control'
                    id='inventoryLongitude'
                    onChange={handleChangeInput}
                    value={locationData.inventoryLongitude || ''}
                  />
                </div>

                <div className='col-md-6'>
                  <label htmlFor='inventoryLatitude' className='form-label'>
                    Latitude
                  </label>
                  <input
                    type='text'
                    className='form-control'
                    id='inventoryLatitude'
                    onChange={handleChangeInput}
                    value={locationData.inventoryLatitude || ''}
                  />
                </div>

                <div className='col-md-6'>
                  <label htmlFor='inventoryEmail' className='form-label'>
                    Email
                  </label>
                  <input
                    type='email'
                    className='form-control'
                    id='inventoryEmail'
                    onChange={handleChangeInput}
                    value={locationData.inventoryEmail || ''}
                    maxLength={50}
                  />
                  {errors?.inventoryEmail && (
                    <label className='errorValue'>
                      {errors.inventoryEmail}
                    </label>
                  )}
                </div>

                <div className='col-md-6'>
                  <label htmlFor='inventoryPhone' className='form-label'>
                    Phone Number
                  </label>
                  <input
                    type='text'
                    className='form-control'
                    id='inventoryPhone'
                    onChange={handleChangeInput}
                    value={locationData.inventoryPhone || ''}
                    maxLength={10}
                  />
                  {errors?.inventoryPhone && (
                    <label className='errorValue'>
                      {errors.inventoryPhone}
                    </label>
                  )}
                </div>

                <div className='col-md-6'>
                  <label htmlFor='pinCode' className='form-label'>
                    Pin Code
                  </label>
                  <input
                    type='text'
                    className='form-control'
                    id='pinCode'
                    onChange={handleChangeInput}
                    value={locationData.pinCode || ''}
                    maxLength={10}
                  />
                  {errors?.pinCode && (
                    <label className='errorValue'>{errors.pinCode}</label>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryForm;
