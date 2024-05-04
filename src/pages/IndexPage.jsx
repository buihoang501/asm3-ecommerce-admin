import React from "react";

import classes from "./IndexPage.module.css";
import Sidebar from "../components/Sidebar";
import InfoBoard from "../components/InfoBoard";

//Get Authtoken
import { getAuthToken } from "../utils/auth";

const IndexPage = () => {
  //Token
  const token = getAuthToken();
  return (
    <>
      {token && token !== "TOKEN EXPIRED" && (
        <div className={classes.index}>
          <header></header>
          <main>
            <Sidebar />
            <InfoBoard />
          </main>
        </div>
      )}
    </>
  );
};

export default IndexPage;
