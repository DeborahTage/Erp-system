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
    Link
} from '@mui/material';
import {
    AddCircleOutlineOutlined,
    Inventory,
    BarChart,
    LocalShipping,
    NavigateNext,
    CalendarToday,
    Warehouse,
    AttachMoney
} from '@mui/icons-material';
import axios from '../../api/axios';
import toast, { Toaster } from 'react-hot-toast';

export default function StockIn() {
    const [items, setItems] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [form, setForm] = useState({
        itemId: '',
        quantity: '',
        batchNumber: '',
        unitCost: '',
        expiryDate: '',
        supplierId: '',
        poReference: '',
        storageZone: '',
        shelfLocation: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetchingItems, setFetchingItems] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setFetchingItems(true);
            const [itemsRes, suppliersRes] = await Promise.all([
                axios.get('/api/inventory/items'),
                axios.get('/api/inventory/suppliers')
            ]);

            // Handle paginated responses
            const itemsData = itemsRes.data.content || itemsRes.data;
            const suppliersData = suppliersRes.data.data || suppliersRes.data;

            if (Array.isArray(itemsData)) setItems(itemsData);
            if (Array.isArray(suppliersData)) setSuppliers(suppliersData);
        } catch (err) {
            console.error('Error fetching data:', err);
            toast.error('Failed to load items or suppliers');
        } finally {
            setFetchingItems(false);
        }
    };

    const selectedItem = items.find(i => i.id.toString() === form.itemId.toString());

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.itemId || !form.quantity || parseFloat(form.quantity) <= 0) {
            setError('Item and positive quantity are required');
            return;
        }

        setLoading(true);
        setError('');

        const payload = {
            ...form,
            itemId: parseInt(form.itemId),
            quantity: parseFloat(form.quantity),
            unitCost: form.unitCost ? parseFloat(form.unitCost) : undefined
        };

        try {
            const res = await axios.post('/api/inventory/stock-in', payload);
            toast.success(`✓ Stock received successfully! New stock: ${res.data.newStock}`, {
                duration: 5000,
                position: 'top-right',
                style: {
                    background: '#2e7d32',
                    color: '#fff',
                    borderRadius: '12px'
                }
            });

            // Record reset but keep some context
            setForm({
                itemId: '',
                quantity: '',
                batchNumber: '',
                unitCost: '',
                expiryDate: '',
                supplierId: '',
                poReference: '',
                storageZone: '',
                shelfLocation: ''
            });

            // Refresh items list to show new stock
            fetchData();
        } catch (err) {
            const errMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to record stock in';
            setError(errMsg);
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, margin: '0 auto' }}>
            <Toaster />

            {/* Header & Breadcrumbs */}
            <Box sx={{ mb: 4 }}>
                <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 1 }}>
                    <Link underline="hover" color="inherit" href="/dashboard">Dashboard</Link>
                    <Link underline="hover" color="inherit" href="/inventory">Inventory</Link>
                    <Typography color="text.primary">Stock In</Typography>
                </Breadcrumbs>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <AddCircleOutlineOutlined fontSize="large" />
                    Stock In (GRN)
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Receive items into the warehouse and update stock levels.
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
                                    <Inventory color="primary" />
                                    Item Details
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
                                            label="Quantity Received"
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
                                        <TextField
                                            fullWidth
                                            label="Unit Cost"
                                            type="number"
                                            inputProps={{ step: "0.01" }}
                                            value={form.unitCost}
                                            onChange={e => setForm({ ...form, unitCost: e.target.value })}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">ETB</InputAdornment>
                                            }}
                                            helperText="Weighted avg cost will be auto-calculated"
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 2 }}>
                                            <Typography variant="caption" color="text.secondary">LOGISTICS & BATCHING</Typography>
                                        </Divider>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Batch Number"
                                            value={form.batchNumber}
                                            onChange={e => setForm({ ...form, batchNumber: e.target.value })}
                                            placeholder="e.g. B-2026-06-A"
                                            InputProps={{ startAdornment: <InputAdornment position="start">#</InputAdornment> }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Expiry Date"
                                            type="date"
                                            value={form.expiryDate}
                                            onChange={e => setForm({ ...form, expiryDate: e.target.value })}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="supplier-label">Supplier</InputLabel>
                                            <Select
                                                labelId="supplier-label"
                                                value={form.supplierId}
                                                label="Supplier"
                                                onChange={e => setForm({ ...form, supplierId: e.target.value })}
                                            >
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {suppliers.map(s => (
                                                    <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="PO Reference"
                                            value={form.poReference}
                                            onChange={e => setForm({ ...form, poReference: e.target.value })}
                                            placeholder="e.g. PO-7782"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Storage Zone"
                                            value={form.storageZone}
                                            onChange={e => setForm({ ...form, storageZone: e.target.value })}
                                            placeholder="e.g. Zone A"
                                            InputProps={{ startAdornment: <InputAdornment position="start"><Warehouse fontSize="small" /></InputAdornment> }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Shelf Location"
                                            value={form.shelfLocation}
                                            onChange={e => setForm({ ...form, shelfLocation: e.target.value })}
                                            placeholder="e.g. Rack-B-4"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sx={{ mt: 2 }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            fullWidth
                                            size="large"
                                            disabled={loading}
                                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LocalShipping />}
                                            sx={{
                                                py: 2,
                                                borderRadius: '12px',
                                                fontWeight: 800,
                                                textTransform: 'none',
                                                fontSize: '1.1rem',
                                                boxShadow: '0 4px 14px 0 rgba(46, 125, 50, 0.39)'
                                            }}
                                        >
                                            {loading ? 'Processing...' : 'Complete Stock Receipt'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Info Section */}
                <Grid item xs={12} md={5}>
                    <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', bgcolor: 'rgba(46, 125, 50, 0.04)', border: '1px dashed rgba(46, 125, 50, 0.2)' }}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BarChart color="primary" />
                            Live Statistics
                        </Typography>

                        {selectedItem ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Average Unit Cost</Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
                                        {selectedItem.avgUnitCost ? `${selectedItem.avgUnitCost} ETB` : '0.00 ETB'}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Current Stock</Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'blue' }}>
                                        {selectedItem.currentStock} {selectedItem.unit}
                                    </Typography>
                                </Box>
                                <Divider />
                                <Box>
                                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>Economic Impact</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AttachMoney fontSize="small" sx={{ color: 'success.main' }} />
                                        Adding {form.quantity || '0'} {selectedItem.unit} will update total valuation.
                                    </Typography>
                                </Box>
                            </Box>
                        ) : (
                            <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
                                <Inventory sx={{ fontSize: 48, opacity: 0.2, mb: 2 }} />
                                <Typography>Select an item to see real-time impact on stock levels and financial valuation.</Typography>
                            </Box>
                        )}
                    </Paper>

                    <Card sx={{ mt: 4, borderRadius: '16px', bgcolor: 'warning.main', color: 'warning.contrastText' }}>
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>Important</Typography>
                            <Typography variant="body2">
                                Every stock receipt automatically generates a Finance Expense entry in the cost ledger and recalculates the weighted average unit cost for future sales.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
