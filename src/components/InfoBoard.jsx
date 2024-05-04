import React, { useState, useEffect } from "react";

//Css module
import classes from "./InfoBoard.module.css";

//React-router-dom
import { useSearchParams } from "react-router-dom";

//Product services

import {
  axiosGetProducts,
  axiosGetProductEdit,
} from "../services/productServices";

//Order services
import { axiosGetOrdersAdminDashBoard } from "../services/orderServices";

import { getAuthToken } from "../utils/auth";

//React redux hooks
import { useSelector } from "react-redux";

//Components
import Products from "./Products";
import Dashboard from "./Dashboard";
import ProductForm from "./ProductForm";
import LiveChat from "./LiveChat";

const InfoBoard = () => {
  //Location query
  const [location, setLocation] = useSearchParams({ location: "" });

  //Loading
  const [isLoading, setIsLoading] = useState(false);

  //User role
  const { userRole } = useSelector((state) => state.auth);

  //Products state
  const [products, setProducts] = useState([]);

  //Product state
  const [product, setProduct] = useState(null);

  //Statistic state
  const [statistic, setStatistic] = useState({
    users: 0,
    orders: 0,
    totalEarnings: 0,
    averageOfMonths: 0,
    earningsOfMonth: 0,
  });

  //Lastest orders
  const [lastestOrders, setLastestOrders] = useState([]);

  // path
  const path = location.get("location");
  const productId = path.split("_")[1]?.toString();

  //handle side effects call api
  useEffect(() => {
    //Get jwt token
    const token = getAuthToken();
    if (!path) {
      const getAdminDashBoardOrders = async (token) => {
        setIsLoading(true);
        const data = await axiosGetOrdersAdminDashBoard(token);
        setIsLoading(false);
        if (data) {
          //Set statistic
          setStatistic({
            users: data.totalUsers,
            orders: data.totalOrders,
            totalEarnings: data.earnings,
            averageOfMonths: data.balance,
            earningsOfMonth: data.totalCurrentMonthRevenue,
          });
          //Set lastest orders
          setLastestOrders(data.lastestOrders);
        }
      };
      getAdminDashBoardOrders(token);
    } else if (path === "products") {
      const getProducts = async () => {
        setIsLoading(true);
        const data = await axiosGetProducts();

        setIsLoading(false);

        //Set products
        setProducts(data);
      };
      getProducts();
    } else if (path.includes("edit-product")) {
      const getProduct = async (token, productId) => {
        setIsLoading(true);
        const data = await axiosGetProductEdit(token, productId);

        setIsLoading(false);

        //Set products
        setProduct(data);
      };
      getProduct(token, productId);
    }

    //Handle when reload page
    setLocation({ location: path });
  }, [path, setLocation, productId]);
  console.log(userRole);
  return (
    <div className={classes.info}>
      {/* Render dashboard */}
      {!path && userRole === "admin" && (
        <Dashboard
          isLoading={isLoading}
          statistic={statistic}
          orders={lastestOrders}
        />
      )}

      {/* Render products */}
      {path === "products" && userRole === "admin" && (
        <Products
          isLoading={isLoading}
          products={products}
          setProducts={setProducts}
        />
      )}

      {/* Render new product */}
      {path === "new-product" && userRole === "admin" && <ProductForm />}
      {/* Render edit product */}
      {path.includes("edit-product") && !isLoading && userRole === "admin" && (
        <ProductForm editing productEdit={product} productId={productId} />
      )}
      {/* Render live chat */}
      {path.includes("live-chat") && <LiveChat />}
    </div>
  );
};

export default InfoBoard;
