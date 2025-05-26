const mongoose = require("mongoose");

// Define the schema for the shortened URL
const urlSchema = new mongoose.Schema({
  shortCode: { 
    type: String, 
    required: true, 
    unique: true // Ensures that each short code is unique
  },
  longUrl: { 
    type: String, 
    required: true 
  },
  userId: { 
    type: String, 
    default: null // For guest users, or if you decide to link URLs to users
  },
  isPublic: { 
    type: Boolean, 
    default: true 
  },
  isCustom: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  expiresAt: { 
    type: Date, 
    default: null // Optional expiration date for the shortened URL
  },
  clicks: { 
    type: Number, 
    default: 0 // Counts the number of times the shortened URL is clicked
  },
  status: { 
    type: String, 
    default: "active", // status can be 'active', 'inactive', etc.
  }
});

// Create the model based on the schema
const modelUrl = mongoose.model("Url", urlSchema);

module.exports = modelUrl;
