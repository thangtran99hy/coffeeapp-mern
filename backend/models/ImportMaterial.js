const mongoose = require("mongoose");

const importMaterialSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  totalPrice: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  import: [
    {
      material: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Material",
      },
      amount: Number,
      priceperunit: Number,
    },
  ],
});
importMaterialSchema.set("timestamps", true);
module.exports = mongoose.model("ImportMaterial", importMaterialSchema);
