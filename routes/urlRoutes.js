const express = require("express");
const router = express.Router();

const { validateUrlHandler } = require("../controllers/urlController");
router.post("/validateUrl", validateUrlHandler);

module.exports = router;
