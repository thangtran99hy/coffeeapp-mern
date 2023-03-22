const express = require("express");
const router = express.Router();
const ExportMaterial = require("../models/ExportMaterial");
const Material = require("../models/Material");
const { number, func } = require("joi");

router.get("/exportMaterial", async (req, res) => {
  try {
    const exportMaterial = await ExportMaterial.find().sort({ createdAt: -1 }).populate('export.material');
    res.json(exportMaterial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.post("/exportMaterial", async (req, res) => {
  try {
    let totalPrice = 0;
    let exportData = [];
    let materialAmountRoot = [];
    for (let i = 0; i < req.body.export.length; i++) {
      let material = await Material.findById(req.body.export[i].material);
      if (material) {
        if (!materialAmountRoot.hasOwnProperty(req.body.export[i].material)) {
          materialAmountRoot[req.body.export[i].material] = material.amount;
        }
        exportData.push(req.body.export[i]);
        totalPrice +=
            Number(material.priceperunit) * Number(req.body.export[i].amount);
        if (material.amount >= Number(req.body.export[i].amount)) {
          material.amount -= Number(req.body.export[i].amount);
        } else {
          Object.keys(materialAmountRoot).forEach(async (key, value) => {
            let amountRevert = materialAmountRoot[key];
            let materialRevert = await Material.findById(key);
            materialRevert.amount = amountRevert;
            materialRevert.save();
          });
          return res.status(400).json({message: material.name + " không đủ để xuất kho"});
        }

        let newExport = {amount: Number(req.body.export[i].amount), time: new Date()};
        if (!material.export) material.export = [];
        material.export.push(newExport);
        try {
          await material.save();
        } catch (error) {
          Object.keys(materialAmountRoot).forEach(async (key, value) => {
            let amountRevert = materialAmountRoot[key];
            let materialRevert = await Material.findById(key);
            materialRevert.amount = amountRevert;
            materialRevert.save();
          });

          return res.status(400).json({message: err.message});
        }
      }
    }
    const exportMaterial = new ExportMaterial({
      name: req.body.name,
      export: exportData,
      totalPrice: totalPrice,
    });

    const newExportMaterial = await exportMaterial.save();

    return res.status(201).json(newExportMaterial);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});
router.get("/exportMaterial/:id", getExportMaterialById, async (req, res) => {
  res.send(req.exportMaterial);
});
router.delete("/exportMaterial/:id", getExportMaterialById, async (req, res) => {
    try {
      await req.exportMaterial.remove();
      res.json({ message: `Deleted ExportMaterial` });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

async function getExportMaterialById(req, res, next) {
  let exportMaterial;
  try {
    exportMaterial = await ExportMaterial.findById(req.params.id);
    if (exportMaterial == null) {
      return res.status(404).json({ message: "Can not find exportMaterial" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  req.exportMaterial = exportMaterial;
  next();
}

module.exports = router;
