//Product API
import { PRODUCT_API } from "../api/api";
//Axios
import axios from "axios";
//React router dom
import { json, Navigate } from "react-router-dom";

//Get all products hompage
export const axiosGetProducts = async () => {
  try {
    //Axios Fetch Request
    const response = await axios.get(`${PRODUCT_API}`);

    if (!response) {
      throw json(
        { message: "Something went wrong when getting products" },
        { status: 500 }
      );
    }

    return response.data.products;
  } catch (error) {
    throw json({ message: error.message }, { status: error.status });
  }
};

//Get product edit page admin
export const axiosGetProductEdit = async (token, productId) => {
  try {
    //Axios Fetch Request
    const response = await axios.get(`${PRODUCT_API}/admin/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response) {
      throw json(
        {
          message: "Something went wrong when getting product edit admin page",
        },
        { status: 500 }
      );
    }

    return response.data.product;
  } catch (error) {
    throw json({ message: error.message }, { status: error.status });
  }
};

//Admin post create a new product
export const axiosPostCreateProductAdmin = async (token, dataSend) => {
  try {
    //Axios Fetch Request
    const response = await axios.post(
      `${PRODUCT_API}/admin/new-product`,
      dataSend,
      {
        headers: {
          "Content-Type": "multipart/form-data;",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    //No response => exit logic
    if (!response && response?.status !== 422) {
      return;
    }

    if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    //Get validation errors data
    if (error?.response?.status === 422) {
      return error.response.data;
    } else {
      //other errors
      console.log(error);
    }
  }
};
//Admin patch edit a  product
export const axiosPatchEditProductAdmin = async (
  token,
  dataSend,
  productId
) => {
  try {
    //Axios Fetch Request
    const response = await axios.patch(
      `${PRODUCT_API}/admin/edit-product/${productId}`,
      dataSend,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    //No response => exit logic
    if (!response && response?.status !== 422) {
      return;
    }

    if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    //Get validation errors data
    if (error?.response?.status === 422) {
      return error.response.data;
    } else {
      //other errors
      console.log(error);
    }
  }
};

//Delete admin product
export const axiosDeleteProductAdmin = async (token, productId) => {
  try {
    //Axios Fetch Request
    const response = await axios.delete(`${PRODUCT_API}/admin/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response) {
      throw json(
        {
          message: "Something went wrong when getting product edit admin page",
        },
        { status: 500 }
      );
    }
    //When success
    return response.data;
  } catch (error) {
    throw json({ message: error.message }, { status: error.status });
  }
};
