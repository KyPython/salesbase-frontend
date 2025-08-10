import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  ArrowDownward as DownloadIcon,
  CalendarToday as CalendarIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

// Chart components
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';

// Table component for tabular reports
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton
} from '@mui/x-data-grid';

/**
 * Custom toolbar for DataGrid
 */
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

/**
 * Report Filter Dialog Component
 */
function FilterDialog({ open, onClose, reportType, onApplyFilters }) {
  const [filters, setFilters] = useState({
    dateRange: {
      startDate: null,
      endDate: null
    },
    assignedTo: '',
    source: '',
    stage: [],
    minDealValue: ''
  });
  
  const [users, setUsers] = useState([]);
  const [sources, setSources] = useState([]);
  const [stages, setStages] = useState([]);
  
  useEffect(() => {
    // Load filter options when dialog opens
    if (open) {
      // Fetch users for assignedTo filter
      api.get('/api/users')
        .then(response => setUsers(response.data.data))
        .catch(error => console.error('Error loading users:', error));
      
      // Fetch lead sources if needed
      if (reportType?.filters?.includes('source')) {
        api.get('/api/leads/sources')
          .then(response => setSources(response.data.data))
          .catch(error => console.error('Error loading sources:', error));
      }
      
      // Fetch deal stages if needed
      if (reportType?.filters?.includes('stage')) {
        api.get('/api/deals/stages')
          .then(response => setStages(response.data.data))
          .catch(error => console.error('Error loading stages:', error));
      }
    }
  }, [open, reportType]);
  
  const handleChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleDateChange = (field, date) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: date
      }
    }));
  };
  
  const handleApply = () => {
    // Remove empty filters
    const appliedFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value === '' || value === null) return acc;
      
      if (key === 'dateRange') {
        if (!value.startDate && !value.endDate) return acc;
        acc[key] = {
          startDate: value.startDate ? format(value.startDate, 'yyyy-MM-dd') : null,
          endDate: value.endDate ? format(value.endDate, 'yyyy-MM-dd') : null
        };
      } else {
        acc[key] = value;
      }
      
      return acc;
    }, {});
    
    onApplyFilters(appliedFilters);
  };

