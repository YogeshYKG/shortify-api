const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

const urlRoutes = require("./routes/urlRoutes");

dotenv.config();
const app = express();

app.use(express.json());

const allowedOrigins = ["http://localhost:3001"];

// cors SetUp
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

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/shortify_dev";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));


// Mount the route directly at / (not /validateUrl)
app.use("/", urlRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server Running on Port : ${PORT}`);
});
