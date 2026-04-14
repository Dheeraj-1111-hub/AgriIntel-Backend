// backend/controllers/analyzeController.js

import { Scan } from "../models/Scan.js";
import { detectDisease } from "../services/diseaseService.js";
import { getWeather } from "../services/weatherService.js";
import { calculateRisk } from "../services/riskService.js";
import { predictYield } from "../services/yieldService.js";
import { getRecommendations } from "../services/recommendationService.js";
import { getAIRecommendations } from "../services/aiRecommendationService.js";

export const analyzeCrop = async (req, res) => {
  try {
    const { cropType, location, soilType } = req.body;
    const userId = req.user.id;

    // ===============================
    // VALIDATION
    // ===============================
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required"
      });
    }

    // ⚠️ Since we use memory storage, no real file exists
    const imageUrl = "memory-upload";

    // ===============================
    // STEP 1: ML (BUFFER)
    // ===============================
    const diseaseResult = await detectDisease(req.file, cropType);

    const confidence = Math.round((diseaseResult.confidence || 0) * 100);

    // ===============================
    // STEP 2: WEATHER
    // ===============================
    const weather = await getWeather(location);

    // ===============================
    // STEP 3: RISK
    // ===============================
    const risk = calculateRisk(
      { disease: diseaseResult.disease, confidence },
      weather
    );

    // ===============================
    // STEP 4: YIELD
    // ===============================
    const yieldPred = predictYield(
      risk,
      { disease: diseaseResult.disease, confidence },
      weather
    );

    // ===============================
    // STEP 5: RECOMMENDATIONS
    // ===============================
    let suggestions = [];

    try {
      if (confidence >= 40 && diseaseResult.disease !== "Unknown") {
        console.log("🤖 Using AI recommendations");

        suggestions = await getAIRecommendations({
          disease: diseaseResult.disease,
          confidence,
          cropType,
          weather,
          risk
        });

      } else {
        throw new Error("Low confidence → fallback");
      }

    } catch (err) {
      console.warn("⚠️ Using rule-based recommendations");

      suggestions = getRecommendations(
        { disease: diseaseResult.disease, confidence },
        weather,
        risk
      );
    }

    // ===============================
    // SAVE
    // ===============================
    const scan = await Scan.create({
      userId,
      imageUrl,
      cropType,
      location,
      soilType,

      disease: diseaseResult.disease,
      confidence,

      temperature: weather.temperature,
      humidity: weather.humidity,
      weatherCondition: weather.condition,

      risk,
      yield: yieldPred,

      suggestions
    });

    // ===============================
    // RESPONSE
    // ===============================
    res.status(201).json({
      success: true,
      message: "Analysis completed successfully",
      data: scan
    });

  } catch (error) {
    console.error("❌ Analyze crop error:", error);

    res.status(500).json({
      success: false,
      message: "Analysis failed",
      error: error.message
    });
  }
};

// ===============================
// GET SINGLE ANALYSIS
// ===============================

export const getAnalysisById = async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.id);

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found"
      });
    }

    res.json({
      success: true,
      data: scan
    });

  } catch (error) {
    console.error("❌ Fetch analysis error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch analysis"
    });
  }
};