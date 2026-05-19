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

  // Helper to extract all input field defaults from the Wamation form HTML
  const extractHiddenFields = (html: string) => {
    const fields: Record<string, string> = {};
    const inputMatches = html.match(/<input\s+[^>]*>/gi) || [];
    for (const match of inputMatches) {
      const nameMatch = match.match(/name=["']([^"']+)["']/i);
      const valueMatch = match.match(/value=["']([^"']*)["']/i);
      if (nameMatch) {
        const name = nameMatch[1];
        const value = valueMatch ? valueMatch[1] : "";
        fields[name] = value;
      }
    }
    return fields;
  };

  // Helper to extract form action attribute
  const extractFormAction = (html: string) => {
    const actionMatch = html.match(/<form[^>]+action=["']([^"']+)["']/i);
    return actionMatch ? actionMatch[1] : "";
  };

  // API Route for Waitlist (Wamation Proxy)
  app.post("/api/waitlist", async (req, res) => {
    try {
      console.log("Processing lead submission:", JSON.stringify(req.body));

      const targetFid = req.body.fid || "6d241213";
      const prefix = req.body.wnopfx || "234";
      let rawPhone = String(req.body.waphone || req.body.phone || "").replace(/\D/g, "");
      
      // Basic phone normalization
      if (rawPhone.startsWith(prefix)) {
        rawPhone = rawPhone.substring(prefix.length);
      }
      if (rawPhone.startsWith("0")) {
        rawPhone = rawPhone.substring(1);
      }

      const commonHeaders = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Connection": "keep-alive"
      };

      // 1. Fetch form HTML dynamically to pull correct internal "fid", "zq" and the crucial PHPSESSID cookie!
      let parsedFields: Record<string, string> = {};
      let phpSessionCookie = "";
      let scrapedAction = "";
      try {
        console.log(`[SCRAPE] Fetching dynamic form structure for FID ${targetFid}...`);
        const formPage = await axios.get(`https://wamation.com.ng/f.php/${targetFid}`, {
          headers: commonHeaders,
          timeout: 6000
        });
        
        parsedFields = extractHiddenFields(formPage.data);
        scrapedAction = extractFormAction(formPage.data);

        const setCookie = formPage.headers["set-cookie"];
        if (setCookie) {
          for (const cookie of setCookie) {
            if (cookie.includes("PHPSESSID")) {
              phpSessionCookie = cookie.split(";")[0];
              break;
            }
          }
        }
        console.log(`[SCRAPE SUCCESS] Active fields extracted. Session Cookie: [${phpSessionCookie}], Custom Action: [${scrapedAction}]`);
      } catch (err: any) {
        console.warn(`[SCRAPE FALLBACK] Failed to scrape: ${err.message}. Using absolute known fallbacks for ${targetFid}.`);
      }

      // 2. Set accurate default values in case scrape failed or was incomplete
      const finalFid = parsedFields["fid"] || (targetFid === "6d241213" ? "5f66a80141213" : targetFid);
      const finalZq = parsedFields["zq"] || (targetFid === "6d241213" ? "41213" : "41213");
      const finalPid = parsedFields["pid"] || "";
      const finalBumppid = parsedFields["bumppid"] || "0";
      const finalCid = parsedFields["cid"] || "";
      const finalUsp = parsedFields["usp"] || "0";
      const finalGrk = parsedFields["grk"] || "";
      const finalPvar = parsedFields["pvar"] || "";

      // 3. Prepare name parameters
      const rawName = req.body.name || "";
      const firstName = req.body.firstname || req.body.fname || rawName.split(" ")[0] || "";
      const lastName = req.body.lastName || (rawName.includes(" ") ? rawName.split(" ").slice(1).join(" ") : "");

      // 4. Try both Split Phone and Full Phone payload styles across standard Wamation endpoints to ensure capture!
      const submissionVariations = [
        { fullPhone: false }, // Variation A: split phone format (waphone=803..., wnopfx=234)
        { fullPhone: true }   // Variation B: full phone format (waphone=234803..., wnopfx=234)
      ];

      // Build endpoints list dynamically, placing the scraped form action first
      const processorEndpoints: string[] = [];
      if (scrapedAction && scrapedAction.startsWith("http")) {
        processorEndpoints.push(scrapedAction);
      }
      processorEndpoints.push(
        "https://app.wamation.com.ng/processor",
        "https://wamation.com.ng/processor",
        "https://wamation.com.ng/f.php/processor"
      );

      let success = false;
      let capturedEndpoint = "";

      for (const variation of submissionVariations) {
        if (success) break;

        const pfx = prefix;
        const phone = rawPhone;
        const full = pfx + phone;

        const payload = new URLSearchParams();
        payload.set("name", rawName);
        payload.set("fname", firstName);
        payload.set("firstname", firstName);
        payload.set("first_name", firstName);
        payload.set("lname", lastName);
        payload.set("lastname", lastName);
        payload.set("last_name", lastName);
        payload.set("wnopfx", pfx);
        payload.set("waphone", variation.fullPhone ? full : phone);
        payload.set("phone", full);
        payload.set("wa_phone", full);
        payload.set("email", req.body.email || `lead_${phone}@wamation.com`);
        
        // Use extracted correct identifiers
        payload.set("zq", finalZq);
        payload.set("fid", finalFid);
        payload.set("pid", finalPid);
        payload.set("bumppid", finalBumppid);
        payload.set("cid", finalCid);
        payload.set("usp", finalUsp);
        payload.set("grk", finalGrk);
        payload.set("pvar", finalPvar);
        
        payload.set("submit", "JOIN THE WAITLIST NOW");
        payload.set("Submit", "JOIN THE WAITLIST NOW");

        console.log(`[Lead Capture Try] FID=${finalFid} | Phone=${variation.fullPhone ? full : phone} | ZQ=${finalZq}`);

        for (const endpoint of processorEndpoints) {
          if (success) break;

          try {
            // Referer is crucial for security / automation triggers in Wamation
            const referer = `https://wamation.com.ng/f.php/${targetFid}`;
            const response = await axios.post(endpoint, payload.toString(), {
              headers: {
                ...commonHeaders,
                "Content-Type": "application/x-www-form-urlencoded",
                "Referer": referer,
                "Upgrade-Insecure-Requests": "1",
                "Origin": "https://wamation.com.ng",
                ...(phpSessionCookie ? { "Cookie": phpSessionCookie } : {})
              },
              timeout: 10000,
              validateStatus: () => true
            });

            const body = String(response.data);
            const bodyLower = body.toLowerCase();

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
                 console.log(`[SUCCESS] Lead captured at ${endpoint} with FID ${finalFid}`);
                 success = true;
                 capturedEndpoint = endpoint;
                 break;
              }
            }

            if (isError) {
              console.warn(`[REJECTED] ${endpoint} for FID ${finalFid}: Error detected`);
            }
          } catch (err: any) {
            console.warn(`[TIMEOUT/ERROR] ${endpoint} for FID ${finalFid}: ${err.message}`);
          }
        }
      }

      if (success) {
        return res.json({ success: true, endpoint: capturedEndpoint });
      }

      // Failsafe: Log the issue but return true to browser so redirects are never blocked
      console.warn("[FAILSAFE ACTION] All capture variations failed, proceeding to allow redirection regardless.");
      return res.json({ success: true, failsafe: true });
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
