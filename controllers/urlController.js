const {isUrlReachable} = require("../utils/validateUrl");

exports.validateUrlHandler = async (req, res) => {
  const { url } = req.body;
  
  
  if (!url) return res.status(400).json({ error: "URL is required" });

  const isValid = await isUrlReachable(url);
  if (isValid) return res.sendStatus(200);
  
  return res.status(400).json({ error: "URL is not reachable" });
};

 