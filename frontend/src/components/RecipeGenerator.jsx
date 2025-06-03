import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Card, CardContent, CardActions, CircularProgress, Divider } from '@mui/material';
import { InferenceClient } from '@huggingface/inference';

// This is a placeholder - in a real app, you would use environment variables
// and never expose API keys in the frontend code
const HF_TOKEN = import.meta.env.VITE_HUGGING_FACE_API_TOKEN; // Replace with actual token in production

const RecipeGenerator = ({ ingredients, imageCaption }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateRecipes = async () => {
    if (!ingredients || ingredients.length === 0) {
      setError('No ingredients detected. Please try another image.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/generate-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, image_caption: imageCaption })
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server responded with status: ${response.status}`);
      }
      const result = await response.json();
      const generatedText = result.generated_text;
      // Simple parsing - in a real app, you would use more robust parsing
      const recipeBlocks = generatedText.split('Recipe').filter(block => block.trim().length > 0);
      const parsedRecipes = recipeBlocks.map((block, index) => {
        const lines = block.split('\n').filter(line => line.trim().length > 0);
        const name = lines[0].includes(':') 
          ? lines[0].split(':')[1].trim() 
          : `Recipe ${index + 1}`;
        const content = lines.slice(1).join('\n');
        return { name, content };
      });
      setRecipes(parsedRecipes);
    } catch (err) {
      console.error('Error generating recipes:', err);
      setError('Failed to generate recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!ingredients || ingredients.length === 0) {
    return null;
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Recipe Recommendations
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Generating delicious recipes...</Typography>
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box>
          {recipes.length > 0 ? (
            <Box>
              {recipes.map((recipe, index) => (
                <Card key={index} sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {recipe.name}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                      {recipe.content}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Save Recipe</Button>
                    <Button size="small">Share</Button>
                  </CardActions>
                </Card>
              ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography gutterBottom>
                Click the button below to generate recipe recommendations based on your ingredients.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={generateRecipes}
                disabled={!ingredients || ingredients.length === 0}
              >
                Generate Recipes
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default RecipeGenerator;