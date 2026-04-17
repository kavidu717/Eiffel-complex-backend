import Cart from "../models/cardModel.js";
import Product from "../models/productModel.js";

const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId });
    }

    if (guestId) {
        return await Cart.findOne({ guestId });
    }

    return null;
};

const addToCart = async (req, res) => {
    const { productId, quantity, color, size, guestId, userId } = req.body;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "product not found",
            });
        }

        let cart = await getCart(userId, guestId);

        if (!cart) {
            cart = new Cart({
                user: userId || null,
                guestId: guestId || `guest_${new Date().getTime()}`,
                products: [],
                totalPrice: 0,
            });
        }

        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.color === color &&
                p.size === size,
        );

        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({
                productId,
                name: product.name,
                image: product.images[0]?.url,
                price: product.price,
                color,
                size,
                quantity,
            });
        }

        cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
        await cart.save();

        return res.status(200).json({ cart });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "something went wrong",
        });
    }
};

const updateQuantity = async (req, res) => {
    const { productId, quantity, color, size, guestId, userId } = req.body;

    try {
        const cart = await getCart(userId, guestId);

        if (!cart) {
            return res.status(404).json({
                message: "cart not found",
            });
        }

        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.color === color &&
                p.size === size,
        );

        if (productIndex === -1) {
            return res.status(404).json({
                message: "product not found in cart",
            });
        }

        if (quantity > 0) {
            cart.products[productIndex].quantity = quantity;
        } else {
            cart.products.splice(productIndex, 1);
        }

        cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
        await cart.save();

        return res.status(200).json({ cart });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "something went wrong",
        });
    }
};

const deleteItemInCart = async (req, res) => {
    const { productId, color, size, guestId, userId } = req.body;

    try {
        const cart = await getCart(userId, guestId);

        if (!cart) {
            return res.status(404).json({
                message: "cart not found",
            });
        }

        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.color === color &&
                p.size === size,
        );

        if (productIndex > -1) {
            cart.products.splice(productIndex, 1);
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await cart.save();
        }

        return res.status(200).json({ cart });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "something went wrong",
        });
    }
};

const loginInUser = async (req, res) => {
    const { userId, guestId } = req.query;

    try {
        const cart = await getCart(userId, guestId);

        if (cart) {
            return res.json({ cart });
        }

        return res.status(404).json({
            message: "cart not found",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "something went wrong",
        });
    }
};

const convertIntoUserCart = async (req, res) => {
    const { guestId } = req.body;

    try {
        const guestCart = await Cart.findOne({ guestId });
        let userCart = await Cart.findOne({ user: req.user._id });

        if (!guestCart || guestCart.products.length === 0) {
            return res.status(404).json({
                message: "Guest cart is empty or not found",
            });
        }

        if (!userCart) {
            userCart = new Cart({
                user: req.user._id,
                products: [],
                totalPrice: 0,
            });
        }

        guestCart.products.forEach((guestItem) => {
            const productIndex = userCart.products.findIndex(
                (item) =>
                    item.productId.toString() === guestItem.productId.toString() &&
                    item.color === guestItem.color &&
                    item.size === guestItem.size,
            );

            if (productIndex > -1) {
                userCart.products[productIndex].quantity += guestItem.quantity;
            } else {
                userCart.products.push(guestItem);
            }
        });

        userCart.totalPrice = userCart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
        await userCart.save();
        await Cart.findOneAndDelete({ guestId });

        return res.status(200).json({
            success: true,
            message: "Guest cart successfully converted into user cart",
            cart: userCart,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error during cart conversion",
            error: error.message,
        });
    }
};

export {
    addToCart,
    updateQuantity,
    deleteItemInCart,
    loginInUser,
    convertIntoUserCart,
};
