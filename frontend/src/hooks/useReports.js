// Install: npm install @tanstack/react-query

// hooks/useReports.js
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useReportTypes = () => {
  return useQuery({
    queryKey: ['reportTypes'],
    queryFn: () => api.get('/api/reports/types').then(res => res.data.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGenerateReport = (reportType, filters) => {
  return useQuery({
    queryKey: ['report', reportType, filters],
    queryFn: () => api.post('/api/reports/generate', {
      reportType,
      filters,
      format: 'json'
    }).then(res => res.data.data),
    enabled: !!reportType,
  });
};