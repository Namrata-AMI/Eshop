const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.js");

const {isLoggedIn} = require("../middlewares/middleware.js");

router.get("/",productController.getAllProducts);
router.get("/search",productController.searchProduct);
router.get("/cart",isLoggedIn,productController.cartItems);

router.post("/cart/increase/:id",isLoggedIn, productController.addqnt);

router.get("/:id/purchase", productController.purchaseProduct);

router.post("/cart/:id", isLoggedIn, productController.cart);
router.get("/:id",isLoggedIn,productController.getProductById);
router.post("/cart/delete/:id",isLoggedIn,productController.delqnt);



module.exports = router;