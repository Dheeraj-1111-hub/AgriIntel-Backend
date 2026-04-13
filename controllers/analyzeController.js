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

    // ============================================
    // VALIDATION
    // ============================================
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required"
      });
    }

    const imagePath = req.file.path;
    const imageUrl = `/uploads/${req.file.filename}`;

    // ============================================
    // STEP 1: ML
    // ============================================
    const disease = await detectDisease(imagePath, cropType);

    // ✅ FIX: convert to percentage (0–100)
    const confidence = Math.round((disease.confidence || 0) * 100);

    // ============================================
    // STEP 2: WEATHER
    // ============================================
    const weather = await getWeather(location);

    // ============================================
    // STEP 3: RISK
    // ============================================
    const risk = calculateRisk(
      { disease: disease.disease, confidence },
      weather
    );

    // ============================================
    // STEP 4: YIELD
    // ============================================
    const yieldPred = predictYield(
      risk,
      { disease: disease.disease, confidence },
      weather
    );

    // ============================================
    // STEP 5: RECOMMENDATIONS (AI + FALLBACK)
    // ============================================
    let suggestions = [];

    try {
      // ✅ DEBUG LOG (optional)
      console.log("Confidence:", confidence);

      if (confidence >= 40 && disease.disease !== "Unknown") {
        console.log("🤖 Using AI recommendations");

        suggestions = await getAIRecommendations({
          disease: disease.disease,
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
        { disease: disease.disease, confidence },
        weather,
        risk
      );
    }

    // ============================================
    // STEP 6: SAVE
    // ============================================
    const scan = await Scan.create({
      userId,
      imageUrl,
      cropType,
      location,
      soilType,

      disease: disease.disease,
      confidence,

      temperature: weather.temperature,
      humidity: weather.humidity,
      weatherCondition: weather.condition,

      risk,
      yield: yieldPred,

      suggestions
    });

    // ============================================
    // RESPONSE
    // ============================================
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

// ============================================
// GET SINGLE ANALYSIS
// ============================================

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