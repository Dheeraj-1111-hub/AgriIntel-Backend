// backend/services/diseaseService.js

import axios from "axios";
import FormData from "form-data";

// ============================================
// ML SERVICE (BUFFER VERSION - FINAL)
// ============================================

export const detectDisease = async (file, cropType) => {
  try {
    const form = new FormData();

    // ✅ BUFFER (NO FILE PATH)
    form.append("image", file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype
    });

    form.append("cropType", cropType || "");

    const response = await axios.post(
      "https://agriintel-ml-service.onrender.com/predict",
      form,
      {
        headers: form.getHeaders(),
        timeout: 90000
      }
    );

    const data = response.data;

    let disease = data?.disease || "Unknown";
    let confidence = Number(data?.confidence || 0);

    // ===============================
    // LOW CONFIDENCE HANDLING
    // ===============================
    if (confidence < 0.5) {
      return {
        disease: "Low confidence detection",
        confidence
      };
    }

    // ===============================
    // CROP MISMATCH HANDLING
    // ===============================
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
// FORMAT FUNCTION
// ============================================

export const formatDiseaseName = (name) => {
  return name
    ?.replace(/_/g, " ")
    ?.replace(/\b\w/g, (c) => c.toUpperCase()) || "Unknown";
};