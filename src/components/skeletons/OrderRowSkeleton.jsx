import React from 'react';
import { Box, Skeleton, Paper } from '@mui/material';

const OrderRowSkeleton = () => {
  return (
    <Paper sx={{ p: 3, borderRadius: 4, mb: 3, border: '1px solid', borderColor: 'grey.100', boxShadow: 'none' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 4, mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Box><Skeleton width={80} /><Skeleton width={100} height={30} /></Box>
          <Box><Skeleton width={80} /><Skeleton width={60} height={30} /></Box>
          <Box><Skeleton width={80} /><Skeleton width={120} height={30} /></Box>
        </Box>
        <Skeleton width={100} height={40} sx={{ borderRadius: 99 }} />
      </Box>
      <Box sx={{ display: 'flex', gap: 3, p: 2 }}>
        <Skeleton variant="rectangular" width={80} height={80} sx={{ borderRadius: 2 }} />
        <Box sx={{ flex: 1 }}>
          <Skeleton width="40%" height={28} />
          <Skeleton width="60%" />
          <Skeleton width="20%" sx={{ mt: 1 }} />
        </Box>
      </Box>
    </Paper>
  );
};

export default OrderRowSkeleton;
