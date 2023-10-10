import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import SearchComponent from './components/SearchComponent';
import SettingsPage from './pages/SettingsPage';
import { Box, Container } from '@mui/material';

function App() {
  const [searchData, setSearchData] = useState({
    graphData1: null,
    graphData2: null,
  });

  return (
    <Router>
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Box display="flex" flexGrow={1}>
          <Navbar />
           <Box flex={1} >
          <Box >
          <SearchComponent onSearch={setSearchData} />
          </Box>
            <Routes>
              <Route path="/" element={<HomePage data={searchData} />} />
              <Route path="/SettingsPage" element={<SettingsPage />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </Router>
  );
}


export default App;
