/**
 * checkUrlStatus.js
 * -----------------
 * This module provides utilities for validating and checking the status of a URL.
 *
 * Function Index:
 *
 * - checkUrlStatus(inputUrl)
 *     → Main orchestrator function that validates the input URL, checks DNS, and confirms HTTP accessibility.
 *
 * - checkIfUrlShorted(inputLongUrl)
 *     → Placeholder for checking if a given long URL has already been shortened (to be implemented).
 *
 * - isValidUrl(inputUrl)
 *     → Validates whether the provided string is a syntactically valid URL.
 *
 * - isReachableDomain(urlObj)
 *     → Performs DNS lookup to confirm if the domain is resolvable.
 *
 * - isUrlPubliclyAccessible(urlObj)
 *     → Attempts to reach the URL using HTTP (via HEAD/GET) to confirm it is publicly accessible.
 */

const fetch = require("node-fetch");
const dns = require("dns").promises;
const { URL } = require("url");
const modelUrl = require("../models/Url");
const checkUrlStatus = async (inputUrl) => {
  const { isValid, url, message: validationMsg } = isValidUrl(inputUrl);
  if (!isValid) return { status: 400, message: validationMsg };

  const dnsResult = await isReachableDomain(url);
  if (!dnsResult.isReachable)
    return { status: 400, message: dnsResult.message };

  const accessResult = await isUrlPubliclyAccessible(url);
  if (!accessResult.accessible)
    return { status: 400, message: accessResult.message };

  return { status: 200, message: "✅ All green - Valid and Reachable URL" };
};

// Function to check if the long URL exists and meets conditions (public and active)
const checkIfUrlShorted = async (inputLongUrl) => {
  try {
    const url = await modelUrl.findOne({ longUrl: inputLongUrl });

    if (!url) {
      return { shortedUrlStatus: "NotFound", shortUrl: null };
    }

    if (!url.isPublic) {
      return { shortedUrlStatus: "NotPublic", shortUrl: null };
    }
    return { shortedUrlStatus: "inDatabase", shortUrl: url.shortCode };
  } catch (error) {
    console.error("Error checking URL:", error);
    return "Error";
  }
};

const fetchShortUrl = async (shortCode) => {
  try {
    console.log("Shortened URL:", shortUrl);
    return shortUrl;
  } catch (error) {
    console.error("Error fetching short URL:", error);
    return "Error";
  }
};

const isValidUrl = (inputUrl) => {
  try {
    return { isValid: true, url: new URL(inputUrl) };
  } catch {
    return { isValid: false, message: "Invalid URL" };
  }
};

const isReachableDomain = async (urlObj) => {
  try {
    await dns.lookup(urlObj.hostname);
    return { isReachable: true };
  } catch {
    return { isReachable: false, message: "Unreachable Domain" };
  }
};

const isUrlPubliclyAccessible = async (urlObj) => {
  try {
    const headers = { "User-Agent": "Mozilla/5.0 (Node.js)" };

    let response = await fetch(urlObj.href, {
      method: "HEAD",
      timeout: 8000,
      headers,
    });

    if (!response.ok || response.status === 405) {
      response = await fetch(urlObj.href, {
        method: "GET",
        timeout: 8000,
        headers,
      });
    }

    if (!response.ok) {
      return {
        accessible: false,
        message: "URL is private or has CORS restrictions",
      };
    }

    return { accessible: true };
  } catch {
    return {
      accessible: false,
      message: "URL is private or has CORS restrictions",
    };
  }
};

module.exports = {
  checkUrlStatus,
  checkIfUrlShorted,
  isValidUrl,
  isReachableDomain,
  isUrlPubliclyAccessible,
};
