# RecipeSnap AI Backend

This is the backend server for RecipeSnap, providing AI-powered image analysis for recipe ingredients detection and image captioning.

## Features

- Image captioning using `nlpconnect/vit-gpt2-image-captioning` model
- Object detection using `facebook/detr-resnet-50` model
- FastAPI server with CORS support for frontend integration
- Automatic model loading and caching

## Setup

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

   This will install all necessary packages including FastAPI, Uvicorn, PyTorch, and Transformers.

### Running the Server

1. Start the server using the provided batch file (Windows):
   ```
   start_server.bat
   ```

   Or directly with Uvicorn:
   ```
   uvicorn server:app --host 0.0.0.0 --port 8000 --reload
   ```

2. The server will start on `http://localhost:8000`

3. On first run, the models will be downloaded automatically (this may take some time depending on your internet connection)

## API Endpoints

### POST /analyze

Analyzes an image and returns both caption and detected ingredients.

**Request:**
- Form data with `image_data` field containing base64-encoded image

**Response:**
```json
{
  "caption": "a plate of food with vegetables",
  "ingredients": [
    {
      "name": "carrot",
      "confidence": 0.92
    },
    {
      "name": "broccoli",
      "confidence": 0.87
    }
  ]
}
```

### GET /health

Checks if the server is running and models are loaded.

**Response:**
```json
{
  "status": "healthy",
  "models_loaded": true
}
```

## Integration with Frontend

The frontend React application communicates with this backend server through the API service. The server handles all AI processing, reducing the load on the client browser.