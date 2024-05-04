//Session API
import { SESSION_API } from "../api/api";
//Axios
import axios from "axios";
//React router dom
import { json } from "react-router-dom";

//Get all sessions
export const axiosGetSessions = async (token) => {
  try {
    //Axios Fetch Request
    const response = await axios.get(`${SESSION_API}`, {
      headers: {
        Authorizatio: `Bearer ${token}`,
      },
    });

    if (!response) {
      throw json(
        { message: "Something went wrong when getting sessions" },
        { status: 500 }
      );
    }
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    throw json({ message: error.message }, { status: error.status });
  }
};
