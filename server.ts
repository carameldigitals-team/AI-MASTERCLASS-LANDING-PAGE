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
      
      const commonHeaders = {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Origin": new URL(clientReferer).origin,
        "Referer": clientReferer
      };

      // We prioritize /processor as seen in the user's HTML
      // Fallbacks cover common domain variations for this CRM
      const endpoints = [
        "https://app.wamation.com.ng/processor",
        "https://app.wamation.com.ng/processor.php",
        "https://app.wamation.io/processor",
        "https://app.wamat.io/processor"
      ];

      let lastError = null;
      for (const endpoint of endpoints) {
        try {
          console.log(`Attempting Wamation endpoint: ${endpoint}`);
          const response = await axios.post(endpoint, formData.toString(), {
            headers: commonHeaders,
            timeout: 10000,
          });
          
          if (response.status >= 200 && response.status < 400) {
            console.log(`Success at ${endpoint}. Status: ${response.status}`);
            // Check if the response body contains error indicators (some endpoints return 200 with error text)
            const bodyPreview = String(response.data).toLowerCase();
            if (bodyPreview.includes("error") && bodyPreview.length < 500) {
              console.warn(`Endpoint returned 200 but body contains "error": ${bodyPreview.substring(0, 100)}`);
              // We don't return yet, try next endpoint if this looks like a generic error page
            } else {
              return res.json({ success: true, endpoint });
            }
          }
        } catch (err: any) {
          lastError = err;
          const status = err.response?.status;
          const data = err.response?.data ? JSON.stringify(err.response.data).substring(0, 200) : "No data";
          console.error(`Failed at ${endpoint}: [${status}] ${err.message}. Response: ${data}`);
        }
      }

      throw lastError || new Error("All Wamation endpoints failed");
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