// Use React.memo for chart components
const MemoizedChart = React.memo(({ data, type }) => {
  // Chart implementation
});
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Filter Report
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          {reportType?.filters?.includes('dateRange') && (
            <>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Date Range</Typography>
              </Grid>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={filters.dateRange.startDate}
                    onChange={(date) => handleDateChange('startDate', date)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={filters.dateRange.endDate}
                    onChange={(date) => handleDateChange('endDate', date)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
            </>
          )}
          
          {reportType?.filters?.includes('assignedTo') && (
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Assigned To</InputLabel>
                <Select
                  value={filters.assignedTo}
                  onChange={(e) => handleChange('assignedTo', e.target.value)}
                  label="Assigned To"
                >
                  <MenuItem value="">All Users</MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.first_name} {user.last_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          
          {reportType?.filters?.includes('source') && (
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Source</InputLabel>
                <Select
                  value={filters.source}
                  onChange={(e) => handleChange('source', e.target.value)}
                  label="Source"
                >
                  <MenuItem value="">All Sources</MenuItem>
                  {sources.map((source) => (
                    <MenuItem key={source} value={source}>
                      {source}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          
          {reportType?.filters?.includes('stage') && (
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Deal Stage</InputLabel>
                <Select
                  multiple
                  value={filters.stage}
                  onChange={(e) => handleChange('stage', e.target.value)}
                  label="Deal Stage"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {stages.map((stage) => (
                    <MenuItem key={stage} value={stage}>
                      {stage}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          
          {reportType?.filters?.includes('minDealValue') && (
            <Grid item xs={12}>
              <TextField
                label="Minimum Deal Value"
                type="number"
                fullWidth
                value={filters.minDealValue}
                onChange={(e) => handleChange('minDealValue', e.target.value)}
              />
            </Grid>
          )}
          
          {reportType?.filters?.includes('userId') && (
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>User</InputLabel>
                <Select
                  value={filters.userId}
                  onChange={(e) => handleChange('userId', e.target.value)}
                  label="User"
                >
                  <MenuItem value="">All Users</MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.first_name} {user.last_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleApply} variant="contained" color="primary">
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/**
 * Schedule Report Dialog Component
 */
function ScheduleDialog({ open, onClose, reportType }) {
  const [schedule, setSchedule] = useState({
    reportType: '',
    format: 'pdf',
    frequency: 'daily',
    time: '09:00',
    dayOfWeek: 1, // Monday
    dayOfMonth: 1,
    recipients: []
  });
  
  const [recipient, setRecipient] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  
  useEffect(() => {
    if (open && reportType) {
      setSchedule(prev => ({
        ...prev,
        reportType: reportType.id
      }));
    }
  }, [open, reportType]);
  
  const handleChange = (field, value) => {
    setSchedule(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleAddRecipient = () => {
    if (recipient && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
      setSchedule(prev => ({
        ...prev,
        recipients: [...prev.recipients, recipient]
      }));
      setRecipient('');
    } else {
      enqueueSnackbar('Please enter a valid email address', { variant: 'error' });
    }
  };
  
  const handleRemoveRecipient = (index) => {
    setSchedule(prev => ({
      ...prev,
      recipients: prev.recipients.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = async () => {
    try {
      await api.post('/api/reports/schedules', schedule);
      enqueueSnackbar('Report scheduled successfully', { variant: 'success' });
      onClose();
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to schedule report',
        { variant: 'error' }
      );
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Schedule Report
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Format</InputLabel>
              <Select
                value={schedule.format}
                onChange={(e) => handleChange('format', e.target.value)}
                label="Format"
              >
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="xlsx">Excel</MenuItem>
                <MenuItem value="csv">CSV</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Frequency</InputLabel>
              <Select
                value={schedule.frequency}
                onChange={(e) => handleChange('frequency', e.target.value)}
                label="Frequency"
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Time"
              type="time"
              fullWidth
              value={schedule.time}
              onChange={(e) => handleChange('time', e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
            />
          </Grid>
          
          {schedule.frequency === 'weekly' && (
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Day of Week</InputLabel>
                <Select
                  value={schedule.dayOfWeek}
                  onChange={(e) => handleChange('dayOfWeek', e.target.value)}
                  label="Day of Week"
                >
                  <MenuItem value={0}>Sunday</MenuItem>
                  <MenuItem value={1}>Monday</MenuItem>
                  <MenuItem value={2}>Tuesday</MenuItem>
                  <MenuItem value={3}>Wednesday</MenuItem>
                  <MenuItem value={4}>Thursday</MenuItem>
                  <MenuItem value={5}>Friday</MenuItem>
                  <MenuItem value={6}>Saturday</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}
          
          {schedule.frequency === 'monthly' && (
            <Grid item xs={12}>
              <TextField
                label="Day of Month (1-31)"
                type="number"
                fullWidth
                value={schedule.dayOfMonth}
                onChange={(e) => handleChange('dayOfMonth', e.target.value)}
                InputProps={{ inputProps: { min: 1, max: 31 } }}
              />
            </Grid>
          )}
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Recipients
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Email Address"
                fullWidth
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={handleAddRecipient}
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            </Box>
          </Grid>
          
          {schedule.recipients.length > 0 && (
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                {schedule.recipients.map((email, index) => (
                  <Chip
                    key={index}
                    label={email}
                    onDelete={() => handleRemoveRecipient(index)}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Paper>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={schedule.recipients.length === 0}
        >
          Schedule Report
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/**
 * Save Report Dialog Component
 */
function SaveDialog({ open, onClose, onSave }) {
  const [format, setFormat] = useState('json');
  
  const handleSubmit = () => {
    onSave(format);
    onClose();
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Save Report</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Format</InputLabel>
          <Select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            label="Format"
          >
            <MenuItem value="json">JSON</MenuItem>
            <MenuItem value="csv">CSV</MenuItem>
            <MenuItem value="xlsx">Excel</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/**
 * Report Visualization Component
 */
function ReportVisualization({ data, reportType }) {
  const theme = useTheme();
  const [viewType, setViewType] = useState('chart');
  
  // Chart colors
  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main
  ];
  
  // Generate columns for DataGrid based on data structure
  const columns = useMemo(() => {
    if (!data || !data.length) return [];
    
    return Object.keys(data[0]).map(key => ({
      field: key,
      headerName: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      flex: 1,
      renderCell: (params) => {
        const value = params.value;
        
        // Format number values
        if (typeof value === 'number') {
          if (key.includes('value') || key.includes('amount')) {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(value);
          }
          
          if (Number.isInteger(value)) {
            return value.toLocaleString();
          }
          
          return value.toFixed(2);
        }
        
        return value;
      }
    }));
  }, [data]);
  
  // Determine chart type based on report type and data
  const renderChart = () => {
    if (!data || !data.length) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <Typography>No data available</Typography>
        </Box>
      );
    }
    
    // Determine chart type based on report type
    switch (reportType?.id) {
      case 'LEADS_BY_STATUS':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill={theme.palette.primary.main}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value.toLocaleString()} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'SALES_BY_REP':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="sales_rep"
                angle={-45}
                textAnchor="end"
                height={70}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickFormatter={(value) => 
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    notation: 'compact',
                    compactDisplay: 'short'
                  }).format(value)
                }
              />
              <Tooltip
                formatter={(value) => 
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(value)
                }
              />
              <Legend />
              <Bar dataKey="won_value" name="Won Deals" fill={theme.palette.success.main} />
              <Bar dataKey="lost_value" name="Lost Deals" fill={theme.palette.error.main} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'ACTIVITY_SUMMARY':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="activity_type"
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Activities" fill={theme.palette.primary.main} />
              <Bar dataKey="unique_users" name="Unique Users" fill={theme.palette.secondary.main} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'REVENUE_FORECAST':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                angle={-45}
                textAnchor="end"
                height={70}
                tickFormatter={(value) => {
                  if (!value) return '';
                  return new Date(value).toLocaleDateString('en-US', { 
                    month: 'short',
                    year: 'numeric'
                  });
                }}
              />
              <YAxis
                tickFormatter={(value) => 
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    notation: 'compact',
                    compactDisplay: 'short'
                  }).format(value)
                }
              />
              <Tooltip
                formatter={(value) => 
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(value)
                }
                labelFormatter={(value) => {
                  if (!value) return '';
                  return new Date(value).toLocaleDateString('en-US', { 
                    month: 'long',
                    year: 'numeric'
                  });
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="total_value"
                name="Total Pipeline"
                stroke={theme.palette.primary.main}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="weighted_value"
                name="Weighted Forecast"
                stroke={theme.palette.success.main}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      default:
        // Generic chart for custom reports
        const firstDataKey = Object.keys(data[0]).find(key => typeof data[0][key] === 'number');
        const categoryKey = Object.keys(data[0]).find(key => typeof data[0][key] === 'string');
        
        if (firstDataKey && categoryKey) {
          return (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={categoryKey}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey={firstDataKey}
                  name={firstDataKey.replace(/_/g, ' ')}
                  fill={theme.palette.primary.main}
                />
              </BarChart>
            </ResponsiveContainer>
          );
        }
        
        // If no suitable chart can be determined, show as table
        return (
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={data.map((row, index) => ({ ...row, id: index }))}
              columns={columns}
              pageSize={10}
              components={{ Toolbar: CustomToolbar }}
              disableSelectionOnClick
            />
          </Box>
        );
    }
  };
  
  // If there's no data, show a message
  if (!data || !data.length) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1">No data available for this report</Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={viewType}
          onChange={(_, newValue) => setViewType(newValue)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab value="chart" label="Chart" />
          <Tab value="table" label="Table" />
        </Tabs>
      </Box>
      
      {viewType === 'chart' ? (
        renderChart()
      ) : (
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={data.map((row, index) => ({ ...row, id: index }))}
            columns={columns}
            pageSize={25}
            components={{ Toolbar: CustomToolbar }}
            disableSelectionOnClick
          />
        </Box>
      )}
    </Box>
  );
}

/**
 * Report Dashboard Component
 */
export default function ReportDashboard() {
  const [reportTypes, setReportTypes] = useState([]);
  const [selectedReportType, setSelectedReportType] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [savedReports, setSavedReports] = useState([]);
  const [savedReportsTab, setSavedReportsTab] = useState(0);
  
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  
  useEffect(() => {
    // Load report types on component mount
    fetchReportTypes();
    fetchSavedReports();
  }, []);
  
  const fetchReportTypes = async () => {
    try {
      const response = await api.get('/api/reports/types');
      setReportTypes(response.data.data);
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to load report types',
        { variant: 'error' }
      );
    }
  };
  
  const fetchSavedReports = async () => {
    try {
      const response = await api.get('/api/reports/saved');
      setSavedReports(response.data.data);
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to load saved reports',
        { variant: 'error' }
      );
    }
  };
  
  const generateReport = async () => {
    if (!selectedReportType) return;
    
    setLoading(true);
    
    try {
      const response = await api.post('/api/reports/generate', {
        reportType: selectedReportType.id,
        filters,
        format: 'json'
      });
      
      setReportData(response.data.data);
      enqueueSnackbar('Report generated successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to generate report',
        { variant: 'error' }
      );
    } finally {
      setLoading(false);
    }
  };
  
  const saveReport = async (format) => {
    if (!selectedReportType || !reportData) return;
    
    setLoading(true);
    
    try {
      const response = await api.post('/api/reports/generate', {
        reportType: selectedReportType.id,
        filters,
        format,
        save: true
      }, {
        responseType: format === 'json' ? 'json' : 'blob'
      });
      
      if (format !== 'json') {
        // Handle file download for non-JSON formats
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `report.${format}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        enqueueSnackbar('Report saved successfully', { variant: 'success' });
        fetchSavedReports();
      }
    } catch (error) {
      enqueueSnackbar('Failed to save report', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };
  
  const downloadSavedReport = async (id, format) => {
    try {
      const response = await api.get(`/api/reports/saved/${id}`, {
        responseType: format === 'json' ? 'json' : 'blob'
      });
      
      if (format !== 'json') {
        // Handle file download for non-JSON formats
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `report.${format}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        // Display JSON report data
        setReportData(response.data.data);
        const reportType = reportTypes.find(
          rt => rt.id === response.data.metadata.report_type
        );
        setSelectedReportType(reportType || { id: response.data.metadata.report_type });
      }
    } catch (error) {
      enqueueSnackbar('Failed to download report', { variant: 'error' });
    }
  };
  
  const handleApplyFilters = (appliedFilters) => {
    setFilters(appliedFilters);
    setFilterDialogOpen(false);
    
    // Generate report with new filters
    generateReport();
  };
  
  // Format saved report date
  const formatReportDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Reports Dashboard</Typography>
      
      <Grid container spacing={3}>
        {/* Report selection and controls */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Generate Report" />
            <Divider />
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Report Type</InputLabel>
                    <Select
                      value={selectedReportType?.id || ''}
                      onChange={(e) => {
                        const selected = reportTypes.find(rt => rt.id === e.target.value);
                        setSelectedReportType(selected || null);
                        setReportData(null);
                      }}
                      label="Report Type"
                    >
                      {reportTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={8}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      onClick={generateReport}
                      disabled={!selectedReportType || loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
                    >
                      Generate
                    </Button>
                    
                    <Button
                      variant="outlined"
                      onClick={() => setFilterDialogOpen(true)}
                      disabled={!selectedReportType}
                      startIcon={<CalendarIcon />}
                    >
                      Set Filters
                    </Button>
                    
                    <Button
                      variant="outlined"
                      onClick={() => setSaveDialogOpen(true)}
                      disabled={!reportData}
                      startIcon={<SaveIcon />}
                    >
                      Save
                    </Button>
                    
                    <Button
                      variant="outlined"
                      onClick={() => setScheduleDialogOpen(true)}
                      disabled={!selectedReportType}
                      startIcon={<ScheduleIcon />}
                    >
                      Schedule
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Report visualization */}
        {reportData && (
          <Grid item xs={12}>
            <Card>
              <CardHeader 
                title={selectedReportType?.name || 'Report'} 
                subheader={selectedReportType?.description}
              />
              <Divider />
              <CardContent>
                <ReportVisualization
                  data={reportData}
                  reportType={selectedReportType}
                />
              </CardContent>
            </Card>
          </Grid>
        )}
        
        {/* Saved reports */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Saved Reports" />
            <Divider />
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={savedReportsTab}
                onChange={(_, newValue) => setSavedReportsTab(newValue)}
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="Recent Reports" />
                <Tab label="Scheduled Reports" />
              </Tabs>
            </Box>
            <CardContent>
              {savedReportsTab === 0 && (
                <Box>
                  {savedReports.length === 0 ? (
                    <Typography variant="body1" sx={{ p: 2 }}>
                      No saved reports found
                    </Typography>
                  ) : (
                    <Grid container spacing={2}>
                      {savedReports.slice(0, 6).map((report) => (
                        <Grid item xs={12} sm={6} md={4} key={report.id}>
                          <Card variant="outlined">
                            <CardHeader
                              title={report.report_name}
                              subheader={formatReportDate(report.created_at)}
                              titleTypographyProps={{ variant: 'subtitle1' }}
                              subheaderTypographyProps={{ variant: 'caption' }}
                            />
                            <Divider />
                            <CardContent sx={{ p: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Format: {report.file_format.toUpperCase()}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Rows: {report.row_count}
                              </Typography>
                            </CardContent>
                            <Box sx={{ display: 'flex', p: 1 }}>
                              <Button
                                size="small"
                                startIcon={<DownloadIcon />}
                                onClick={() => downloadSavedReport(report.id, report.file_format)}
                                fullWidth
                              >
                                Download
                              </Button>
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              )}
              
              {savedReportsTab === 1 && (
                <Typography variant="body1" sx={{ p: 2 }}>
                  Scheduled reports feature coming soon...
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Dialogs */}
      <FilterDialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        reportType={selectedReportType}
        onApplyFilters={handleApplyFilters}
      />
      
      <SaveDialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        onSave={saveReport}
      />
      
      <ScheduleDialog
        open={scheduleDialogOpen}
        onClose={() => setScheduleDialogOpen(false)}
        reportType={selectedReportType}
      />
    </Box>
  );
}
