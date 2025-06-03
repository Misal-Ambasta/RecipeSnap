/**
 * API Service for communicating with the backend server
 * Handles all requests to the FastAPI backend for image analysis
 */

const API_BASE_URL = 'http://localhost:8000';

/**
 * Analyzes an image using the backend AI models
 * @param {string} imageData - Base64 encoded image data
 * @returns {Promise<{caption: string, ingredients: Array<{name: string, confidence: number}>}>}
 */
export const analyzeImage = async (imageData) => {
  try {
    const formData = new FormData();
    // If imageData is a base64 string, convert to Blob
    let fileToSend = imageData;
    if (typeof imageData === 'string' && imageData.startsWith('data:')) {
      const res = await fetch(imageData);
      fileToSend = await res.blob();
    }
    formData.append('file', fileToSend, 'image.jpg');
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      body: formData,
    });
    
    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Server responded with status: ${response.status}`);
    }
    
    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
};

/**
 * Checks if the backend server is healthy and models are loaded
 * @returns {Promise<{status: string, models_loaded: boolean}>}
 */
export const checkServerHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    
    if (!response.ok) {
      throw new Error(`Health check failed with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'unhealthy', models_loaded: false };
  }
};