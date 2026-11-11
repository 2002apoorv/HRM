import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import {
  MdOutlineLocalShipping,
  MdOutlineAdd,
  MdOutlineClose,
  MdOutlineCheckCircle,
  MdOutlinePeople,
  MdOutlineInventory2,
} from 'react-icons/md';

export const PurchasesSuppliersView = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'suppliers'
  const [loading, setLoading] = useState(true);

  // Modals
  const [showPOModal, setShowPOModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [activePO, setActivePO] = useState(null);

  // PO form state
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [poItems, setPoItems] = useState([{ productId: '', quantity: 1, unitCost: 0, batchNumber: '', expiryDate: '' }]);
  const [poNotes, setPoNotes] = useState('');

  // Supplier form state
  const [supplierForm, setSupplierForm] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
  });

  // Receive items state
  const [receivedItemsState, setReceivedItemsState] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchSuppliers();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/sales/purchases');
      if (res.data.success) {
        setPurchaseOrders(res.data.purchaseOrders || []);
      }
    } catch (err) {
      console.error('Fetch POs error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await api.get('/sales/suppliers');
      if (res.data.success) {
        setSuppliers(res.data.suppliers || []);
      }
    } catch (err) {
      console.error('Fetch suppliers error:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get('/sales/products?limit=100');
      if (res.data.success) {
        setProducts(res.data.products || []);
      }
    } catch (err) {
      console.error('Fetch products error:', err);
    }
  };

  const handleAddItemToPO = () => {
    setPoItems([...poItems, { productId: '', quantity: 1, unitCost: 0, batchNumber: '', expiryDate: '' }]);
  };

  const handleRemoveItemFromPO = (idx) => {
    setPoItems(poItems.filter((_, i) => i !== idx));
  };

  const handlePOItemChange = (idx, field, value) => {
    const updated = [...poItems];
    updated[idx][field] = value;
    if (field === 'productId') {
      const p = products.find((prod) => prod._id === value);
      if (p) {
        updated[idx].unitCost = p.purchaseCost || 0;
      }
    }
    setPoItems(updated);
  };

  const submitCreatePO = async (e) => {
    e.preventDefault();
    if (!selectedSupplierId) {
      alert('Please select a supplier');
      return;
    }

    const validItems = poItems.filter((i) => i.productId && Number(i.quantity) > 0);
    if (validItems.length === 0) {
      alert('Please add at least one valid product line to the purchase order');
      return;
    }

    try {
      const res = await api.post('/sales/purchases', {
        supplierId: selectedSupplierId,
        items: validItems,
        notes: poNotes,
      });

      if (res.data.success) {
        setShowPOModal(false);
        setPoItems([{ productId: '', quantity: 1, unitCost: 0, batchNumber: '', expiryDate: '' }]);
        setSelectedSupplierId('');
        fetchOrders();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create PO');
    }
  };

  const submitCreateSupplier = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/sales/suppliers', supplierForm);
      if (res.data.success) {
        setShowSupplierModal(false);
        setSupplierForm({ name: '', contactPerson: '', phone: '', email: '', address: '' });
        fetchSuppliers();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add supplier');
    }
  };

  const handleOpenReceive = (po) => {
    setActivePO(po);
    const initial = po.items.map((i) => ({
      productId: i.productId,
      productName: i.productName,
      orderedQuantity: i.quantity,
      receivedQuantity: i.quantity,
      batchNumber: i.batchNumber || `BAT-${Date.now().toString().slice(-4)}`,
      expiryDate: i.expiryDate ? i.expiryDate.split('T')[0] : '',
    }));
    setReceivedItemsState(initial);
    setShowReceiveModal(true);
  };

  const submitReceive = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/sales/purchases/${activePO._id}/receive`, {
        receivedItems: receivedItemsState,
      });
      if (res.data.success) {
        alert('Goods received! Inventory quantities and batch records have been updated.');
        setShowReceiveModal(false);
        fetchOrders();
        fetchProducts();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to receive goods');
    }
  };

  const formatCurrency = (val) => `$${Number(val || 0).toFixed(2)}`;

  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.8rem',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    title: {
      fontSize: '1.9rem',
      fontWeight: 800,
      color: '#fff',
      margin: 0,
      letterSpacing: '-0.5px',
    },
    tabGroup: {
      display: 'flex',
      background: 'rgba(255, 255, 255, 0.06)',
      padding: '0.3rem',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
    },
    tabBtn: (isActive) => ({
      padding: '0.5rem 1.2rem',
      borderRadius: '10px',
      border: 'none',
      background: isActive ? 'linear-gradient(135deg, #059669, #0284c7)' : 'transparent',
      color: isActive ? '#fff' : '#94a3b8',
      fontWeight: 600,
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
    }),
    primaryBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: 'linear-gradient(135deg, #059669, #0284c7)',
      color: '#fff',
      border: 'none',
      borderRadius: '10px',
      padding: '0.65rem 1.2rem',
      fontWeight: 600,
      fontSize: '0.92rem',
      cursor: 'pointer',
      boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)',
    },
    tableWrapper: {
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '18px',
      overflowX: 'auto',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      textAlign: 'left',
    },
    th: {
      padding: '0.85rem 1.1rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#94a3b8',
      fontSize: '0.78rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      background: 'rgba(15, 23, 42, 0.6)',
    },
    td: {
      padding: '0.95rem 1.1rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      fontSize: '0.88rem',
      color: '#cbd5e1',
    },
    badge: (bg, color) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.3rem',
      padding: '0.2rem 0.55rem',
      borderRadius: '6px',
      background: bg,
      color: color,
      fontSize: '0.75rem',
      fontWeight: 700,
    }),
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem',
    },
    modalCard: {
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '20px',
      width: '100%',
      maxWidth: '680px',
      maxHeight: '90vh',
      overflowY: 'auto',
      padding: '2rem',
      boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
      color: '#fff',
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      paddingBottom: '1rem',
    },
  };

  return (
    <div>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Purchases & Suppliers</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '0.3rem 0 0 0' }}>
            Supplier directory, purchase orders, and goods receiving with batch tracking.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <div style={styles.tabGroup}>
            <button
              style={styles.tabBtn(activeTab === 'orders')}
              onClick={() => setActiveTab('orders')}
            >
              Purchase Orders ({purchaseOrders.length})
            </button>
            <button
              style={styles.tabBtn(activeTab === 'suppliers')}
              onClick={() => setActiveTab('suppliers')}
            >
              Suppliers ({suppliers.length})
            </button>
          </div>

          {activeTab === 'orders' ? (
            <button style={styles.primaryBtn} onClick={() => setShowPOModal(true)}>
              <MdOutlineAdd size={20} />
              <span>Create Purchase Order</span>
            </button>
          ) : (
            <button style={styles.primaryBtn} onClick={() => setShowSupplierModal(true)}>
              <MdOutlineAdd size={20} />
              <span>Add New Supplier</span>
            </button>
          )}
        </div>
      </div>

      {/* Purchase Orders Table */}
      {activeTab === 'orders' && (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>PO #</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Supplier</th>
                <th style={styles.th}>Item Lines</th>
                <th style={styles.th}>Total Amount</th>
                <th style={styles.th}>Payment Status</th>
                <th style={styles.th}>Delivery Status</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ ...styles.td, textAlign: 'center', padding: '3rem' }}>
                    Loading purchase orders...
                  </td>
                </tr>
              ) : purchaseOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ ...styles.td, textAlign: 'center', padding: '3rem' }}>
                    No purchase orders yet. Click "Create Purchase Order" to order stock.
                  </td>
                </tr>
              ) : (
                purchaseOrders.map((po) => (
                  <tr key={po._id}>
                    <td style={{ ...styles.td, fontWeight: 700, color: '#38bdf8' }}>{po.poNumber}</td>
                    <td style={styles.td}>{new Date(po.orderDate).toLocaleDateString()}</td>
                    <td style={{ ...styles.td, fontWeight: 600, color: '#fff' }}>{po.supplierId?.name}</td>
                    <td style={styles.td}>{po.items.length}</td>
                    <td style={{ ...styles.td, fontWeight: 700, color: '#34d399' }}>{formatCurrency(po.totalAmount)}</td>
                    <td style={styles.td}>
                      <span
                        style={
                          po.paymentStatus === 'PAID'
                            ? styles.badge('rgba(16, 185, 129, 0.2)', '#34d399')
                            : styles.badge('rgba(245, 158, 11, 0.2)', '#fbbf24')
                        }
                      >
                        {po.paymentStatus}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span
                        style={
                          po.orderStatus === 'RECEIVED'
                            ? styles.badge('rgba(16, 185, 129, 0.2)', '#34d399')
                            : styles.badge('rgba(56, 189, 248, 0.2)', '#38bdf8')
                        }
                      >
                        {po.orderStatus}
                      </span>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>
                      {po.orderStatus === 'PENDING' ? (
                        <button
                          style={{
                            background: 'linear-gradient(135deg, #059669, #10b981)',
                            border: 'none',
                            color: '#fff',
                            borderRadius: '8px',
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                          onClick={() => handleOpenReceive(po)}
                        >
                          Receive Goods & Restock
                        </button>
                      ) : (
                        <span style={{ color: '#34d399', fontSize: '0.8rem', fontWeight: 600 }}>Received</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Suppliers Table */}
      {activeTab === 'suppliers' && (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Supplier Name</th>
                <th style={styles.th}>Contact Person</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Address</th>
                <th style={styles.th}>Outstanding Payables</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ ...styles.td, textAlign: 'center', padding: '3rem' }}>
                    No suppliers added yet.
                  </td>
                </tr>
              ) : (
                suppliers.map((s) => (
                  <tr key={s._id}>
                    <td style={{ ...styles.td, fontWeight: 700, color: '#fff' }}>{s.name}</td>
                    <td style={styles.td}>{s.contactPerson || '-'}</td>
                    <td style={styles.td}>{s.phone || '-'}</td>
                    <td style={styles.td}>{s.email || '-'}</td>
                    <td style={styles.td}>{s.address || '-'}</td>
                    <td style={{ ...styles.td, fontWeight: 700, color: s.outstandingBalance > 0 ? '#f87171' : '#34d399' }}>
                      {formatCurrency(s.outstandingBalance)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Purchase Order Modal */}
      {showPOModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Create Purchase Order</h3>
              <button
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                onClick={() => setShowPOModal(false)}
              >
                <MdOutlineClose size={24} />
              </button>
            </div>

            <form onSubmit={submitCreatePO}>
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>
                  Select Supplier *
                </label>
                <select
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                >
                  <option value="">-- Choose Supplier --</option>
                  {suppliers.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.contactPerson})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>
                  Ordered Items
                </label>

                {poItems.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr auto',
                      gap: '0.6rem',
                      marginBottom: '0.6rem',
                      alignItems: 'center',
                    }}
                  >
                    <select
                      required
                      style={{
                        padding: '0.55rem',
                        background: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '0.85rem',
                      }}
                      value={item.productId}
                      onChange={(e) => handlePOItemChange(idx, 'productId', e.target.value)}
                    >
                      <option value="">-- Product --</option>
                      {products.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      style={{
                        padding: '0.55rem',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '0.85rem',
                      }}
                      value={item.quantity}
                      onChange={(e) => handlePOItemChange(idx, 'quantity', e.target.value)}
                    />

                    <input
                      type="number"
                      step="0.01"
                      placeholder="Unit Cost"
                      style={{
                        padding: '0.55rem',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '0.85rem',
                      }}
                      value={item.unitCost}
                      onChange={(e) => handlePOItemChange(idx, 'unitCost', e.target.value)}
                    />

                    {poItems.length > 1 && (
                      <button
                        type="button"
                        style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}
                        onClick={() => handleRemoveItemFromPO(idx)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px dashed rgba(255, 255, 255, 0.25)',
                    color: '#38bdf8',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    marginTop: '0.4rem',
                  }}
                  onClick={handleAddItemToPO}
                >
                  + Add Another Product Line
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  style={{ padding: '0.65rem 1.2rem', background: '#334155', border: 'none', color: '#fff', borderRadius: '10px' }}
                  onClick={() => setShowPOModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.primaryBtn}>
                  Issue Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {showSupplierModal && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalCard, maxWidth: '480px' }}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Add New Supplier</h3>
              <button
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                onClick={() => setShowSupplierModal(false)}
              >
                <MdOutlineClose size={24} />
              </button>
            </div>

            <form onSubmit={submitCreateSupplier}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>
                  Supplier / Vendor Name *
                </label>
                <input
                  type="text"
                  required
                  style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
                  value={supplierForm.name}
                  onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>
                  Contact Representative
                </label>
                <input
                  type="text"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
                  value={supplierForm.contactPerson}
                  onChange={(e) => setSupplierForm({ ...supplierForm, contactPerson: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>
                    Phone
                  </label>
                  <input
                    type="text"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
                    value={supplierForm.phone}
                    onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
                    value={supplierForm.email}
                    onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>
                  Office Address
                </label>
                <input
                  type="text"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
                  value={supplierForm.address}
                  onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
                <button
                  type="button"
                  style={{ padding: '0.65rem 1.2rem', background: '#334155', border: 'none', color: '#fff', borderRadius: '10px' }}
                  onClick={() => setShowSupplierModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.primaryBtn}>
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receive Goods Modal */}
      {showReceiveModal && activePO && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#34d399' }}>
                Receive Delivery: {activePO.poNumber}
              </h3>
              <button
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                onClick={() => setShowReceiveModal(false)}
              >
                <MdOutlineClose size={24} />
              </button>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '1.2rem' }}>
              Verify delivered quantities and batch numbers. Confirming this will increment stock in your inventory.
            </p>

            <form onSubmit={submitReceive}>
              <table style={{ ...styles.table, marginBottom: '1.5rem' }}>
                <thead>
                  <tr>
                    <th style={styles.th}>Product</th>
                    <th style={styles.th}>Ordered</th>
                    <th style={styles.th}>Received Qty</th>
                    <th style={styles.th}>Batch #</th>
                    <th style={styles.th}>Expiry Date</th>
                  </tr>
                </thead>
                <tbody>
                  {receivedItemsState.map((item, idx) => (
                    <tr key={idx}>
                      <td style={styles.td}>{item.productName}</td>
                      <td style={styles.td}>{item.orderedQuantity}</td>
                      <td style={styles.td}>
                        <input
                          type="number"
                          min="1"
                          style={{
                            width: '65px',
                            padding: '0.3rem',
                            background: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '6px',
                            color: '#fff',
                            textAlign: 'center',
                          }}
                          value={item.receivedQuantity}
                          onChange={(e) => {
                            const u = [...receivedItemsState];
                            u[idx].receivedQuantity = Number(e.target.value);
                            setReceivedItemsState(u);
                          }}
                        />
                      </td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          placeholder="BAT-LOT-01"
                          style={{
                            width: '100px',
                            padding: '0.3rem',
                            background: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '6px',
                            color: '#fff',
                            fontSize: '0.8rem',
                          }}
                          value={item.batchNumber}
                          onChange={(e) => {
                            const u = [...receivedItemsState];
                            u[idx].batchNumber = e.target.value;
                            setReceivedItemsState(u);
                          }}
                        />
                      </td>
                      <td style={styles.td}>
                        <input
                          type="date"
                          style={{
                            padding: '0.3rem',
                            background: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '6px',
                            color: '#fff',
                            fontSize: '0.8rem',
                          }}
                          value={item.expiryDate}
                          onChange={(e) => {
                            const u = [...receivedItemsState];
                            u[idx].expiryDate = e.target.value;
                            setReceivedItemsState(u);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
                <button
                  type="button"
                  style={{ padding: '0.65rem 1.2rem', background: '#334155', border: 'none', color: '#fff', borderRadius: '10px' }}
                  onClick={() => setShowReceiveModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.primaryBtn}>
                  Confirm Goods Receipt & Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchasesSuppliersView;
