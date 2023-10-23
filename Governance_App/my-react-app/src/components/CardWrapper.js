import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

function CardWrapper({ children, title }) {
  return (
    <Card style={{
      maxWidth: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'rgba(0,102,255, 0.5)',
      border: '2px solid white',
      borderRadius: '30px'
    }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
}

export default CardWrapper;
