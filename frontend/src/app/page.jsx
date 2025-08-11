'use client';

import React, { useState, useEffect } from 'react';
import { Roboto } from 'next/font/google';
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  Grid, 
  Card,
  CardContent,
  createTheme,
  ThemeProvider,
  IconButton,
  Chip,
  Stack
} from '@mui/material';
import { useRouter } from 'next/navigation';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Navbar from '../components/Navbar';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Error Parsing User Data:", e);
      }
    }
  }, []);
  
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#8e24aa',
      },
      background: {
        paper: '#1e1e2f',
        default: '#121212',
      },
      text: {
        primary: '#ffffff',
        secondary: 'rgba(255, 255, 255, 0.7)',
      }
    },
    typography: {
      fontFamily: roboto.style.fontFamily,
    },
  });

  const features = [
    {
      icon: <SmartToyIcon sx={{ fontSize: 40, color: '#8e24aa' }} />,
      title: 'AI-Powered Coaching',
      description: 'Get personalized workout and diet recommendations powered by advanced machine learning algorithms.'
    },
    {
      icon: <FitnessCenterIcon sx={{ fontSize: 40, color: '#8e24aa' }} />,
      title: 'Smart Workouts',
      description: 'Adaptive training programs that evolve with your fitness level and goals.'
    },
    {
      icon: <RestaurantIcon sx={{ fontSize: 40, color: '#8e24aa' }} />,
      title: 'Intelligent Nutrition',
      description: 'AI-driven meal planning that considers your dietary preferences and fitness objectives.'
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#8e24aa' }} />,
      title: 'Progress Analytics',
      description: 'Advanced analytics to track your progress and optimize your fitness journey.'
    }
  ];

  const quickActions = [
    { title: 'Document Workouts', icon: <FitnessCenterIcon />, path: '/workouts', color: '#ff6b35' },
    { title: 'Plan Diet', icon: <RestaurantIcon />, path: '/diet', color: '#4ecdc4' },
    { title: 'Ask AI', icon: <SmartToyIcon />, path: '/chatbot', color: '#8e24aa' },
    { title: 'Profile', icon: <PersonIcon />, path: '/profile', color: '#ffd23f' }
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #121212 0%, #2d2d3a 50%, #1a1a2e 100%)' }}>
        <Navbar setUser={setUser} />
        
        {/* Hero Section */}
        <Container maxWidth="lg" sx={{ pt: 8, pb: 6 }}>
          <Box
            sx={{
              textAlign: 'center',
              mb: 8,
              position: 'relative'
            }}
          >
            {/* Animated background elements */}
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                left: '10%',
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #8e24aa, #ce93d8)',
                opacity: 0.1,
                animation: 'float 6s ease-in-out infinite',
                '@keyframes float': {
                  '0%, 100%': { transform: 'translateY(0px)' },
                  '50%': { transform: 'translateY(-20px)' }
                }
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 50,
                right: '15%',
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #8e24aa, #ce93d8)',
                opacity: 0.05,
                animation: 'float 8s ease-in-out infinite reverse',
              }}
            />
            
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '3rem', md: '4.5rem' },
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #ffffff, #ce93d8)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2
              }}
            >
              Welcome to Flexify
            </Typography>
            
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                color: 'text.secondary',
                mb: 2,
                fontWeight: 300
              }}
            >
              Your AI-Powered Fitness Companion
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                maxWidth: 600,
                mx: 'auto',
                color: 'text.secondary',
                mb: 4,
                lineHeight: 1.6
              }}
            >
              Transform your fitness journey with machine learning-powered workouts, 
              intelligent nutrition planning, and personalized coaching that adapts to your goals.
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" gap={2}>
              {user && <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => router.push('/workouts')}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  background: 'linear-gradient(45deg, #8e24aa 30%, #ce93d8 90%)',
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #7b1fa2 30%, #ba68c8 90%)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                View Your Workouts!
              </Button>}
              {!user && <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => router.push('/signup')}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  background: 'linear-gradient(45deg, #8e24aa 30%, #ce93d8 90%)',
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #7b1fa2 30%, #ba68c8 90%)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Start Your Journey
              </Button>}


              
              <Button
                variant="outlined"
                size="large"
                startIcon={<PlayArrowIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  borderColor: '#8e24aa',
                  color: '#8e24aa',
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#ce93d8',
                    backgroundColor: 'rgba(142, 36, 170, 0.1)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Watch Demo
              </Button>
            </Stack>
          </Box>

          {/* User Welcome Section */}
          {user && (
            <Box
              sx={{
                textAlign: 'center',
                mb: 6,
                p: 3,
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(142, 36, 170, 0.1) 0%, rgba(206, 147, 216, 0.1) 100%)',
                border: '1px solid rgba(142, 36, 170, 0.3)'
              }}
            >
              <Typography variant="h5" sx={{ mb: 1, color: '#ce93d8' }}>
                Welcome back, {user.username || user.email}!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Ready to continue your fitness journey?
              </Typography>
            </Box>
          )}

          {/* Quick Actions */}
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h4"
              sx={{
                textAlign: 'center',
                mb: 4,
                fontWeight: 'bold',
                color: 'text.primary'
              }}
            >
              Quick Actions
            </Typography>
            
            <Grid container spacing={3}>
              {quickActions.map((action, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, rgba(30, 30, 47, 0.8) 0%, rgba(45, 45, 58, 0.8) 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 3,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 10px 30px rgba(${action.color === '#8e24aa' ? '142, 36, 170' : action.color === '#ff6b35' ? '255, 107, 53' : action.color === '#4ecdc4' ? '78, 205, 196' : '255, 210, 63'}, 0.3)`,
                        borderColor: action.color,
                      }
                    }}
                    onClick={() => router.push(action.path)}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <IconButton
                        sx={{
                          backgroundColor: `${action.color}20`,
                          color: action.color,
                          mb: 2,
                          '&:hover': { backgroundColor: `${action.color}30` }
                        }}
                      >
                        {action.icon}
                      </IconButton>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {action.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Features Section */}
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h4"
              sx={{
                textAlign: 'center',
                mb: 2,
                fontWeight: 'bold',
                color: 'text.primary'
              }}
            >
              Powered by AI & Machine Learning
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                mb: 6,
                color: 'text.secondary',
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              Experience the future of fitness with our cutting-edge technology
            </Typography>

            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, rgba(30, 30, 47, 0.6) 0%, rgba(45, 45, 58, 0.6) 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 3,
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        borderColor: 'rgba(142, 36, 170, 0.5)',
                        boxShadow: '0 10px 30px rgba(142, 36, 170, 0.2)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        {feature.icon}
                        <Typography
                          variant="h5"
                          sx={{
                            ml: 2,
                            fontWeight: 'bold',
                            color: 'text.primary'
                          }}
                        >
                          {feature.title}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'text.secondary',
                          lineHeight: 1.6
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* CTA Section */}
          <Box
            sx={{
              textAlign: 'center',
              p: 6,
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(142, 36, 170, 0.1) 0%, rgba(206, 147, 216, 0.1) 100%)',
              border: '1px solid rgba(142, 36, 170, 0.3)'
            }}
          >
            <Typography
              variant="h4"
              sx={{
                mb: 2,
                fontWeight: 'bold',
                color: 'text.primary'
              }}
            >
              Ready to Transform Your Fitness?
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                color: 'text.secondary',
                maxWidth: 500,
                mx: 'auto'
              }}
            >
              Join thousands of users who have revolutionized their fitness journey with AI-powered coaching
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="center">
              <Chip label="🤖 AI Coaching" variant="outlined" sx={{ color: '#8e24aa', borderColor: '#8e24aa' }} />
              <Chip label="📊 Smart Analytics" variant="outlined" sx={{ color: '#8e24aa', borderColor: '#8e24aa' }} />
              <Chip label="🎯 Personalized Plans" variant="outlined" sx={{ color: '#8e24aa', borderColor: '#8e24aa' }} />
            </Stack>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
