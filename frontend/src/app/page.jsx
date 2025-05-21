'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Box, Typography, Button } from '@mui/material';

export default function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Use Next.js environment variables
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hello/`)
      .then(res => setMessage(res.data.message))
      .catch(err => console.error(err));
  }, []);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 3 
      }}
    >
      <Typography variant="h2" component="h1" gutterBottom>
        {message || "Loading..."}
      </Typography>
    </Box>
  );
}
