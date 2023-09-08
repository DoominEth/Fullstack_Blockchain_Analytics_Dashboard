import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

function CardWrapper({ children, title }) {
  return (
    <Card style={{ display: 'flex', flexDirection: 'column', background: 'darkgray', border: '2px solid white', borderRadius: '15px' }}>
      <CardContent style={{ flex: 1 }}>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
}

export default CardWrapper;
