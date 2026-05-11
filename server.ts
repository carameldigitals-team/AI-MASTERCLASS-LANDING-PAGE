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

      // Priority endpoints based on historical stability
      const endpoints = [
        "https://app.wamation.com.ng/processor",
        "https://app.wamation.com.ng/processor.php",
        "https://app.wamation.io/processor",
        "https://appv2.wamation.com.ng/processor",
        "https://app.wamat.io/processor",
        "https://wamation.com.ng/processor",
        `https://app.wamation.com.ng/processor?fid=${req.body.fid || "5f66a80141213"}`
      ];

      let lastError = null;
      let success = false;
      let capturedEndpoint = "";

      for (const endpoint of endpoints) {
        // Retry logic: attempt each endpoint up to 2 times
        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            console.log(`[Attempt ${attempt}] Forwarding lead to ${endpoint}...`);
            const response = await axios.post(endpoint, formData.toString(), {
              headers: commonHeaders,
              timeout: 15000, // Increased timeout 
              validateStatus: () => true 
            });
            
            const bodyPreview = String(response.data).toLowerCase();
            console.log(`Endpoint ${endpoint} (Attempt ${attempt}) returned status ${response.status}. Body length: ${bodyPreview.length}`);

            // Wamation often returns 200/302 even for some failures, but usually a small body with "error" is bad
            // If it redirects (302) it's almost always a success in their architecture
            if ((response.status >= 200 && response.status < 400)) {
              // Check if body specifically indicates a failure (usually small bodies < 300 chars)
              if (bodyPreview.includes("error") && bodyPreview.length < 500 && !bodyPreview.includes("success")) {
                console.warn(`Potential error in response body from ${endpoint}: ${bodyPreview.substring(0, 200)}`);
                lastError = new Error(`CRM body error: ${bodyPreview.substring(0, 100)}`);
                continue; // Try next attempt or endpoint
              }
              
              console.log(`Successful lead capture verified at ${endpoint}`);
              success = true;
              capturedEndpoint = endpoint;
              break; // Success! Break out of attempts
            } else {
              console.error(`Endpoint ${endpoint} failed with status ${response.status}`);
              lastError = new Error(`Status ${response.status}`);
            }
          } catch (err: any) {
            lastError = err;
            console.error(`Network error at ${endpoint} (Attempt ${attempt}): ${err.message}`);
            // Wait a moment before retry
            if (attempt === 1) await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
        
        if (success) {
          return res.json({ success: true, endpoint: capturedEndpoint });
        }
      }

      if (!success) {
        console.error("All lead capture attempts failed. Final error:", lastError?.message);
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
