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
        
        // Use provided names or fallback to placeholders
        const rawName = req.body.name || "";
        const firstName = req.body.firstname || req.body.fname || rawName.split(' ')[0] || "";
        const lastName = req.body.lastName || (rawName.includes(' ') ? rawName.split(' ').slice(1).join(' ') : "");

        // Exact field names found across various Wamation templates
        data.set("name", rawName);
        data.set("fname", firstName);
        data.set("firstname", firstName);
        data.set("first_name", firstName);
        data.set("lname", lastName);
        data.set("lastname", lastName);
        data.set("last_name", lastName);
        data.set("wnopfx", pfx);
        data.set("waphone", useFullInWaphone ? full : phone);
        data.set("phone", full);
        data.set("wa_phone", full);
        
        // Ensure email is set to a valid placeholder if missing; CRM integrations often require it
        data.set("email", req.body.email || `lead_${phone}@wamation.com`);

        data.set("zq", zqValue);
        data.set("fid", fidValue);
        
        // Relational fields found in Wamation HTML
        data.set("pid", fidValue);
        data.set("bumppid", req.body.bumppid || "0");
        data.set("cid", req.body.cid || "");
        data.set("usp", req.body.usp || "0");
        data.set("grk", req.body.grk || "");
        data.set("pvar", req.body.pvar || "");
        
        // Submission markers
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
        "Connection": "keep-alive",
        "Cache-Control": "max-age=0"
      };

      let lastError = null;
      let success = false;
      let capturedEndpoint = "";
      
      const configVariations = [
        { fid: "6d241213", full: true },      
        { fid: "6d241213", full: false },     
        { fid: "5f66a80141213", full: true },  
      ];

      for (const config of configVariations) {
        if (success) break;
        
        // Try to scrape exact ZQ from the form page first
        let zqValue = (config.fid === "6d241213") ? "241213" : "41213"; // Defaults
        try {
          const formPage = await axios.get(`https://wamation.com.ng/f.php/${config.fid}`, {
            headers: { "User-Agent": commonHeaders["User-Agent"] },
            timeout: 5000
          });
          const zqMatch = formPage.data.match(/name=["']zq["']\s+value=["'](.*?)["']/i);
          const fidMatch = formPage.data.match(/name=["']fid["']\s+value=["'](.*?)["']/i);
          
          if (zqMatch && zqMatch[1]) {
            zqValue = zqMatch[1];
            console.log(`[SCRAPE] Found ZQ=${zqValue} for FID=${config.fid}`);
          }
          
          let effectiveFid = config.fid;
          if (fidMatch && fidMatch[1]) {
            effectiveFid = fidMatch[1];
            console.log(`[SCRAPE] Found internal FID=${effectiveFid} on page for ${config.fid}`);
          }

          const formData = buildFormData(prefix, rawPhone, config.full, zqValue, effectiveFid);
          const currentPhone = formData.get("waphone");
          console.log(`[Lead Capture] Trying FID=${effectiveFid} | Phone=${currentPhone} | ZQ=${zqValue}`);

          const currentEndpoints = [
            "https://app.wamation.com.ng/processor",
            "https://wamation.com.ng/processor",
            "https://wamation.com.ng/f.php/processor"
          ];

          for (const endpoint of currentEndpoints) {
            if (success) break;
            
            try {
              // Referer is absolutely critical for Wamation
              const referer = `https://wamation.com.ng/f.php/${config.fid}`;
              
              const response = await axios.post(endpoint, formData.toString(), {
                headers: {
                  ...commonHeaders,
                  "Referer": referer,
                  "Upgrade-Insecure-Requests": "1"
                },
                timeout: 10000, 
                validateStatus: () => true 
              });
              
              const body = String(response.data);
              const bodyLower = body.toLowerCase();
              
              // Check for success or specific redirect
              const isError = bodyLower.includes("not complete") || 
                              bodyLower.includes("invalid fid") ||
                              bodyLower.includes("fid mismatch") ||
                              (body.length < 1000 && bodyLower.includes("error") && !bodyLower.includes("welcome"));

              if ((response.status >= 200 && response.status < 400) && !isError) {
                const weHaveSuccessMessage = bodyLower.includes("success") || 
                                           bodyLower.includes("congratulations") || 
                                           bodyLower.includes("welcome") ||
                                           bodyLower.includes("received");
                
                if (response.status === 302 || weHaveSuccessMessage || body.length > 5000) {
                   console.log(`[SUCCESS] Lead captured at ${endpoint} with FID ${effectiveFid}`);
                   success = true;
                   capturedEndpoint = endpoint;
                   break;
                }
              }
              
              if (isError) {
                console.warn(`[REJECTED] ${endpoint} for FID ${effectiveFid}: Error detected`);
              }
            } catch (err: any) {
              console.warn(`[TIMEOUT/ERROR] ${endpoint} for FID ${effectiveFid}: ${err.message}`);
            }
          }
        } catch (e) {
          console.warn(`[SCRAPE-FAIL] Error during attempt for FID ${config.fid}: ${e.message}`);
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
