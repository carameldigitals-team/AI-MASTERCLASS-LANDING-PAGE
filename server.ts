import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Route for Waitlist (Wamation Proxy)
  app.post("/api/waitlist", async (req, res) => {
    try {
      console.log("Processing lead submission:", JSON.stringify(req.body));

      const formData = new URLSearchParams();
      for (const [key, value] of Object.entries(req.body)) {
        formData.append(key, String(value));
      }

      if (!formData.has("submit")) {
        formData.append("submit", "JOIN THE WAITLIST NOW");
      }

      const clientReferer = req.headers.referer || req.headers.origin || "https://carameldigitals.com";
      
      // Set browser-like headers. Hardcoding referer to the actual domain
      // often bypasses CRM security filters that block unknown origins.
      const targetDomain = "https://carameldigitals.com";
      const commonHeaders = {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Origin": targetDomain,
        "Referer": targetDomain + "/",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache"
      };

      // We prioritize /processor as seen in the user's HTML
      const endpoints = [
        "https://app.wamation.com.ng/processor",
        "https://app.wamation.com.ng/processor.php",
        "https://app.wamation.io/processor",
        "https://app.wamat.io/processor",
        "https://appv2.wamation.com.ng/processor"
      ];

      let lastError = null;
      let success = false;

      for (const endpoint of endpoints) {
        try {
          console.log(`Forwarding lead to ${endpoint}...`);
          const response = await axios.post(endpoint, formData.toString(), {
            headers: commonHeaders,
            timeout: 12000,
            validateStatus: () => true // Handle 3xx or 4xx manually for detail
          });
          
          const bodyPreview = String(response.data).toLowerCase();
          console.log(`Endpoint ${endpoint} returned status ${response.status}. Body length: ${bodyPreview.length}`);

          // Some endpoints return 200 but contain "error" in text
          if (response.status >= 200 && response.status < 400) {
            if (bodyPreview.includes("error") && bodyPreview.length < 500) {
              console.warn(`Potential error in response body from ${endpoint}: ${bodyPreview}`);
              lastError = new Error(`CRM returned success status but error message: ${bodyPreview}`);
              continue;
            }
            
            console.log(`Successful lead capture verified at ${endpoint}`);
            success = true;
            return res.json({ success: true, endpoint });
          } else {
            console.error(`Endpoint ${endpoint} failed with status ${response.status}. Body: ${bodyPreview.substring(0, 200)}`);
            lastError = new Error(`CRM returned status ${response.status}`);
          }
        } catch (err: any) {
          lastError = err;
          console.error(`Network error at ${endpoint}: ${err.message}`);
        }
      }

      if (!success) {
        throw lastError || new Error("All lead capture endpoints failed");
      }
    } catch (error: any) {
      console.error("Critical failure in Wamation proxy:", error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
