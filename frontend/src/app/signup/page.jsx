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

export default function SignUp() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [confirmedEmail, setConfirmedEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
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
    "Welcome to Flexify",
    "Your Fitness Journey Starts Now",
    "Let's get you signed in"
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
        // TODO: Handle success
        router.push('/');
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

    let hasError = false;

    if (email !== confirmedEmail) {
      setEmailError('Email addresses do not match');
      hasError = true;
    }

    if (password !== confirmedPassword){
      setPasswordError('Passwords do not match');
    }

    // TODO: Handle Success
    if (!hasError){
      setIsLoading(true);

      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register/`, {
        username: username,
        email: email,
        password: password
      })
      .then(response => {
        const data = response.data;

        localStorage.setItem('access_token', data.tokens.access);
        localStorage.setItem('refresh_token', data.tokens.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));

        showNotification('Account created successfully! Redirecting...', 'success');
  
        // Short delay before redirect for user to see success message
        setTimeout(() => {
          router.push('/');
        }, 1500);
      })
      .catch(error => {
        console.error('Registration error:', error);
        let errorMessage = 'Registration failed. Please try again.';
        
        if (error.response && error.response.data) {
          // Handle field-specific errors
          if (error.response.data.email) {
            setEmailError(error.response.data.email[0]);
            errorMessage = `Email error: ${error.response.data.email[0]}`;
          }
          if (error.response.data.username) {
            setUsernameError(error.response.data.username[0]);
            errorMessage = `Username error: ${error.response.data.username[0]}`;
          }
          if (error.response.data.password) {
            setPasswordError(error.response.data.password[0]);
            errorMessage = `Password error: ${error.response.data.password[0]}`;
          }
          if (error.response.data.error || error.response.data.detail) {
            const serverError = error.response.data.error || error.response.data.detail;
            setGeneralError(serverError);
            errorMessage = serverError;
          }
        } else {
          setGeneralError(errorMessage);
        }
        
        // Always show notification for any error
        showNotification(errorMessage);
      })
      .finally(() => {
        setIsLoading(false);
      }) 
    }
  }

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
                color: '#e0e0e0', // Lighter text for dark background
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
                Create Account
              </Typography>
              
              <Box component="form" sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  margin="normal"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  InputProps={{
                    sx: { borderRadius: 1.5 }
                  }}
                  
                />

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
                />

                <TextField
                  fullWidth
                  label="Confirm Email"
                  variant="outlined"
                  margin="normal"
                  required
                  value={confirmedEmail}
                  onChange={(e) => setConfirmedEmail(e.target.value)}
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
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  margin="normal"
                  required
                  value={confirmedPassword}
                  onChange={(e) => setConfirmedPassword(e.target.value)}
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
                
                <Button
                  onClick={handleSubmit}
                  fullWidth
                  variant="contained"
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
                  Create Account
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
                    Already have an account?{' '}
                    <Link 
                      href="/login"
                      style={{
                        color: '#ce93d8',
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