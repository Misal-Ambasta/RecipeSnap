import { useState } from 'react';
import { Container, CssBaseline, Box, Typography, ThemeProvider, createTheme } from '@mui/material';
import Header from './components/Header';
import ImageCapture from './components/ImageCapture';
import IngredientDetection from './components/IngredientDetection';
import RecipeGenerator from './components/RecipeGenerator';
import './App.css';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50', // Green color for food theme
    },
    secondary: {
      main: '#ff9800', // Orange as secondary color
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
  },
});

function App() {
  const [capturedImage, setCapturedImage] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [imageCaption, setImageCaption] = useState('');

  // Handler for when an image is captured or uploaded
  const handleImageCaptured = (imageData) => {
    setCapturedImage(imageData);
    // Reset previous results when a new image is captured
    setIngredients([]);
    setImageCaption('');
  };

  // Handler for when ingredients are detected
  const handleIngredientsDetected = (detectedIngredients, caption) => {
    setIngredients(detectedIngredients);
    setImageCaption(caption);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default'
      }}>
        <Header />
        
        <Container maxWidth="md" sx={{ flex: 1, py: 4 }}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Turn Your Fridge Into Delicious Meals
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Take a photo of your ingredients and get AI-powered recipe recommendations
            </Typography>
          </Box>
          
          <ImageCapture onImageCaptured={handleImageCaptured} />
          
          {capturedImage && (
            <IngredientDetection 
              imageData={capturedImage} 
              onIngredientsDetected={handleIngredientsDetected}
            />
          )}
          
          {ingredients.length > 0 && (
            <RecipeGenerator 
              ingredients={ingredients} 
              imageCaption={imageCaption}
            />
          )}
        </Container>
        
        <Box component="footer" sx={{ py: 3, bgcolor: 'background.paper', textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            RecipeSnap - AI Cooking Assistant © {new Date().getFullYear()}
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
