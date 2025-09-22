import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

//@desc    Fetch all products
//@route   GET /api/products
//@access  Public

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

//@desc    Fetch single product by ID
//@route   GET /api/products/:id
//@access  Public

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
});

//@desc    Create a new product
//@route   POST /api/products
//@access  Private/Admin

// Additional controller functions can be added here

const createProduct = asyncHandler(async (req, res) => {
  
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
    rating: 0,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});


//@desc Update a product
//@route PUT /api/products/:id
//@access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
 const { name, price, description, image, brand, category, countInStock } = req.body;
 
 const product = await Product.findById(req.params.id);

 if (product) {
   product.name = name;
   product.price = price;
   product.description = description;
   product.image = image;
   product.brand = brand;
   product.category = category;
   product.countInStock = countInStock;

   const updatedProduct = await product.save();
   res.json(updatedProduct);
 } else {
   res.status(404);
   throw new Error('Product not found');
 }    
});
// Additional controller functions can be added here

//@desc Delete a product
//@route DELETE /api/products/:id
//@access Private/Admin

export { getProducts, getProductById, createProduct, updateProduct };
