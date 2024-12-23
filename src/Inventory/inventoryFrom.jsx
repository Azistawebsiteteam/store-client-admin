import React from "react";
import BackBtn from "../Components/BackBtn";

const InventoryForm = (props) => {
  const {
    locationData,
    setLocationData,
    validationErrors,
    setValidationErrors,
  } = props;

  const handleChangeInput = (e) => {
    let { id, value } = e.target;
    if (id === "inventoryPhone" || id === "pinCode") {
      value = value.replace(/[^0-9]/g, "");
    }
    setLocationData({ ...locationData, [id]: value });
    setValidationErrors({ ...validationErrors, [id]: "" });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="d-flex align-items-center mb-3">
            <BackBtn />
            <h5>Inventory Location</h5>
          </div>
        </div>
        {locationData && Object.keys(locationData).length > 0 && (
          <div className="col-12">
            <div className="bgStyle">
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="inventoryId" className="form-label">
                    Inventory ID
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inventoryId"
                    onChange={handleChangeInput}
                    value={locationData.inventoryId || ""}
                    maxLength={50}
                  />
                  {validationErrors?.inventoryId && (
                    <label className="errorValue">
                      {validationErrors.inventoryId}
                    </label>
                  )}
                </div>

                <div className="col-md-6">
                  <label htmlFor="inventoryName" className="form-label">
                    Inventory Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inventoryName"
                    onChange={handleChangeInput}
                    value={locationData.inventoryName || ""}
                    maxLength={50}
                  />
                  {validationErrors?.inventoryName && (
                    <label className="errorValue">
                      {validationErrors.inventoryName}
                    </label>
                  )}
                </div>

                <div className="col-md-6">
                  <label htmlFor="inventoryLocation" className="form-label">
                    Inventory Location
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inventoryLocation"
                    onChange={handleChangeInput}
                    value={locationData.inventoryLocation || ""}
                    maxLength={50}
                  />
                  {validationErrors?.inventoryLocation && (
                    <label className="errorValue">
                      {validationErrors.inventoryLocation}
                    </label>
                  )}
                </div>

                <div className="col-md-6">
                  <label htmlFor="inventoryAddress" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inventoryAddress"
                    onChange={handleChangeInput}
                    value={locationData.inventoryAddress || ""}
                  />
                  {validationErrors?.inventoryAddress && (
                    <label className="errorValue">
                      {validationErrors.inventoryAddress}
                    </label>
                  )}
                </div>

                <div className="col-md-6">
                  <label htmlFor="inventoryLongitude" className="form-label">
                    Longitude
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inventoryLongitude"
                    onChange={handleChangeInput}
                    value={locationData.inventoryLongitude || ""}
                  />
                  {validationErrors?.inventoryLongitude && (
                    <label className="errorValue">
                      {validationErrors.inventoryLongitude}
                    </label>
                  )}
                </div>

                <div className="col-md-6">
                  <label htmlFor="inventoryLatitude" className="form-label">
                    Latitude
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inventoryLatitude"
                    onChange={handleChangeInput}
                    value={locationData.inventoryLatitude || ""}
                  />
                  {validationErrors?.inventoryLatitude && (
                    <label className="errorValue">
                      {validationErrors.inventoryLatitude}
                    </label>
                  )}
                </div>

                <div className="col-md-6">
                  <label htmlFor="inventoryEmail" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="inventoryEmail"
                    onChange={handleChangeInput}
                    value={locationData.inventoryEmail || ""}
                    maxLength={50}
                  />
                  {validationErrors?.inventoryEmail && (
                    <label className="errorValue">
                      {validationErrors.inventoryEmail}
                    </label>
                  )}
                </div>

                <div className="col-md-6">
                  <label htmlFor="inventoryPhone" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inventoryPhone"
                    onChange={handleChangeInput}
                    value={locationData.inventoryPhone || ""}
                    maxLength={10}
                  />
                  {validationErrors?.inventoryPhone && (
                    <label className="errorValue">
                      {validationErrors.inventoryPhone}
                    </label>
                  )}
                </div>

                <div className="col-md-6">
                  <label htmlFor="pinCode" className="form-label">
                    Pin Code
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="pinCode"
                    onChange={handleChangeInput}
                    value={locationData.pinCode || ""}
                    maxLength={6}
                  />
                  {validationErrors?.pinCode && (
                    <label className="errorValue">
                      {validationErrors.pinCode}
                    </label>
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
