import { Handler } from "@netlify/functions";
import axios from "axios";

export const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { name, wnopfx, waphone } = body;

    if (!name || !waphone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    // Wamation expected fields
    const formData = new URLSearchParams();
    formData.append("name", name);
    formData.append("wnopfx", wnopfx || "234");
    formData.append("waphone", waphone);
    formData.append("zq", "41213");
    formData.append("fid", "5f66a80141213");
    formData.append("bumppid", "0");
    formData.append("usp", "0");
    formData.append("submit", "JOIN THE WAITLIST NOW");

    // Send to Wamation
    const response = await axios.post("https://app.wamation.com.ng/processor", formData.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      timeout: 10000,
    });

    console.log("Wamation response status:", response.status);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ success: true }),
    };
  } catch (error: any) {
    console.error("Error submitting to Wamation:", error.message);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        success: false, 
        error: "Submission failed",
        details: error.message 
      }),
    };
  }
};
