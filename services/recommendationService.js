// services/recommendationService.js

// ============================================
// BASE RECOMMENDATIONS (DISEASE-SPECIFIC)
// ============================================

export const getRecommendations = (disease, weather = {}, risk = 'Medium') => {
  try {
    let suggestions = [];

    const diseaseName = disease.disease;

    // ========================================
    // 1. DISEASE-SPECIFIC ACTIONS
    // ========================================
    const diseaseMap = {
      'Leaf Rust': [
        'Apply triazole fungicides (e.g., propiconazole)',
        'Use rust-resistant crop varieties',
        'Remove heavily infected leaves to prevent spread'
      ],
      'Powdery Mildew': [
        'Apply sulfur or potassium bicarbonate fungicides',
        'Improve air circulation between plants',
        'Reduce excess nitrogen fertilization'
      ],
      'Leaf Spot': [
        'Apply copper-based fungicides',
        'Avoid overhead irrigation to reduce leaf moisture',
        'Remove infected plant debris'
      ],
      'Healthy': [
        'Maintain current farming practices',
        'Monitor crops weekly for early disease detection',
        'Apply balanced fertilizers'
      ]
    };

    suggestions.push(...(diseaseMap[diseaseName] || [
      'Monitor crop regularly',
      'Maintain proper irrigation',
      'Follow crop rotation'
    ]));

    // ========================================
    // 2. WEATHER-BASED RECOMMENDATIONS
    // ========================================
    if (weather.humidity > 75) {
      suggestions.push('High humidity detected: Increase field ventilation');
      suggestions.push('Avoid excess irrigation to prevent fungal growth');
    }

    if (weather.temperature > 32) {
      suggestions.push('High temperature stress: Ensure adequate watering');
    }

    if (weather.temperature < 15) {
      suggestions.push('Low temperature detected: Monitor for slow growth');
    }

    // ========================================
    // 3. RISK-BASED ACTIONS
    // ========================================
    if (risk === 'High') {
      suggestions.push('URGENT: Immediate fungicide application required');
      suggestions.push('Consider isolating affected area');
    } else if (risk === 'Medium') {
      suggestions.push('Monitor crop every 2–3 days');
    }

    // ========================================
    // 4. CONFIDENCE-BASED LOGIC (ML)
    // ========================================
    if ((disease.confidence || 0) > 0.85) {
      suggestions.push('High confidence detection: Take immediate action');
    } else if ((disease.confidence || 0) < 0.5) {
      suggestions.push('Low confidence: Re-scan crop for accurate results');
    }

    // ========================================
    // REMOVE DUPLICATES
    // ========================================
    return [...new Set(suggestions)];

  } catch (error) {
    console.error('Recommendation error:', error);
    return ['Monitor crop health', 'Maintain irrigation'];
  }
};

// ============================================
// DETAILED RECOMMENDATIONS (ADVANCED)
// ============================================

export const getDetailedRecommendations = (disease, risk, cropType, weather = {}) => {
  try {
    const base = getRecommendations(disease, weather, risk);

    // ========================================
    // CROP-SPECIFIC INTELLIGENCE
    // ========================================
    const cropTips = {
      'Rice': [
        'Maintain standing water level (2–5 cm)',
        'Avoid water stagnation during disease spread'
      ],
      'Wheat': [
        'Apply fungicide before heading stage',
        'Monitor for rust spread during cool humid conditions'
      ],
      'Corn': [
        'Remove infected cobs immediately',
        'Ensure proper spacing for airflow'
      ],
      'Cotton': [
        'Check for boll infection regularly',
        'Avoid excess irrigation during disease'
      ]
    };

    if (cropTips[cropType]) {
      base.push(...cropTips[cropType]);
    }

    return [...new Set(base)];

  } catch (error) {
    console.error('Detailed recommendations error:', error);
    return getRecommendations(disease, weather, risk);
  }
};