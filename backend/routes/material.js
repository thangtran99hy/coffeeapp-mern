const express = require('express');
const router = express.Router();
const Material = require('../models/Material');

router.get('/material', async (req, res) => {
    try {
        const material = await Material.find();
        res.json(material);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.post('/material', async (req, res) => {
    const material = new Material(
        {
            name: req.body.name,
            name_type: req.body.name_type,
            description: req.body.description,
            amount: req.body.amount,
            unit: req.body.unit,
            priceperunit: req.body.priceperunit
        }
    );
    try {
        const newMaterial = await material.save();
        res.status(201).json(newMaterial);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
router.get('/materialInput', async (req, res) => {
    try {
        const material = await Material.find({ amountInput: { $ne: 0 } });
        res.json(material);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.get('/materialOutput', async (req, res) => {
    try {
        const material = await Material.find({ amountOutput: { $ne: 0 } });
        res.json(material);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.patch('/material/:id', getMaterialById, async (req, res) => {
    if (req.body.name != null) {
        req.material.name = req.body.name;
    }
    if (req.body.description != null) {
        req.material.description = req.body.description;
    }
    if (req.body.unit != null) {
        req.material.unit = req.body.unit;
    }
    if (req.body.name_type != null) {
        req.material.name_type = req.body.name_type;
    }
    if (req.body.amount != null) {
        req.material.amount = req.body.amount;
    }
    if (req.body.priceperunit != null) {
        req.material.priceperunit = req.body.priceperunit;
    }
    try {
        const updateMaterial = await req.material.save();
        res.json(updateMaterial);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
router.delete('/material/:id', getMaterialById, async (req, res) => {
    try {
        await req.material.remove();
        res.json({ message: `Deleted Material` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getMaterialById(req, res, next) {
    let material;
    try {
        material = await Material.findById(req.params.id);
        if (material == null) {
            return res.status(404).json({ message: 'Can not find material' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });

    }
    req.material = material;
    next();
}

module.exports = router;

