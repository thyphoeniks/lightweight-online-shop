const mongoose = require("mongoose");
const mongodb = require("mongodb");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  }
});

userSchema.methods.addToCart = function(product) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  let cartProductItems = [...this.cart.items];
  if (cartProductIndex >= 0) {
    newQuantity = newQuantity + 1;
    cartProductItems[cartProductIndex].quantity = newQuantity;
  } else {
    cartProductItems.push({
      productId: product._id,
      quantity: newQuantity
    });
  }
  const updatedCart = { items: cartProductItems };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.deleteFromCart = function(prodId) {
  const updatedCartItems = this.cart.items.filter(i => {
    return i.productId.toString() !== prodId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearTheCart = function() {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
