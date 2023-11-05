import React, { useState, useEffect } from 'react';
import { Grid, Button, Container, Typography, Paper } from '@mui/material';
import SearchGitHubComponent from '../components/SearchGitHubComponent';
import { fetchUniqueLabelNames, getLabelInfoByName } from '../API/labelAPI';
import CardWrapper from '../components/CardWrapper';
import LabelSettings from '../components/LabelInfoComponent';
import BenchmarkComponent from '../components/BenchmarkComponent';


function SettingsPage() {
  const [labels, setLabels] = useState([]);
  const [labelInfo, setLabelInfo] = useState(null);
  const [selectedLabelName, setSelectedLabelName] = useState('');

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
    setSelectedLabelName(labelName);
  };

  return (
    <Container style={{ background: '#f5f5f5', padding: '20px', borderRadius: '15px' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CardWrapper >
          <h2>Create New Label</h2>
          <SearchGitHubComponent />
          </CardWrapper>
      </Grid>
      <Grid item xs={12} >
        <CardWrapper>
          <h2>Labels</h2>
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
          </CardWrapper>
      </Grid>
      <Grid item xs={12} >
        <CardWrapper>
        <h2>Label Settings</h2>
          {labelInfo && <LabelSettings info={labelInfo} selectedLabelName={selectedLabelName} />}
        </CardWrapper>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <CardWrapper>
        <BenchmarkComponent/>
        </CardWrapper>
      </Grid>
    </Container>
  );
}

export default SettingsPage;
