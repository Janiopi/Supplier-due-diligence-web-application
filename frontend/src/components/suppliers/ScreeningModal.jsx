import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Chip,
} from '@mui/material';
import { screeningService } from '../../services/api';

const ScreeningModal = ({ supplierId, open, onClose }) => {
  const [sources, setSources] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const data = await screeningService.getSources();
        setSources(data);
      } catch (err) {
        setError('Error loading sources');
      }
    };

    fetchSources();
  }, []);

  const handleSourceChange = (event) => {
    const { name, checked } = event.target;

    if (checked) {
      if (selectedSources.length < 3) {
        setSelectedSources([...selectedSources, name]);
      }
    } else {
      setSelectedSources(selectedSources.filter((f) => f !== name));
    }
  };

  const handleScreening = async () => {
    if (selectedSources.length < 1) {
      setError('Select at least one source');
      return;
    }

    try {
      setLoading(true);
      const data = await screeningService.screenSupplier(
        supplierId,
        selectedSources
      );
      setResults(data);
      setLoading(false);
      setError(null);
    } catch (err) {
      setError('Error performing screening');
      setLoading(false);
    }
  };

  const getRiskLevelChip = (level) => {
    switch (level) {
      case 1:
        return <Chip label="Low" color="success" size="small" />;
      case 2:
        return <Chip label="Medium" color="warning" size="small" />;
      case 3:
        return <Chip label="High" color="error" size="small" />;
      default:
        return <Chip label="Unknown" size="small" />;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Supplier Screening</DialogTitle>

      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Select sources (maximum 3):
        </Typography>

        <FormGroup row>
          {sources.map((source) => (
            <FormControlLabel
              key={source}
              control={
                <Checkbox
                  checked={selectedSources.includes(source)}
                  onChange={handleSourceChange}
                  name={source}
                  disabled={
                    !selectedSources.includes(source) &&
                    selectedSources.length >= 3
                  }
                />
              }
              label={source}
            />
          ))}
        </FormGroup>

        <Button
          variant="contained"
          color="primary"
          onClick={handleScreening}
          disabled={selectedSources.length === 0 || loading}
          sx={{ mt: 2, mb: 3 }}
        >
          Perform Screening
        </Button>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {results.length > 0 && !loading && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Source</TableCell>
                  <TableCell>Result</TableCell>
                  <TableCell>Risk Level</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell>{result.sourceName}</TableCell>
                    <TableCell>
                      {result.found ? (
                        <Chip label="Match" color="error" size="small" />
                      ) : (
                        <Chip label="No match" color="success" size="small" />
                      )}
                    </TableCell>
                    <TableCell>{getRiskLevelChip(result.riskLevel)}</TableCell>
                    <TableCell>{result.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScreeningModal;
