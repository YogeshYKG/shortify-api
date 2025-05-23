const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const urlRoutes = require("./routes/urlRoutes");

dotenv.config();
const app = express();

app.use(express.json());

const allowedOrigins = ["http://localhost:3000"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  credentials: true
};

app.use(cors(corsOptions));

// Mount the route directly at / (not /validateUrl)
app.use("/", urlRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server Running on Port : ${PORT}`);
});
