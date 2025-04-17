const Product = require("../models/product.js");
const Cart = require("../models/cart.js");

// Fetch all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.render("lists/index", { products });
    } catch (e) {
        console.error("Error fetching products:", e);
        req.flash("error", "Failed to load products");
        res.redirect("/app");
    }
};

// Fetch product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            req.flash("error", "Product not found");
            return res.redirect("/app");
        }
        res.render("lists/product", { product });
    } catch (e) {
        console.error("Error fetching product:", e);
        req.flash("error", "Failed to load product");
        res.redirect("/app");
    }
};

// Search products
exports.searchProduct = async (req, res) => {
    try {
        const query = req.query.query;
        console.log("Search query:", query);
        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { brand: { $regex: query, $options: "i" } }
            ]
        });
        if (products.length === 0) {
            req.flash("error", "No products found");
            return res.redirect("/app");
        }
        res.render("lists/index", { products });
    } catch (e) {
        console.error("Error searching products:", e);
        req.flash("error", "Something went wrong!");
        res.redirect("/app");
    }
};

// View cart items
exports.cartItems = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            req.flash("error", "Nothing is in the cart");
            return res.redirect("/app");
        }
        res.render("lists/cart", { cart });
    } catch (e) {
        console.error("Error fetching cart items:", e);
        req.flash("error", "Something went wrong!");
        res.redirect("/app");
    }
};

// Add to cart
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
                items: [{ product: product._id, quantity: 1 }]
            });
        } else {
            const existingItemIndex = cart.items.findIndex(item =>
                item.product.equals(product._id)
            );

            if (existingItemIndex !== -1) {
                cart.items[existingItemIndex].quantity += 1;
            } else {
                cart.items.push({ product: product._id, quantity: 1 });
            }
        }

        await cart.save();
        req.flash("success", `${product.name} added to cart!`);
        res.redirect("/app");
    } catch (e) {
        console.error("Error adding to cart:", e);
        req.flash("error", "Something went wrong!");
        res.redirect("/app");
    }
};

// Increase quantity
exports.addqnt = async (req, res) => {
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
        console.error("Error increasing quantity:", e);
        req.flash("error", "Something went wrong!");
        res.redirect("/app/cart");
    }
};

// Decrease quantity or delete from cart
exports.delqnt = async (req, res) => {
    const userId = req.user._id;
    const productId = req.params.id;

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) return res.redirect("/app/cart");

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();

        req.flash("success", "Item deleted");
        res.redirect("/app/cart");
    } catch (err) {
        console.error("Error deleting item from cart:", err);
        req.flash("error", "Something went wrong.");
        res.redirect("/app/cart");
    }
};

// Purchase product
exports.purchaseProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            req.flash("error", "Product not found");
            return res.redirect("/app");
        }

        const deliveryDays = Math.floor(Math.random() * 10) + 1;

        res.render("lists/purchase", { product, deliveryDays });
    } catch (e) {
        console.error("Purchase Error:", e.message);
        req.flash("error", "Something went wrong");
        res.redirect("/app");
    }
};
