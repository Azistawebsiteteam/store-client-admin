import React from "react";

const CustomerForm = (props) => {
  const { customerData, setCustomerData } = props;

  const handleCustomerData = (e) => {
    setCustomerData({ ...customerData, [e.target.id]: e.target.value });
  };

  console.log(customerData.customerMobileNum.length > 0);

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
                    />
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
                    />
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
                    />
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
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="wtsupNum" className="form-label">
                      Whatsapp number
                    </label>
                    <input
                      type="text"
                      onChange={handleCustomerData}
                      className="form-control"
                      id="wtsupNum"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      onChange={handleCustomerData}
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
                    />
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
                    >
                      <option>Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="emailMarketing"
                        disabled={
                          customerData.customerEmail.length > 0 ? false : true
                        }
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
                        disabled={
                          customerData.customerMobileNum.length > 0
                            ? false
                            : true
                        }
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
