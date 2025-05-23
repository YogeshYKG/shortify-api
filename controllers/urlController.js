const { checkUrlStatus } = require("../utils/checkUrlStatus");

exports.validateUrlHandler = async (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({code: 400, error: "URL is required" });

  const result = await checkUrlStatus(url);

  if (result.status === 200) {
    return res.status(200).json({ code: 200, message: result.message });
  }

  return res.status(400).json({ code: 400, error: result.message });
};
