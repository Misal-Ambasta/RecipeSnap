import { useState, useEffect } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { analyzeImage } from '../services/apiService';

const IngredientDetection = ({ imageData, onIngredientsDetected }) => {
  const [ingredients, setIngredients] = useState([]);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const processImage = async () => {
      if (!imageData) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Use the backend API service to analyze the image
        const result = await analyzeImage(imageData);
        
        // Update state with the results
        setIngredients(result.ingredients);
        setCaption(result.caption);
        
        // Call the callback to pass data back to parent
        if (onIngredientsDetected) {
          onIngredientsDetected(result.ingredients, result.caption);
        }
      } catch (err) {
        console.error('Error processing image:', err);
        setError('Failed to process the image. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    processImage();
  }, [imageData, onIngredientsDetected]);

  if (!imageData) {
    return null;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Detected Ingredients
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Analyzing your ingredients...</Typography>
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box>
          {caption && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">Image Description:</Typography>
              <Typography>{caption}</Typography>
            </Box>
          )}
          
          {ingredients.length > 0 ? (
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">Detected Items:</Typography>
              <List>
                {ingredients.map((ingredient, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={ingredient.name} 
                      secondary={`Confidence: ${Math.round(ingredient.confidence * 100)}%`} 
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          ) : (
            <Typography>No ingredients detected. Try another image or angle.</Typography>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default IngredientDetection;