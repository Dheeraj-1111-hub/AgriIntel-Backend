// services/riskService.js

// ============================================
// MAIN RISK CALCULATION (LEVEL)
// ============================================

export const calculateRisk = (disease, weather) => {
  try {
    const score = calculateRiskScore(disease, weather);

    if (score >= 7) return 'High';
    if (score >= 4) return 'Medium';
    return 'Low';

  } catch (error) {
    console.error('Risk calculation error:', error);
    return 'Medium';
  }
};

// ============================================
// DETAILED RISK SCORE (0–10)
// ============================================

export const calculateRiskScore = (disease, weather) => {
  try {
    let score = 0;

    const name = (disease.disease || "").toLowerCase();

    // ========================================
    // 1. DISEASE SEVERITY (SMART MATCH)
    // ========================================
    let diseaseSeverity = 1.5;

    if (name.includes("rust")) diseaseSeverity = 3;
    else if (name.includes("blight")) diseaseSeverity = 3.5;
    else if (name.includes("mildew")) diseaseSeverity = 2.5;
    else if (name.includes("spot")) diseaseSeverity = 2;
    else if (name.includes("healthy")) diseaseSeverity = 0.5;
    else if (name.includes("unknown")) return 3;

    // ========================================
    // 2. CONFIDENCE IMPACT (FIXED)
    // ========================================
    const confidenceImpact = ((disease.confidence || 0) / 100) * 5;

    // ========================================
    // 3. WEATHER IMPACT
    // ========================================
    let weatherImpact = 0;

    if (weather.humidity > 75) weatherImpact += 2;
    else if (weather.humidity > 60) weatherImpact += 1;

    if (weather.temperature > 32 || weather.temperature < 12) {
      weatherImpact += 1.5;
    } else if (weather.temperature > 28) {
      weatherImpact += 1;
    }

    // 🔥 Smart interaction
    if (name.includes("rust") && weather.humidity > 70) {
      weatherImpact += 1.5;
    }

    // ========================================
    // FINAL SCORE
    // ========================================
    score = diseaseSeverity + confidenceImpact + weatherImpact;

    // 🔥 Low confidence penalty
    if ((disease.confidence || 0) < 30) {
      score -= 1;
    }

    return Math.min(parseFloat(score.toFixed(2)), 10);

  } catch (error) {
    console.error("Risk score error:", error);
    return 5;
  }
};