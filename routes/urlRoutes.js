const express = require("express");
const router = express.Router();

const { validateUrlHandler, shortifyUrlHandler } = require("../controllers/urlController");


router.post("/validateUrl", validateUrlHandler);
router.post("/shortifyUrl", shortifyUrlHandler);

module.exports = router;
