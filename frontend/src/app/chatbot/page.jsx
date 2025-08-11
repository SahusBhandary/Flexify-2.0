'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Roboto } from 'next/font/google';
import { 
  Box, 
  Typography, 
  Container, 
  TextField,
  IconButton,
  Paper,
  Avatar,
  createTheme,
  ThemeProvider,
  InputAdornment,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Navbar from '../../components/Navbar';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const ChatBot = () => {
  const [user, setUser] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm Flex AI, your personal fitness and nutrition assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

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

  const quickActions = [
    { label: 'Create workout plan', icon: <FitnessCenterIcon sx={{ fontSize: 16 }} />, category: 'workout' },
    { label: 'Suggest healthy meals', icon: <RestaurantIcon sx={{ fontSize: 16 }} />, category: 'nutrition' },
    { label: 'Track my progress', icon: <TrendingUpIcon sx={{ fontSize: 16 }} />, category: 'progress' },
    { label: 'Set fitness goals', icon: <FitnessCenterIcon sx={{ fontSize: 16 }} />, category: 'goals' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setIsClient(true);
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Error Parsing User Data:", e);
      }
    }
  }, []);

  if (!isClient){
    return <div>Loading...</div>
  }

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response (you'll replace this with actual API call)
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: "I understand you're asking about: \"" + inputMessage + "\". This is where I would provide a helpful response based on your fitness and nutrition needs. I'm currently in development mode!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action) => {
    setInputMessage(action.label);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #121212 0%, #2d2d3a 50%, #1a1a2e 100%)' }}>
        <Navbar setUser={setUser} />
        
        <Container maxWidth="lg" sx={{ pt: 4, pb: 2, height: 'calc(100vh - 80px)' }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                mx: 'auto',
                mb: 2,
                background: 'linear-gradient(45deg, #8e24aa 30%, #ce93d8 90%)',
              }}
            >
              <SmartToyIcon sx={{ fontSize: 30 }} />
            </Avatar>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #ffffff, #ce93d8)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              Flex AI Assistant
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Your personal fitness and nutrition coach powered by AI
            </Typography>
          </Box>

          {/* Chat Container */}
          <Paper
            elevation={6}
            sx={{
              height: 'calc(100vh - 300px)',
              background: 'linear-gradient(135deg, rgba(30, 30, 47, 0.9) 0%, rgba(45, 45, 58, 0.9) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Messages Area */}
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                p: 3,
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(142, 36, 170, 0.5)',
                  borderRadius: '3px',
                },
              }}
            >
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                    mb: 2,
                    alignItems: 'flex-start'
                  }}
                >
                  {message.type === 'bot' && (
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        mr: 1,
                        background: 'linear-gradient(45deg, #8e24aa 30%, #ce93d8 90%)',
                      }}
                    >
                      <SmartToyIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                  )}
                  
                  <Box
                    sx={{
                      maxWidth: '70%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: message.type === 'user' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        background: message.type === 'user' 
                          ? 'linear-gradient(45deg, #8e24aa 30%, #ce93d8 90%)'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: message.type === 'bot' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                        color: '#ffffff',
                        wordBreak: 'break-word'
                      }}
                    >
                      <Typography variant="body1" sx={{ lineHeight: 1.5 }}>
                        {message.content}
                      </Typography>
                    </Paper>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        mt: 0.5,
                        fontSize: '0.75rem'
                      }}
                    >
                      {formatTime(message.timestamp)}
                    </Typography>
                  </Box>

                  {message.type === 'user' && (
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        ml: 1,
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                  )}
                </Box>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      mr: 1,
                      background: 'linear-gradient(45deg, #8e24aa 30%, #ce93d8 90%)',
                    }}
                  >
                    <SmartToyIcon sx={{ fontSize: 16 }} />
                  </Avatar>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Flex AI is typing...
                    </Typography>
                  </Paper>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

            {/* Quick Actions */}
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Quick Actions:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {quickActions.map((action, index) => (
                  <Chip
                    key={index}
                    icon={action.icon}
                    label={action.label}
                    variant="outlined"
                    size="small"
                    onClick={() => handleQuickAction(action)}
                    sx={{
                      color: '#ce93d8',
                      borderColor: 'rgba(206, 147, 216, 0.5)',
                      '&:hover': {
                        borderColor: '#ce93d8',
                        backgroundColor: 'rgba(206, 147, 216, 0.1)',
                      }
                    }}
                  />
                ))}
              </Stack>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

            {/* Input Area */}
            <Box sx={{ p: 2 }}>
              <TextField
                fullWidth
                multiline
                maxRows={3}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about fitness, nutrition, or wellness..."
                variant="outlined"
                InputProps={{
                  sx: { 
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#8e24aa',
                    }
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleSendMessage}
                        disabled={inputMessage.trim() === '' || isTyping}
                        sx={{
                          background: inputMessage.trim() !== '' && !isTyping 
                            ? 'linear-gradient(45deg, #8e24aa 30%, #ce93d8 90%)'
                            : 'rgba(255, 255, 255, 0.1)',
                          color: '#ffffff',
                          '&:hover': {
                            background: inputMessage.trim() !== '' && !isTyping 
                              ? 'linear-gradient(45deg, #7b1fa2 30%, #ba68c8 90%)'
                              : 'rgba(255, 255, 255, 0.2)',
                          },
                          '&:disabled': {
                            color: 'rgba(255, 255, 255, 0.3)',
                          }
                        }}
                      >
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    color: '#ffffff',
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  }
                }}
              />
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ChatBot;