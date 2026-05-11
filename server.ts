import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";

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

      const primaryFid = "5f66a80141213";
      const secondaryFid = req.body.fid || "6d241213";
      
      // Extract components for mutation
      const prefix = req.body.wnopfx || "234";
      let rawPhone = String(req.body.waphone || req.body.phone || "").replace(/\D/g, "");
      
      // Basic normalization
      if (rawPhone.startsWith(prefix)) {
        rawPhone = rawPhone.substring(prefix.length);
      }
      if (rawPhone.startsWith("0")) {
        rawPhone = rawPhone.substring(1);
      }

      const buildFormData = (pfx: string, phone: string, useFullInWaphone: boolean, zqValue: string, fidValue: string) => {
        const data = new URLSearchParams();
        const full = pfx + phone;
        
        for (const [key, value] of Object.entries(req.body)) {
          // Skip email if it was originally empty to keep it clean
          if (key === 'email' && !value) continue;
          data.append(key, String(value));
        }
        
        // Overwrite with normalized/specific values
        data.set("wnopfx", pfx);
        data.set("waphone", useFullInWaphone ? full : phone);
        data.set("phone", full);
        data.set("wa_phone", full);
        data.set("zq", zqValue);
        data.set("fid", fidValue);
        data.set("submit", "JOIN THE WAITLIST NOW");
        
        return data;
      };

      const commonHeaders = {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Origin": "https://wamation.com.ng",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache"
      };

      const endpoints = [
        "https://app.wamation.com.ng/processor", // Primary
        "https://wamation.com.ng/processor",     // Mirror
        "https://wamation.com.ng/f.php/processor" // Legacy Mirror
      ];

      let lastError = null;
      let success = false;
      let capturedEndpoint = "";
      
      // Prioritize "Split Mode" (phone without prefix) + Primary FID (from HTML)
      // This most closely mimics the actual form submission that triggers automation.
      const configs = [
        { fid: primaryFid, zq: "41213", full: false }, // Split mode - Most likely for automation
        { fid: primaryFid, zq: "41213", full: true },  // Full mode backup
        { fid: secondaryFid, zq: "241213", full: false },
        { fid: secondaryFid, zq: "241213", full: true },
      ];

      for (const config of configs) {
        if (success) break;
        
        const formData = buildFormData(prefix, rawPhone, config.full, config.zq, config.fid);
        const currentPhone = formData.get("waphone");
        console.log(`Trying Config: FID=${config.fid} ZQ=${config.zq} waphone=${currentPhone}`);

        for (const endpoint of endpoints) {
          if (success) break;
          
          try {
            const response = await axios.post(endpoint, formData.toString(), {
              headers: {
                ...commonHeaders,
                "Referer": "https://wamation.com.ng/f.php/6d241213"
              },
              timeout: 10000, 
              validateStatus: () => true 
            });
            
            const bodyPreview = String(response.data).toLowerCase();
            console.log(`[${endpoint}] Result: ${response.status} (Len: ${bodyPreview.length})`);

            if (response.status >= 200 && response.status < 400) {
              const isError = bodyPreview.length < 800 && 
                              (bodyPreview.includes("error") || 
                               bodyPreview.includes("not complete") || 
                               bodyPreview.includes("invalid"));

              if (isError) {
                lastError = new Error(`CRM Error: ${bodyPreview.substring(0, 150)}`);
                continue; 
              }
              
              success = true;
              capturedEndpoint = endpoint;
              break; 
            } else {
              lastError = new Error(`Status ${response.status}`);
            }
          } catch (err: any) {
            lastError = err;
            console.warn(`Connection to ${endpoint} failed: ${err.message}`);
          }
        }
      }

      if (success) {
        return res.json({ success: true, endpoint: capturedEndpoint });
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
    
    // Explicitly handle index.html in dev mode if middleware skips it
    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = await fs.readFileSync(path.resolve(__dirname, "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
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
