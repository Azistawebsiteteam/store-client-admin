import React, { useEffect, useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 } from "uuid";
import Cookies from "js-cookie";
import axios from "axios";
import swalHandle from "./ErrorHandler";
import AdminSideBar from "./AdminSideBar";
import Ingredients from "../Components/Ingredients";
import Features from "../Components/Features";
import BackBtn from "../Components/BackBtn";
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

  return (
    <div className="adminSec">
      <AdminSideBar />
      <div className="commonSec">
        <div className="d-flex align-items-center mb-3">
          <BackBtn onClick={() => navigate(-1)} />
          <h4>Product Info</h4>
        </div>
        <div className="productInfoCont">
          <h5 className="mb-4">Ingredients</h5>
          <Ingredients
            ingredients={ingredients}
            setIngredients={setIngredients}
            deleteIngredient={deleteIngredient}
            setDeletedIngredient={setDeletedIngredient}
            setIsChangesOccur={setIsChangesOccur}
          />
        </div>
        <div className="productInfoCont">
          <h5 className="mb-4">Features</h5>
          <Features
            features={features}
            setFeatures={setFeatures}
            deleteFeatures={deleteFeatures}
            setDeletedFeatures={setDeletedFeatures}
            setIsChangesOccur={setIsChangesOccur}
          />
        </div>
        <div className="row mt-3 mb-5">
          <div className="col-12 d-flex justify-content-end">
            <button
              className="adminBtn"
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
