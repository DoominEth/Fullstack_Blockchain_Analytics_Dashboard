import React, { useState, useEffect } from 'react';
import { Grid, Button, Container, Typography, Paper } from '@mui/material';
import SearchGitHubComponent from '../components/SearchGitHubComponent';
import { fetchUniqueLabelNames, getLabelInfoByName } from '../API/labelAPI';

function SettingsPage() {
  const [labels, setLabels] = useState([]);
  const [labelInfo, setLabelInfo] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const labelNames = await fetchUniqueLabelNames();
      setLabels(labelNames);
    }
    fetchData();
  }, []);

  const handleButtonClick = async (labelName) => {
    const info = await getLabelInfoByName(labelName);
    setLabelInfo(JSON.parse(info.data));
  };

  return (
    <div>
      <h1>Settings Page</h1>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <h2>Create New Label</h2>
          <SearchGitHubComponent />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          {labels.map((label, index) => (
            <Button
              key={index}
              variant="contained"
              onClick={() => handleButtonClick(label)}
              sx={{ margin: '10px' }}
            >
              {label}
            </Button>
          ))}
        </Grid>
      </Grid>
      <Container maxWidth="md">
        {labelInfo && labelInfo.map((info, index) => (
          <Paper key={index} elevation={3} sx={{ margin: '10px', padding: '10px' }}>
            <Typography variant="body1">Event Name: {info.event_name}</Typography>
            <Typography variant="body1">Event and Params: {info.event_and_params}</Typography>
            <Typography variant="body1">Event Signature: {info.event_signature}</Typography>
          </Paper>
        ))}
      </Container>
    </div>
  );
}

export default SettingsPage;
