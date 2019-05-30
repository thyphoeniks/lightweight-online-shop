const Sequelize = require("sequelize");

const sequelize = new Sequelize("online-shop", "root", "onlineshop", {
  dialect: "mysql",
  host: "localhost"
});

module.exports = sequelize;
