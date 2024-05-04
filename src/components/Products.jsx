import React, { useState } from "react";
//Css module
import classes from "./Products.module.css";

//React-router-dom
import { useSearchParams } from "react-router-dom";

//Product services
import { axiosDeleteProductAdmin } from "../services/productServices";

//Get authtoken

import { getAuthToken } from "../utils/auth";

//Table
const Table = ({ products, setProducts, search, setProductsSearch }) => {
  //token
  const token = getAuthToken();

  //location query
  const [, setLocation] = useSearchParams();
  return (
    <div className={classes.products}>
      <table>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Price</th>
            <th scope="col">Image</th>
            <th scope="col">Category</th>
            <th scope="col">Edit</th>
          </tr>
        </thead>
        {products.map((product, index) => {
          return (
            <tbody key={product._id}>
              <tr className={index % 2 === 0 ? `${classes.gray}` : ""}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>
                  {new Intl.NumberFormat()
                    .format(product.price)
                    .replace(/,/g, ".") + "  VND"}{" "}
                </td>
                <td>
                  <img
                    src={
                      product.img1.includes("firebase")
                        ? product.img1
                        : `${process.env.REACT_APP_BACKEND_API}/${product.img1}`
                    }
                    alt={product.name}
                  />
                </td>
                <td>{product.category}</td>
                <td>
                  <div className={classes.action}>
                    <button
                      onClick={() => {
                        setLocation({
                          location: `edit-product_${product._id}`,
                        });
                      }}
                      className={classes.update}
                    >
                      Update
                    </button>
                    <button
                      onClick={async () => {
                        //Confirm delete product
                        if (
                          window.confirm(
                            "Are you sure you want to delete this product"
                          )
                        ) {
                          const data = await axiosDeleteProductAdmin(
                            token,
                            product._id
                          );
                          if (data?.message) {
                            //Remove by filter
                            setProducts((prevProducts) =>
                              prevProducts.filter(
                                (prevProduct) => prevProduct._id !== product._id
                              )
                            );
                            if (search) {
                              setProductsSearch((prevProducts) =>
                                prevProducts.filter(
                                  (prevProduct) =>
                                    prevProduct._id !== product._id
                                )
                              );
                            }

                            alert(data.message);
                            return;
                          } else {
                            alert("Delete failed!");
                            return;
                          }
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          );
        })}
      </table>
    </div>
  );
};

const Products = ({ isLoading, products, setProducts }) => {
  //location query
  const [, setLocation] = useSearchParams();
  //Search input
  const [searchValue, setSearchValue] = useState("");

  //Onchange search value
  const searchValueChangeHandler = (e) => {
    setSearchValue(e.target.value);
    //Filter products by name
    setSearchProducts(() => {
      const updatedProducts = [...products];

      //Updating via filter name searching
      return updatedProducts.filter((product) => {
        return product.name
          .toString()
          .toLowerCase()
          .replace(/\s/g, "")
          .includes(e.target.value.toString().toLowerCase().replace(/\s/g, ""));
      });
    });
  };

  //Search products
  const [searchProducts, setSearchProducts] = useState([]);

  return (
    <React.Fragment>
      {isLoading && <p>Loading progress ...</p>}
      {!isLoading && (
        <div className={classes.index}>
          <div className={classes.head}>
            <h3>Products</h3>
            <button onClick={() => setLocation({ location: "new-product" })}>
              New Product
            </button>
          </div>

          <input
            type="text"
            placeholder="Enter Search"
            value={searchValue}
            onChange={searchValueChangeHandler}
          />

          {/* When searching */}
          {searchProducts && searchProducts.length > 0 && (
            <Table
              search
              setProductsSearch={setSearchProducts}
              products={searchProducts}
              setProducts={setProducts}
            />
          )}

          {/* When loading component or no searching (empty search '') */}
          {!searchValue &&
            searchProducts.length === 0 &&
            products &&
            products.length > 0 && (
              <Table products={products} setProducts={setProducts} />
            )}

          {/*Empty products */}
          {(products.length === 0 ||
            (searchProducts.length === 0 && searchValue)) && (
            <p>No products found.</p>
          )}
        </div>
      )}
    </React.Fragment>
  );
};

export default Products;
