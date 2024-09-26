import React, { useEffect, useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 } from "uuid";
import Cookies from "js-cookie";
import axios from "axios";
import Swal from "sweetalert2";

import swalHandle from "./ErrorHandler";
import AdminSideBar from "./AdminSideBar";
import Ingredients from "../Components/Ingredients";
import Features from "../Components/Features";
import { IoMdArrowRoundBack } from "react-icons/io";
import "../index.css";

const ProductInfo = () => {
  const { id } = useParams();
  const [isChangesOccur, setIsChangesOccur] = useState(false);
  const [ingredients, setIngredients] = useState([
    {
      id: v4(),
      title: "",
      description: "",
      image: "",
    },
  ]);

  const [deleteIngredient, setDeletedIngredient] = useState([]);
  const [deleteFeatures, setDeletedFeatures] = useState([]);

  const [features, setFeatures] = useState([
    {
      id: v4(),
      title: "",
      image: "",
    },
  ]);

  const navigate = useNavigate();

  const baseUrl = `${process.env.REACT_APP_API_URL}//product`;

  const token = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

  const getProductInfo = useCallback(async () => {
    try {
      const url = `${baseUrl}/get-info`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      swalHandle.onLoading();
      const response = await axios.post(url, { productId: id }, { headers });
      const { ingredients, features } = response.data;
      swalHandle.onLoadingClose();
      if (ingredients.length > 0) {
        setIngredients(ingredients);
      }
      if (features.length > 0) {
        setFeatures(features);
      }
    } catch (error) {
      swalHandle.onLoadingClose(error);
      swalHandle.onError(error);
    }
  }, [baseUrl, token, id]);

  useEffect(() => {
    getProductInfo();
  }, [getProductInfo]);

  const handleSubmitIngs = async () => {
    try {
      const url = `${baseUrl}/add-info`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const formdata = new FormData();

      ingredients.forEach((ing) => {
        formdata.append("ingImages", ing.image);
      });
      features.forEach((feature) => {
        formdata.append("feaImages", feature.image);
      });

      formdata.append("ingredients", JSON.stringify(ingredients));
      formdata.append("features", JSON.stringify(features));
      formdata.append("productId", id);
      // Append unique values to FormData
      // Note: Delete items id is appendeing to array of unique values
      [...new Set(deleteIngredient)].forEach((item) =>
        formdata.append("deleteIngredient[]", item)
      );
      [...new Set(deleteFeatures)].forEach((item) =>
        formdata.append("deleteFeatures[]", item)
      );

      swalHandle.onLoading();
      const response = await axios.post(url, formdata, { headers });
      if (response.status === 200) {
        setIngredients([
          {
            id: v4(),
            title: "",
            description: "",
            image: "",
          },
        ]);
        setFeatures([
          {
            id: v4(),
            title: "",
            image: "",
          },
        ]);
        swalHandle.onLoadingClose();
        swalHandle.onSuccess();
        setTimeout(() => {
          navigate("/products");
        }, 2000);
      }
    } catch (error) {
      swalHandle.onLoadingClose();
      swalHandle.onError(error);
    }
  };

  const goBacktoPage = () => {
    // here we checking any unsaves changes are registered and giveing alret to user
    if (isChangesOccur) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top",
        width: "50%",
        height: "10%",
        customClass: {
          popup: "color-toast",
          content: "swal-custom-content",
          confirmButton: "swal-custom-confirm-button",
          cancelButton: "swal-custom-cancel-button",
        },
        timerProgressBar: true,
        showConfirmButton: false,
        showCancelButton: false,
      });
      // the toast returing the html content in alret to handle actions
      return Toast.fire({
        html: `
          <div class="toast-content ms-auto d-flex align-items-center">
            <span>Your changes are not saved. Do you want to save them?</span>
            <button id="save-button" class="swal2-confirm swal2-styled">Save</button>
            <button id="cancel-button" class="swal2-cancel swal2-styled">Undo</button>
          </div>
        `,
        didOpen: () => {
          document
            .getElementById("save-button")
            .addEventListener("click", () => {
              // saving changes and send back to server
              handleSubmitIngs();
              Swal.close();
            });
          document
            .getElementById("cancel-button")
            .addEventListener("click", () => {
              // undo chnages and got to previous page
              navigate(-1);
              Swal.close();
            });
        },
      });
    } else {
    }
  };

  return (
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec">
        <div className="d-flex align-items-center">
          <IoMdArrowRoundBack
            style={{ fontSize: "30px", cursor: "pointer", marginRight: "4px" }}
            onClick={goBacktoPage}
          />{" "}
          <h3>Product Info</h3>
        </div>
        <Ingredients
          ingredients={ingredients}
          setIngredients={setIngredients}
          deleteIngredient={deleteIngredient}
          setDeletedIngredient={setDeletedIngredient}
          setIsChangesOccur={setIsChangesOccur}
        />
        <Features
          features={features}
          setFeatures={setFeatures}
          deleteFeatures={deleteFeatures}
          setDeletedFeatures={setDeletedFeatures}
          setIsChangesOccur={setIsChangesOccur}
        />
        <div className="row mt-3">
          <div className="col-6">
            <button
              className="btn btn-primary"
              disabled={!isChangesOccur}
              onClick={handleSubmitIngs}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
