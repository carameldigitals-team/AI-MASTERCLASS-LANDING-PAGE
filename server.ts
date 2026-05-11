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

      const fid = req.body.fid || "6d241213";
      // Theory: zq might be 41213 (historical) or 241213 (suffix of current fid)
      const zqVariants = ["41213", "241213"];
      
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

      const buildFormData = (pfx: string, phone: string, useFullInWaphone: boolean, zqValue: string) => {
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
        data.set("fid", fid);
        if (!data.has("submit")) data.set("submit", "JOIN THE WAITLIST NOW");
        
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
        `https://wamation.com.ng/f.php/${fid}`,
        `https://wamation.com.ng/f.php/processor`,
        `https://wamation.com.ng/processor?fid=${fid}`,
        "https://wamation.com.ng/processor",
        "https://app.wamation.com.ng/processor"
      ];

      let lastError = null;
      let success = false;
      let capturedEndpoint = "";
      
      // We'll iterate through ZQ variants, then phone formats, then endpoints
      for (const zqVal of zqVariants) {
        if (success) break;
        
        const dataVariations = [
          buildFormData(prefix, rawPhone, false, zqVal),
          buildFormData(prefix, rawPhone, true, zqVal)
        ];

        for (const formData of dataVariations) {
          if (success) break;
          
          const currentPhoneFormat = formData.get("waphone");
          console.log(`Testing ZQ: ${zqVal} | Phone Format: ${currentPhoneFormat}`);

          for (const endpoint of endpoints) {
            if (success) break;
            
            for (let attempt = 1; attempt <= 2; attempt++) {
              try {
                const response = await axios.post(endpoint, formData.toString(), {
                  headers: {
                    ...commonHeaders,
                    "Referer": endpoint.includes('f.php') ? endpoint : "https://wamation.com.ng/"
                  },
                  timeout: 12000,
                  validateStatus: () => true 
                });
                
                const bodyPreview = String(response.data).toLowerCase();
                console.log(`[${endpoint}] ZQ:${zqVal} Fmt:${currentPhoneFormat} (A${attempt}) -> Status ${response.status}`);

                if (response.status >= 200 && response.status < 400) {
                  const isError = bodyPreview.length < 700 && 
                                  (bodyPreview.includes("error") || 
                                   bodyPreview.includes("not complete") || 
                                   bodyPreview.includes("invalid"));

                  if (isError) {
                    lastError = new Error(`CRM Error: ${bodyPreview.substring(0, 150)}`);
                    console.warn(`CRM reported error: ${bodyPreview.substring(0, 150)}`);
                    break; // Try next format
                  }
                  
                  success = true;
                  capturedEndpoint = endpoint;
                  break; 
                } else {
                  lastError = new Error(`Status ${response.status}`);
                }
              } catch (err: any) {
                lastError = err;
                if (attempt === 1) await new Promise(r => setTimeout(r, 300));
              }
            }
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
