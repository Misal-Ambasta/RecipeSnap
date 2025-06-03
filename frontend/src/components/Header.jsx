import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* SVG icon for the logo */}
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginRight: '10px' }}
          >
            <path 
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" 
              fill="white" 
            />
            <path 
              d="M7 9h2v6H7zm8 0h2v6h-2z" 
              fill="white" 
            />
          </svg>
          
          <Typography variant="h6" component="div">
            RecipeSnap
          </Typography>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Typography variant="subtitle2" color="inherit">
          AI Cooking Assistant
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;