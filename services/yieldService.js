// services/yieldService.js

// ============================================
// MAIN YIELD PREDICTION (PERCENTAGE)
// ============================================

export const predictYield = (risk, disease, weather) => {
  try {
    let base = 85; // ideal max yield %

    // ========================================
    // 1. RISK IMPACT
    // ========================================
    if (risk === 'High') base -= 40;
    else if (risk === 'Medium') base -= 20;
    else base -= 5;

    // ========================================
    // 2. DISEASE CONFIDENCE IMPACT (FIXED)
    // ========================================
    const confidence = (disease.confidence || 0) / 100; // ✅ normalize

    base -= confidence * 25; // slightly stronger impact

    // ========================================
    // 3. WEATHER IMPACT
    // ========================================
    if (weather.humidity > 80) base -= 5;
    else if (weather.humidity < 40) base -= 5;

    if (weather.temperature > 32 || weather.temperature < 12) {
      base -= 5;
    } else if (weather.temperature > 28) {
      base -= 2;
    }

    // ========================================
    // FINAL OUTPUT (bounded)
    // ========================================
    return Math.max(30, Math.round(base));

  } catch (error) {
    console.error('Yield prediction error:', error);
    return 60;
  }
};



// ============================================
// YIELD PER HECTARE (REALISTIC AGRI VALUES)
// ============================================

export const estimateYieldPerHectare = (cropType, risk, weather, disease) => {
  try {
    const baseYield = {
      Rice: 5000,
      Wheat: 4500,
      Corn: 6000,
      Cotton: 2000,
      Sugarcane: 70000
    };

    let baseValue = baseYield[cropType] || 5000;

    // ========================================
    // 1. RISK REDUCTION
    // ========================================
    const riskFactor = {
      Low: 0.9,
      Medium: 0.7,
      High: 0.45
    };

    baseValue *= (riskFactor[risk] || 0.7);

    // ========================================
    // 2. WEATHER EFFECT
    // ========================================
    let weatherFactor = 1;

    if (weather.humidity > 85 || weather.humidity < 40) {
      weatherFactor -= 0.1;
    }

    if (weather.temperature > 35 || weather.temperature < 12) {
      weatherFactor -= 0.15;
    }

    baseValue *= weatherFactor;

    // ========================================
    // 3. DISEASE IMPACT (FIXED)
    // ========================================
    const confidence = (disease.confidence || 0) / 100;

    baseValue -= baseValue * (confidence * 0.25);

    // ========================================
    return Math.max(1000, Math.round(baseValue)); // safety floor

  } catch (error) {
    console.error('Yield estimation error:', error);
    return 4000;
  }
};