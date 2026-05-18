import React from 'react';
import { Box, Skeleton } from '@mui/material';

const MedicineCardSkeleton = () => {
  return (
    <Box sx={{ 
      borderRadius: 4, 
      overflow: 'hidden', 
      bgcolor: 'white', 
      border: '1px solid', 
      borderColor: 'grey.200',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Skeleton variant="rectangular" height={200} animation="wave" />
      <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Skeleton variant="text" width="60%" height={24} animation="wave" />
        <Skeleton variant="text" width="100%" height={16} animation="wave" />
        <Skeleton variant="text" width="80%" height={16} animation="wave" />
        <Box sx={{ mt: 'auto', pt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton variant="text" width="30%" height={32} animation="wave" />
          <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: 2 }} animation="wave" />
        </Box>
      </Box>
    </Box>
  );
};

export default MedicineCardSkeleton;
