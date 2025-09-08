import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";

//@desc    Create new order
//@route   POST /api/orders
//@access  Private

const addOrderItems = asyncHandler(async (req, res) => {
  res.send('Add order items');
});

//@desc    Get logged in user orders
//@route   POST /api/orders/myorders
//@access  Private

const getMyOrders = asyncHandler(async (req, res) => {
  res.send('get my orders');
});

//@desc Get order by ID
//@route GET /api/orders/:id
//@access Private

const getOrderById = asyncHandler(async (req, res) => {
    res.send('Get order by ID');
//   const order = await Order.findById(req.params.id).populate(
//     'user',
//     'name email'
//   );

//   if (order) {
//     res.json(order);
//   } else {
//     res.status(404);
//     throw new Error('Order not found');
//   }
});

//@desc    Update order to paid
//@route   GET /api/orders/:id/pay
//@access  Private

const updateOrderToPaid = asyncHandler(async (req, res) => {
//   const order = await Order.findById(req.params.id);

//   if (order) {
//     order.isPaid = true;
//     order.paidAt = Date.now();
//     order.paymentResult = {
//       id: req.body.id,
//       status: req.body.status,
//       update_time: req.body.update_time,
//       email_address: req.body.payer.email_address,
//     };

//     const updatedOrder = await order.save();
//     res.json(updatedOrder);
//   } else {
//     res.status(404);
//     throw new Error('Order not found');
//   }
  res.send('Update order to paid');});  

  //@desc    Update order to delivered
//@route   GET /api/orders/:id/deliver
//@access  Private/Admin

const updateOrderToDelivered = asyncHandler(async (req, res) => {
//   const order = await Order.findById(req.params.id);

//   if (order) {
//     order.isDelivered = true;
//     order.deliveredAt = Date.now();

//     const updatedOrder = await order.save();
//     res.json(updatedOrder);
//   } else {
//     res.status(404);
//     throw new Error('Order not found');
//   }
  res.send('Update order to delivered');});

  //@desc    Get all orders
//@route   GET /api/orders
//@access  Private/Admin

const getOrders = asyncHandler(async (req, res) => {
//   const orders = await Order.find({}).populate('user', 'id name');
//   res.json(orders);
  res.send('Get all orders');});    

export { addOrderItems, getMyOrders, getOrderById, updateOrderToPaid, updateOrderToDelivered, getOrders };