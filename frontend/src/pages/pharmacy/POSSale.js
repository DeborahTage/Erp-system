import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

export default function POSSale() {
    const [cart, setCart] = useState([]);
    const [customer, setCustomer] = useState({ name: '', phone: '' });
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [sellableItems, setSellableItems] = useState([]);

    useEffect(() => {
        // Fetch inventory items that are drugs/vaccines
        axios.get('/api/inventory/items')
            .then(res => {
                const data = res.data;
                let items = [];
                if (Array.isArray(data)) items = data;
                else if (data && Array.isArray(data.content)) items = data.content;

                setSellableItems(items.filter(i => i.status === 'ACTIVE' || i.active === true));
            })
            .catch(e => {
                console.error(e);
                setSellableItems([]);
            });
    }, []);

    const addToCart = (item) => {
        // Basic POS cart add
        setCart([...cart, { ...item, cartQty: 1, lineTotal: (item.avgUnitCost || 100) * 1.5 }]);
    };

    const handleCheckout = async () => {
        try {
            const payload = {
                items: cart.map(c => ({
                    itemId: c.id,
                    qty: c.cartQty,
                    unitPrice: c.lineTotal
                })),
                customerName: customer.name,
                customerPhone: customer.phone,
                paymentMethod
            };

            const res = await axios.post('/api/pharmacy/sales', payload);
            alert(`Sale complete! Receipt: ${res.data.saleCode}`);
            setCart([]);
            setCustomer({ name: '', phone: '' });
        } catch (e) {
            alert("Checkout failed. Error: " + (e.response?.data?.message || e.message));
        }
    };

    const total = cart.reduce((sum, item) => sum + item.lineTotal * item.cartQty, 0);

    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="bg-white rounded shadow-sm border p-4">
                <h2 className="text-xl font-bold mb-4">Inventory Items</h2>
                <input placeholder="Search OTC drugs/vaccines..." className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {sellableItems.map(item => (
                        <div key={item.id} className="border p-3 rounded flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition">
                            <div>
                                <div className="font-semibold text-gray-800">{item.itemName}</div>
                                <div className="text-sm text-gray-500">Stock: {item.currentStock || 0} {item.unit} | SKU: {item.sku}</div>
                            </div>
                            <button
                                onClick={() => addToCart(item)}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                                disabled={(item.currentStock || 0) <= 0}
                            >
                                Add+
                            </button>
                        </div>
                    ))}
                    {sellableItems.length === 0 && <p className="text-gray-500 text-center">No inventory found.</p>}
                </div>
            </div>

            <div className="bg-gray-50 p-6 rounded shadow border">
                <h2 className="text-xl font-bold mb-4">Cart Checkout</h2>

                <div className="min-h-32">
                    {cart.map((item, i) => (
                        <div key={i} className="flex justify-between py-2 border-b">
                            <span className="font-medium text-gray-700">{item.itemName} <span className="text-sm text-gray-500">x{item.cartQty}</span></span>
                            <span className="font-medium text-gray-900">{item.lineTotal.toFixed(2)} Birr</span>
                        </div>
                    ))}
                    {cart.length === 0 && <p className="text-gray-500 py-4 text-center">Cart is empty</p>}
                </div>

                <div className="text-xl font-bold mt-6 mb-4 flex justify-between">
                    <span>Total:</span>
                    <span>{total.toFixed(2)} Birr</span>
                </div>

                <div className="mt-4 space-y-3">
                    <input
                        placeholder="Customer Name"
                        value={customer.name}
                        onChange={e => setCustomer({ ...customer, name: e.target.value })}
                        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        placeholder="Phone Number"
                        value={customer.phone}
                        onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                        value={paymentMethod}
                        onChange={e => setPaymentMethod(e.target.value)}
                        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="Cash">Cash</option>
                        <option value="Credit">Credit</option>
                        <option value="Mobile Money">Mobile Money</option>
                    </select>
                </div>

                <button
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                    className="bg-green-600 text-white font-bold text-lg w-full mt-6 py-3 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
                    Complete Sale & Print Receipt
                </button>
            </div>
        </div>
    );
}
