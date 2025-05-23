const fetch = require("node-fetch");
const dns = require("dns").promises;
const { URL } = require("url");

const checkUrlStatus = async (inputUrl) => {
  let url;

  // 1. Validate URL
  try {
    url = new URL(inputUrl);
  } catch (e) {
    return { status: 400, message: "Invalid URL" };
  }

  // 2. Check if domain is reachable via DNS lookup
  try {
    await dns.lookup(url.hostname);
  } catch (e) {
    return { status: 400, message: "Unreachable Domain" };
  }

  // 3. Try HEAD and GET to determine full URL reachability
  try {
    const headers = { "User-Agent": "Mozilla/5.0 (Node.js)" };

    // Try HEAD first
    let response = await fetch(url.href, {
      method: "HEAD",
      timeout: 8000,
      headers,
    });

    if (!response.ok || response.status === 405) {
      // Fallback to GET
      response = await fetch(url.href, {
        method: "GET",
        timeout: 8000,
        headers,
      });
    }

    if (!response.ok) {
      return {
        status: 400,
        message: "URL is private or has CORS restrictions",
      };
    }

    return { status: 200, message: "✅ All green - Valid and Reachable URL" };
  } catch (e) {
    return {
      status: 400,
      message: "URL is private or has CORS restrictions",
    };
  }
};

module.exports = { checkUrlStatus };
