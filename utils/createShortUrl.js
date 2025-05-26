const { nanoid } = require("nanoid");
const Url = require("../models/Url");

const createShortUrl = async (longUrl) => {
  try {
    const shortCode = nanoid(6); // Generates a unique 6-character code
    const newUrl = new Url({
      shortCode,
      longUrl,
      isPublic: true,
      isCustom: false,
      createdAt: new Date(),
      expiresAt: null,
      clicks: 0,
      status: "active"
    });

    await newUrl.save();
    return shortCode;
  } catch (error) {
    console.error("Error creating short URL:", error);
    throw new Error("Failed to create short URL");
  }
};

module.exports = { createShortUrl };
