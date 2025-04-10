const Product = require("../models/product.js");
const Cart = require("../models/cart.js");

// Fetch all
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.render("lists/index", { products });
    } catch (e) {
        console.error("Error fetching products:", e);
        req.flash("error", "Failed to load products");
        res.redirect("/error");
    }
};

// Fetch
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            req.flash("error", "Product not found");
            return res.redirect("/app");
        }
        //console.log("Image URL:", product.images[0]);
        res.render("lists/product.ejs", { product });
    } catch (e) {
        console.error("Error fetching product:", e);
        req.flash("error", "Failed to load product");
        res.redirect("/app");
    }
};



//search
exports.searchProduct = async (req, res) => {
  try {
    const query = req.query.query; 
    console.log(query);
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } }
      ]
    });

    res.render("lists/index.ejs", { products });
  } catch (e) {
    console.log(e);
    req.flash("error", e.message);
    res.redirect("/app");
  }
};



// cart items 
exports.cartItems = async (req, res) => {
    try {
      console.log("User ID from session:", req.user._id);
  
      const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  
      if (!cart || cart.items.length === 0) {
        req.flash("error", "Nothing is in the cart");
        return res.redirect("/app");
      }
  
      console.log("Cart retrieved:", cart);
      res.render("lists/cart", { cart }); 
    } catch (e) {
      console.log("Error in cartItems:", e);
      req.flash("error", "Something went wrong!");
      res.redirect("/app");
    }
  };
  

// add to cart
exports.cart = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      const userId = req.user._id;
  
      if (!product) {
        req.flash("error", "Product not found!");
        return res.redirect("/app");
      }
  
      let cart = await Cart.findOne({ user: userId });
  
      if (!cart) {
        cart = new Cart({
          user: userId,
          items: [{ product: product._id, quantity: 1 }],
        });
      } 
      else {
        const existingItemIndex = cart.items.findIndex(item =>
          item.product.equals(product._id)
        );
  
        if (existingItemIndex !== -1) {
          cart.items[existingItemIndex].quantity += 1;
        } 
        else {
          cart.items.push({ product: product._id, quantity: 1 });
        }
      }
  
      await cart.save();
  
      req.flash("success", `${product.name} added to cart!`);
      res.redirect("/app");
    } catch (e) {
      console.error(e);
      req.flash("error", "Something went wrong!");
      res.redirect("/app");
    }
  };
  

// incarese qnty
exports.addqnt = async (req, res) => {
  console.log("addqnt route hit");

  try {
      const productId = req.params.id;
      const userId = req.user._id;

      const cart = await Cart.findOne({ user: userId });

      if (!cart) {
          req.flash("error", "Cart not found.");
          return res.redirect("/app/cart");
      }

      const item = cart.items.find(item => item.product.toString() === productId);
      
      if (!item) {
          req.flash("error", "Product not found in cart.");
          return res.redirect("/app/cart");
      }

      item.quantity += 1;

      await cart.save();

      req.flash("success", "Quantity increased!");
      res.redirect("/app/cart");
  } catch (e) {
      console.error("Error in addqnt:", e);
      req.flash("error", "Something went wrong!");
      res.redirect("/app/cart");
  }
};

// delete form cart

exports.delqnt = async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.id; 

  console.log("User ID from session:", userId);

  console.log("productId is:", productId); 

  try {

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.redirect('/app/cart');

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();

    console.log("Item deleted:", productId);
    req.flash("success", "Item is deleted");
    res.redirect('/app/cart');


  } 
  catch (err) {

    console.error("Error deleting item from cart:", err);
    req.flash("error", "Something went wrong.");
    res.redirect('/app/cart');

  }
};


// purcahse
exports.purchaseProduct = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(" the id is : ", id);
    const product = await Product.findById(id);
    if (!product) {
      req.flash("error", "Product not found");
      return res.redirect("/app");
    }
    res.render("lists/purchase.ejs", { product }); 
  } 
  catch (e) {
    console.error("Purchase Error:", e.message);
    req.flash("error", "Something went wrong");
    res.redirect("/app");
  }
};
