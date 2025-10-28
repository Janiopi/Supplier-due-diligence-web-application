import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  MenuItem,
  Paper,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { supplierService } from '../../services/api';

const countries = [
  'Argentina',
  'Bolivia',
  'Brazil',
  'Chile',
  'Colombia',
  'Ecuador',
  'Paraguay',
  'Peru',
  'Uruguay',
  'Venezuela',
];

const SupplierForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    businessName: '',
    tradeName: '',
    taxId: '',
    phoneNumber: '',
    email: '',
    website: '',
    address: '',
    country: '',
    annualRevenue: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      const fetchSupplier = async () => {
        try {
          setLoading(true);
          const data = await supplierService.getById(id);
          setFormData({
            id: data.id,
            businessName: data.businessName,
            tradeName: data.tradeName,
            taxId: data.taxId,
            phoneNumber: data.phoneNumber,
            email: data.email,
            website: data.website,
            address: data.address,
            country: data.country,
            annualRevenue: data.annualRevenue.toString(),
          });
          setLoading(false);
        } catch (error) {
          console.error('Error loading supplier', error);
          setLoading(false);
        }
      };

      fetchSupplier();
    }
  }, [id, isEditing]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!formData.taxId.trim()) {
      newErrors.taxId = 'Tax ID is required';
    } else if (!/^\d{11}$/.test(formData.taxId)) {
      newErrors.taxId = 'Tax ID must have 11 numeric digits';
    }

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (formData.website && !/^https?:\/\/\S+\.\S+/.test(formData.website)) {
      newErrors.website = 'Invalid website format';
    }

    if (!formData.country) {
      newErrors.country = 'Country is required';
    }

    if (!formData.annualRevenue) {
      newErrors.annualRevenue = 'Annual revenue is required';
    } else if (
      isNaN(Number(formData.annualRevenue)) ||
      Number(formData.annualRevenue) < 0
    ) {
      newErrors.annualRevenue = 'Annual revenue must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const dataToSubmit = {
        ...formData,
        annualRevenue: Number(formData.annualRevenue),
      };

      if (isEditing) {
        await supplierService.update(id, dataToSubmit);
      } else {
        await supplierService.create(dataToSubmit);
      }

      setLoading(false);
      navigate('/');
    } catch (error) {
      console.error('Error saving supplier', error);
      setLoading(false);
    }
  };

  if (loading && isEditing) return <CircularProgress />;

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        {isEditing ? 'Edit Supplier' : 'New Supplier'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              name="businessName"
              label="Business Name"
              fullWidth
              required
              value={formData.businessName}
              onChange={handleChange}
              error={!!errors.businessName}
              helperText={errors.businessName}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name="tradeName"
              label="Trade Name"
              fullWidth
              value={formData.tradeName}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name="taxId"
              label="Tax ID (11 digits)"
              fullWidth
              required
              value={formData.taxId}
              onChange={handleChange}
              error={!!errors.taxId}
              helperText={errors.taxId}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name="phoneNumber"
              label="Phone Number"
              fullWidth
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name="email"
              label="Email"
              fullWidth
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name="website"
              label="Website"
              fullWidth
              value={formData.website}
              onChange={handleChange}
              error={!!errors.website}
              helperText={errors.website}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="address"
              label="Address"
              fullWidth
              value={formData.address}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name="country"
              label="Country"
              select
              fullWidth
              required
              value={formData.country}
              onChange={handleChange}
              error={!!errors.country}
              helperText={errors.country}
            >
              {countries.map((country) => (
                <MenuItem key={country} value={country}>
                  {country}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name="annualRevenue"
              label="Annual Revenue (USD)"
              fullWidth
              required
              type="number"
              value={formData.annualRevenue}
              onChange={handleChange}
              error={!!errors.annualRevenue}
              helperText={errors.annualRevenue}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : isEditing ? (
              'Update'
            ) : (
              'Create'
            )}
          </Button>

          <Button variant="outlined" onClick={() => navigate('/')}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default SupplierForm;
