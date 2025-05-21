'use client';

import './globals.css';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import GoogleOAuthWrapper from '@/components/GoogleOAuthWrapper';
import { Google } from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4285f4',
    },
    secondary: {
      main: '#19857b',
    },
  },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Flexify</title>
        <meta name="description" content="Flexify - Your Fitness App" />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <GoogleOAuthWrapper>
            <CssBaseline />
            {children}
          </GoogleOAuthWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
