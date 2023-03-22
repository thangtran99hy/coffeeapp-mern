const express = require("express");
const router = express.Router();
const ImportMaterial = require("../models/ImportMaterial");
const Material = require("../models/Material");
const { number, func } = require("joi");

router.get("/importMaterial", async (req, res) => {
  try {
    const importMaterial = await ImportMaterial.find().populate('import.material').sort({ createdAt: -1 });
    res.json(importMaterial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.post("/importMaterial", async (req, res) => {
  try {
    let totalPrice = 0;
    let importData = [];
    let materialRoot = [];
    let materialAmountRoot = [];
    for (let i = 0; i < req.body.import.length; i++) {
      let material = await Material.findById(req.body.import[i].material);
      if (material) {
        if (!materialAmountRoot.hasOwnProperty(req.body.import[i].material)) {
          materialAmountRoot[req.body.import[i].material] = material.amount;
        }
        let materialRootFind = materialRoot.find((item) => item._id === material._id);
        if (!materialRootFind) {
          materialRoot.push({
            ...material
          });
        }
        totalPrice += Number(material.priceperunit) * Number(req.body.import[i].amount);
        importData.push({
          ...req.body.import[i],
          priceperunit: material.priceperunit
        })
        material.amount += Number(req.body.import[i].amount);
        let newImport = {amount: Number(req.body.import[i].amount), time: new Date()};
        if (!material.import) material.import = [];
        material.import.push(newImport);
        try {
          await material.save();
        } catch (error) {
          Object.keys(materialAmountRoot).forEach(async (key, value) => {
            let amountRevert = materialAmountRoot[key];
            let materialRevert = await Material.findById(key);
            materialRevert.amount = amountRevert;
            materialRevert.save();
          });
          res.status(400).json({message: err.message});
        }
      }
    }
    const importMaterial = new ImportMaterial({
      name: req.body.name,
      import: importData,
      totalPrice: totalPrice,
    });

    const newImportMaterial = await importMaterial.save();

    const material = res.status(201).json(newImportMaterial);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.patch("/importMaterial/:id", getImportMaterialById, async (req, res) => {
  if (req.body.name != null) {
    req.importMaterial.name = req.body.name;
  }

  try {
    const updateImportMaterial = await req.importMaterial.save();
    res.json(updateImportMaterial);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.get("/importMaterial/:id", getImportMaterialById, async (req, res) => {
  res.send(req.importMaterial);
});
router.delete("/importMaterial/:id", getImportMaterialById, async (req, res) => {
    try {
      await req.importMaterial.remove();
      res.json({ message: `Deleted ImportMaterial` });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

async function getImportMaterialById(req, res, next) {
  let importMaterial;
  try {
    importMaterial = await ImportMaterial.findById(req.params.id);
    if (importMaterial == null) {
      return res.status(404).json({ message: "Can not find importMaterial" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  req.importMaterial = importMaterial;
  next();
}

module.exports = router;
