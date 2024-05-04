//Order API
import { ORDER_API } from "../api/api";

//Axios
import axios from "axios";

//React router dom
import { json } from "react-router-dom";

//Admin get orders dashboard
export const axiosGetOrdersAdminDashBoard = async (token) => {
  try {
    //Axios Fetch Request
    const response = await axios.get(`${ORDER_API}/admin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response) {
      throw json(
        {
          message: "Something went wrong when getting admin dashboard orders.",
        },
        { status: 500 }
      );
    }

    return response.data;
  } catch (error) {
    throw json({ message: error.message }, { status: error.status });
  }
};

//Admin get order detail
export const axiosGetOrderDetailAdmin = async (token, orderId) => {
  try {
    //Axios Fetch Request
    const response = await axios.get(`${ORDER_API}/admin/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response) {
      throw json(
        {
          message: "Something went wrong when getting admin order detail.",
        },
        { status: 500 }
      );
    }

    return response.data;
  } catch (error) {
    throw json({ message: error.message }, { status: error.status });
  }
};
