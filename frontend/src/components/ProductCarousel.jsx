import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import Loader from "./Loader";
import Message from "./Message";
import { useGetTopProductsQuery } from "../slices/productsApiSlice";

const ProductCarousel = () => {
  // Configurable number of items per slide
  const itemsPerSlide = 3;
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

  // Group products in chunks of itemsPerSlide
  const groupedProducts = [];
  if (products) {
    for (let i = 0; i < products.length; i += itemsPerSlide) {
      groupedProducts.push(products.slice(i, i + itemsPerSlide));
    }
  }

  const cardWidth = 300;
  const cardHeight = 400;
  const imageHeight = 250;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error.message}</Message>
      ) : (
        products && (
          <Carousel pause="hover" className="bg-primary mb-4" indicators={false}>
            {groupedProducts.map((group, idx) => (
              <Carousel.Item key={idx}>
                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", alignItems: "center" }}>
                  {group.map((product) => {
                    const imageUrl = getImageUrl(product);
                    if (!imageUrl) return null;
                    return (
                      <Link
                        key={product._id}
                        to={`/product/${product._id}`}
                        style={{ flex: "0 0 auto", textAlign: "center", color: "inherit", textDecoration: "none", display: "flex", justifyContent: "center", alignItems: "center" }}
                      >
                        <div style={{
                          width: `${cardWidth}px`,
                          height: `${cardHeight}px`,
                          backgroundColor: "white",
                          padding: "1rem",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          borderRadius: "0.5rem",
                          margin: "2rem 0",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-start",
                          alignItems: "center",
                          overflow: "hidden"
                        }}>
                          <Image
                            src={imageUrl}
                            alt={product.name}
                            fluid
                            style={{ height: `${imageHeight}px`, width: "90%", objectFit: "contain", marginBottom: "0.5rem", display: "block" }}
                          />
                          <div style={{ width: "100%", textAlign: "center", flexGrow: 1, overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <h2 style={{ whiteSpace: "normal", wordWrap: "break-word", fontSize: "1.1rem", margin: 0 }}>
                              {product.name}
                            </h2>
                            <div style={{ marginTop: "0.5rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
                              {[...Array(5)].map((_, i) => (
                                <span key={i} style={{ color: "#f8c325ff", fontSize: "1.1rem", marginRight: i !== 4 ? "2px" : "0" }}>
                                  {i < Math.round(product.rating || 0) ? "★" : "☆"}
                                </span>
                              ))}
                            </div>
                            <div style={{ marginTop: "0.25rem", fontSize: "0.9rem", color: "#555" }}>
                              {product.numReviews} {product.numReviews === 1 ? "review" : "reviews"}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        )
      )}
    </>
  );
};

export default ProductCarousel;
