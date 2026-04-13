import axios from "axios";
import fs from "fs";
import FormData from "form-data";

// ============================================
// ML SERVICE (STABLE + SAFE VERSION)
// ============================================

export const detectDisease = async (imagePath, cropType) => {
  try {
    const form = new FormData();

    form.append("image", fs.createReadStream(imagePath));
    form.append("cropType", cropType || "");

    const response = await axios.post(
      "http://127.0.0.1:8000/predict",
      form,
      {
        headers: form.getHeaders(),
        timeout: 30000
      }
    );

    const data = response.data;

    let disease = data?.disease || "Unknown";
    let confidence = Number(data?.confidence || 0);

    // ============================================
    // ✅ SAFETY FIX 1: Low confidence handling
    // ============================================
    if (confidence < 0.5) {
      return {
        disease: "Low confidence detection",
        confidence
      };
    }

    // ============================================
    // ✅ SAFETY FIX 2: Crop mismatch handling
    // ============================================
    if (
      cropType &&
      disease !== "Unknown" &&
      !disease.toLowerCase().includes(cropType.toLowerCase())
    ) {
      disease = "Possible mismatch (verify manually)";
    }

    return { disease, confidence };

  } catch (error) {
    console.error(
      "❌ ML Service Error:",
      error.response?.data || error.message
    );

    return {
      disease: "Service unavailable",
      confidence: 0
    };
  }
};

// ============================================
// FORMAT FUNCTION (UNCHANGED)
// ============================================

export const formatDiseaseName = (name) => {
  return name
    ?.replace(/_/g, " ")
    ?.replace(/\b\w/g, (c) => c.toUpperCase()) || "Unknown";
};