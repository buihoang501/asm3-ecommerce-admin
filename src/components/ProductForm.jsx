import React, { useState } from "react";

//CSS module
import classes from "./ProductForm.module.css";

//Product serviecs
import {
  axiosPostCreateProductAdmin,
  axiosPatchEditProductAdmin,
} from "../services/productServices";

//Get Authtoken
import { getAuthToken } from "../utils/auth";

//React router dom
import { useNavigate } from "react-router-dom";
import ErrorModal from "../ui/ErrorModal";

const ProductForm = ({ editing, productEdit, productId }) => {
  //Navigate
  const navigate = useNavigate();
  //token
  const token = getAuthToken();

  //Show error and errors
  const [errors, setErrors] = useState([]);
  const [showError, setShowError] = useState(false);

  //product state
  const [product, setProduct] = useState({
    name: productEdit?.name ? productEdit.name : "",
    category: productEdit?.category ? productEdit.category : "",
    shortDescription: productEdit?.short_desc ? productEdit.short_desc : "",
    longDescription: productEdit?.long_desc ? productEdit.long_desc : "",
    price: productEdit?.price ? productEdit.price : "",
    stock: productEdit?.stock ? productEdit.stock : "",
  });

  //file state
  const [filesInput, setFilesInput] = useState([]);

  //Handle files change
  const handleFilesChange = (e) => {
    if (e.target.files.length !== 4) {
      alert("You must select 4 files");
      e.target.value = null;
      return;
    }

    //Check file types
    for (let file of e.target.files) {
      if (
        !file.type === "image/png" ||
        !file.type === "image/jpeg" ||
        !file.type === "image/png"
      ) {
        alert("Please select files with suitable types");
        e.target.value = null;
        return;
      }
    }

    setFilesInput([...e.target.files]);
  };

  //Handle change product state
  const productChangeHandler = (e) => {
    //set product staet
    setProduct((prevProduct) => {
      return {
        ...prevProduct,
        [e.target.name]: e.target.value,
      };
    });
  };

  //Submit product form handler
  const handleProductSubmit = async (e) => {
    //Prevent default browser behavior
    e.preventDefault();

    //form Data
    const formData = new FormData();

    if (!editing) {
      for (let file of filesInput) {
        formData.append("files[]", file);
      }
      formData.append("files", filesInput);
    }

    formData.append("name", product.name);
    formData.append("category", product.category);
    formData.append("shortDescription", product.shortDescription);
    formData.append("longDescription", product.longDescription);
    formData.append("price", product.price);
    formData.append("stock", product.stock);

    //Call fetch create product
    const data = !editing
      ? await axiosPostCreateProductAdmin(token, formData)
      : await axiosPatchEditProductAdmin(token, formData, productId);
    if (data?.errors) {
      setErrors(data.errors);
      //Set show erros
      setShowError(true);
      //Exit logic
      return;
    }
    //Success
    if (data?.message) {
      alert(`${data.message}`);
      return navigate("/?location=products");
    }
  };
  return (
    <>
      <div className={classes["product-form"]}>
        {showError && (
          <ErrorModal errors={errors} setShowError={setShowError} />
        )}
        <form
          method={editing ? "patch" : "post"}
          encType="multipart/form-data"
          onSubmit={handleProductSubmit}
        >
          <div className={classes["form-control"]}>
            <label htmlFor="name">Product Name</label>
            <input
              onChange={productChangeHandler}
              id="name"
              type="text"
              name="name"
              placeholder="Enter Product Name"
              value={product.name}
            />
          </div>
          <div className={classes["form-control"]}>
            <label htmlFor="category">Category</label>
            <input
              onChange={productChangeHandler}
              type="text"
              id="category"
              name="category"
              placeholder="Enter Category"
              value={product.category}
            />
          </div>
          <div className={classes["form-control"]}>
            <label htmlFor="price">Price</label>
            <input
              onChange={productChangeHandler}
              type="number"
              id="price"
              name="price"
              min="1"
              placeholder="Enter Price"
              value={product.price}
            />
          </div>
          <div className={classes["form-control"]}>
            <label htmlFor="price">Stock</label>
            <input
              onChange={productChangeHandler}
              type="number"
              id="stock"
              name="stock"
              min="1"
              placeholder="Enter Stock"
              value={product.stock}
            />
          </div>
          <div className={classes["form-control"]}>
            <label htmlFor="shortDescription">Short Description</label>

            <textarea
              onChange={productChangeHandler}
              value={product.shortDescription}
              name="shortDescription"
              id="shortDescription"
              cols="30"
              rows="3"
              placeholder="Enter Short Description"
            ></textarea>
          </div>
          <div className={classes["form-control"]}>
            <label htmlFor="longDescription">Long Description</label>

            <textarea
              onChange={productChangeHandler}
              name="longDescription"
              id="longDescription"
              cols="30"
              rows="6"
              placeholder="Enter Long Description"
              value={product.longDescription}
            ></textarea>
          </div>
          {!editing && (
            <div className={classes["form-control"]}>
              <label htmlFor="fileInput">Upload image (4 images)</label>
              <input
                onChange={handleFilesChange}
                accept=".jpg, .png, .jpeg"
                id="file"
                type="file"
                multiple
              />
            </div>
          )}

          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
};

export default ProductForm;
