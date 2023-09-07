import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <Drawer variant="permanent" anchor="left">
      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/page1">
          <ListItemText primary="Page 1" />
        </ListItem>
        {/* Add more links as needed */}
      </List>
    </Drawer>
  );
}

export default Navbar;
