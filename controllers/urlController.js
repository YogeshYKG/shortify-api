const {
  checkUrlStatus,
  checkIfUrlShorted,
} = require("../utils/checkUrlStatus");
const { createShortUrl } = require("../utils/createShortUrl");
exports.validateUrlHandler = async (req, res) => {

  const { url } = req.body;

  if (!url)
    return res.status(400).json({ code: 400, error: "URL is required" });

  const result = await checkUrlStatus(url);

  if (result.status === 200) {
    return res.status(200).json({ code: 200, message: result.message });
  }

  return res.status(400).json({ code: 400, error: result.message });
};

exports.shortifyUrlHandler = async (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ code: 400, error: "URL is required" });
  }

  try {
    const { shortedUrlStatus, shortUrl } = await checkIfUrlShorted(longUrl);

    if (shortedUrlStatus === "inDatabase") {
      return res.status(200).json({ shortUrl, message: "URL already shortened" });
    }

    if (
      shortedUrlStatus === "NotFound" ||
      shortedUrlStatus === "NotPublic" ||
      shortedUrlStatus === "Error"
    ) {
      const shortUrl = await createShortUrl(longUrl);
      return res.status(201).json({ shortUrl, message: "Short URL created" });
    }
  } catch (error) {
    console.error("Shortify handler error:", error);
    return res.status(500).json({ code: 500, error: "Server error" });
  }
};
