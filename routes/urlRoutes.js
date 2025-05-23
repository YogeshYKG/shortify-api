const express = require("express");
const router = express.Router();

const { validateUrlHandler } = require("../controllers/urlController");
router.post("/validate", validateUrlHandler);

module.exports = router;
