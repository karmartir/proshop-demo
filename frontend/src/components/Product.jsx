import {useState} from 'react';
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const Product = ({ product }) => {
  const imagesArray =
  product.images && product.images.length > 0
    ? product.images
    : product.image
    ? [product.image]
    : []; // empty fallback

  const [currentImage, setCurrentImage] = useState(imagesArray[0] || null);
  return (
    <Card className="my-3 p-3 rounded product-card">
      <Link to={`/product/${product._id}`}>
        <Card.Img className="product-image" src={currentImage} variant="top" alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div" className="product-title">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
<Card.Text as='div'>
  <Rating value={product.rating} text={`${product.numReviews} reviews`}/>
</Card.Text>
        <Card.Text as='h3'>
            ${product.price}
            </Card.Text>
      </Card.Body>
    </Card>
  );
};
export default Product;
