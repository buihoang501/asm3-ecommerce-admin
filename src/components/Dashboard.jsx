import React from "react";

//CSS module
import classes from "./Dashboard.module.css";
import OrdersBoard from "./OrdersBoard";
import Orders from "./Orders";

const Dashboard = ({ orders, statistic, isLoading }) => {
  return (
    <>
      {isLoading && <p>Loading progress...</p>}
      {!isLoading && (
        <div className={classes.dashboard}>
          <h4>Dashboard</h4>
          <OrdersBoard statistic={statistic} />
          <Orders orders={orders} />
        </div>
      )}
    </>
  );
};

export default Dashboard;
