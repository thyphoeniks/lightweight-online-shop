const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All products",
      path: "/products"
    });
  });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId, product => {
    res.render("shop/product-details", {
      product: product,
      pageTitle: "Product Details",
      path: "/products"
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "My shop",
      path: "/"
    });
  });
};

exports.getCart = (req, res, next) => {
  Product.fetchAll(products => {
    const productsData = [];
    Cart.getCart(cart => {
      let productCartData;
      for (product of products) {
        productCartData = cart.products.find(p => p.id === product.id);
        if (productCartData) {
          productsData.push({ productData: product, qty: productCartData.qty });
        }
      }
      // console.log(productsData);
      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        products: productsData
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, prod => {
    Cart.addProduct(productId, prod.price);
    res.redirect("/cart");
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Orders",
    path: "/orders"
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout"
  });
};
