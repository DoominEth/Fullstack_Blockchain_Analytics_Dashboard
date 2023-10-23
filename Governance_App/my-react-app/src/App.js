import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import SearchComponent from './components/SearchComponent';
import SettingsPage from './pages/SettingsPage';
import { Box, Container, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const initialTheme = createTheme();

const theme = createTheme(initialTheme, {
  components: {
    MuiContainer: {
      styleOverrides: {
        maxWidthLg: {
          [initialTheme.breakpoints.up('lg')]: {
            maxWidth: 2400
          }
        }
      }
    }
  }
});

    


function App() {
  const [searchData, setSearchData] = useState({
    graphData1: null,
    graphData2: null,
  });

return (
  <ThemeProvider theme={theme}>
    <Router>
      <Grid container spacing={2}>
        <Grid item xs={1}>
          <Navbar />
        </Grid>
        <Grid item xs={11}>
          <Grid container direction="column" spacing={2}>
            <Grid item xs={12}>
              <SearchComponent onSearch={setSearchData} />
            </Grid>
            <Grid item xs={12}>
              <Routes>
                <Route path="/" element={<HomePage data={searchData} />} />
                <Route path="/SettingsPage" element={<SettingsPage />} />
              </Routes>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Router>
  </ThemeProvider>
);
}

//<Container maxWidth='100%' style={{maxWidth:false , display: 'flex',  height: 'fit-content', width: 'fit-content' }}>
export default App;
