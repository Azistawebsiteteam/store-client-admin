import React from "react";

const CustomerForm = (props) => {
  const {
    customerData,
    setCustomerData,
    errors,
    setErrors,
    permissions,
    setPermissions,
  } = props;

  const handleCustomerData = (e) => {
    let { id, value } = e.target;

    if (id === "customerMobileNum" || id === "wtsupNum") {
      value = value.replace(/[^0-9]/g, "");
    }
    if (id === "customerMobileNum" && permissions.sameForWhatsapp) {
      setCustomerData({ ...customerData, [id]: value, wtsupNum: value });
      setErrors({ ...errors, [id]: "", wtsupNum: "" });
    } else {
      setCustomerData({ ...customerData, [id]: value });
      setErrors({ ...errors, [id]: "" });
    }
  };

  const handleCheckbox = (e) => {
    const { id, checked } = e.target;
    if (id === "sameForWhatsapp") {
      if (checked) {
        setCustomerData({
          ...customerData,
          wtsupNum: customerData.customerMobileNum,
        });
      } else {
        setCustomerData({ ...customerData, wtsupNum: "" });
      }
    }
    setPermissions({ ...permissions, [id]: checked });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-8">
          <div className="row">
            <div className="col-12">
              <div className="bgStyle">
                <div className="row g-3">
                  <h6>Customer overview</h6>
                  <div className="col-md-6">
                    <label htmlFor="customerFirstName" className="form-label">
                      First name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="customerFirstName"
                      onChange={handleCustomerData}
                      value={customerData.customerFirstName}
                    />
                    {errors.customerFirstName && (
                      <span className="error">{errors.customerFirstName}</span>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="customerLastName" className="form-label">
                      Last name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="customerLastName"
                      onChange={handleCustomerData}
                      value={customerData.customerLastName}
                    />
                    {errors.customerLastName && (
                      <span className="error">{errors.customerLastName}</span>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="customerEmail" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="customerEmail"
                      onChange={handleCustomerData}
                      value={customerData.customerEmail}
                    />
                    {errors.customerEmail && (
                      <span className="error">{errors.customerEmail}</span>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="customerMobileNum" className="form-label">
                      Phone number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="customerMobileNum"
                      onChange={handleCustomerData}
                      value={customerData.customerMobileNum}
                    />
                    {errors.customerMobileNum && (
                      <span className="error">{errors.customerMobileNum}</span>
                    )}
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="sameForWhatsapp"
                        onChange={handleCheckbox}
                        checked={permissions.sameForWhatsapp}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="sameForWhatsapp"
                      >
                        Same for WhatsApp.
                      </label>
                    </div>
                  </div>
                  {!permissions.sameForWhatsapp && (
                    <div className="col-md-6">
                      <label htmlFor="wtsupNum" className="form-label">
                        Whatsapp number
                      </label>
                      <input
                        type="text"
                        onChange={handleCustomerData}
                        className="form-control"
                        id="wtsupNum"
                        value={
                          permissions.sameForWhatsapp
                            ? customerData.customerMobileNum
                            : customerData.wtsupNum
                        }
                      />
                      {errors.wtsupNum && (
                        <span className="error">{errors.wtsupNum}</span>
                      )}
                    </div>
                  )}
                  <div className="col-md-6">
                    <label htmlFor="password" className="form-label">
                      Password (optional)
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      onChange={handleCustomerData}
                      value={customerData.password}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="DOB" className="form-label">
                      DOB
                    </label>
                    <input
                      type="date"
                      onChange={handleCustomerData}
                      className="form-control"
                      id="DOB"
                      value={customerData.DOB}
                    />
                    {errors.DOB && <span className="error">{errors.DOB}</span>}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="gender" className="form-label">
                      Gender
                    </label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      id="gender"
                      onChange={handleCustomerData}
                      value={customerData.gender}
                    >
                      <option>Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    {errors.gender && (
                      <span className="error">{errors.gender}</span>
                    )}
                  </div>
                  <div className="col-12">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="emailMarketing"
                        onChange={handleCheckbox}
                        disabled={
                          customerData.customerEmail.length > 1 ? false : true
                        }
                        checked={permissions.emailMarketing}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="emailMarketing"
                      >
                        Customer agreed to receive marketing emails.
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="smsMarketing"
                        onChange={handleCheckbox}
                        disabled={
                          customerData.customerMobileNum.length >= 10
                            ? false
                            : true
                        }
                        checked={permissions.smsMarketing}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="smsMarketing"
                      >
                        Customer agreed to receive SMS marketing text messages.
                      </label>
                    </div>
                  </div>
                  <span>
                    You should ask your customers for permission before you
                    subscribe them to your marketing emails or SMS.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="row">
            <div className="col-12">
              <div className="bgStyle">
                <div className="col-md-12">
                  <h6 htmlFor="notes" className="form-label">
                    Notes
                  </h6>
                  <input
                    type="text"
                    onChange={handleCustomerData}
                    className="form-control"
                    id="notes"
                  />
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="bgStyle">
                <div className="col-md-12">
                  <h6 htmlFor="tags" className="form-label">
                    Tags
                  </h6>
                  <input
                    type="text"
                    onChange={handleCustomerData}
                    className="form-control"
                    id="tags"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;
