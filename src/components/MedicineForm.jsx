import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  TextField,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  MenuItem,
} from '@mui/material';
const CATEGORIES = ['Baby Care', 'Skincare', 'Daily Health', 'Medicines', 'Laboratory'];
import {
  X,
  Pill,
  FileText,
  IndianRupee,
  Layers,
  Tag,
  Image as ImageIcon
} from 'lucide-react';

const medicineSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  description: z.string().min(5, { message: 'Description must be at least 5 characters' }),
  price: z.number().min(0.01, { message: 'Price must be greater than zero' }),
  category: z.string().min(2, { message: 'Category is required' }),
  image: z.string().url({ message: 'Must be a valid image URL' }).or(z.literal('')),
});

export default function MedicineForm({ open, handleClose, onSubmit, initialData = null }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(medicineSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      category: initialData?.category || '',
      image: initialData?.image || '',
    },
  });

  const submitHandler = async (data) => {
    await onSubmit(data);
    reset();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
      PaperProps={{
        sx: { borderRadius: fullScreen ? 0 : 4, overflow: 'hidden' }
      }}
    >
      <DialogTitle sx={{
        m: 0,
        p: 3,
        bgcolor: 'primary.50',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'primary.main', color: 'white' }}>
            <Pill size={20} />
          </Box>
          <Typography variant="h6" fontWeight={800}>
            {initialData ? 'Update Product' : 'Add New Product'}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" sx={{ color: 'text.secondary' }} aria-label="Close dialog">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(submitHandler)}>
        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Product Name"
                  placeholder="e.g. Paracetamol 500mg"
                  variant="outlined"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Pill size={18} className="text-gray-400" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 2.5 }
                  }}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Detailed Description"
                  placeholder="What is this medicine used for?"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                        <FileText size={18} className="text-gray-400" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 2.5 }
                  }}
                />
              )}
            />

            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Price (₹)"
                  type="number"
                  variant="outlined"
                  fullWidth
                  error={!!errors.price}
                  helperText={errors.price?.message}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IndianRupee size={18} className="text-gray-400" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 2.5 }
                  }}
                />
              )}
            />

            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Product Category"
                  variant="outlined"
                  fullWidth
                  error={!!errors.category}
                  helperText={errors.category?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Tag size={18} className="text-gray-400" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 2.5 }
                  }}
                >
                  {CATEGORIES.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Product Image URL"
                  placeholder="https://images.unsplash.com/..."
                  variant="outlined"
                  fullWidth
                  error={!!errors.image}
                  helperText={errors.image?.message || "Optional: A direct link to an image"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ImageIcon size={18} className="text-gray-400" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 2.5 }
                  }}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 0 }}>
          <Button
            onClick={handleClose}
            color="inherit"
            sx={{ fontWeight: 700, textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            startIcon={isSubmitting && <CircularProgress size={20} color="inherit" />}
            sx={{
              px: 4,
              borderRadius: 2.5,
              fontWeight: 800,
              textTransform: 'none',
              boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.3)'
            }}
          >
            {isSubmitting ? (initialData ? 'Saving...' : 'Adding...') : (initialData ? 'Save Changes' : 'Add to Inventory')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
