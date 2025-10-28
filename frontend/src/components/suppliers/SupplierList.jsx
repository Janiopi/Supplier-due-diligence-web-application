import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { Edit, Delete, Visibility, Security } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { supplierService } from '../../services/api';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await supplierService.getAll();
        setSuppliers(data);
        setLoading(false);
      } catch (error) {
        setError('Error loading suppliers');
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await supplierService.delete(id);
        setSuppliers(suppliers.filter((p) => p.id !== id));
      } catch (error) {
        setError('Error deleting supplier');
      }
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Suppliers</Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/suppliers/new"
        >
          New Supplier
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Business Name</TableCell>
              <TableCell>Tax ID</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Annual Revenue ($)</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>{supplier.businessName}</TableCell>
                <TableCell>{supplier.taxId}</TableCell>
                <TableCell>{supplier.country}</TableCell>
                <TableCell>
                  ${supplier.annualRevenue.toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(supplier.lastUpdated).toLocaleString()}
                </TableCell>
                <TableCell>
                  <IconButton
                    component={Link}
                    to={`/suppliers/${supplier.id}`}
                    size="small"
                    color="primary"
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    component={Link}
                    to={`/suppliers/edit/${supplier.id}`}
                    size="small"
                    color="secondary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(supplier.id)}
                    size="small"
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                  <IconButton
                    component={Link}
                    to={`/screening/${supplier.id}`}
                    size="small"
                    color="success"
                  >
                    <Security />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SupplierList;
