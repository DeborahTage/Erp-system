import React, { useState, useEffect } from 'react';
import {
    Search, ShoppingCart, User, CreditCard, Receipt,
    Trash2, Plus, Minus, AlertTriangle, CheckCircle2,
    Package, Pill, Box, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { ScrollArea } from '../../components/ui/scroll-area';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
    DialogDescription, DialogFooter, DialogTrigger
} from '../../components/ui/dialog';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '../../components/ui/select';
import { inventoryApi, pharmacyApi } from '../../api';
import { formatCurrency } from '../../utils';
import { toast } from 'react-toastify';

const POSTerminal = () => {
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [cart, setCart] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [showCheckout, setShowCheckout] = useState(false);
    const [showRxWarning, setShowRxWarning] = useState(false);
    const [blockedItem, setBlockedItem] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, custRes] = await Promise.all([
                inventoryApi.getItems(),
                pharmacyApi.getCustomers()
            ]);
            setProducts(prodRes.data || []);
            setCustomers(custRes.data || []);
        } catch (e) {
            toast.error("Failed to sync pharmacy data");
        }
    };

    const filteredProducts = products.filter(p =>
        p.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getPriceForCustomer = (product) => {
        if (!selectedCustomer) return product.retailPrice || product.sellingPrice;
        switch (selectedCustomer.customerType) {
            case 'WHOLESALE': return product.wholesalePrice || product.retailPrice || product.sellingPrice;
            case 'PARTNER_FARM': return product.partnerPrice || product.retailPrice || product.sellingPrice;
            default: return product.retailPrice || product.sellingPrice;
        }
    };

    const addToCart = (product) => {
        // Prescription Guard
        if (product.isControlled) {
            setBlockedItem(product);
            setShowRxWarning(true);
            return;
        }

        const price = getPriceForCustomer(product);
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
        } else {
            setCart([...cart, { ...product, qty: 1, price }]);
        }
    };

    const updateQty = (id, delta) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.qty + delta);
                return { ...item, qty: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = subtotal * 0.15;
    const total = subtotal + tax;

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        try {
            const saleData = {
                items: cart.map(i => ({ itemId: i.id, qty: i.qty, unitPrice: i.price })),
                customerId: selectedCustomer?.id,
                paymentMethod: paymentMethod,
                customerName: selectedCustomer ? selectedCustomer.name : "Walk-in Customer"
            };
            await pharmacyApi.createSale(saleData);
            toast.success("Sale completed successfully!");
            setCart([]);
            setSelectedCustomer(null);
            setShowCheckout(false);
        } catch (e) {
            toast.error(e.response?.data?.message || "Transaction failed");
        }
    };

    return (
        <div className="flex h-[calc(100vh-120px)] gap-6 animate-in fade-in duration-500 overflow-hidden">

            {/* LEFT: Product Section */}
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Scan barcode or search products..."
                            className="pl-10 h-11"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-[180px] h-11">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Items</SelectItem>
                            <SelectItem value="DRUG">Drugs</SelectItem>
                            <SelectItem value="VACCINE">Vaccines</SelectItem>
                            <SelectItem value="EQUIPMENT">Equipment</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <ScrollArea className="flex-1 rounded-xl border border-gray-100 bg-gray-50/30 p-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProducts.map((p) => (
                            <Card key={p.id} className="cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all h-fit group" onClick={() => addToCart(p)}>
                                <CardHeader className="p-3 pb-0">
                                    <div className="flex justify-between items-start">
                                        {p.isControlled ? <Badge variant="destructive" className="text-[10px]"><Zap className="w-2 h-2 mr-1" /> Controlled</Badge> : <Badge variant="secondary" className="text-[10px]">Standard</Badge>}
                                        <span className="text-xs font-mono text-gray-400">{p.sku}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-3">
                                    <div className="font-bold text-gray-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">{p.itemName}</div>
                                    <div className="text-xs text-gray-500 mb-2 truncate">{p.category}</div>
                                    <div className="flex justify-between items-end">
                                        <div className="text-lg font-bold text-indigo-600">
                                            {formatCurrency(getPriceForCustomer(p))}
                                        </div>
                                        <div className={p.currentStock <= 5 ? "text-rose-500 text-xs font-medium" : "text-emerald-600 text-xs font-medium"}>
                                            {p.currentStock} in stock
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* RIGHT: Cart & Checkout */}
            <Card className="w-[420px] flex flex-col shadow-xl border-indigo-100 bg-white">
                <CardHeader className="bg-indigo-600 text-white pb-6 rounded-t-xl">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="h-6 w-6" />
                        <CardTitle>Checkout Terminal</CardTitle>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                    <div className="p-4 border-b space-y-4">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <User className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                <Select
                                    onValueChange={(val) => setSelectedCustomer(customers.find(c => c.id === parseInt(val)))}
                                >
                                    <SelectTrigger className="pl-8 h-9 border-indigo-100 bg-indigo-50/50">
                                        <SelectValue placeholder={selectedCustomer ? selectedCustomer.name : "Walk-in Customer"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customers.map(c => (
                                            <SelectItem key={c.id} value={c.id.toString()}>{c.name} ({c.customerType})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button variant="outline" size="sm" className="h-9 w-9 p-0 text-indigo-600 border-indigo-200">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        {selectedCustomer && (
                            <div className="text-xs flex gap-4 text-gray-500 bg-indigo-50/50 p-2 rounded">
                                <span>Type: <b>{selectedCustomer.customerType}</b></span>
                                <span>Balance: <b className="text-rose-600">{formatCurrency(selectedCustomer.outstandingBalance)}</b></span>
                            </div>
                        )}
                    </div>

                    <ScrollArea className="flex-1 px-4">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-2">
                                <ShoppingCart className="h-12 w-12 opacity-20" />
                                <p className="text-sm font-medium">Cart is empty</p>
                            </div>
                        ) : (
                            <div className="py-4 space-y-4">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-3 items-start animate-in slide-in-from-right-2">
                                        <div className="flex-1">
                                            <div className="font-semibold text-sm text-gray-800">{item.itemName}</div>
                                            <div className="text-xs text-indigo-600 font-medium">{formatCurrency(item.price)} / unit</div>
                                        </div>
                                        <div className="flex items-center gap-2 border rounded-lg p-1 bg-gray-50">
                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => updateQty(item.id, -1)}><Minus className="h-3 w-3" /></Button>
                                            <span className="text-sm font-bold w-6 text-center">{item.qty}</span>
                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => updateQty(item.id, 1)}><Plus className="h-3 w-3" /></Button>
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-300 hover:text-rose-500" onClick={() => removeFromCart(item.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>

                    <div className="p-6 bg-gray-50 border-t space-y-3">
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Subtotal</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Tax (15%)</span>
                            <span>{formatCurrency(tax)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-black text-gray-900 border-t pt-3 mt-1">
                            <span>TOTAL</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="p-4 flex flex-col gap-2">
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger className="w-full h-11 font-semibold text-gray-700">
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-indigo-500" />
                                <SelectValue placeholder="Payment Method" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="CASH">Cash Payment</SelectItem>
                            <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
                            <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                            <SelectItem value="CREDIT">Farmer Credit Account</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        className="w-full h-14 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                        disabled={cart.length === 0}
                        onClick={() => setShowCheckout(true)}
                    >
                        Complete Transaction
                    </Button>
                </CardFooter>
            </Card>

            {/* Prescription Warning Dialog */}
            <Dialog open={showRxWarning} onOpenChange={setShowRxWarning}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-rose-600">
                            <AlertTriangle className="h-5 w-5" /> Controlled Substance
                        </DialogTitle>
                        <DialogDescription>
                            <b>{blockedItem?.itemName}</b> requires a validated prescription for commercial sale.
                            Please verify the customer's prescription in the system.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-rose-50 p-4 rounded-lg border border-rose-100 italic text-sm text-rose-800">
                        Unauthorized sale of controlled veterinary drugs is subject to regulatory audit.
                    </div>
                    <DialogFooter className="sm:justify-start">
                        <Button type="button" variant="secondary" onClick={() => setShowRxWarning(false)}>
                            Back to Catalog
                        </Button>
                        <Button type="button" className="bg-indigo-600 text-white ml-auto">
                            Search Prescriptions
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Checkout Confirmation Dialog */}
            <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Confirm Transaction</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to process this sale for <b>{selectedCustomer ? selectedCustomer.name : 'Walk-in Customer'}</b>?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2 border">
                            <div className="flex justify-between text-sm">
                                <span>Method:</span>
                                <span className="font-bold">{paymentMethod}</span>
                            </div>
                            <div className="flex justify-between text-lg">
                                <span>Amount Due:</span>
                                <span className="font-black text-indigo-600">{formatCurrency(total)}</span>
                            </div>
                        </div>
                        {paymentMethod === 'CREDIT' && selectedCustomer && (
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                                This transaction will be added to the customer's outstanding balance. New balance will be <b>{formatCurrency(selectedCustomer.outstandingBalance + total)}</b>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setShowCheckout(false)}>Cancel</Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 font-bold" onClick={handleCheckout}>Confirm & Generate Receipt</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default POSTerminal;
