import os
import base64
import io
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from PIL import Image
import torch
from transformers import pipeline, AutoFeatureExtractor, DetrForObjectDetection

# Initialize FastAPI app
app = FastAPI(title="RecipeSnap AI Backend")

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Increase maximum upload size to 10MB
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

class LimitUploadSize(BaseHTTPMiddleware):
    def __init__(self, app, max_upload_size: int):
        super().__init__(app)
        self.max_upload_size = max_upload_size

    async def dispatch(self, request: Request, call_next):
        if request.method == "POST":
            content_length = request.headers.get("content-length")
            if content_length and int(content_length) > self.max_upload_size:
                return JSONResponse(
                    status_code=413,
                    content={"detail": f"File too large. Maximum size allowed is {self.max_upload_size/1024/1024:.1f}MB"}
                )
        return await call_next(request)

# Add middleware to increase upload size limit to 10MB (10 * 1024 * 1024 bytes)
app.add_middleware(LimitUploadSize, max_upload_size=10 * 1024 * 1024)

# Global variables to store loaded models
image_captioner = None
object_detector = None
feature_extractor = None

# Food categories to filter detected objects
FOOD_CATEGORIES = [
    'apple', 'orange', 'banana', 'broccoli', 'carrot', 'hot dog', 'pizza', 
    'donut', 'cake', 'sandwich', 'tomato', 'bowl', 'bottle', 'wine glass', 
    'cup', 'fork', 'knife', 'spoon', 'dining table', 'food', 'fruit', 'vegetable'
]

# Response models
class DetectedIngredient(BaseModel):
    name: str
    confidence: float

class ImageAnalysisResponse(BaseModel):
    caption: str
    ingredients: List[DetectedIngredient]

# Load models on startup
@app.on_event("startup")
async def load_models():
    global image_captioner, object_detector, feature_extractor
    
    print("Loading image captioning model...")
    image_captioner = pipeline("image-to-text", model="nlpconnect/vit-gpt2-image-captioning")
    
    print("Loading object detection model...")
    feature_extractor = AutoFeatureExtractor.from_pretrained("facebook/detr-resnet-50")
    object_detector = DetrForObjectDetection.from_pretrained("facebook/detr-resnet-50")
    
    print("Models loaded successfully!")

# Helper function to process base64 image
def decode_base64_image(base64_string: str):
    # Remove data URL prefix if present
    if "," in base64_string:
        base64_string = base64_string.split(",")[1]
    
    # Decode base64 string to bytes
    image_bytes = base64.b64decode(base64_string)
    
    # Create PIL Image from bytes
    image = Image.open(io.BytesIO(image_bytes))
    return image

# Helper function to detect objects using DETR model
def detect_objects(image):
    # Prepare image for the model
    inputs = feature_extractor(images=image, return_tensors="pt")
    outputs = object_detector(**inputs)
    
    # Convert outputs to usable format
    target_sizes = torch.tensor([image.size[::-1]])
    results = feature_extractor.post_process_object_detection(
        outputs, target_sizes=target_sizes, threshold=0.5
    )[0]
    
    # Extract detections
    detections = []
    for score, label, box in zip(results["scores"], results["labels"], results["boxes"]):
        class_name = object_detector.config.id2label[label.item()]
        
        # Filter for food-related items
        if any(category in class_name.lower() for category in FOOD_CATEGORIES):
            detections.append({
                "name": class_name,
                "confidence": score.item()
            })
    
    return detections

# Endpoint to analyze image (both caption and object detection)
@app.post("/analyze", response_model=ImageAnalysisResponse)
async def analyze_image(file: UploadFile = File(...)):
    if not image_captioner or not object_detector:
        raise HTTPException(status_code=503, detail="Models are still loading. Please try again in a moment.")
    try:
        # Read image bytes from the uploaded file
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))
        
        # Generate caption
        caption_result = image_captioner(image)
        caption = caption_result[0]["generated_text"] if caption_result else "No caption generated"
        
        # Detect objects
        ingredients = detect_objects(image)
        
        return ImageAnalysisResponse(
            caption=caption,
            ingredients=[DetectedIngredient(**ingredient) for ingredient in ingredients]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

# Add this after the /analyze endpoint
@app.post("/generate-recipes")
async def generate_recipes(
    ingredients: list = Body(...),
    image_caption: str = Body("")
):
    try:
        prompt = f"""
        I have the following ingredients: {', '.join(ingredients)}.
        {f'The image shows: {image_caption}.' if image_caption else ''}
        Please suggest 3 delicious recipes I can make with these ingredients.
        For each recipe, provide:
        1. Recipe name
        2. Ingredients list (including quantities)
        3. Step-by-step cooking instructions
        4. Approximate cooking time
        5. Difficulty level (Easy, Medium, Hard)
        """
        # Use the transformers pipeline for text-generation
        recipe_generator = pipeline("text-generation", model="mistralai/Mistral-7B-Instruct-v0.2")
        result = recipe_generator(prompt, max_new_tokens=1024, temperature=0.7, top_p=0.95)
        generated_text = result[0]["generated_text"] if result else ""
        return {"generated_text": generated_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recipes: {str(e)}")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "models_loaded": image_captioner is not None and object_detector is not None}

# Run the server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)