import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import Loader from "./Loader";
import Message from "./Message";
import { useGetTopProductsQuery } from "../slices/productsApiSlice";
import { useState, useEffect } from "react";

const ProductCarousel = () => {
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
   // Responsive adjustments
  useEffect(() => {
    let debounceTimeout = null;

    const updateItemsPerSlide = () => {
      const width = window.innerWidth;
      if (width < 768) return 1;      // Mobile
      else if (width < 1068) return 2; // Tablet and mid-size screens
      else return 3;                  // Desktop / LG
    };

    const handleResize = () => {
      const newItemsPerSlide = updateItemsPerSlide();
      setItemsPerSlide(newItemsPerSlide);
    };

    const debouncedResize = () => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        handleResize();
      }, 200);
    };

    // Initialize itemsPerSlide on mount without debounce
    handleResize();

    window.addEventListener("resize", debouncedResize);

    return () => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      window.removeEventListener("resize", debouncedResize);
    };
  }, []);

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
          <Carousel pause="hover" className="bg-primary mb-4" indicators={false} style={{ paddingTop: "1.5rem", paddingBottom: "1.5rem" }}>
            {groupedProducts.map((group, idx) => (
              <Carousel.Item key={idx}>
                <div className="d-flex flex-nowrap justify-content-center align-items-center gap-3">
                  {group.map((product) => {
                    const imageUrl = getImageUrl(product);
                    if (!imageUrl) return null;
                    return (
                      <Link
                        key={product._id}
                        to={`/product/${product._id}`}
                        className="d-flex justify-content-center align-items-center text-center text-decoration-none text-reset"
                        style={{ flex: "0 0 auto" }}
                      >
                        <div
                          className="bg-white p-3 shadow rounded d-flex flex-column justify-content-start align-items-center overflow-hidden"
                          style={{
                            width: `${cardWidth}px`,
                            height: `${cardHeight}px`,
                            margin: "2rem 0",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            cursor: "pointer",
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.transform = "translateY(-10px)";
                            e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.25)";
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
                          }}
                        >
                          <Image
                            src={imageUrl}
                            alt={product.name}
                            fluid
                            className="mb-2 rounded shadow-sm"
                            style={{ height: `${imageHeight}px`, width: "90%", objectFit: "contain", display: "block" }}
                          />
                          <div className="w-100 d-flex flex-column align-items-center flex-grow-1 overflow-hidden">
                            <h2 className="fw-bold mb-0" style={{ whiteSpace: "normal", wordWrap: "break-word", fontSize: "1.25rem" }}>
                              {product.name}
                            </h2>
                            <div className="mt-2 d-flex justify-content-center align-items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} style={{ color: "#f8c325ff", fontSize: "1.1rem" }}>
                                  {i < Math.round(product.rating || 0) ? "★" : "☆"}
                                </span>
                              ))}
                              <div className="text-muted ms-2" style={{ fontSize: "0.9rem" }}>
                                {product.numReviews} {product.numReviews === 1 ? "review" : "reviews"}
                              </div>
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
