const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const chalk = require("chalk");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoute");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

const path = require("path");

const cors = require("cors");

//const bodyParser = require("body-parser");

const { getStoredItems, storeItems } = require("./data/items");

const app = express();

//-------------Server Log start

// Define a custom morgan token for the timestamp
morgan.token("timestamp", function () {
  return new Date().toISOString();
});

// Define a custom morgan token for colored status code
morgan.token("status-colored", function (req, res) {
  const status = res.statusCode;
  if (status >= 500) {
    return chalk.red(status); // Server error
  } else if (status >= 400) {
    return chalk.yellow(status); // Client error
  } else if (status >= 300) {
    return chalk.cyan(status); // Redirect
  } else if (status >= 200) {
    return chalk.green(status); // Success
  }
  return chalk.white(status);
});

// Define a custom morgan format that includes the timestamp and colored status code
const customFormat =
  ":timestamp :method :url :status-colored :response-time ms";

//-------------Server Log end

//configure env
dotenv.config();

//Database config
connectDB();

//PORT
const PORT = process.env.PORT || 8080;

//Enable cors
app.use(cors());

//middlewares

//app.use(bodyParser.json());
app.use(express.json()); //This middleware is built-in and simplifies the process by removing the need to use body-parser for JSON data

//app.use(morgan("dev")); //HTTP request Logger

//static files access
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Use the custom format in morgan middleware
app.use(morgan(customFormat));

//routes
app.use("/api/v1/auth", authRoutes);

//Category Routes
app.use("/api/v1/category", categoryRoutes);

//Product Routes
app.use("/api/v1/product", productRoutes);

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to Myntra Backend" });
// });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/items", async (req, res) => {
  const storedItems = await getStoredItems();
  //await new Promise((resolve, reject) => setTimeout(() => resolve(), 2000));
  res.json({ items: storedItems });
});

app.get("/items/:id", async (req, res) => {
  const storedItems = await getStoredItems();
  const item = storedItems.find((item) => item.id === req.params.id);
  res.json({ item });
});

app.post("/items", async (req, res) => {
  const existingItems = await getStoredItems();
  const itemData = req.body;
  const newItem = {
    ...itemData,
    id: Math.random().toString(),
  };
  const updatedItems = [newItem, ...existingItems];
  await storeItems(updatedItems);
  res.status(201).json({ message: "Stored new item.", item: newItem });
});

app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode and on port : ${PORT}`
  );
});
