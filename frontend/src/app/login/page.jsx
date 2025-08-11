'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Roboto } from 'next/font/google';
import { 
  Box, 
  Typography, 
  Container, 
  TextField, 
  Button, 
  Divider, 
  Paper,
  IconButton,
  InputAdornment,
  createTheme,
  ThemeProvider
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { alpha } from '@mui/material/styles';
import { useGoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function Login() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState('error');
  const router = useRouter();

  // Create dark theme
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#8e24aa', // Purple as primary color
      },
      background: {
        paper: '#1e1e2f',
        default: '#121212',
      },
    },
    typography: {
      fontFamily: roboto.style.fontFamily,
    },
  });
  
  const welcomeTexts = [
    "Welcome Back",
    "Let's Pick Up Where You Left Off",
    "Login to Continue"
  ];

  const showNotification = (message, severity = 'error') => {
    setNotificationMessage(message);
    setNotificationSeverity(severity);
    setNotificationOpen(true);
  };

  const hideNotification = () => {
    setNotificationOpen(false);
  };

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

  const handleGoogleButtonOnClick = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/`, 
        { token: tokenResponse.access_token }
      )
      .then(response => {
        const data = response.data
        localStorage.setItem('access_token', data.tokens.access);
        localStorage.setItem('refresh_token', data.tokens.refresh);
        localStorage.setItem('user', JSON.stringify(data.user))
        
        showNotification('Login successful! Redirecting...', 'success');
        
        // Redirect after success
        setTimeout(() => {
          router.push('/');
        }, 1500);
      })
      .catch(error => {
        console.error('Axios error:', error);
        let errorMessage = 'Google sign-in failed. Please try again.';
        if (error.response?.data?.detail) {
          errorMessage = error.response.data.detail;
        }
        showNotification(errorMessage);
      });
    },
    onError: (error) => console.error('Login Failed:', error),
    flow: 'implicit',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    // Validate form
    if (!email) {
      setEmailError('Email is required');
      return;
    }

    if (!password) {
      setPasswordError('Password is required');
      return;
    }

    setIsLoading(true);

    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login/`, {
      email: email,
      password: password
    })
    .then(response => {
      const data = response.data;

      localStorage.setItem('access_token', data.tokens.access);
      localStorage.setItem('refresh_token', data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(data.user));

      showNotification('Login successful! Redirecting...', 'success');

      // Short delay before redirect for user to see success message
      setTimeout(() => {
        router.push('/');
      }, 1500);
    })
    .catch(error => {
      console.error('Login error:', error);
      let errorMessage = 'Invalid email or password. Please try again.';
      
      if (error.response && error.response.data) {
        if (error.response.data.non_field_errors) {
          errorMessage = error.response.data.non_field_errors[0];
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        }
        setGeneralError(errorMessage);
      } else {
        setGeneralError(errorMessage);
      }
      
      showNotification(errorMessage);
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #121212 0%, #2d2d3a 100%)',
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
                color: '#e0e0e0',
                fontWeight: 'bold',
                position: 'relative'
              }}
            >
              {displayedText}
            </Typography>
          </Box>
          
          {showAuthForm && (
            <Paper 
              elevation={6}
              sx={{
                padding: 4,
                borderRadius: 2,
                opacity: 0,
                animation: 'fadeIn 0.8s forwards',
                '@keyframes fadeIn': {
                  to: { opacity: 1 }
                },
                animationDelay: '0.3s',
                backgroundColor: 'background.paper',
                border: '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ mb: 3, color: '#e0e0e0' }}>
                Login to Your Account
              </Typography>
              
              {generalError && (
                <Box 
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 1,
                    bgcolor: 'rgba(211, 47, 47, 0.1)',
                    borderLeft: '4px solid #d32f2f'
                  }}
                >
                  <Typography color="error" variant="body2">
                    {generalError}
                  </Typography>
                </Box>
              )}
              
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  margin="normal"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    sx: { borderRadius: 1.5 }
                  }}
                  error={!!emailError}
                  helperText={emailError}
                  FormHelperTextProps={{
                    sx: { color: theme => theme.palette.error.main }
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  margin="normal"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  error={!!passwordError}
                  helperText={passwordError}
                  FormHelperTextProps={{
                    sx: { color: theme => theme.palette.error.main }
                  }}
                />
                
                <Box sx={{ textAlign: 'right', mt: 1 }}>
                  <Link 
                    href="/forgot-password"
                    style={{
                      color: '#ce93d8',
                      textDecoration: 'none',
                      fontSize: '0.875rem'
                    }}
                  >
                    Forgot Password?
                  </Link>
                </Box>
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    borderRadius: 1.5,
                    background: 'linear-gradient(45deg, #8e24aa 30%, #aa66cc 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #7b1fa2 30%, #9c27b0 90%)'
                    }
                  }}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
                
                <Box sx={{ position: 'relative', my: 3 }}>
                  <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        px: 1,
                        color: 'rgba(255, 255, 255, 0.7)'
                      }}
                    >
                      OR
                    </Typography>
                  </Divider>
                </Box>
                
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleGoogleButtonOnClick}
                  startIcon={<GoogleIcon />}
                  sx={{
                    color: '#e0e0e0',
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                    borderRadius: 1.5,
                    py: 1.5,
                    '&:hover': {
                      bgcolor: alpha('#fff', 0.08),
                      borderColor: 'rgba(255, 255, 255, 0.5)'
                    }
                  }}
                >
                  Continue with Google
                </Button>
                
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                    Don't have an account?{' '}
                    <Link 
                      href="/signup"
                      style={{
                        color: '#ce93d8',
                        textDecoration: 'none'
                      }}
                    >
                      Sign up
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Paper>
          )}
        </Container>
      </Box>
      
      <Snackbar 
        open={notificationOpen} 
        autoHideDuration={6000} 
        onClose={hideNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={hideNotification} 
          severity={notificationSeverity}
          variant="filled"
          sx={{ 
            width: '100%', 
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            '.MuiAlert-message': {
              fontWeight: 500
            }
          }}
        >
          {notificationMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}