import React from 'react';
import { TableRow, TableCell, Skeleton, Box } from '@mui/material';

const TableRowSkeleton = () => {
  return (
    <TableRow>
      <TableCell>
        <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: 1.5 }} />
      </TableCell>
      <TableCell><Skeleton width={120} /></TableCell>
      <TableCell><Skeleton width={80} /></TableCell>
      <TableCell><Skeleton width={200} /></TableCell>
      <TableCell align="right"><Skeleton width={50} /></TableCell>
      <TableCell align="right"><Skeleton width={50} /></TableCell>
      <TableCell align="center">
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default TableRowSkeleton;
