'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Box, 
  Typography, 
  Container, 
  TextField, 
  Button, 
  Divider, 
  Paper,
  IconButton,
  InputAdornment
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { alpha } from '@mui/material/styles';

export default function Login() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const welcomeTexts = [
    "Welcome to Flexify",
    "Please Create an Account to Continue"
  ];

  // Typewriter effect
  useEffect(() => {
    if (currentTextIndex >= welcomeTexts.length) {
      setShowAuthForm(true);
      return;
    }

    const currentFullText = welcomeTexts[currentTextIndex];
    
    if (displayedText.length < currentFullText.length) {
      // Still typing current text
      const timeoutId = setTimeout(() => {
        setDisplayedText(currentFullText.substring(0, displayedText.length + 1));
      }, 100); // Speed of typing
      
      return () => clearTimeout(timeoutId);
    } else {
      // Current text is complete, wait before moving to next text
      const timeoutId = setTimeout(() => {
        setDisplayedText('');
        setCurrentTextIndex(currentTextIndex + 1);
      }, 1500); // Pause between texts
      
      return () => clearTimeout(timeoutId);
    }
  }, [displayedText, currentTextIndex, welcomeTexts]);
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: 3
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4
          }}
        >
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#333',
              fontWeight: 'bold',
              position: 'relative'
            }}
          >
            {displayedText}
            <Box 
              component="span" 
              sx={{ 
                opacity: currentTextIndex < welcomeTexts.length ? 1 : 0,
                borderRight: '0.15em solid #333',
                animation: 'blink-caret 0.75s step-end infinite',
                '@keyframes blink-caret': {
                  'from, to': { borderColor: 'transparent' },
                  '50%': { borderColor: '#333' }
                }
              }}
            />
          </Typography>
        </Box>
        
        {showAuthForm && (
          <Paper 
            elevation={4}
            sx={{
              padding: 4,
              borderRadius: 2,
              opacity: 0,
              animation: 'fadeIn 0.8s forwards',
              '@keyframes fadeIn': {
                to: { opacity: 1 }
              },
              animationDelay: '0.3s'
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ mb: 3 }}>
              Create Account
            </Typography>
            
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                margin="normal"
                required
                InputProps={{
                  sx: { borderRadius: 1.5 }
                }}
              />
              
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                margin="normal"
                required
                InputProps={{
                  sx: { borderRadius: 1.5 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  bgcolor: '#4285f4',
                  borderRadius: 1.5,
                  '&:hover': {
                    bgcolor: '#3367d6'
                  }
                }}
              >
                Create Account
              </Button>
              
              <Box sx={{ position: 'relative', my: 3 }}>
                <Divider>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      px: 1,
                      color: 'text.secondary'
                    }}
                  >
                    OR
                  </Typography>
                </Divider>
              </Box>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                sx={{
                  color: '#555',
                  borderColor: '#ddd',
                  borderRadius: 1.5,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: alpha('#000', 0.04),
                    borderColor: '#bbb'
                  }
                }}
              >
                Continue with Google
              </Button>
              
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link 
                    href="/login"
                    style={{
                      color: '#4285f4',
                      textDecoration: 'none'
                    }}
                  >
                    Log In
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}
      </Container>
    </Box>
  );
}