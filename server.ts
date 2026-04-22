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
      console.log("Received lead submission request:", JSON.stringify(req.body));

      // Proxy everything from the client to Wamation dynamically
      const formData = new URLSearchParams();
      for (const [key, value] of Object.entries(req.body)) {
        formData.append(key, String(value));
      }

      // Ensure 'submit' is present as it's often required by these processors
      if (!formData.has("submit")) {
        formData.append("submit", "JOIN THE WAITLIST NOW");
      }

      const name = req.body.name || "Unknown";
      const phone = `${req.body.wnopfx || ""}${req.body.waphone || ""}`;
      console.log(`Forwarding lead to Wamation: ${name} (${phone})`);

      // Send to Wamation with browser-like headers to prevent blocks
      const response = await axios.post("https://app.wamation.com.ng/processor", formData.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Origin": "https://app.wamation.com.ng",
          "Referer": "https://app.wamation.com.ng/"
        },
        timeout: 10000, // 10 second timeout
      });

      console.log("Wamation response status:", response.status);
      
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error submitting to Wamation:", error.message);
      if (error.response) {
        console.error("Wamation error context:", {
          status: error.response.status,
          data: error.response.data
        });
      }
      res.status(500).json({ success: false, error: "Submission failed" });
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
