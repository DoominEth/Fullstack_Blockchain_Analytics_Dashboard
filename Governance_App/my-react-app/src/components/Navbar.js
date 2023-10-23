import React from 'react';
import { Drawer, List, ListItem, ListItemText, Divider, Typography, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard'; 

function Navbar() {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      anchor="left"

    >
      <Box sx={{ display: 'flex', alignItems: 'center', padding: '8px', justifyContent: 'space-between' }}>
        <Typography variant="h6" noWrap component="div">
          Data Analytics
        </Typography>
        <DashboardIcon /> 
      </Box>
      <Divider />
      <List>
        <ListItem button component={Link} to="/" selected={location.pathname === '/'}>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem 
            button 
            component={Link} 
            to="/SettingsPage" 
            selected={location.pathname === '/SettingsPage'}
        >
            <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </Drawer>
  );
}

export default Navbar;
