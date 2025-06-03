// This file contains pure functions for AI-related operations

// Convert base64 image data to a blob
export const dataURLtoBlob = (dataURL) => {
  const base64Data = dataURL.split(',')[1];
  const byteCharacters = atob(base64Data);
  const byteArrays = [];
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays.push(byteCharacters.charCodeAt(i));
  }
  
  const byteArray = new Uint8Array(byteArrays);
  return new Blob([byteArray], { type: 'image/jpeg' });
};

// Filter predictions to only include food-related items
export const filterFoodItems = (predictions) => {
  const foodCategories = [
    'apple', 'orange', 'banana', 'broccoli', 'carrot', 
    'hot dog', 'pizza', 'donut', 'cake', 'sandwich', 'tomato', 'vegetable',
    'fruit', 'food', 'bowl', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon',
    'refrigerator', 'oven', 'microwave', 'toaster', 'sink', 'blender'
  ];
  
  return predictions.filter(prediction => 
    foodCategories.some(category => 
      prediction.class.toLowerCase().includes(category.toLowerCase())
    )
  );
};

// Format ingredients for recipe generation prompt
export const formatIngredientsForPrompt = (ingredients) => {
  if (!ingredients || ingredients.length === 0) {
    return '';
  }
  
  return ingredients
    .map(ingredient => ingredient.name)
    .join(', ');
};

// Create a recipe generation prompt
export const createRecipePrompt = (ingredientsList, imageCaption) => {
  return `
    I have the following ingredients: ${ingredientsList}.
    ${imageCaption ? `The image shows: ${imageCaption}.` : ''}
    Please suggest 3 delicious recipes I can make with these ingredients.
    For each recipe, provide:
    1. Recipe name
    2. Ingredients list (including quantities)
    3. Step-by-step cooking instructions
    4. Approximate cooking time
    5. Difficulty level (Easy, Medium, Hard)
  `;
};

// Parse generated recipe text into structured format
export const parseRecipeText = (generatedText) => {
  // Split by recipe markers and filter empty blocks
  const recipeBlocks = generatedText.split(/Recipe\s*\d*:?/i).filter(block => block.trim().length > 0);
  
  return recipeBlocks.map((block, index) => {
    // Extract recipe parts
    const lines = block.split('\n').filter(line => line.trim().length > 0);
    
    // Extract recipe name from first line or use default
    const name = lines[0].includes(':') 
      ? lines[0].split(':')[1].trim() 
      : `Recipe ${index + 1}`;
    
    // Join the rest as content
    const content = lines.slice(1).join('\n');
    
    return { name, content };
  });
};