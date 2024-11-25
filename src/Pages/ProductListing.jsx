import React, { useEffect, useState } from "react";
import AdminSideBar from "./AdminSideBar";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { IoMdEye } from "react-icons/io";
import swalHandle from "./ErrorHandler";
import "./Admin.css";
import Pagination from "../Components/Pagination";
import { downloadExcel } from "react-export-table-to-excel";

const ProductListing = () => {
  const [productsList, setProductsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filteredProductsList, setFilteredProductsList] = useState([]);

  const baseUrl = process.env.REACT_APP_API_URL;
  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const logsPerPage = 10;

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
        const totalItems = response.data.products;
        setProductsList(totalItems);
        setTotalProducts(totalItems.length);
      } catch (error) {
        swalHandle.onLoadingClose();
        swalHandle.onError(error);
      }
    };
    productDetails();
  }, [token, baseUrl]);

  const header = ["Product Name", "status", "Quantity", "category", "vendor"];
  function handleDownloadExcel() {
    downloadExcel({
      fileName: "Product Details",
      sheet: "product-list",
      tablePayload: {
        header,
        body: productsList.map((p) => ({
          product_title: p.product_title,
          status: p.status === 1 ? "Active" : "Draft",
          quantity: p.total_variant_quantity,
          product_category: p.product_category,
          azst_vendor_name: p.azst_vendor_name,
        })),
      },
    });
  }

  return (
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec">
        <div className="container">
          <div className="row">
            <div className="productsTopbar">
              <h4>Products</h4>
              <button className="exportBtn" onClick={handleDownloadExcel}>
                Export
              </button>
              <Link to="/product/create" className="infoBtn">
                Add Products
              </Link>
            </div>
            <div className="middleSec">
              <div className="tableCont">
                <table
                  className="table table-hover"
                  style={{ minWidth: "1200px" }}
                >
                  <thead>
                    <tr className="tableHeader">
                      <th className="sticky-column" scope="col">
                        #
                      </th>
                      <th scope="col">Product</th>
                      <th scope="col"></th>
                      <th scope="col">Status</th>
                      <th scope="col" style={{ width: "10%" }}>
                        Inventory
                      </th>
                      {/* <th scope="col">Sales channels</th> */}
                      {/* <th scope="col">Markets</th> */}
                      <th scope="col">Category</th>
                      <th style={{ width: "  14%" }} scope="col">
                        Vendor
                      </th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProductsList.map((p) => (
                      <tr key={p.product_id}>
                        <td
                          className="sticky-column"
                          style={{ width: "120px" }}
                        >
                          <img
                            src={p.image_src}
                            alt="product"
                            className="productThumbnail"
                          />
                        </td>
                        <td style={{ width: "360px" }}>
                          <Link
                            className="productLink"
                            to={`/product/update/${p.product_id}`}
                          >
                            {p.product_title}
                          </Link>
                        </td>
                        <td>
                          <a target="__blank" href={p.url_handle}>
                            <IoMdEye />
                          </a>
                        </td>
                        <td>
                          {p.status === 1 ? (
                            <span className="activeProduct">Active</span>
                          ) : (
                            <span className="draftProduct">Draft</span>
                          )}
                        </td>
                        <td style={{ width: "10%" }}>
                          {p.total_variants === 0 || null ? (
                            p.total_variant_quantity === "0" ? (
                              <span style={{ color: "#8e0b21" }}>
                                {p.total_variant_quantity} in stock
                              </span>
                            ) : (
                              <span>{p.total_variant_quantity} in stock</span>
                            )
                          ) : p.total_variant_quantity === "0" ? (
                            <span style={{ color: "#8e0b21" }}>
                              {p.total_variant_quantity} in stock for
                              {p.total_variants} variants
                            </span>
                          ) : (
                            <span>
                              {p.total_variant_quantity} in stock for{" "}
                              {p.total_variants} variants
                            </span>
                          )}
                        </td>
                        {/* <td>null</td> */}
                        {/* <td>Indian Market</td> */}
                        <td>{p.product_category}</td>
                        <td style={{ width: "14%" }}>{p.azst_vendor_name}</td>
                        <td>
                          <Link
                            to={`/product/info/${p.product_id}`}
                            className="infoBtn secBtn"
                          >
                            Add Info
                          </Link>
                        </td>
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
              listOfItems={productsList}
              setFilteredItemsList={setFilteredProductsList}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
