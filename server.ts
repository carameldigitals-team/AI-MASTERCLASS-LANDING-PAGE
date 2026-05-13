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
        
        // Exact field names and values from Wamation form
        data.set("name", req.body.name || "");
        data.set("email", req.body.email || `lead_${phone}@wamation.com`);
        data.set("wnopfx", pfx);
        data.set("waphone", useFullInWaphone ? full : phone);
        data.set("phone", full);
        data.set("wa_phone", full);
        data.set("zq", zqValue);
        data.set("fid", fidValue);
        data.set("pid", "");
        data.set("bumppid", "0");
        data.set("cid", "");
        data.set("usp", "0");
        data.set("grk", "");
        data.set("pvar", "");
        data.set("submit", "JOIN THE WAITLIST NOW");
        data.set("Submit", "JOIN THE WAITLIST NOW");
        
        return data;
      };

      const commonHeaders = {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Origin": "https://wamation.com.ng",
        "Connection": "keep-alive"
      };

      let lastError = null;
      let success = false;
      let capturedEndpoint = "";
      
      const configVariations = [
        { fid: "5f66a80141213", zq: "41213", full: false }, // Primary FID from hidden field
        { fid: "5f66a80141213", zq: "41213", full: true },  
        { fid: "6d241213", zq: "241213", full: false },     // FID from URL
        { fid: "6d241213", zq: "41213", full: false },      // Cross-match
        { fid: "6d241213", zq: "1213", full: false },       // Short ZQ
      ];

      for (const config of configVariations) {
        if (success) break;
        
        const formData = buildFormData(prefix, rawPhone, config.full, config.zq, config.fid);
        const currentPhone = formData.get("waphone");
        console.log(`[Lead Capture] Trying FID=${config.fid} | Phone=${currentPhone} | ZQ=${config.zq}`);

        const currentEndpoints = [
          "https://app.wamation.com.ng/processor",
          `https://wamation.com.ng/f.php/${config.fid}`,
          "https://wamation.com.ng/processor"
        ];

        for (const endpoint of currentEndpoints) {
          if (success) break;
          
          try {
            // Try both the specific fid referer and the general wamation referer
            const referer = endpoint.includes('f.php') ? endpoint : `https://wamation.com.ng/f.php/${config.fid}`;
            
            const response = await axios.post(endpoint, formData.toString(), {
              headers: {
                ...commonHeaders,
                "Referer": referer,
                "X-Requested-With": "XMLHttpRequest" // Some processors look for this
              },
              timeout: 8000, 
              validateStatus: () => true 
            });
            
            const body = String(response.data);
            const bodyLower = body.toLowerCase();
            console.log(`[${endpoint}] Status: ${response.status} (Body: ${body.length})`);

            // Check if captured by searching for common success keywords or redirects
            const isFailure = bodyLower.includes("not complete") || 
                              bodyLower.includes("invalid fid") ||
                              bodyLower.includes("fid mismatch") ||
                              (body.length < 500 && bodyLower.includes("error") && !bodyLower.includes("none"));

            if (response.status >= 200 && response.status < 400 && !isFailure) {
              console.log(`[SUCCESS] Lead captured at ${endpoint} with FID ${config.fid}`);
              success = true;
              capturedEndpoint = endpoint;
              break; 
            }
          } catch (err: any) {
            console.warn(`[FAIL] ${endpoint}: ${err.message}`);
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
