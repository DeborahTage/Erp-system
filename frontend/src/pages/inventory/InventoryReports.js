import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Paper,
    Breadcrumbs,
    Link,
    Divider,
    CircularProgress,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip
} from '@mui/material';
import {
    BarChart as BarChartIcon,
    NavigateNext,
    Download,
    TrendingUp,
    Warning,
    Inventory,
    AttachMoney,
    Timer,
    Info
} from '@mui/icons-material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';
import axios from '../../api/axios';
import toast, { Toaster } from 'react-hot-toast';

export default function InventoryReports() {
    const [summary, setSummary] = useState(null);
    const [turnover, setTurnover] = useState([]);
    const [lowStock, setLowStock] = useState([]);
    const [expiring, setExpiring] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const [summaryRes, turnoverRes, lowStockRes, expiringRes] = await Promise.all([
                axios.get('/api/inventory/reports/summary'),
                axios.get('/api/inventory/reports/turnover'),
                axios.get('/api/inventory/low-stock'),
                axios.get('/api/inventory/expiring')
            ]);

            setSummary(summaryRes.data);
            setTurnover(turnoverRes.data);
            setLowStock(lowStockRes.data.content || lowStockRes.data);
            setExpiring(expiringRes.data);
        } catch (err) {
            console.error('Error fetching report data:', err);
            toast.error('Failed to load report data');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadValuation = async () => {
        try {
            const res = await axios.get('/api/inventory/reports/valuation/csv', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'stock_valuation.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            toast.error('Failed to download report');
        }
    };

    const StatCard = ({ title, value, icon, color, subtitle }) => (
        <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', position: 'relative', overflow: 'visible' }}>
            <Box sx={{
                position: 'absolute',
                top: -15,
                left: 20,
                width: 50,
                height: 50,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: color,
                color: '#fff',
                boxShadow: `0 4px 10px ${color}44`
            }}>
                {icon}
            </Box>
            <CardContent sx={{ pt: 5 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                    {title}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
                    {value}
                </Typography>
                {subtitle && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        {subtitle}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, margin: '0 auto' }}>
            <Toaster />

            {/* Header */}
            <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 1 }}>
                        <Link underline="hover" color="inherit" href="/dashboard">Dashboard</Link>
                        <Link underline="hover" color="inherit" href="/inventory">Inventory</Link>
                        <Typography color="text.primary">Reports</Typography>
                    </Breadcrumbs>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
                        Inventory Intelligence
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Comprehensive stock analytics, valuation, and forecasting.
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={handleDownloadValuation}
                    sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
                >
                    Export Valuation
                </Button>
            </Box>

            {/* Summary Grid */}
            <Grid container spacing={4} sx={{ mb: 6 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Valuation"
                        value={`${summary?.totalValue?.toLocaleString() || '0'} ETB`}
                        icon={<AttachMoney fontSize="large" />}
                        color="#2e7d32"
                        subtitle="Current asset value"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Active SKUs"
                        value={summary?.totalSkus || '0'}
                        icon={<Inventory fontSize="large" />}
                        color="#0288d1"
                        subtitle="Items tracked in system"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Low Stock Alerts"
                        value={summary?.lowStockCount || '0'}
                        icon={<Warning fontSize="large" />}
                        color="#ed6c02"
                        subtitle="Below reorder point"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Expiring Soon"
                        value={summary?.expiringCount || '0'}
                        icon={<Timer fontSize="large" />}
                        color="#d32f2f"
                        subtitle="Next 30 days"
                    />
                </Grid>
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 4, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TrendingUp color="primary" />
                            Stock Turnover Trend (Last 6 Months)
                        </Typography>
                        <Box sx={{ height: 350, width: '100%' }}>
                            <ResponsiveContainer>
                                <BarChart data={turnover} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="turnover_rate" fill="#2e7d32" radius={[6, 6, 0, 0]} name="Movement Qty" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>

                {/* Side Alerts */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 4, borderRadius: '16px', height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: 'text.primary' }}>
                            Critical Alerts
                        </Typography>

                        <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {lowStock.length > 0 ? (
                                lowStock.slice(0, 5).map((item) => (
                                    <ListItem
                                        key={item.id}
                                        sx={{
                                            bgcolor: 'rgba(237, 108, 2, 0.05)',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(237, 108, 2, 0.1)'
                                        }}
                                    >
                                        <ListItemIcon><Warning sx={{ color: 'warning.main' }} /></ListItemIcon>
                                        <ListItemText
                                            primary={item.itemName}
                                            secondary={`Stock: ${item.currentStock}`}
                                            primaryTypographyProps={{ fontWeight: 700 }}
                                        />
                                        <Chip label="LOW" size="small" color="warning" />
                                    </ListItem>
                                ))
                            ) : (
                                <Box sx={{ py: 4, textAlign: 'center', bgcolor: 'rgba(46, 125, 50, 0.05)', borderRadius: '12px' }}>
                                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>All stock levels healthy</Typography>
                                </Box>
                            )}

                            {expiring.length > 0 && (
                                <Divider sx={{ my: 1 }} />
                            )}

                            {expiring.slice(0, 5).map((batch) => (
                                <ListItem
                                    key={batch.id}
                                    sx={{
                                        bgcolor: 'rgba(211, 47, 47, 0.05)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(211, 47, 47, 0.1)'
                                    }}
                                >
                                    <ListItemIcon><Timer sx={{ color: 'error.main' }} /></ListItemIcon>
                                    <ListItemText
                                        primary={batch.batchNumber}
                                        secondary={`Exp: ${batch.expiryDate}`}
                                        primaryTypographyProps={{ fontWeight: 700 }}
                                    />
                                    <Chip label="EXPIRY" size="small" color="error" />
                                </ListItem>
                            ))}
                        </List>

                        <Box sx={{ mt: 4, bgcolor: 'rgba(2, 136, 209, 0.05)', p: 2, borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Info color="info" fontSize="small" sx={{ mt: 0.5 }} />
                            <Typography variant="caption" color="text.secondary">
                                Summary data reflects real-time stock levels across all zones. Reorder points are defined at the item level.
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
