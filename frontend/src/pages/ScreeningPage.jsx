import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ScreeningModal from '../components/suppliers/ScreeningModal';
import { supplierService } from '../services/api';

const ScreeningPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const data = await supplierService.getById(id);
        setSupplier(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading supplier', error);
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (!supplier) return <Typography>Supplier not found</Typography>;

  return (
    <Container>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Supplier Screening
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1">
            <strong>Business Name:</strong> {supplier.businessName}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Tax ID:</strong> {supplier.taxId}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Country:</strong> {supplier.country}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setModalOpen(true)}
          >
            Perform Screening
          </Button>

          <Button variant="outlined" onClick={() => navigate('/')}>
            Back
          </Button>
        </Box>

        <ScreeningModal
          supplierId={parseInt(id)}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </Paper>
    </Container>
  );
};

export default ScreeningPage;
