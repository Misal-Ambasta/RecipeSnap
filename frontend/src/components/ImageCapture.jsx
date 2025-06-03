import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Button, Box, Typography, Paper } from '@mui/material';
import Dropzone from 'react-dropzone';

const ImageCapture = ({ onImageCaptured }) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [captureMethod, setCaptureMethod] = useState('upload'); // 'upload' or 'webcam'
  const webcamRef = useRef(null);

  const captureFromWebcam = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      onImageCaptured(imageSrc);
    }
  }, [webcamRef, onImageCaptured]);

  const handleFileUpload = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setCapturedImage(URL.createObjectURL(file));
        onImageCaptured(file);
      }
    },
    [onImageCaptured]
  );

  const resetImage = () => {
    setCapturedImage(null);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Capture Ingredients
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Button 
          variant={captureMethod === 'upload' ? 'contained' : 'outlined'} 
          onClick={() => setCaptureMethod('upload')} 
          sx={{ mr: 1 }}
        >
          Upload Photo
        </Button>
        <Button 
          variant={captureMethod === 'webcam' ? 'contained' : 'outlined'} 
          onClick={() => setCaptureMethod('webcam')}
        >
          Use Webcam
        </Button>
      </Box>

      {captureMethod === 'webcam' ? (
        <Box sx={{ mb: 2 }}>
          {capturedImage ? (
            <Box>
              <img 
                src={capturedImage} 
                alt="Captured ingredients" 
                style={{ maxWidth: '100%', maxHeight: '300px' }} 
              />
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" color="primary" onClick={resetImage}>
                  Take Another Photo
                </Button>
              </Box>
            </Box>
          ) : (
            <Box>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: 'environment' }}
                style={{ width: '100%', maxHeight: '300px' }}
              />
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" color="primary" onClick={captureFromWebcam}>
                  Capture Photo
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      ) : (
        <Box sx={{ mb: 2 }}>
          {capturedImage ? (
            <Box>
              <img 
                src={capturedImage} 
                alt="Uploaded ingredients" 
                style={{ maxWidth: '100%', maxHeight: '300px' }} 
              />
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" color="primary" onClick={resetImage}>
                  Upload Another Photo
                </Button>
              </Box>
            </Box>
          ) : (
            <Dropzone onDrop={handleFileUpload} accept={{'image/*': []}} multiple={false}>
              {({ getRootProps, getInputProps }) => (
                <Box 
                  {...getRootProps()} 
                  sx={{ 
                    border: '2px dashed #cccccc', 
                    borderRadius: 2, 
                    p: 3, 
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': { borderColor: 'primary.main' }
                  }}
                >
                  <input {...getInputProps()} />
                  <Typography>Drag and drop an image here, or click to select a file</Typography>
                </Box>
              )}
            </Dropzone>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default ImageCapture;