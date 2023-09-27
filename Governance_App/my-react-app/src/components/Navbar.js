import React from 'react';
import { Drawer, List, ListItem, ListItemText, Divider, Typography, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard'; // Temporary icon

function Navbar() {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 100,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 200,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', padding: '8px', justifyContent: 'space-between' }}>
        <Typography variant="h6" noWrap component="div">
          Data Analytics
        </Typography>
        <DashboardIcon /> {/* Temporary icon */}
      </Box>
      <Divider />
      <List>
        <ListItem button component={Link} to="/" selected={location.pathname === '/'}>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/page1" selected={location.pathname === '/page1'}>
          <ListItemText primary="Page 1" />
        </ListItem>
      </List>
    </Drawer>
  );
}

export default Navbar;
