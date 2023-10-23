import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { fetchHashLogEvents } from '../API/initialContractDataAPI';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function ContractInformationComponent({ contractData = {} }) {
  const [value, setValue] = useState(0);
  const [fetchedData, setFetchedData] = useState(null);


useEffect(() => {
  const fetchData = async () => {
    try {
      if (contractData.id) {
        const data = await fetchHashLogEvents(contractData.id);
        console.log(data.data)
        setFetchedData(data.data);

      }
    } catch (error) {
      console.error("Error fetching hash functions:", error);
    }
  };

  fetchData();
}, [contractData.id]);


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  console.log("Is fetchedData an array?", Array.isArray(fetchedData));

  return (
    <div>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="contract information tabs">
          <Tab label="General" {...a11yProps(0)} />
          <Tab label="Events" {...a11yProps(1)} />
          <Tab label="Functions" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        Address: {contractData.id ?? "Not Available"}
      </CustomTabPanel>
<CustomTabPanel value={value} index={1}>
  {
    typeof fetchedData === "string" ?
    JSON.parse(fetchedData).map((event, index) => (
      <div key={index} style={{ marginBottom: "10px" }}>
        <Typography variant="h6">{event.event_name}</Typography>
        <Typography variant="body1">Event and Params: {event.event_and_params}</Typography>
        <Typography variant="body2">Hash: {event.event_signature.substring(0, 6)}</Typography>
      </div>
    ))
    :
    <Typography variant="body1">No events fetched.</Typography>
  }
</CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Functions: {contractData.functions?.join(", ") ?? "No Functions"}
      </CustomTabPanel>
    </div>
  );
}
