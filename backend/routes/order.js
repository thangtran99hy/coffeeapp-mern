const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Table = require('../models/Table');
const Product = require('../models/Product');
const { number, func } = require('joi');
router.get('/order', async (req, res) => {
    try {
        let limit = Number(req.query.limit);
        let page = Number(req.query.page);
        const order = await Order.find()
            .sort({ updatedAt: -1 })
            .limit(limit)
            .skip(limit * page)
            // .populate('order.product')
            .populate({
                path: 'order.product',
                populate: {
                    path: 'type',
                },
            })
            .populate('user', 'name')
            .populate('table', 'name');
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.post('/order', async (req, res) => {
    let totalPrice = 0;
    for (let i = 0; i < req.body.order.length; i++) {
        let product = await Product.findById(req.body.order[i].product);
        totalPrice += Number(product.price) * Number(req.body.order[i].amount);
        let newBook = { amount: req.body.order[i].amount, time: new Date() };
        console.log(newBook);
        if (!product.book) product.book = [];
        product.book.push(newBook);
        console.log(product.book);
    }
    const order = new Order({
        user: req.body.user,
        table: req.body.table,
        order: req.body.order,
        status: req.body.status,
        totalPrice,
    });

    let table;
    try {
        table = await Table.findById(req.body.table);
        if (table != null) {
            table.status = 'busy';
        }
        await table.save();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

    try {
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
router.post('/orderemail', async (req, res) => {
    let totalPrice = 0;
    let user = await User.findOne({ email: req.body.email });
    let table = await Table.findOne({ user: user });
    if (req.body.table) {
        let tableId = req.body.table;
        table = await Table.findById(tableId);
    }
    let statusPrev = null;
    if (!table) {
        return res.status(400).json({ message: 'Bạn đã mua hàng chưa đặt bàn!' });
    } else {
        if (table.status === 'busy') {
            return res.status(400).json({ message: 'Bàn bạn chọn đã bận!' });
        } else {
            statusPrev = table.status;
            table.status = 'busy';
            table.user = null;
            await table.save();
        }
    }
    for (let i = 0; i < req.body.order.length; i++) {
        let product = await Product.findById(req.body.order[i].product);
        totalPrice += Number(product.price) * Number(req.body.order[i].amount);
    }
    const order = new Order({
        user: user ? user._id : null,
        table: table ? table._id : null,
        name: req.body.name,
        order: req.body.order,
        status: req.body.status,
        totalPrice,
    });

    try {
        const newOrder = await order.save();
        return res.status(201).json(newOrder);
    } catch (err) {
        if (statusPrev) {
            table.status = statusPrev;
            await table.save();
        }
        res.status(400).json({ message: err.message });
    }
});
router.patch('/order/:id/status/:status', getOrderById, async (req, res) => {
    if (req.order.status != null) {
        req.order.status = req.params.status;
    }
    try {
        const updateOrder = await req.order.save();
        res.json(updateOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
router.patch('/order/:id/add', getOrderById, async (req, res) => {
    let order = req.order;
    let orderList = req.order.order;
    orderList.push(req.body.order);

    try {
        const updateOrder = await req.order.save();
        res.json(updateOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
router.get('/order/:id/calculate', getOrderById, async (req, res) => {
    try {
        let order = req.order.order;
        let totalPrice = await caculateTotalPrice(order);
        req.order.totalPrice = totalPrice;
        res.json(req.order);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
router.get('/order/:id', getOrderById, async (req, res) => {
    try {
        res.send(req.order);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
router.delete('/order/:id', getOrderById, async (req, res) => {
    try {
        await req.order.remove();
        res.json({ message: `Deleted Order` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getOrderById(req, res, next) {
    let order;
    try {
        order = await Order.findById(req.params.id)
            .populate('order.product')
            .populate('user', 'username')
            .populate('table', 'name');
        if (order == null) {
            return res.status(404).json({ message: 'Can not find order' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    req.order = order;
    next();
}

async function caculateTotalPrice(order) {
    let totalPrice = 0;
    try {
        for (let i = 0; i < order.length; i++) {
            let product = order[i];
            totalPrice += product.product.price * product.amount;
        }
        return totalPrice;
    } catch (error) {
        return 0;
    }
}

module.exports = router;
