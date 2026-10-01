const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.js");
const { isLoggedIn } = require("../middlewares/middleware.js");
const product = require("../models/product.js");

router.get("/",productController.getHome);
router.get("/products", productController.getAllProducts);
router.get("/search", productController.searchProduct);

router.get("/collection/:name", productController.getCollection);
router.get("/style", productController.getStyle);
router.get("/gifts",isLoggedIn,productController.getGift);
router.get("/style_guide", isLoggedIn,productController.getGuide);
router.get("/about",isLoggedIn,productController.getAbout);
router.get("/concierge",isLoggedIn, productController.getConcierge);
router.get("/contact", isLoggedIn,productController.getContact);
router.post("/contact", isLoggedIn ,productController.postContact);
router.get("/checkout", isLoggedIn, productController.getCheckout);
router.post("/checkout", isLoggedIn, productController.postCheckout);




router.get("/cart", isLoggedIn, productController.cartItems);

router.post("/cart/:id", isLoggedIn, productController.cart);


router.post("/cart/increase/:id", isLoggedIn, productController.addqnt);

router.post("/cart/decrease/:id", isLoggedIn, productController.decreaseqnt);

router.post("/cart/delete/:id", isLoggedIn, productController.delqnt);
router.get("/:id/purchase", isLoggedIn, productController.purchaseProduct);

router.get("/order/:id", isLoggedIn, productController.getOrder);

router.get("/:id", isLoggedIn, productController.getProductById);



module.exports = router;
