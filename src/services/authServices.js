//Auth API
import { AUTH_API } from "../api/api";

//Import axios
import axios from "axios";

//Login / Signup API
export const axiosAuthRequest = async (pathname, dataSend) => {
  try {
    //Axios call auth request
    const response = await axios.post(
      `${AUTH_API}/${pathname}/admin`,
      dataSend
    );
    //No response => exit logic
    if (!response && response?.status !== 422) {
      return;
    }

    if (response?.status === 201) {
      return response.data;
    }
  } catch (error) {
    //Get validation errors data
    if (error?.response?.status === 422 || error?.response?.status === 403) {
      return error.response.data;
    } else {
      //other errors
      console.log(error);
    }
  }
};
