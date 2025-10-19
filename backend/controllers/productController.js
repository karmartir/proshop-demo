import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";
import fs from "fs";
import path from "path";

//@desc    Fetch all products
//@route   GET /api/products
//@access  Public

const getProducts = asyncHandler(async (req, res) => {
  // Pagination logic
  // Default page size is set to 4
  // If pageNumber is not provided, it defaults to 1
  const pageSize = process.env.PAGINATION_LIMIT || 4;
  const page = Number(req.query.pageNumber) || 1;

  // Search keyword logic
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  // Count total number of products
  const count = await Product.countDocuments({ ...keyword });

  // Fetch products with pagination
  // Limit the number of products returned based on pageSize and skip based on current page
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  // Normalize image field for each product
  const normalizedProducts = products.map((p) => ({
    ...p._doc,
    image: p.images?.length ? p.images[0] : p.image || "/images/placeholder.jpg",
  }));
  res.json({ products: normalizedProducts, page, pages: Math.ceil(count / pageSize) });
});

//@desc    Fetch paginated products
//@route   GET /api/products?pageNumber=
//@access  Public

const getPaginatedProducts = asyncHandler(async (req, res) => {
  const pageSize = 4;
  const page = Number(req.query.pageNumber) || 1;
  const count = await Product.countDocuments();
  const products = await Product.find({})
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

//@desc    Fetch single product by ID
//@route   GET /api/products/:id
//@access  Public

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    const normalizedProduct = {
      ...product._doc,
      image: product.images?.length ? product.images[0] : product.image || "/images/placeholder.jpg",
    };
    return res.json(normalizedProduct);
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

//@desc    Create a new product
//@route   POST /api/products
//@access  Private/Admin

// Additional controller functions can be added here

const createProduct = asyncHandler(async (req, res) => {
  // Handle uploaded images
  let images = [];
  if (req.files && req.files.length > 0) {
    images = req.files.map((file) => `/uploads/${file.filename}`);
  }
  const product = new Product({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: images.length > 0 ? images[0] : "/images/sample.jpg",
    images: images,
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
    rating: 0,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

//@desc Update a product
//@route PUT /api/products/:id
//@access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    // If new images are uploaded, append them to product.images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`);
      // Ensure product.images is an array
      if (!Array.isArray(product.images)) {
        product.images = [];
      }
      product.images = [...product.images, ...newImages];
      // Optionally update the main image to the first image if not set
      if (!product.image && product.images.length > 0) {
        product.image = product.images[0];
      }
    }
    // Allow updating the main image field if provided
    if (image) {
      product.image = image;
    }
    // Allow replacing images array if provided in body (e.g., removing images)
    if (req.body.images) {
      product.images = req.body.images;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});
// Additional controller functions can be added here

//@desc Delete a product

//@route DELETE /api/products/:id
//@access Private/Admin

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.status(200).json({ message: "Product deleted" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc Create a new product review
// @route POST /api/products/:id/reviews
// @access Private

// Additional controller functions can be added here
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//@desc    Get top rated products
//@route   GET /api/products/top
//@access  Public

const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(9);
  res.status(200).json(products);
});

// @desc Delete a product image
// @route DELETE /api/products/:id/images/:imageName
// @access Private/Admin
const deleteProductImage = asyncHandler(async (req, res) => {
  const { id, imageName } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Remove image from product.images array
  product.images = product.images.filter(img => !img.includes(imageName));
  await product.save();

  // Delete file from server uploads folder
  const filePath = path.join(process.cwd(), "uploads", imageName);
  fs.unlink(filePath, (err) => {
    if (err) console.error("Failed to delete image file:", err);
  });

  res.json({ message: "Image deleted successfully", images: product.images });
});


// @desc Delete a product review by admin
// @route DELETE /api/products/:id/reviews/:reviewId
// @access Private/Admin
const deleteProductReview = asyncHandler(async (req, res) => {
  const { id, reviewId } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Remove the review
  product.reviews = product.reviews.filter(r => r._id.toString() !== reviewId);

  // Update numReviews and rating
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.length
    ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
    : 0;

  await product.save();
  res.json({ message: "Review deleted successfully", reviews: product.reviews });
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  deleteProductImage,
  deleteProductReview
};
