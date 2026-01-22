const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "MY_SUPER_SECRET_KEY";

// --------------------- Middleware: Verify Token ---------------------
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token missing" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
}

// --------------------- Generate Order ID ---------------------
async function generateOrderId() {
  const year = new Date().getFullYear();
  const lastOrder = await Order.findOne().sort({ createdAt: -1 });
  let nextSerial = 1;

  if (lastOrder && lastOrder.orderId) {
    const lastId = parseInt(lastOrder.orderId);
    const lastYear = Math.floor(lastId / 1000);
    const lastSerial = lastId % 1000;
    if (lastYear === year) nextSerial = lastSerial + 1;
  }

  const paddedSerial = nextSerial.toString().padStart(3, "0");
  return `${year}${paddedSerial}`;
}

// --------------------- PLACE ORDER ---------------------
router.post("/order", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { email, phone, address, paymentMethod, cardNumber, expiry } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const user = await User.findById(userId);
    const newOrderId = await generateOrderId();

    const order = new Order({
      orderId: newOrderId,
      username: user.username,
      email,
      phone,
      address,
      paymentMethod,
      payment_details: {
        cardNumber: paymentMethod === "Card" ? cardNumber : null,
        expiry: paymentMethod === "Card" ? expiry : null,
      },
      items: cart.items,
    });

    await order.save();
    await Cart.findOneAndUpdate({ userId }, { items: [] });

    res.status(200).json({ message: "Order placed", orderId: newOrderId });
  } catch (err) {
    res.status(500).json({ message: "Order error", error: err.message });
  }
});

// --------------------- GET ALL USER ORDERS ---------------------
router.get("/orders", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ email: req.user.email }).sort({
      createdAt: -1,
    });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// --------------------- CANCEL ORDER ---------------------
router.put("/cancel/:orderId", authenticateToken, async (req, res) => {
  const { orderId } = req.params;
  const { reason } = req.body;

  try {
    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.email !== req.user.email)
      return res.status(403).json({ message: "Unauthorized" });

    if (order.status === "Cancelled")
      return res.status(400).json({ message: "Already cancelled" });

    order.status = "Cancelled";
    order.cancelReason = reason;

    order.items.forEach((item) => {
      item.status = "Cancelled";
    });

    await order.save();

    res.status(200).json({ message: "Order cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Cancel error", error: err.message });
  }
});

// --------------------- USER PROFILE ---------------------
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      username: user.username,
      email: user.email,
      phone: user.phone,
    });
  } catch (err) {
    res.status(500).json({ message: "Profile error", error: err.message });
  }
});

module.exports = router;
