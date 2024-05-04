import React from "react";

//CSS module
import classes from "./Orders.module.css";

//React router dom
import { Link } from "react-router-dom";
const Orders = ({ orders }) => {
  return (
    <div className={classes.orders}>
      <h3>History</h3>
      <table>
        <thead>
          <tr>
            <th scope="col">ID User</th>
            <th scope="col">Name</th>
            <th scope="col">Phone</th>
            <th scope="col">Address</th>
            <th scope="col">Total</th>
            <th scope="col">Delivery</th>
            <th scope="col">Status</th>
            <th scope="col">Detail</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr
              className={index % 2 === 0 ? `${classes.gray}` : ""}
              key={order._id}
            >
              <td>{order.userId._id}</td>
              <td>{order.userId.fullName}</td>
              <td>{order.userId.phoneNumber}</td>
              <td>{order.userId.address}</td>
              <td>
                {new Intl.NumberFormat()
                  .format(order.totalPrice)
                  .replace(/,/g, ".") + " VND"}
              </td>
              <td>
                {order.deliveryStatus === "Waiting for progressing" &&
                  "Chưa Vận Chuyển"}
              </td>
              <td>
                {order.paymentStatus === "Waiting for pay" && "Chưa Thanh Toán"}
              </td>
              <td>
                <Link to={`/${order._id}`}>View</Link>
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td>No any orders</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
