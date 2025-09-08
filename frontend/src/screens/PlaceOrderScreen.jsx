import {useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {Row, Col, ListGroup, Image, Card, Button} from 'react-bootstrap';
import CheckoutSteps from '../components/CheckoutSteps';
// import Message from '../components/Message';
// import {clearCartItems} from '../slices/cartSlice';
// import {createOrder} from '../slices/orderSlice';

const PlaceOrderScreen = () => {
    const navigate = useNavigate();

    const cart = useSelector((state) => state.cart);

    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate('/shipping');
        } else if (!cart.paymentMethod) {
            navigate('/payment');
        }
    }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  return (
    <>
     <CheckoutSteps step1 step2 step3 step4 />
     <Row>
        <Col md={8}>Column</Col>
        <Col md={4}>Column</Col>
            
     </Row>
    </>
  )
}

export default PlaceOrderScreen
