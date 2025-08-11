'use client';

import { AppBar } from "@mui/material"
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import NextLink from 'next/link';
import { isAuthenticated } from "./AuthFunctions";
import { logout } from "./AuthFunctions";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

const Navbar = (props) => {
  const { setUser } = props;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, [])

  const homeOnClick = () => {
    router.push('/');
  }

  const openLogoutDialog = () => {
    setLogoutDialogOpen(true);
  }

  const closeLogoutDialog = () => {
    setLogoutDialogOpen(false);
  }

  const handleLogout = () => {
    setUser(null);
    logout();
    setIsLoggedIn(false);
    setLogoutDialogOpen(false);
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {/* Logo / Title */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, '&:hover': {cursor: 'pointer',}}} onClick={homeOnClick}>
            Flexify
          </Typography>

          {/* Nav links */}
          <Button color="inherit" component={NextLink} href="/">Home</Button>
          <Button color="inherit" component={NextLink} href="/workouts">Workouts</Button>
          <Button color="inherit" component={NextLink} href="/diet">Diet Planning</Button>
          <Button color="inherit" component={NextLink} href="/chatbot">Ask Flex AI</Button>
          <Button color="inherit" component={NextLink} href="/analytics">Analytics</Button>
          <Button color="inherit" component={NextLink} href="/profile">Profile</Button>
          {isLoggedIn ? 
            <Button color="inherit" onClick={openLogoutDialog}>{'Logout'}</Button> :
            <Button color="inherit" component={NextLink} href="/signup">{'Login'}</Button>
          }
        </Toolbar>
      </AppBar>
      <Dialog
        open={logoutDialogOpen}
        onClose={closeLogoutDialog}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
        PaperProps={{
          sx: {
            bgcolor: 'background.paper', // Uses theme's paper color (#1e1e2f)
            borderRadius: 2, // Rounded corners
            border: '1px solid rgba(255, 255, 255, 0.12)', // Subtle border
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)', // Deeper shadow
            minWidth: '320px', // Ensures dialog isn't too small
          }
        }}
      >
        <DialogTitle id="logout-dialog-title" sx={{ 
          pb: 1,
          color: '#e0e0e0',
          fontWeight: 500,
        }}>
          Confirm Logout
        </DialogTitle>
        
        <DialogContent>
          <DialogContentText id="logout-dialog-description" sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            pb: 1 
          }}>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={closeLogoutDialog}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              borderRadius: 1.5,
              px: 2,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.08)',
              }
            }}
          >
            Cancel
          </Button>
          
          <Button 
            onClick={handleLogout}
            variant="contained"
            autoFocus
            sx={{
              borderRadius: 1.5,
              px: 2,
              background: 'linear-gradient(45deg, #8e24aa 30%, #aa66cc 90%)',
              color: '#ffffff',
              fontWeight: 500,
              '&:hover': {
                background: 'linear-gradient(45deg, #7b1fa2 30%, #9c27b0 90%)'
              }
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>

    
    
  );
}

export default Navbar;