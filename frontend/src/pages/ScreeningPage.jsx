import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { supplierService, screeningService } from '../services/api';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const ScreeningPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(null);
  const [entityName, setEntityName] = useState('');
  const [availableSources, setAvailableSources] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const [screeningResults, setScreeningResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sourcesLoading, setSourcesLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load supplier data if ID is provided
        if (id) {
          const supplierData = await supplierService.getById(id);
          setSupplier(supplierData);
          setEntityName(supplierData.businessName);
        }

        // Load available sources
        const sourcesResponse = await screeningService.getSources();
        if (sourcesResponse.success) {
          setAvailableSources(sourcesResponse.data);
        } else {
          setError('Failed to load screening sources');
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Error loading data. Please try again.');
      } finally {
        setSourcesLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleSourceChange = (event) => {
    const value = event.target.value;
    setSelectedSources(typeof value === 'string' ? value.split(',') : value);
  };

  const handleScreening = async () => {
    if (!entityName.trim()) {
      setError('Please enter an entity name to search');
      return;
    }

    setLoading(true);
    setError('');
    setScreeningResults(null);

    try {
      const results = await screeningService.screenEntity(
        entityName,
        selectedSources
      );
      setScreeningResults(results);
    } catch (error) {
      console.error('Screening error:', error);
      setError('Error performing screening. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  if (sourcesLoading) {
    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        <SecurityIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
        Due Diligence Screening
      </Typography>

      {supplier && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Supplier Information
          </Typography>
          <Typography>
            <strong>Business Name:</strong> {supplier.businessName}
          </Typography>
          <Typography>
            <strong>Tax ID:</strong> {supplier.taxId}
          </Typography>
          <Typography>
            <strong>Country:</strong> {supplier.country}
          </Typography>
        </Paper>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Screening Configuration
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Entity Name to Search"
              value={entityName}
              onChange={(e) => setEntityName(e.target.value)}
              placeholder="Enter business name or entity"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Sources</InputLabel>
              <Select
                multiple
                value={selectedSources}
                onChange={handleSourceChange}
                input={<OutlinedInput label="Select Sources" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const source = availableSources.find(
                        (s) => s.key === value
                      );
                      return <Chip key={value} label={source?.name || value} />;
                    })}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {availableSources.map((source) => (
                  <MenuItem key={source.key} value={source.key}>
                    <Box>
                      <Typography variant="body1">{source.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {source.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleScreening}
            disabled={loading || !entityName.trim()}
            startIcon={
              loading ? <CircularProgress size={20} /> : <SearchIcon />
            }
          >
            {loading ? 'Screening...' : 'Start Screening'}
          </Button>
          <Button variant="outlined" onClick={() => navigate('/')}>
            Back to Suppliers
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {screeningResults && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Screening Results
          </Typography>

          {screeningResults.success ? (
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Search ID: {screeningResults.data.searchId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Timestamp:{' '}
                  {new Date(screeningResults.data.timestamp).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Entity: {screeningResults.data.entityName}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">
                  Summary: {screeningResults.data.summary.successful}{' '}
                  successful, {screeningResults.data.summary.failed} failed
                </Typography>
              </Box>

              {screeningResults.data.results.map((result, index) => (
                <Accordion key={index} sx={{ mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      <Chip
                        label={result.status}
                        color={getStatusColor(result.status)}
                        size="small"
                        sx={{ mr: 2 }}
                      />
                      <Typography>{result.source}</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    {result.status === 'success' && result.data ? (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Found {result.data.count} results in{' '}
                          {result.data.source}
                        </Typography>
                        {result.data.results &&
                          result.data.results
                            .slice(0, 5)
                            .map((item, itemIndex) => (
                              <Card
                                key={itemIndex}
                                variant="outlined"
                                sx={{ mb: 1 }}
                              >
                                <CardContent sx={{ py: 1 }}>
                                  {Object.entries(item).map(([key, value]) => (
                                    <Typography key={key} variant="body2">
                                      <strong>{key}:</strong> {value || 'N/A'}
                                    </Typography>
                                  ))}
                                </CardContent>
                              </Card>
                            ))}
                        {result.data.results &&
                          result.data.results.length > 5 && (
                            <Typography variant="body2" color="text.secondary">
                              ... and {result.data.results.length - 5} more
                              results
                            </Typography>
                          )}
                      </Box>
                    ) : (
                      <Alert severity="error">
                        {result.error || 'No data available'}
                      </Alert>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          ) : (
            <Alert severity="error">
              {screeningResults.message || 'Screening failed'}
            </Alert>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default ScreeningPage;
