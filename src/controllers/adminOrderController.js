import Order from "../models/orderModel.js";

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate("user", "firstName lastName email");

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "something went wrong",
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "order not found",
            });
        }

        order.status = req.body.status || order.status;
        order.isDelivered = req.body.status === "Delivered" ? true : order.isDelivered;
        order.deliveredAt = req.body.status === "Delivered" ? Date.now() : order.deliveredAt;

        const updatedOrder = await order.save();

        return res.status(200).json({
            success: true,
            order: updatedOrder,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "something went wrong",
        });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "order not found",
            });
        }

        await order.deleteOne();

        return res.status(200).json({
            success: true,
            message: "order deleted",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "something went wrong",
        });
    }
};

export { getAllOrders, updateOrderStatus, deleteOrder };
