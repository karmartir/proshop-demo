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
  const navigate = useNavigate();

  const [images, setImages] = useState(product?.images || []);
  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImages(
        (product.images || [])
          .filter((img) => img) // remove null/undefined
          .map((img) => (typeof img === "string" ? { url: img, public_id: null } : img))
      );
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
      images: images.map((img) => (img.url ? img.url : img)),
      brand,
      category,
      description,
      countInStock,
    };
    try {
      await updateProduct(updatedProduct).unwrap();
      toast.success("Product Updated Successfully");
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
    const formData = new FormData();
    formData.append("name", product?.name || name || "");
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Image upload failed");
      }
      const data = await response.json();
      if (data.images && Array.isArray(data.images)) {
        setImages((prev) => [...prev, ...data.images]);
        toast.success("Image(s) uploaded successfully");
        refetch();
      } else {
        throw new Error("No image data returned");
      }
    } catch (err) {
      toast.error(err?.message || "Image upload failed");
      e.target.value = "";
    }
  };

  const handleDeleteImage = async (img) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    if (img.public_id) {
      // Cloudinary image
      try {
        const response = await fetch(`/api/upload/${img.public_id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete image");
        await response.json();
        setImages((prev) => prev.filter((i) => i.public_id !== img.public_id));
        toast.success("Image deleted successfully");
      } catch (err) {
        toast.error(err?.message || "Failed to delete image");
      }
    } else {
      // Old image (string)
      setImages((prev) => prev.filter((i) => i !== img && i?.url !== img));
      toast.success("Image removed successfully");
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
              />
            </Form.Group>

            <Form.Group controlId="price" className="my-2">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="image" className="my-2">
              <Form.Label>Images</Form.Label>
              <Form.Control type="file" onChange={uploadFileHandler} multiple />
              <div className="thumbnails">
                {images
                  .filter((img) => img) // remove null/undefined
                  .map((img, idx) => {
                    const src = img.url ? img.url : img; // fallback for string
                    return (
                      <div key={idx} className="thumbnail-wrapper">
                        <img src={src} alt={`uploaded-${idx}`} className="thumbnail" />
                        <span
                          onClick={() => handleDeleteImage(img)}
                          className="delete-btn"
                        >
                          ×
                        </span>
                      </div>
                    );
                  })}
              </div>
            </Form.Group>

            <Form.Group controlId="brand" className="my-2">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="countInStock" className="my-2">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter countInStock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="category" className="my-2">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="description" className="my-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
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