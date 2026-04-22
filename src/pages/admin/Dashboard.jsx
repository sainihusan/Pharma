import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useMedicines } from '../../context/MedicinesContext';
import MedicineForm from '../../components/MedicineForm';
import {
  Button,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import TableRowSkeleton from '../../components/skeletons/TableRowSkeleton';

export default function Dashboard() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { medicines, loading, addMedicine, updateMedicine, deleteMedicine } = useMedicines();

  const [openForm, setOpenForm] = useState(false);
  const [editingMed, setEditingMed] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  const handleOpenAdd = () => {
    setEditingMed(null);
    setOpenForm(true);
  };

  const handleOpenEdit = (med) => {
    setEditingMed(med);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingMed(null);
  };

  const handleSubmit = (data) => {
    if (editingMed) {
      updateMedicine(editingMed.id, data);
    } else {
      addMedicine(data);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        gap={3}
        mb={6}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight={800} gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your product inventory and medicine listings
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 3,
            fontWeight: 700,
            textTransform: 'none',
            boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.2)',
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          Add Medicine
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'grey.200' }}>
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ backgroundColor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Image</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Cost (₹)</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Sell (₹)</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)
              ) : (
                medicines.map((med) => (
                  <TableRow key={med.id} hover>
                    <TableCell>
                      {med.image ? (
                        <Box
                          component="img"
                          src={med.image}
                          alt={med.name}
                          sx={{ width: 40, h: 40, borderRadius: 1.5, objectFit: 'cover', border: '1px solid', borderColor: 'grey.100' }}
                        />
                      ) : (
                        <Box sx={{ width: 40, h: 40, borderRadius: 1.5, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 'bold', color: 'grey.400' }}>
                          {med.name.charAt(0)}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                      {med.name}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {med.category || 'Uncategorized'}
                      </span>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {med.description}
                    </TableCell>
                    <TableCell align="right" sx={{ color: 'text.secondary' }}>₹{med.costPrice || '-'}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.main' }}>₹{med.price}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleOpenEdit(med)} size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton color="error" onClick={() => deleteMedicine(med.id)} size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
              {!loading && medicines.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    No medicines found. Click "Add Medicine" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </TableContainer>

      {openForm && (
        <MedicineForm
          open={openForm}
          handleClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={editingMed}
        />
      )}
    </Container>
  );
}
