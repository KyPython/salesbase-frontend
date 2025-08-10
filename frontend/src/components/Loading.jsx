// components/Loading.jsx (NEW FILE)
import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Skeleton,
} from '@mui/material';

// Full page loading
export function PageLoading({ message = 'Loading...' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        p: 3,
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  );
}

// Inline loading for buttons
export function ButtonLoading({ size = 20 }) {
  return <CircularProgress size={size} color="inherit" />;
}

// Table loading skeleton
export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <Box>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Box key={rowIndex} sx={{ display: 'flex', gap: 2, mb: 1 }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              variant="text"
              height={40}
              sx={{ flex: 1 }}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
}

// Card loading skeleton
export function CardSkeleton() {
  return (
    <Box sx={{ p: 2 }}>
      <Skeleton variant="text" height={32} width="60%" sx={{ mb: 1 }} />
      <Skeleton variant="text" height={24} width="40%" sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={100} />
    </Box>
  );
}

export default PageLoading;