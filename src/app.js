const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
// import error middleware
const error_middleware = require("./middlewares/error-middleware");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const helmet = require("helmet");
const app = express();
// import cors option
const { corsAllRequest, corsRequest } = require("./utils/cors-option");
const { sequelize } = require("./repository/database/models");
// import logger
const logger = require("./utils/logger-winston");

// Check connection database
const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Connection to database has been established successfully");
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};
connectDatabase();

app.options("*", corsAllRequest);
app.use(cookieParser());
app.use(morgan("combined", { stream: logger.stream }));
app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// router mocks data generate
const mock_routes = require("./routes/generate-mock-routes");
app.use("/api", corsRequest, mock_routes);

// router list products
const product_routes = require("./routes/product-routes");
app.use("/api/product", corsRequest, product_routes);

// router list category
const category_routes = require("./routes/category-router");
app.use("/api/category", corsRequest, category_routes);

// router auth
const auth_routes = require("./routes/auth-routes");
app.use("/api/auth", corsRequest, auth_routes);

// router user
const user_routes = require("./routes/user-routes");
app.use("/api/user", corsRequest, user_routes);

// router admin
const category_routes_admin = require("./routes/admin/category-routes");
app.use("/api/admin", corsRequest, category_routes_admin);

const product_routes_admin = require("./routes/admin/product-routes");
app.use("/api/admin", corsRequest, product_routes_admin);

const roles_routes_admin = require("./routes/admin/roles-routes");
app.use("/api/admin", corsRequest, roles_routes_admin);

const store_routes_admin = require("./routes/admin/store-routes");
app.use("/api/admin", corsRequest, store_routes_admin);

const user_routes_admin = require("./routes/admin/user-routes");
app.use("/api/admin", corsRequest, user_routes_admin);

const checkout_routes_admin = require("./routes/admin/checkout-routes");
app.use("/api/admin", corsRequest, checkout_routes_admin);

// router customer
const cart_routes = require("./routes/customer/cart-routes");
app.use("/api/customer", corsRequest, cart_routes);

const checkout_routes = require("./routes/customer/checkout-routes");
app.use("/api/customer", corsRequest, checkout_routes);

const store_routes = require("./routes/seller/store-routes");
app.use("/api/seller", corsRequest, store_routes);

const sellerProduct_routes = require("./routes/seller/product-routes");
app.use("/api/seller", corsRequest, sellerProduct_routes);

const sellerOrder_routes = require("./routes/seller/order-routes");
app.use("/api/seller", corsRequest, sellerOrder_routes);

// use error middleware
app.use(error_middleware);

module.exports = app;
