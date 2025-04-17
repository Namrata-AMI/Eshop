const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.js");

const {isLoggedIn} = require("../middlewares/middleware.js");


router.get("/", productController.getAllProducts);

router.get("/search", productController.searchProduct);


router.get("/cart", isLoggedIn, productController.cartItems);

router.post("/cart/:id", isLoggedIn, productController.cart);

router.post("/cart/increase/:id", isLoggedIn, productController.addqnt);

router.post("/cart/delete/:id", isLoggedIn, productController.delqnt);


router.get("/:id/purchase", isLoggedIn, productController.purchaseProduct); 

router.get("/:id", isLoggedIn, productController.getProductById); 




module.exports = router;