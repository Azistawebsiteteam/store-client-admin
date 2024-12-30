import React, { useCallback, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import moment from "moment";
import { DownloadTableExcel } from "react-export-table-to-excel";
import { MdDelete, MdEdit } from "react-icons/md";

import AdminSideBar from "../Pages/AdminSideBar";
import ErrorHandler from "../Pages/ErrorHandler";
import Swal from "sweetalert2";

const Chargeslist = () => {
  const [chargeList, setChargesList] = useState([]);

  const tableRef = useRef(null);

  const baseUrl = `${process.env.REACT_APP_API_URL}/shipping/charge`;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);
  const adminDetails = JSON.parse(localStorage.getItem("adminDetails"));

  const getCharges = useCallback(async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      ErrorHandler.onLoading();
      const response = await axios.get(baseUrl, { headers });
      ErrorHandler.onLoadingClose();
      setChargesList(response.data);
    } catch (error) {
      ErrorHandler.onLoadingClose();
      ErrorHandler.onError(error);
    }
  }, [token, baseUrl]);

  useEffect(() => {
    getCharges();
  }, [getCharges]);

  const inputsPopup = async (method, values, chargeId) => {
    const { azst_cart_amount = 0, azst_charge_amount = 0 } = values;
    const { value: formValues } = await Swal.fire({
      title: "Enter Charge Amounts",
      html: `
        <div style="display: flex; align-items: center; margin-bottom: 10px;">
          <label for="cartAmount" style="width: 120px; text-align: right; margin-right: 10px;">Cart Amount:</label>
          <input type="number" id="cartAmount" class="swal2-input" style="width: 200px;" placeholder="Enter Cart Amount" value=${azst_cart_amount} />
         </div>
        <div style="display: flex; align-items: center; margin-bottom: 10px;">
          <label for="chargeAmount" style="width: 120px; text-align: right; margin-right: 10px;">Charge Amount:</label>
          <input type="number" id="chargeAmount" class="swal2-input" style="width: 200px;" placeholder="Enter Charge Amount" value=${azst_charge_amount} />
        </div>
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Save",
      preConfirm: () => {
        const cartAmount = document.getElementById("cartAmount").value;
        const chargeAmount = document.getElementById("chargeAmount").value;

        if (!cartAmount || !chargeAmount) {
          Swal.showValidationMessage("Both fields are required");
          return;
        }
        return {
          cartAmount: Number(cartAmount),
          chargeAmount: Number(chargeAmount),
        };
      },
    });

    if (formValues) {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        let response = {};
        if (method === "POST") {
          // for POST requests add new charge
          response = await axios.post(baseUrl, formValues, {
            headers,
          });
          const { chargeId } = response.data;

          setChargesList([
            {
              azst_charge_id: chargeId,
              azst_cart_amount: formValues.cartAmount,
              azst_charge_amount: formValues.chargeAmount,
              azst_charge_status: 1,
              azst_charge_created_by: adminDetails.azst_admin_details_fname,
              azst_charge_update_by: null,
              created_on: moment().format("DD-MM-YYYY"),
              updated_on: null,
            },
            ...chargeList,
          ]);
        } else {
          // for PUT requests Update charge
          response = await axios.put(
            baseUrl,
            { ...formValues, chargeId },
            {
              headers,
            }
          );
          const updatedList = chargeList.map((charge) => {
            if (charge.azst_charge_id === chargeId) {
              return {
                ...charge,
                azst_cart_amount: formValues.cartAmount,
                azst_charge_amount: formValues.chargeAmount,
                azst_charge_update_by: adminDetails.azst_admin_details_fname,
                updated_on: moment().format("DD-MM-YYYY"),
              };
            } else {
              return charge;
            }
          });
          setChargesList(updatedList);
        }

        if (response.status !== 200) throw new Error("API error");
        Swal.fire({
          title: "Success",
          text: "Data saved successfully!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        ErrorHandler.onError(error);
      }
    }
  };

  const deleteCharge = async (id) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger me-3",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const body = {
              chargeId: id,
            };
            await axios.patch(baseUrl, body, {
              headers: { Authorization: "Bearer " + token },
            });
            ErrorHandler.onLoadingClose();
            const updatedList = chargeList.filter(
              (c) => c.azst_charge_id !== id
            );
            setChargesList(updatedList);
            swalWithBootstrapButtons.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
              timer: 2000,
            });
          } catch (error) {
            ErrorHandler.onLoadingClose();
            ErrorHandler.onError(error);
          }
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your Record is safe :)",
            icon: "error",
            timer: 2000,
          });
        }
      });
  };

  return (
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec">
        <div className="container">
          <div className="row">
            <div className="commonTopSec">
              <h4>Shipping Charges</h4>
              <DownloadTableExcel
                filename="shippingChagres table"
                sheet="shippingChagres"
                currentTableRef={tableRef.current}
              >
                <button className="exportBtn"> Export</button>
              </DownloadTableExcel>
              <button
                className="infoBtn"
                onClick={() => inputsPopup("POST", {})}
              >
                Add New Charge
              </button>
            </div>

            <div className="middleSec">
              <div className="tableCont">
                <table
                  ref={tableRef}
                  className="table table-hover"
                  style={{ minWidth: "1200px" }}
                >
                  <thead>
                    <tr className="tableHeader">
                      <th
                        className="sticky-column"
                        scope="col"
                        style={{ width: "15%" }}
                      >
                        Cart Amount
                      </th>
                      <th scope="col" style={{ width: "10%" }}>
                        Charge Amount
                      </th>
                      <th scope="col">Created by</th>
                      <th scope="col">Created on</th>
                      <th scope="col">Upadate by</th>
                      <th scope="col" style={{ width: "10%" }}>
                        Update on
                      </th>
                      <th>Status</th>
                      <th>action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {chargeList.map((c) => (
                      <tr key={c.azst_charge_id}>
                        <td
                          className="sticky-column"
                          style={{ width: "120px" }}
                        >
                          {c.azst_cart_amount}
                        </td>
                        <td>{c.azst_charge_amount}</td>
                        <td>{c.azst_charge_created_by}</td>
                        <td>{c.created_on}</td>
                        <td>{c.azst_charge_update_by}</td>
                        <td>{c.updated_on}</td>
                        <td>
                          {c.azst_charge_status === 1 ? (
                            <span className="activeProduct">Active</span>
                          ) : (
                            <span className="draftProduct">InActive</span>
                          )}
                        </td>
                        <td>
                          <MdEdit
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              inputsPopup(
                                "PUT",
                                {
                                  azst_cart_amount: c.azst_cart_amount,
                                  azst_charge_amount: c.azst_charge_amount,
                                },
                                c.azst_charge_id
                              )
                            }
                          />
                          <MdDelete
                            style={{ cursor: "pointer", marginLeft: "17px" }}
                            onClick={() => deleteCharge(c.azst_charge_id)}
                          />
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
    </div>
  );
};

export default Chargeslist;
