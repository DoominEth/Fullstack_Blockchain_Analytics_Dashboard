import React, { useState, useEffect  } from 'react';
import { Typography, Paper, Switch, FormControlLabel, Slider, Button, Grid } from '@mui/material';
import { updateLabelData } from '../API/labelAPI';

const LabelSettings = ({ info, selectedLabelName  }) => {
  const [toggles, setToggles] = useState(info.map(label => label.include));
  const [sliderValue, setSliderValue] = useState(info[0]?.percentage_match || 50);
  const [stopWhenMatchFound, setStopWhenMatchFound] = useState(info[0]?.stop_on_match || false); 
const handleStopWhenMatchFoundToggle = () => {
  setStopWhenMatchFound(prevState => !prevState);
};

  useEffect(() => {
    setToggles(info.map(label => label.include));
    setSliderValue(info[0]?.percentage_match || 50);
    setStopWhenMatchFound(info[0]?.stop_on_match || false);
  }, [info]); 


  const handleToggle = (index) => {
    // Update the specific toggle based on the index
    setToggles(toggleStates => {
      const newToggles = [...toggleStates];
      newToggles[index] = !newToggles[index];
      return newToggles;
    });
  };

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };


const onSave = async () => {
    const updatedLabels = info.map((label, index) => ({
        event_signature: label.event_signature,
        include: toggles[index]
    }));

    const updatedData = {
        labelName: selectedLabelName,
        labels: updatedLabels,
        percentage_match: sliderValue,
        stop_on_match: stopWhenMatchFound
    };
    
    // Log the data
    console.log(updatedData);

    try {
        const response = await updateLabelData(selectedLabelName, updatedData);
        if (response.status === 'Data updated successfully') {
            // Handle successful update (e.g. Show a success message to the user)
        } else {
            // Handle error in updating data (e.g. Show an error message to the user)
        }
    } catch (error) {
        console.error("Error updating label data:", error);
        // Handle error in API call (e.g. Show an error message to the user)
    }
};



  return (
    <div>
        <Typography variant="h5">{selectedLabelName}</Typography>
      {info.map((label, index) => (
        <Paper key={index} elevation={3} sx={{ margin: '10px', padding: '10px' }}>
          <Typography variant="body1">Event Name: {label.event_name}</Typography>
          <Typography variant="body1">Event and Params: {label.event_and_params}</Typography>
          <Typography variant="body1">Event Signature: {label.event_signature}</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={toggles[index]}
                onChange={() => handleToggle(index)}
                name={`toggleSwitch-${index}`}
                color="primary"
              />
            }
            label={toggles[index] ? "On" : "Off"}
          />
        </Paper>
      ))}
      
      <Typography gutterBottom>Percentage Match</Typography>
      <Slider
        value={sliderValue}
        onChange={handleSliderChange}
        aria-labelledby="continuous-slider"
        valueLabelDisplay="auto"
        min={1}
        max={100}
      />


<Grid container justifyContent="space-between" alignItems="center" spacing={2}>
  <Grid item>
    <FormControlLabel
      control={
        <Switch
          checked={stopWhenMatchFound}
          onChange={handleStopWhenMatchFoundToggle}
          name="stopWhenMatchFoundToggle"
          color="primary"
        />
      }
      label="Stop When Match Found"
    />
  </Grid>

  <Grid item>
    <Button variant="contained" color="primary" onClick={onSave}>
      Save
    </Button>
  </Grid>
</Grid>
    </div>
  );
};

export default LabelSettings;
