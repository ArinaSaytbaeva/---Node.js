const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { authenticateToken } = require('../middleware/auth');

// Создать заказ
router.post('/', authenticateToken, async (req, res) => {
    try {
        const order = new Order({
            ...req.body,
            userId: req.user.userId
        });
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Получить заказы текущего пользователя
router.get('/my', authenticateToken, async (req, res) => {
    const orders = await Order.find({ userId: req.user.userId })
        .populate('products.productId')
        .sort({ createdAt: -1 });
    res.json(orders);
});

// Получить конкретный заказ
router.get('/:id', authenticateToken, async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('products.productId');
    if (!order) return res.status(404).json({ error: 'Заказ не найден' });
    res.json(order);
});

module.exports = router;