# 🌾 AgriIntel Backend API

Complete Node.js/Express backend for AgriIntel crop disease detection and analysis system.

## 📋 Features

- **Crop Analysis** - ML-based disease detection from images
- **Weather Integration** - Real-time weather data integration
- **Risk Assessment** - Advanced risk calculation engine
- **Yield Prediction** - Crop yield estimation
- **Smart Recommendations** - AI-powered suggestions
- **Analytics** - Comprehensive insights and trends
- **User Settings** - Customizable preferences

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB atlas account
- npm or yarn

### Installation

```bash
cd backend
npm install
```

### Configuration

Create `.env` file:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama3-8b-8192
MAX_FILE_SIZE=5242880
```

### Run Server

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── controllers/        # Business logic
├── routes/            # API endpoints
├── services/          # Core services (ML, Weather, Risk, etc)
├── models/            # MongoDB schemas
├── middleware/        # Error handling
├── utils/             # Helpers (file upload)
├── config/            # Database config
├── uploads/           # Uploaded images
├── server.js          # Main server file
└── package.json       # Dependencies
```

## 📚 API Endpoints

### Analyze Tab
- `POST /api/analyze` - Analyze crop image

### History Tab
- `GET /api/history` - Get all scans
- `GET /api/history/:id` - Get single scan
- `DELETE /api/history/:id` - Delete scan

### Dashboard Tab
- `GET /api/dashboard` - Get dashboard stats

### Insights Tab
- `GET /api/insights` - Get analytics & trends

### Settings Tab
- `GET /api/user` - Get user settings
- `PUT /api/user` - Update user settings

## 🧠 Services

| Service | Purpose |
|---------|---------|
| diseaseService | ML disease detection |
| weatherService | Weather data integration |
| riskService | Risk calculation engine |
| yieldService | Yield prediction |
| recommendationService | Smart suggestions |

## 🗄️ Database Models

### Scan Model
```javascript
{
  imageUrl: String,
  cropType: String,
  location: String,
  soilType: String,
  disease: String,
  confidence: Number,
  temperature: Number,
  humidity: Number,
  weatherCondition: String,
  risk: String,
  yield: String,
  suggestions: [String],
  createdAt: Date
}
```

### User Model
```javascript
{
  name: String,
  location: String,
  preferredCrops: [String],
  units: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Development

### Adding New Route
1. Create controller in `/controllers`
2. Create route in `/routes`
3. Import and use in `server.js`

### Adding New Service
1. Create service file in `/services`
2. Import in controller
3. Call in controller method

### Integrating Real ML Model
- Replace mock data in `diseaseService.js`
- Options:
  - Groq API with vision
  - TensorFlow.js
  - Custom ML API
  - Hugging Face model

## 📊 Sample API Response

```json
{
  "success": true,
  "data": {
    "_id": "123abc",
    "cropType": "Rice",
    "location": "Punjab",
    "disease": "Leaf Rust",
    "confidence": 0.92,
    "risk": "High",
    "yield": "Low",
    "suggestions": [
      "Apply fungicide immediately",
      "Improve air circulation",
      "Remove infected leaves"
    ]
  }
}
```

## 🚨 Error Handling

All errors follow consistent format:
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed message"
}
```

## 📝 License

MIT License

## 👤 Author

AgriIntel Team
