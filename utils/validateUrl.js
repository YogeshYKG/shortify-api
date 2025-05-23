const fetch = require("node-fetch");

const isUrlReachable = async (url) => {
  try {
    console.log("Checking:", url);

    let res = await fetch(url, {
      method: "HEAD",
      timeout: 8000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Node.js)"
      },
    });

    console.log("HEAD status:", res.status, res.statusText);

    // Try GET if HEAD is not OK
    if (!res.ok || res.status === 405) {
      res = await fetch(url, {
        method: "GET",
        timeout: 8000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Node.js)"
        },
      });

      console.log("GET status:", res.status, res.statusText);
    }

    return res.ok;
  } catch (error) {
    console.error("❌ Exception during fetch:", error.name, error.message);
    return false;
  }
};

module.exports = { isUrlReachable };
