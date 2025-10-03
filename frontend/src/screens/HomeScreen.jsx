import { useEffect, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import ProductCarousel from '../components/ProductCarousel';
import { useGetProductsQuery, useGetTopProductsQuery } from '../slices/productsApiSlice';
import Paginate from '../components/Paginate';
import Meta from '../components/Meta';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, error, refetch } = useGetProductsQuery(
    { keyword, pageNumber },
    { refetchOnMountOrArgChange: true }
  );

  const { data: topProductsData } = useGetTopProductsQuery();

  const [carouselImages, setCarouselImages] = useState([]);

  useEffect(() => {
    if (topProductsData?.products) {
      // Pick the last image of each top product (if images exist)
      const newImages = topProductsData.products
        .map(product =>
          Array.isArray(product.images) && product.images.length > 0
            ? product.images[product.images.length - 1]
            : null
        )
        .filter(Boolean);
      setCarouselImages(newImages);
    }
  }, [topProductsData]);

  useEffect(() => {
    if (data?.products) {
      const interval = setInterval(() => {
        refetch(); // Refetch data every 5 minutes
      }, 300000); // 300000 ms = 5 minutes

      return () => clearInterval(interval); // Cleanup on component unmount
    }
  }, [data, refetch]);

  return (
    <>
      <Meta title="Welcome To Pro-Shop!" />
      {!keyword ? (
        <ProductCarousel images={carouselImages} />
      ) : (
        keyword && (
          <>
            <h2>
              Search Results for "<strong>{keyword}</strong>"
            </h2>
            <Link to="/" className="mb-3 d-inline-block text-dark">
              <Button variant="light">Go Back</Button>
            </Link>
          </>
        )
      )}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Row>
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>

          <Paginate
            pages={data.pages}
            page={data.page}
            isAdmin={false}
            keyword={keyword || ''}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;