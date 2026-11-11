import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import {
  MdOutlineInventory2,
  MdOutlineWarning,
  MdOutlineHourglassBottom,
  MdOutlineCompareArrows,
  MdOutlineDeleteSweep,
  MdOutlineClose,
  MdOutlineArrowUpward,
  MdOutlineArrowDownward,
} from 'react-icons/md';

export const InventoryManagementView = () => {
  const [movements, setMovements] = useState([]);
  const [alerts, setAlerts] = useState({ lowStock: [], outOfStock: [], expiringBatches: [] });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showWriteOffModal, setShowWriteOffModal] = useState(false);

  // Form states
  const [adjustForm, setAdjustForm] = useState({
    productId: '',
    batchId: '',
    quantityChange: 0,
    reason: '',
  });

  const [writeOffForm, setWriteOffForm] = useState({
    productId: '',
    batchId: '',
    quantity: 1,
    type: 'DAMAGE', // DAMAGE or EXPIRED
    reason: '',
  });

  const [availableBatches, setAvailableBatches] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [movRes, alertRes, prodRes] = await Promise.all([
        api.get('/sales/inventory/movements'),
        api.get('/sales/inventory/alerts'),
        api.get('/sales/products?limit=100'),
      ]);

      if (movRes.data.success) setMovements(movRes.data.movements || []);
      if (alertRes.data.success) setAlerts(alertRes.data || { lowStock: [], outOfStock: [], expiringBatches: [] });
      if (prodRes.data.success) setProducts(prodRes.data.products || []);
    } catch (err) {
      console.error('Fetch inventory error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };


  const handleProductSelectForAdjust = async (productId) => {
    setAdjustForm({ ...adjustForm, productId, batchId: '' });
    if (!productId) {
      setAvailableBatches([]);
      return;
    }
    const prod = products.find((p) => p._id === productId);
    if (prod && prod.hasBatches) {
      try {
        const res = await api.get(`/sales/products/${productId}`);
        setAvailableBatches(res.data.batches || []);
      } catch (e) {
        setAvailableBatches([]);
      }
    } else {
      setAvailableBatches([]);
    }
  };

  const handleProductSelectForWriteOff = async (productId) => {
    setWriteOffForm({ ...writeOffForm, productId, batchId: '' });
    if (!productId) {
      setAvailableBatches([]);
      return;
    }
    const prod = products.find((p) => p._id === productId);
    if (prod && prod.hasBatches) {
      try {
        const res = await api.get(`/sales/products/${productId}`);
        setAvailableBatches(res.data.batches || []);
      } catch (e) {
        setAvailableBatches([]);
      }
    } else {
      setAvailableBatches([]);
    }
  };

  const submitAdjust = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/sales/inventory/adjust', adjustForm);
      if (res.data.success) {
        setShowAdjustModal(false);
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to adjust stock');
    }
  };

  const submitWriteOff = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/sales/inventory/write-off', writeOffForm);
      if (res.data.success) {
        setShowWriteOffModal(false);
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to process write-off');
    }
  };

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
    topActions: {
      display: 'flex',
      gap: '0.8rem',
    },
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
    dangerBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: 'rgba(239, 68, 68, 0.15)',
      color: '#f87171',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '10px',
      padding: '0.65rem 1.1rem',
      fontWeight: 600,
      fontSize: '0.92rem',
      cursor: 'pointer',
    },
    alertsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.2rem',
      marginBottom: '2rem',
    },
    alertCard: (borderColor, bg) => ({
      background: bg,
      border: `1px solid ${borderColor}`,
      borderRadius: '16px',
      padding: '1.2rem 1.4rem',
    }),
    alertCardHeader: (color) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: color,
      fontSize: '0.95rem',
      fontWeight: 700,
      marginBottom: '0.8rem',
    }),
    alertList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    alertItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '0.85rem',
      color: '#cbd5e1',
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
      maxWidth: '520px',
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
    formGroup: {
      marginBottom: '1.1rem',
    },
    label: {
      display: 'block',
      color: '#cbd5e1',
      fontSize: '0.85rem',
      fontWeight: 600,
      marginBottom: '0.35rem',
    },
    input: {
      width: '100%',
      boxSizing: 'border-box',
      padding: '0.65rem 0.9rem',
      background: 'rgba(255, 255, 255, 0.07)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '8px',
      color: '#fff',
      fontSize: '0.9rem',
      outline: 'none',
    },
    select: {
      width: '100%',
      boxSizing: 'border-box',
      padding: '0.65rem 0.9rem',
      background: 'rgba(15, 23, 42, 0.9)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '8px',
      color: '#fff',
      fontSize: '0.9rem',
      outline: 'none',
    },
  };

  const getMovementBadge = (type) => {
    switch (type) {
      case 'RECEIVE_PURCHASE':
        return (
          <span style={styles.badge('rgba(16, 185, 129, 0.2)', '#34d399')}>
            <MdOutlineArrowUpward size={13} />
            Receive Purchase
          </span>
        );
      case 'SALE_DEDUCT':
        return (
          <span style={styles.badge('rgba(2, 132, 199, 0.2)', '#38bdf8')}>
            <MdOutlineArrowDownward size={13} />
            Sale Deduct
          </span>
        );
      case 'RETURN_RESTORE':
        return (
          <span style={styles.badge('rgba(168, 85, 247, 0.2)', '#c084fc')}>
            <MdOutlineArrowUpward size={13} />
            Return Restored
          </span>
        );
      case 'MANUAL_ADJUSTMENT':
        return (
          <span style={styles.badge('rgba(245, 158, 11, 0.2)', '#fbbf24')}>
            <MdOutlineCompareArrows size={13} />
            Manual Adjustment
          </span>
        );
      case 'DAMAGE_WRITEOFF':
        return (
          <span style={styles.badge('rgba(239, 68, 68, 0.2)', '#f87171')}>
            <MdOutlineDeleteSweep size={13} />
            Damage Write-Off
          </span>
        );
      case 'EXPIRED_WRITEOFF':
        return (
          <span style={styles.badge('rgba(239, 68, 68, 0.2)', '#f87171')}>
            <MdOutlineHourglassBottom size={13} />
            Expired Write-Off
          </span>
        );
      default:
        return (
          <span style={styles.badge('rgba(148, 163, 184, 0.2)', '#cbd5e1')}>
            {type || 'Movement'}
          </span>
        );
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Inventory Movements & Auditing</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '0.3rem 0 0 0' }}>
            Complete audit trail of stock adjustments, receives, write-offs, and critical stock alerts.
          </p>
        </div>

        <div style={styles.topActions}>
          <button style={styles.dangerBtn} onClick={() => setShowWriteOffModal(true)}>
            <MdOutlineDeleteSweep size={18} />
            <span>Write-Off Stock</span>
          </button>
          <button style={styles.primaryBtn} onClick={() => setShowAdjustModal(true)}>
            <MdOutlineCompareArrows size={20} />
            <span>Manual Stock Adjustment</span>
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#f87171'
        }}>
          <div>
            <strong>Error loading inventory:</strong> {error}
          </div>
          <button
            onClick={fetchData}
            style={{
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.4rem 0.8rem',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Critical Alerts Row */}
      <div style={styles.alertsRow}>
        {/* Low Stock Warning */}
        <div style={styles.alertCard('rgba(245, 158, 11, 0.3)', 'rgba(245, 158, 11, 0.08)')}>
          <div style={styles.alertCardHeader('#f59e0b')}>
            <MdOutlineWarning size={18} />
            <span>Low Stock Alerts ({alerts.lowStock?.length || 0})</span>
          </div>
          <ul style={styles.alertList}>
            {alerts.lowStock?.length === 0 ? (
              <li style={{ color: '#94a3b8', fontSize: '0.85rem' }}>All stock above thresholds.</li>
            ) : (
              alerts.lowStock?.slice(0, 4).map((p) => (
                <li key={p._id} style={styles.alertItem}>
                  <span>{p.name}</span>
                  <span style={{ color: '#fbbf24', fontWeight: 700 }}>
                    {p.currentStock} {p.unit} (Min: {p.reorderThreshold})
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Out of Stock Warning */}
        <div style={styles.alertCard('rgba(239, 68, 68, 0.3)', 'rgba(239, 68, 68, 0.08)')}>
          <div style={styles.alertCardHeader('#ef4444')}>
            <MdOutlineInventory2 size={18} />
            <span>Out of Stock Alerts ({alerts.outOfStock?.length || 0})</span>
          </div>
          <ul style={styles.alertList}>
            {alerts.outOfStock?.length === 0 ? (
              <li style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No out of stock items.</li>
            ) : (
              alerts.outOfStock?.slice(0, 4).map((p) => (
                <li key={p._id} style={styles.alertItem}>
                  <span>{p.name}</span>
                  <span style={{ color: '#f87171', fontWeight: 700 }}>0 {p.unit} remaining</span>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Expiring Batches Warning */}
        <div style={styles.alertCard('rgba(236, 72, 153, 0.3)', 'rgba(236, 72, 153, 0.08)')}>
          <div style={styles.alertCardHeader('#ec4899')}>
            <MdOutlineHourglassBottom size={18} />
            <span>Expiring Pharmacy Batches ({alerts.expiringBatches?.length || 0})</span>
          </div>
          <ul style={styles.alertList}>
            {alerts.expiringBatches?.length === 0 ? (
              <li style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No batches expiring within 30 days.</li>
            ) : (
              alerts.expiringBatches?.slice(0, 4).map((b) => (
                <li key={b._id} style={styles.alertItem}>
                  <span>
                    {b.productId?.name || 'Product'} ({b.batchNumber || 'Batch'})
                  </span>
                  <span style={{ color: '#f472b6', fontWeight: 700 }}>
                    Exp: {b.expiryDate ? new Date(b.expiryDate).toLocaleDateString() : 'N/A'}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Movements Ledger Table */}
      <div style={styles.tableWrapper}>
        <div style={{ padding: '1.2rem 1.4rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>Stock Movement Ledger</h3>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Real-time inventory transactions</span>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Date & Time</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Product</th>
              <th style={styles.th}>Batch</th>
              <th style={styles.th}>Prev Stock</th>
              <th style={styles.th}>Change</th>
              <th style={styles.th}>New Stock</th>
              <th style={styles.th}>Reason / Reference</th>
              <th style={styles.th}>Logged By</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} style={{ ...styles.td, textAlign: 'center', padding: '3rem' }}>
                  Loading movements ledger...
                </td>
              </tr>
            ) : movements.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ ...styles.td, textAlign: 'center', padding: '3rem' }}>
                  No stock movements recorded yet.
                </td>
              </tr>
            ) : (
              movements.map((m) => {
                const isPositive = m.quantity > 0;
                return (
                  <tr key={m._id}>
                    <td style={styles.td}>
                      {m.timestamp
                        ? `${new Date(m.timestamp).toLocaleDateString()} ${new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                        : 'N/A'}
                    </td>
                    <td style={styles.td}>{getMovementBadge(m.movementType)}</td>
                    <td style={{ ...styles.td, fontWeight: 600, color: '#fff' }}>
                      {m.productId?.name || 'General Product'}
                    </td>
                    <td style={styles.td}>
                      {m.batchId?.batchNumber ? (
                        <span style={{ color: '#38bdf8', fontWeight: 600 }}>{m.batchId.batchNumber}</span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td style={styles.td}>{m.previousStock ?? 0}</td>
                    <td style={{ ...styles.td, fontWeight: 700, color: isPositive ? '#34d399' : '#f87171' }}>
                      {isPositive ? `+${m.quantity}` : m.quantity}
                    </td>
                    <td style={{ ...styles.td, fontWeight: 700, color: '#fff' }}>{m.newStock ?? 0}</td>
                    <td style={{ ...styles.td, maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.reason || m.referenceType || '-'}
                    </td>
                    <td style={styles.td}>{m.performedBy?.name || 'System'}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>


      {/* Manual Adjustment Modal */}
      {showAdjustModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Manual Stock Adjustment</h3>
              <button
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                onClick={() => setShowAdjustModal(false)}
              >
                <MdOutlineClose size={24} />
              </button>
            </div>

            <form onSubmit={submitAdjust}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Select Product *</label>
                <select
                  required
                  style={styles.select}
                  value={adjustForm.productId}
                  onChange={(e) => handleProductSelectForAdjust(e.target.value)}
                >
                  <option value="">-- Choose Product --</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} (Current Stock: {p.currentStock} {p.unit})
                    </option>
                  ))}
                </select>
              </div>

              {availableBatches.length > 0 && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Select Batch</label>
                  <select
                    style={styles.select}
                    value={adjustForm.batchId}
                    onChange={(e) => setAdjustForm({ ...adjustForm, batchId: e.target.value })}
                  >
                    <option value="">-- Product level / Default --</option>
                    {availableBatches.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.batchNumber} (Available: {b.currentQuantity})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div style={styles.formGroup}>
                <label style={styles.label}>Quantity Change (+ to add, - to reduce) *</label>
                <input
                  type="number"
                  required
                  style={styles.input}
                  placeholder="e.g. 10 or -5"
                  value={adjustForm.quantityChange}
                  onChange={(e) => setAdjustForm({ ...adjustForm, quantityChange: e.target.value })}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Reason for Adjustment *</label>
                <input
                  type="text"
                  required
                  style={styles.input}
                  placeholder="e.g. Stock count audit discrepancy"
                  value={adjustForm.reason}
                  onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  style={{ ...styles.dangerBtn, background: 'rgba(255,255,255,0.08)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.15)' }}
                  onClick={() => setShowAdjustModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.primaryBtn}>
                  Apply Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Write-Off Modal */}
      {showWriteOffModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#f87171' }}>Stock Write-Off (Damage/Expired)</h3>
              <button
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                onClick={() => setShowWriteOffModal(false)}
              >
                <MdOutlineClose size={24} />
              </button>
            </div>

            <form onSubmit={submitWriteOff}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Write-Off Type *</label>
                <select
                  style={styles.select}
                  value={writeOffForm.type}
                  onChange={(e) => setWriteOffForm({ ...writeOffForm, type: e.target.value })}
                >
                  <option value="DAMAGE">Damaged / Broken in Transit</option>
                  <option value="EXPIRED">Expired Stock Disposal</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Select Product *</label>
                <select
                  required
                  style={styles.select}
                  value={writeOffForm.productId}
                  onChange={(e) => handleProductSelectForWriteOff(e.target.value)}
                >
                  <option value="">-- Choose Product --</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} (Stock: {p.currentStock})
                    </option>
                  ))}
                </select>
              </div>

              {availableBatches.length > 0 && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Select Batch</label>
                  <select
                    style={styles.select}
                    value={writeOffForm.batchId}
                    onChange={(e) => setWriteOffForm({ ...writeOffForm, batchId: e.target.value })}
                  >
                    <option value="">-- Select Specific Batch --</option>
                    {availableBatches.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.batchNumber} (Qty: {b.currentQuantity})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div style={styles.formGroup}>
                <label style={styles.label}>Quantity to Write Off *</label>
                <input
                  type="number"
                  required
                  min="1"
                  style={styles.input}
                  value={writeOffForm.quantity}
                  onChange={(e) => setWriteOffForm({ ...writeOffForm, quantity: e.target.value })}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Reason / Audit Note *</label>
                <input
                  type="text"
                  required
                  style={styles.input}
                  placeholder="e.g. Broken vial during shelf stocking"
                  value={writeOffForm.reason}
                  onChange={(e) => setWriteOffForm({ ...writeOffForm, reason: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  style={{ ...styles.dangerBtn, background: 'rgba(255,255,255,0.08)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.15)' }}
                  onClick={() => setShowWriteOffModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" style={{ ...styles.primaryBtn, background: 'linear-gradient(135deg, #dc2626, #ef4444)' }}>
                  Confirm Write-Off
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagementView;
