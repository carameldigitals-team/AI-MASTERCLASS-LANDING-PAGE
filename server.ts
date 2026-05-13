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

      const fids = ["5f66a80141213", "6d241213"];
      
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
        data.set("Submit", "JOIN THE WAITLIST NOW");
        if (!data.has("email")) data.set("email", "");
        
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

      const baseEndpoints = [
        "https://app.wamation.com.ng/processor", 
        "https://wamation.com.ng/processor",
        "https://wamation.com.ng/f.php/processor"
      ];

      let lastError = null;
      let success = false;
      let capturedEndpoint = "";
      
      // Configurations to try
      const configVariations = [
        { fid: "5f66a80141213", zq: "41213", full: false }, // Direct matched config (Split phone)
        { fid: "5f66a80141213", zq: "41213", full: true },  // Full phone version
        { fid: "6d241213", zq: "41213", full: false },      // Cross-match FID/ZQ
        { fid: "6d241213", zq: "241213", full: false },     // Original known FID/ZQ
      ];

      for (const config of configVariations) {
        if (success) break;
        
        const formData = buildFormData(prefix, rawPhone, config.full, config.zq, config.fid);
        // Ensure email is set to a placeholder if missing, some CRM integrations require it for indexing
        if (!formData.get("email")) {
          formData.set("email", `lead_${rawPhone}@wamation.com`);
        }
        const currentPhone = formData.get("waphone");
        console.log(`Trying Config: FID=${config.fid} ZQ=${config.zq} waphone=${currentPhone}`);

        // Prioritize the direct f.php endpoint as it's most likely to trigger automation
        const currentEndpoints = [
          `https://wamation.com.ng/f.php/${config.fid}`,
          "https://app.wamation.com.ng/processor",
          "https://wamation.com.ng/processor"
        ];

        for (const endpoint of currentEndpoints) {
          if (success) break;
          
          try {
            const referer = `https://wamation.com.ng/f.php/${config.fid}`;
            const response = await axios.post(endpoint, formData.toString(), {
              headers: {
                ...commonHeaders,
                "Referer": referer
              },
              timeout: 7000, // Faster timeout per request
              validateStatus: () => true 
            });
            
            const bodyPreview = String(response.data).toLowerCase();
            console.log(`[${endpoint}] FID:${config.fid} -> ${response.status}`);

            // If we get a 200-399, it likely worked or it's an "Already Registered" message
            if (response.status >= 200 && response.status < 400) {
              // Only treat it as a hard error if it explicitly says something is missing/invalid
              const isHardError = bodyPreview.length < 500 && 
                                 (bodyPreview.includes("not complete") || 
                                  bodyPreview.includes("invalid fid"));

              if (isHardError) {
                lastError = new Error(`CRM rejected: ${bodyPreview.substring(0, 100)}`);
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
