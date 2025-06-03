# RecipeSnap - AI Cooking Assistant from Your Fridge

RecipeSnap is an innovative web application that transforms the way you cook by using AI to identify ingredients from your fridge and suggest delicious recipes. Simply take a photo of your ingredients, and let the AI do the rest!

## Features

- **Image Capture**: Take photos directly using your device's camera or upload images from your gallery
- **Ingredient Detection**: Advanced AI models identify ingredients in your photos
- **Recipe Generation**: Get personalized recipe recommendations based on detected ingredients
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Project Structure

The project consists of two main components:

1. **Frontend**: A React application built with Vite and Material UI
2. **Backend**: A FastAPI server that hosts AI models for image analysis

## AI Models Used

RecipeSnap leverages several state-of-the-art AI models:

1. **Image Captioning**: [nlpconnect/vit-gpt2-image-captioning](https://huggingface.co/nlpconnect/vit-gpt2-image-captioning)
   - Provides a natural language description of the image contents
   - Based on Vision Transformer (ViT) and GPT-2 architecture

2. **Object Detection**: [facebook/detr-resnet-50](https://huggingface.co/facebook/detr-resnet-50)
   - Identifies specific food items and ingredients in the image
   - Now implemented via Python backend for more accurate results

3. **Recipe Generation**: [mistralai/Mistral-7B-Instruct](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2)
   - Generates detailed, step-by-step recipes based on detected ingredients
   - Provides cooking instructions, ingredient quantities, and difficulty levels

## Tech Stack

- **Frontend**: React with Vite for fast development and optimized builds
- **UI Framework**: Material-UI for a clean, responsive interface
- **Backend**: FastAPI (Python) for hosting AI models and processing images
- **AI Integration**: Hugging Face Transformers for advanced AI capabilities

## Setup and Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Python 3.8 or higher
- pip (Python package manager)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the backend server:
   ```bash
   # On Windows
   start_server.bat
   
   # Or directly with Uvicorn
   uvicorn server:app --host 0.0.0.0 --port 8000 --reload
   ```

### Frontend Setup

1. Navigate to the RecipeSnap directory:
   ```bash
   cd RecipeSnap
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready to be deployed to your hosting service of choice.

## Usage

1. Ensure both the backend and frontend servers are running
2. Open the RecipeSnap application in your browser
3. Choose to either upload a photo or take a new one using your camera
4. Wait for the AI to analyze the image and detect ingredients
5. Review the detected ingredients and the generated image caption
6. Explore the recipe recommendations tailored to your available ingredients
7. Follow the step-by-step cooking instructions to prepare your meal

## Privacy Considerations

RecipeSnap now processes images on a local backend server, keeping your data on your own machine. The AI models are downloaded and run locally, ensuring your cooking data stays private!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Happy cooking with RecipeSnap! 🍳🥗🍲