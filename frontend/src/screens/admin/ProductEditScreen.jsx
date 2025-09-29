import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from "../../slices/productsApiSlice";

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [description, setDescription] = useState("");
  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);
  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();
  const navigate = useNavigate();

  const [images, setImages] = useState(product?.images || []);
  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImages(product.images || [product.image]);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      productId,
      name,
      price,
      images,
      brand,
      category,
      description,
      countInStock,
    };
    try {
      await updateProduct(updatedProduct).unwrap();
      toast.success("Product Updated Successfully");
      // Navigate to the product page after updating to show new images
      refetch();
      navigate(`/product/${productId}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  const uploadFileHandler = async (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 4) {
      toast.error("Maximum 4 images allowed. Remove some images first.");
      e.target.value = "";
      return;
    }

    for (const file of files) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await uploadProductImage(formData).unwrap();
        toast.success(res.message);
        setImages((prev) => [...prev, res.image]); // append new images
        refetch();

      } catch (err) {
        toast.error(err?.data?.message || err.error);
        e.target.value = "";
      }
    }
  };

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
      </Link>

      {loadingUpdate && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <FormContainer>
          <h1>Edit Product</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="my-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="price" className="my-2">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            {/* {'image input placeholder'} */}

            <Form.Group controlId="image" className="my-2">
              <Form.Label>Image</Form.Label>
              {/* <Form.Control
                type="text"
                placeholder="Enter image url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control> */}
              <Form.Control type="file" onChange={uploadFileHandler} multiple />
              <div
                className="thumbnails"
                style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}
              >
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`uploaded-${idx}`}
                    className="thumbnail"
                  />
                ))}
              </div>
              {loadingUpload && <Loader />}
            </Form.Group>

            <Form.Group controlId="brand" className="my-2">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="countInStock" className="my-2">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter countInStock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="category" className="my-2">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description" className="my-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary" className="my-2">
              Update
            </Button>
          </Form>
        </FormContainer>
      )}
    </>
  );
};

export default ProductEditScreen;
