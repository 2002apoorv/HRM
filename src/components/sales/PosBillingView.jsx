import React, { useEffect, useState, useRef } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/authContext.jsx';
import {
  MdOutlineSearch,
  MdOutlineShoppingCart,
  MdOutlineDelete,
  MdOutlinePrint,
  MdOutlineCheckCircle,
  MdOutlineClose,
  MdOutlinePerson,
  MdOutlinePersonAdd,
  MdOutlineWarningAmber,
} from 'react-icons/md';

export const PosBillingView = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Cart state
  const [cart, setCart] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [walkinName, setWalkinName] = useState('Walk-in Customer');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [taxPercent, setTaxPercent] = useState(5);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [paidAmount, setPaidAmount] = useState(0);
  const [saleNotes, setSaleNotes] = useState('');

  // Modals
  const [completedInvoice, setCompletedInvoice] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showQuickCustomerModal, setShowQuickCustomerModal] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');

  const receiptRef = useRef();

  useEffect(() => {
    fetchPosProducts();
    fetchCustomers();
  }, []);

  const fetchPosProducts = async (q = '') => {
    setLoading(true);
    try {
      const res = await api.get('/sales/pos/search', { params: { query: q } });
      if (res.data.success) {
        setProducts(res.data.products || []);
      }
    } catch (err) {
      console.error('POS product search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/sales/customers?limit=100');
      if (res.data.success) {
        setCustomers(res.data.customers || []);
      }
    } catch (err) {
      console.error('Fetch customers error:', err);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    fetchPosProducts(val);
  };

  const addToCart = (product) => {
    if (product.currentStock <= 0) {
      alert(`Cannot add ${product.name}: Out of stock!`);
      return;
    }

    const existingIndex = cart.findIndex((item) => item.productId === product._id);
    if (existingIndex > -1) {
      const currentQty = cart[existingIndex].quantity;
      if (currentQty + 1 > product.currentStock) {
        alert(`Cannot add more than available stock (${product.currentStock})`);
        return;
      }
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([
        ...cart,
        {
          productId: product._id,
          name: product.name,
          sku: product.sku,
          unitPrice: product.sellingPrice,
          unitCost: product.purchaseCost,
          unit: product.unit,
          hasBatches: product.hasBatches,
          eligibleBatchesCount: product.eligibleBatches?.length || 0,
          maxStock: product.currentStock,
          quantity: 1,
          discount: 0,
        },
      ]);
    }
  };

  const updateCartQty = (productId, newQty) => {
    const item = cart.find((i) => i.productId === productId);
    if (!item) return;

    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    if (newQty > item.maxStock) {
      alert(`Requested quantity (${newQty}) exceeds available stock (${item.maxStock})`);
      return;
    }

    setCart(cart.map((i) => (i.productId === productId ? { ...i, quantity: newQty } : i)));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((i) => i.productId !== productId));
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const totalDiscount = Number(discountAmount) || 0;
  const taxableAmount = Math.max(0, subtotal - totalDiscount);
  const taxAmount = (taxableAmount * (Number(taxPercent) || 0)) / 100;
  const grandTotal = Math.round((taxableAmount + taxAmount) * 100) / 100;

  // Auto-fill paidAmount with grandTotal if cash or upi
  const handleSetFullPayment = () => {
    setPaidAmount(grandTotal);
  };

  const balanceDue = Math.max(0, Math.round((grandTotal - (Number(paidAmount) || 0)) * 100) / 100);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    const payload = {
      customerId: selectedCustomerId || null,
      customerName: selectedCustomerId
        ? customers.find((c) => c._id === selectedCustomerId)?.name
        : walkinName || 'Walk-in Customer',
      customerPhone: selectedCustomerId
        ? customers.find((c) => c._id === selectedCustomerId)?.phone
        : walkinPhone,
      cartItems: cart,
      discountAmount: totalDiscount,
      taxPercent: Number(taxPercent) || 0,
      paidAmount: Number(paidAmount) >= 0 ? Number(paidAmount) : grandTotal,
      paymentMethod,
      notes: saleNotes,
    };

    try {
      const res = await api.post('/sales/pos/checkout', payload);
      if (res.data.success) {
        setCompletedInvoice(res.data.invoice);
        setShowReceiptModal(true);
        // Reset POS cart
        setCart([]);
        setDiscountAmount(0);
        setPaidAmount(0);
        setSaleNotes('');
        fetchPosProducts(searchQuery);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Checkout failed. Please check stock levels.');
    }
  };

  const handleCreateQuickCustomer = async (e) => {
    e.preventDefault();
    if (!newCustomerName) return;
    try {
      const res = await api.post('/sales/customers', {
        name: newCustomerName,
        phone: newCustomerPhone,
      });
      if (res.data.success) {
        setCustomers([...customers, res.data.customer]);
        setSelectedCustomerId(res.data.customer._id);
        setShowQuickCustomerModal(false);
        setNewCustomerName('');
        setNewCustomerPhone('');
      }
    } catch (err) {
      alert('Failed to create customer');
    }
  };

  const printReceipt = () => {
    window.print();
  };

  const formatCurrency = (val) => `$${Number(val || 0).toFixed(2)}`;

  const styles = {
    posContainer: {
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr',
      gap: '1.5rem',
      height: 'calc(100vh - 110px)',
    },
    catalogPanel: {
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '20px',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
    },
    searchBar: {
      position: 'relative',
      marginBottom: '1.2rem',
    },
    searchInput: {
      width: '100%',
      boxSizing: 'border-box',
      padding: '0.8rem 1rem 0.8rem 2.7rem',
      background: 'rgba(15, 23, 42, 0.8)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '12px',
      color: '#fff',
      fontSize: '0.95rem',
      outline: 'none',
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: '1rem',
      overflowY: 'auto',
      flex: 1,
      paddingRight: '0.4rem',
    },
    productCard: (outOfStock) => ({
      background: outOfStock ? 'rgba(239, 68, 68, 0.08)' : 'rgba(255, 255, 255, 0.04)',
      border: `1px solid ${outOfStock ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.08)'}`,
      borderRadius: '14px',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      cursor: outOfStock ? 'not-allowed' : 'pointer',
      opacity: outOfStock ? 0.6 : 1,
      transition: 'all 0.18s ease',
    }),
    cartPanel: {
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
      boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)',
    },
    cartHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      paddingBottom: '0.8rem',
    },
    cartItemsList: {
      flex: 1,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.6rem',
      marginBottom: '1rem',
      paddingRight: '0.4rem',
    },
    cartItemRow: {
      background: 'rgba(255, 255, 255, 0.04)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: '12px',
      padding: '0.75rem 0.9rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '0.8rem',
    },
    qtyBtn: {
      width: '26px',
      height: '26px',
      borderRadius: '6px',
      background: 'rgba(255, 255, 255, 0.1)',
      border: 'none',
      color: '#fff',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
    },
    checkoutSection: {
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      paddingTop: '1rem',
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '0.4rem',
      fontSize: '0.9rem',
      color: '#94a3b8',
    },
    grandTotalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: '0.8rem 0',
      fontSize: '1.35rem',
      fontWeight: 800,
      color: '#34d399',
      borderTop: '1px dashed rgba(255, 255, 255, 0.15)',
      paddingTop: '0.6rem',
    },
    payBtn: {
      width: '100%',
      padding: '0.9rem 0',
      background: 'linear-gradient(135deg, #059669, #0284c7)',
      border: 'none',
      borderRadius: '12px',
      color: '#fff',
      fontSize: '1.1rem',
      fontWeight: 800,
      cursor: 'pointer',
      boxShadow: '0 6px 20px rgba(5, 150, 105, 0.4)',
      transition: 'all 0.2s',
    },
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem',
    },
    receiptCard: {
      background: '#fff',
      color: '#1e293b',
      borderRadius: '16px',
      width: '100%',
      maxWidth: '440px',
      padding: '2rem',
      boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
      fontFamily: 'Courier New, Courier, monospace',
    },
  };

  return (
    <div style={styles.posContainer}>
      {/* Left Column: Product Selection Grid */}
      <div style={styles.catalogPanel}>
        <div style={styles.searchBar}>
          <MdOutlineSearch size={22} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Scan barcode or type product name/SKU..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.productsGrid}>
          {loading ? (
            <div style={{ color: '#94a3b8', padding: '2rem', textAlign: 'center' }}>Searching catalog...</div>
          ) : products.length === 0 ? (
            <div style={{ color: '#94a3b8', padding: '2rem', textAlign: 'center' }}>No products found.</div>
          ) : (
            products.map((p) => {
              const outOfStock = p.currentStock <= 0;
              return (
                <div
                  key={p._id}
                  style={styles.productCard(outOfStock)}
                  onClick={() => !outOfStock && addToCart(p)}
                >
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>{p.sku}</div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem', margin: '0.2rem 0' }}>{p.name}</div>
                    {p.hasBatches && (
                      <div style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 600 }}>
                        FEFO Batches ({p.eligibleBatches?.length || 0})
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.8rem' }}>
                    <span style={{ fontWeight: 800, color: '#34d399', fontSize: '1.05rem' }}>
                      {formatCurrency(p.sellingPrice)}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: outOfStock ? '#f87171' : '#94a3b8',
                      }}
                    >
                      {outOfStock ? 'Out' : `${p.currentStock} ${p.unit}`}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Active Cart & Billing Terminal */}
      <div style={styles.cartPanel}>
        <div style={styles.cartHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MdOutlineShoppingCart size={22} color="#34d399" />
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#fff', fontWeight: 800 }}>Active Sale Cart</h2>
          </div>
          <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 700 }}>
            {cart.reduce((sum, i) => sum + i.quantity, 0)} items
          </span>
        </div>

        {/* Customer Selection */}
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
          <select
            style={{
              flex: 1,
              padding: '0.55rem 0.8rem',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '0.88rem',
              outline: 'none',
            }}
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
          >
            <option value="">Walk-in Customer (General)</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} {c.phone ? `(${c.phone})` : ''} - Bal: {formatCurrency(c.outstandingBalance)}
              </option>
            ))}
          </select>

          <button
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#34d399',
              borderRadius: '8px',
              padding: '0 0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Register New Customer"
            onClick={() => setShowQuickCustomerModal(true)}
          >
            <MdOutlinePersonAdd size={18} />
          </button>
        </div>

        {/* Cart Items List */}
        <div style={styles.cartItemsList}>
          {cart.length === 0 ? (
            <div style={{ color: '#64748b', textAlign: 'center', margin: 'auto' }}>
              Click products on the left catalog to add them to this sale cart.
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.productId} style={styles.cartItemRow}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.88rem' }}>{item.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {formatCurrency(item.unitPrice)} / {item.unit} &bull; {item.hasBatches ? 'FEFO Batch' : 'Direct Stock'}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <button style={styles.qtyBtn} onClick={() => updateCartQty(item.productId, item.quantity - 1)}>-</button>
                  <span style={{ fontWeight: 700, minWidth: '24px', textAlign: 'center', color: '#fff' }}>
                    {item.quantity}
                  </span>
                  <button style={styles.qtyBtn} onClick={() => updateCartQty(item.productId, item.quantity + 1)}>+</button>
                </div>

                <div style={{ fontWeight: 700, color: '#34d399', minWidth: '60px', textAlign: 'right' }}>
                  {formatCurrency(item.unitPrice * item.quantity)}
                </div>

                <button
                  style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: '0 0.2rem' }}
                  onClick={() => removeFromCart(item.productId)}
                >
                  <MdOutlineDelete size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Financial Totals & Checkout Panel */}
        <form onSubmit={handleCheckout} style={styles.checkoutSection}>
          <div style={styles.summaryRow}>
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          <div style={styles.summaryRow}>
            <span>Discount ($)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              style={{
                width: '75px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '6px',
                color: '#fff',
                padding: '0.2rem 0.4rem',
                textAlign: 'right',
                fontSize: '0.85rem',
              }}
              value={discountAmount}
              onChange={(e) => setDiscountAmount(e.target.value)}
            />
          </div>

          <div style={styles.summaryRow}>
            <span>Tax ({taxPercent}%)</span>
            <span>{formatCurrency(taxAmount)}</span>
          </div>

          <div style={styles.grandTotalRow}>
            <span>Grand Total</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>

          {/* Payment Method & Amount Paid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '0.8rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>
                Payment Method
              </label>
              <select
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.85rem',
                }}
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="CASH">Cash</option>
                <option value="UPI">UPI / Digital</option>
                <option value="CARD">Credit/Debit Card</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
              </select>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Amount Paid ($)</label>
                <button
                  type="button"
                  style={{ background: 'transparent', border: 'none', color: '#38bdf8', fontSize: '0.75rem', cursor: 'pointer' }}
                  onClick={handleSetFullPayment}
                >
                  Exact Total
                </button>
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.9rem',
                }}
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
              />
            </div>
          </div>

          {balanceDue > 0 && (
            <div style={{ ...styles.summaryRow, color: '#fbbf24', fontWeight: 600, marginBottom: '0.8rem' }}>
              <span>Balance Due (On Account):</span>
              <span>{formatCurrency(balanceDue)}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={cart.length === 0}
            style={{
              ...styles.payBtn,
              opacity: cart.length === 0 ? 0.5 : 1,
              cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            Complete Sale &bull; {formatCurrency(grandTotal)}
          </button>
        </form>
      </div>

      {/* Printable Receipt Modal */}
      {showReceiptModal && completedInvoice && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalCard, maxWidth: '440px', background: '#ffffff', color: '#0f172a' }}>
            <div ref={receiptRef} style={{ padding: '0.5rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.2rem', borderBottom: '1px dashed #cbd5e1', paddingBottom: '0.8rem' }}>
                <h2 style={{ margin: '0 0 0.2rem 0', fontSize: '1.4rem', fontWeight: 800 }}>
                  {user?.organization?.name || 'PRIMARY ENTERPRISE'}
                </h2>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Tax Invoice & Retail Receipt</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Invoice: {completedInvoice.invoiceNumber}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Date: {new Date(completedInvoice.createdAt).toLocaleString()}
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                <strong>Customer: </strong> {completedInvoice.customerName}
                {completedInvoice.customerPhone && <span> ({completedInvoice.customerPhone})</span>}
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #0f172a' }}>
                    <th style={{ textAlign: 'left', padding: '0.3rem 0' }}>Item</th>
                    <th style={{ textAlign: 'center', padding: '0.3rem 0' }}>Qty</th>
                    <th style={{ textAlign: 'right', padding: '0.3rem 0' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {completedInvoice.items.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px dotted #e2e8f0' }}>
                      <td style={{ padding: '0.4rem 0' }}>
                        <div>{item.name}</div>
                        {item.batchNumber && (
                          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Batch: {item.batchNumber}</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center', padding: '0.4rem 0' }}>{item.quantity}</td>
                      <td style={{ textAlign: 'right', padding: '0.4rem 0' }}>{formatCurrency(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '0.6rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span>Subtotal:</span>
                  <span>{formatCurrency(completedInvoice.subtotal)}</span>
                </div>
                {completedInvoice.discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span>Discount:</span>
                    <span>-{formatCurrency(completedInvoice.discountAmount)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span>Tax:</span>
                  <span>{formatCurrency(completedInvoice.taxAmount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', margin: '0.4rem 0' }}>
                  <span>Total Paid:</span>
                  <span>{formatCurrency(completedInvoice.paidAmount)}</span>
                </div>
                {completedInvoice.balanceDue > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#b45309', fontWeight: 700 }}>
                    <span>Balance Due:</span>
                    <span>{formatCurrency(completedInvoice.balanceDue)}</span>
                  </div>
                )}
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.3rem' }}>
                  Payment Method: {completedInvoice.paymentMethod}
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                Thank you for your business! Please retain for records or returns.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
              <button
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#0f172a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                }}
                onClick={printReceipt}
              >
                <MdOutlinePrint size={18} />
                <span>Print Receipt</span>
              </button>
              <button
                style={{
                  padding: '0.75rem 1.2rem',
                  background: '#e2e8f0',
                  color: '#0f172a',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                onClick={() => setShowReceiptModal(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Customer Modal */}
      {showQuickCustomerModal && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalCard, maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>Quick Add Customer</h3>
              <button
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                onClick={() => setShowQuickCustomerModal(false)}
              >
                <MdOutlineClose size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateQuickCustomer}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>
                  Phone Number
                </label>
                <input
                  type="text"
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                <button
                  type="button"
                  style={{ padding: '0.6rem 1rem', background: 'transparent', border: '1px solid #475569', color: '#fff', borderRadius: '8px' }}
                  onClick={() => setShowQuickCustomerModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.6rem 1.2rem', background: '#059669', border: 'none', color: '#fff', borderRadius: '8px', fontWeight: 600 }}
                >
                  Save & Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PosBillingView;
