import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import Loader from "./Loader";
import Message from "./Message";
import { useGetTopProductsQuery } from "../slices/productsApiSlice";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const getImageUrl = (product) => {
    if (!product.images || !Array.isArray(product.images)) return null;
    // Filter out null or undefined images
    const validImages = product.images.filter(img => img != null);
    if (validImages.length === 0) return null;

    // Try to get last image URL; if invalid, fallback to first image URL
    let lastImage = validImages[validImages.length - 1];
    let imageUrl = null;

    if (typeof lastImage === "string") {
      imageUrl = lastImage;
    } else if (typeof lastImage === "object" && lastImage.url) {
      imageUrl = lastImage.url;
    }

    if (!imageUrl) {
      const firstImage = validImages[0];
      if (typeof firstImage === "string") {
        imageUrl = firstImage;
      } else if (typeof firstImage === "object" && firstImage.url) {
        imageUrl = firstImage.url;
      }
    }

    return imageUrl;
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error.message}</Message>
      ) : (
        products && (
          <Carousel pause="hover" className="bg-primary mb-4" indicators={false}>
            {products.map((product) => {
              const imageUrl = getImageUrl(product);
              if (!imageUrl) return null;
              return (
                <Carousel.Item key={product._id}>
                  <Link to={`/product/${product._id}`}>
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fluid
                      style={{ height: "400px", objectFit: "contain" }}
                    />
                    <Carousel.Caption>
                      <h2>{product.name} (${product.price})</h2>
                    </Carousel.Caption>
                  </Link>
                </Carousel.Item>
              );
            })}
          </Carousel>
        )
      )}
    </>
  );
};

export default ProductCarousel;
