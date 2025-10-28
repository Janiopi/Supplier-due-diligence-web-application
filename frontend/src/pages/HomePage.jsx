import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import SupplierList from '../components/suppliers/SupplierList';

const HomePage = () => {
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Supplier Due Diligence System
        </Typography>
        <SupplierList />
      </Box>
    </Container>
  );
};

export default HomePage;
