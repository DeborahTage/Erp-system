import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Alert,
    CircularProgress,
    Divider,
    InputAdornment,
    Paper,
    Breadcrumbs,
    Link,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import {
    IndeterminateCheckBox,
    Inventory,
    BarChart,
    LocalShipping,
    NavigateNext,
    CalendarToday,
    Warehouse,
    AttachMoney,
    Assignment,
    ErrorOutlined
} from '@mui/icons-material';
import axios from '../../api/axios';
import toast, { Toaster } from 'react-hot-toast';

export default function StockOut() {
    const [items, setItems] = useState([]);
    const [batches, setBatches] = useState([]);
    const [form, setForm] = useState({
        itemId: '',
        quantity: '',
        reason: 'ISSUE',
        notes: '',
        referenceId: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetchingItems, setFetchingItems] = useState(true);
    const [fetchingBatches, setFetchingBatches] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        if (form.itemId) {
            fetchBatches(form.itemId);
        } else {
            setBatches([]);
        }
    }, [form.itemId]);

    const fetchItems = async () => {
        try {
            setFetchingItems(true);
            const res = await axios.get('/api/inventory/items');
            const data = res.data.content || res.data;
            if (Array.isArray(data)) setItems(data);
        } catch (err) {
            toast.error('Failed to load items');
        } finally {
            setFetchingItems(false);
        }
    };

    const fetchBatches = async (itemId) => {
        try {
            setFetchingBatches(true);
            const res = await axios.get(`/api/inventory/batches/${itemId}`);
            setBatches(res.data || []);
        } catch (err) {
            console.error('Error fetching batches:', err);
        } finally {
            setFetchingBatches(false);
        }
    };

    const selectedItem = items.find(i => i.id.toString() === form.itemId.toString());

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.itemId || !form.quantity || parseFloat(form.quantity) <= 0) {
            setError('Item and positive quantity are required');
            return;
        }

        if (selectedItem && parseFloat(form.quantity) > selectedItem.currentStock) {
            setError(`Insufficient stock. Available: ${selectedItem.currentStock}`);
            return;
        }

        setLoading(true);
        setError('');

        const payload = {
            ...form,
            itemId: parseInt(form.itemId),
            quantity: parseFloat(form.quantity),
            referenceId: form.referenceId ? parseInt(form.referenceId) : undefined
        };

        try {
            const res = await axios.post('/api/inventory/stock-out', payload);
            toast.success(`✓ Stock issued successfully! New stock: ${res.data.newStock}`, {
                duration: 5000,
                position: 'top-right',
                style: {
                    background: '#d32f2f',
                    color: '#fff',
                    borderRadius: '12px'
                }
            });

            setForm({
                itemId: '',
                quantity: '',
                reason: 'ISSUE',
                notes: '',
                referenceId: ''
            });

            // Refresh items list
            fetchItems();
        } catch (err) {
            const errMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to record stock out';
            setError(errMsg);
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    const reasons = [
        { value: 'ISSUE', label: 'Issue to Barn', color: 'info' },
        { value: 'SALE', label: 'Sale', color: 'success' },
        { value: 'TRANSFER', label: 'Transfer', color: 'secondary' },
        { value: 'EXPIRED', label: 'Expired', color: 'error' },
        { value: 'DAMAGED', label: 'Damaged', color: 'error' },
        { value: 'ADJUSTMENT', label: 'Adjustment', color: 'warning' }
    ];

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, margin: '0 auto' }}>
            <Toaster />

            {/* Header & Breadcrumbs */}
            <Box sx={{ mb: 4 }}>
                <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 1 }}>
                    <Link underline="hover" color="inherit" href="/dashboard">Dashboard</Link>
                    <Link underline="hover" color="inherit" href="/inventory">Inventory</Link>
                    <Typography color="text.primary">Stock Out</Typography>
                </Breadcrumbs>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'error.main', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IndeterminateCheckBox fontSize="large" />
                    Stock Out (Issue)
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Deduct items from inventory for use, sale, or disposal.
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={4}>
                {/* Form Section */}
                <Grid item xs={12} md={7}>
                    <Card sx={{ borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
                        <CardContent sx={{ p: 4 }}>
                            <form onSubmit={handleSubmit}>
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Assignment color="error" />
                                    Issue Details
                                </Typography>

                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth required>
                                            <InputLabel id="item-label">Select Item</InputLabel>
                                            <Select
                                                labelId="item-label"
                                                value={form.itemId}
                                                label="Select Item"
                                                onChange={e => setForm({ ...form, itemId: e.target.value })}
                                                disabled={fetchingItems}
                                            >
                                                {fetchingItems ? (
                                                    <MenuItem disabled><CircularProgress size={20} sx={{ mr: 1 }} /> Loading items...</MenuItem>
                                                ) : (
                                                    items.map(item => (
                                                        <MenuItem key={item.id} value={item.id}>
                                                            {item.itemName} ({item.sku}) — Available: {item.currentStock} {item.unit}
                                                        </MenuItem>
                                                    ))
                                                )}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Quantity Issuing"
                                            type="number"
                                            inputProps={{ step: "0.01", min: "0.01" }}
                                            value={form.quantity}
                                            onChange={e => setForm({ ...form, quantity: e.target.value })}
                                            required
                                            InputProps={{
                                                endAdornment: selectedItem && <InputAdornment position="end">{selectedItem.unit}</InputAdornment>
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth required>
                                            <InputLabel id="reason-label">Reason for Issue</InputLabel>
                                            <Select
                                                labelId="reason-label"
                                                value={form.reason}
                                                label="Reason for Issue"
                                                onChange={e => setForm({ ...form, reason: e.target.value })}
                                            >
                                                {reasons.map(r => (
                                                    <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={2}
                                            label="Notes / Destination"
                                            value={form.notes}
                                            onChange={e => setForm({ ...form, notes: e.target.value })}
                                            placeholder="e.g. Dispatched to Barn 3 for midday feeding"
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="error"
                                            fullWidth
                                            size="large"
                                            disabled={loading}
                                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <IndeterminateCheckBox />}
                                            sx={{
                                                py: 2,
                                                borderRadius: '12px',
                                                fontWeight: 800,
                                                textTransform: 'none',
                                                fontSize: '1.1rem',
                                                boxShadow: '0 4px 14px 0 rgba(211, 47, 47, 0.39)'
                                            }}
                                        >
                                            {loading ? 'Processing...' : 'Complete Stock Issue'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Batch Allocation Info */}
                    {batches.length > 0 && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Warehouse fontSize="inherit" /> FEFO Auto-Allocation Order
                            </Typography>
                            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '12px' }}>
                                <Table size="small">
                                    <TableHead sx={{ bgcolor: 'action.hover' }}>
                                        <TableRow>
                                            <TableCell>Batch #</TableCell>
                                            <TableCell>Expiry</TableCell>
                                            <TableCell align="right">Qty Available</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {batches.map((b) => (
                                            <TableRow key={b.id}>
                                                <TableCell sx={{ fontWeight: 600 }}>{b.batchNumber}</TableCell>
                                                <TableCell>
                                                    {b.expiryDate ? (
                                                        <Chip
                                                            size="small"
                                                            label={b.expiryDate}
                                                            color={new Date(b.expiryDate) < new Date() ? 'error' : 'default'}
                                                        />
                                                    ) : 'N/A'}
                                                </TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                                    {b.quantityRemaining}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                * System automatically deducts from batches using First-Expiry-First-Out (FEFO) logic.
                            </Typography>
                        </Box>
                    )}
                </Grid>

                {/* Info Section */}
                <Grid item xs={12} md={5}>
                    <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', bgcolor: 'rgba(211, 47, 47, 0.04)', border: '1px dashed rgba(211, 47, 47, 0.2)' }}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BarChart color="error" />
                            Stock Impact
                        </Typography>

                        {selectedItem ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Available for Issue</Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
                                        {selectedItem.currentStock} {selectedItem.unit}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>After Issue</Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 800, color: (selectedItem.currentStock - (parseFloat(form.quantity) || 0)) < 0 ? 'error.main' : 'warning.main' }}>
                                        {Math.max(0, (selectedItem.currentStock - (parseFloat(form.quantity) || 0)).toFixed(2))} {selectedItem.unit}
                                    </Typography>
                                </Box>
                                <Divider />
                                <Box>
                                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>Financial Impact</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AttachMoney fontSize="small" sx={{ color: 'error.main' }} />
                                        {form.reason === 'SALE' ? 'COGS entry will be auto-generated.' : 'Stock value will be reduced.'}
                                    </Typography>
                                </Box>
                                {selectedItem.reorderPoint && (selectedItem.currentStock - (parseFloat(form.quantity) || 0)) <= selectedItem.reorderPoint && (
                                    <Alert severity="warning" icon={<ErrorOutlined />} sx={{ borderRadius: '12px' }}>
                                        Action will trigger <strong>Auto-Reorder</strong> alert.
                                    </Alert>
                                )}
                            </Box>
                        ) : (
                            <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
                                <Inventory sx={{ fontSize: 48, opacity: 0.2, mb: 2 }} />
                                <Typography>Select an item to see stock impact and reorder alerts.</Typography>
                            </Box>
                        )}
                    </Paper>

                    <Card sx={{ mt: 4, borderRadius: '16px', bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>FEFO Enforcement</Typography>
                            <Typography variant="body2">
                                Trust Agro ERP enforces First-Expiry-First-Out (FEFO) to minimize waste. The system automatically selects the batch with the earliest expiry date that has available stock.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
