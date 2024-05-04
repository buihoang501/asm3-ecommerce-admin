import React from "react";

//Css module
import classes from "./OrdersBoard.module.css";

const OrdersBoard = ({ statistic }) => {
  return (
    <div className={classes["orders-boards"]}>
      <div>
        <div className={classes.left}>
          <h3>{statistic.users}</h3>
          <p>Clients</p>
        </div>
        <div className={classes.right}>
          <i className="fa-solid fa-user-plus"></i>
        </div>
      </div>
      <div>
        <div className={classes.left}>
          <h3 className={classes.money}>
            {new Intl.NumberFormat()
              .format(statistic.earningsOfMonth)
              .replace(/,/g, ".")}
          </h3>
          <p>Earnings of Month</p>
        </div>
        <div className={classes.right}>
          <i className="fa-solid fa-dollar-sign"></i>
        </div>
      </div>
      <div>
        <div className={classes.left}>
          <h3 className={classes.money}>
            {new Intl.NumberFormat()
              .format(statistic.averageOfMonths)
              .replace(/,/g, ".")}
          </h3>
          <p>Average of Months</p>
        </div>
        <div className={classes.right}>
          <i className="fa-solid fa-dollar-sign"></i>
        </div>
      </div>
      <div>
        <div className={classes.left}>
          <h3 className={classes.money}>
            {new Intl.NumberFormat()
              .format(statistic.totalEarnings)
              .replace(/,/g, ".")}
          </h3>
          <p>Total Earns</p>
        </div>
        <div className={classes.right}>
          <i className="fa-solid fa-dollar-sign"></i>
        </div>
      </div>
      <div>
        <div className={classes.left}>
          <h3>{statistic.orders}</h3>
          <p>New Order</p>
        </div>
        <div className={classes.right}>
          <i className="fa-regular fa-file"></i>
        </div>
      </div>
    </div>
  );
};

export default OrdersBoard;
