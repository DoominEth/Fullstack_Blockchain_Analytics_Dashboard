import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBarComponent';
import SearchComponent from './components/SearchComponent';
import SettingsPage from './pages/SettingsPage';  

function App() {
  return (
  
    <Router>

      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                      <div style={{ alignSelf: 'center', margin: '20px 0', width: '70%' }}>
          {/* <SearchBar /> */}
          <SearchComponent/>
        </div>
        <div style={{ display: 'flex', flexGrow: 1 }}>
          <Navbar />

          <div style={{ flex: 1, paddingLeft: 360 }}> {/* paddingLeft is the width of the sidebar */}
            <Routes>
              <Route path="/" element={<HomePage />} />
               <Route path="/SettingsPage" element={<SettingsPage />} /> 
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
