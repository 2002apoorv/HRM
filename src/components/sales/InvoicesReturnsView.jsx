import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import {
  MdOutlineSearch,
  MdOutlineReceiptLong,
  MdOutlineAssignmentReturn,
  MdOutlineVisibility,
  MdOutlineClose,
  MdOutlineCheckCircle,
  MdOutlinePrint,
} from 'react-icons/md';

export const InvoicesReturnsView = () => {
  const [invoices, setInvoices] = useState([]);
  const [returns, setReturns] = useState([]);
  const [activeTab, setActiveTab] = useState('invoices'); // 'invoices' or 'returns'
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);

  // Return form state
  const [returnItems, setReturnItems] = useState([]);
  const [refundMethod, setRefundMethod] = useState('CASH');
  const [returnReason, setReturnReason] = useState('Customer return / exchange');

  useEffect(() => {
    fetchInvoices();
    fetchReturns();
  }, [search, statusFilter]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.paymentStatus = statusFilter;

      const res = await api.get('/sales/pos/invoices', { params });
      if (res.data.success) {
        setInvoices(res.data.invoices || []);
      }
    } catch (err) {
      console.error('Fetch invoices error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReturns = async () => {
    try {
      const res = await api.get('/sales/returns');
      if (res.data.success) {
        setReturns(res.data.returns || []);
      }
    } catch (err) {
      console.error('Fetch returns error:', err);
    }
  };

  const handleOpenDetails = async (invoiceId) => {
    try {
      const res = await api.get(`/sales/pos/invoices/${invoiceId}`);
      if (res.data.success) {
        setSelectedInvoice(res.data.invoice);
        setShowDetailModal(true);
      }
    } catch (err) {
      alert('Failed to load invoice details');
    }
  };

  const handleOpenReturn = (invoice) => {
    setSelectedInvoice(invoice);
    // Initialize return quantities with 0
    const items = invoice.items.map((i) => {
      const available = i.quantity - (i.returnedQuantity || 0);
      return {
        productId: i.productId,
        productName: i.name,
        batchId: i.batchId,
        soldQuantity: i.quantity,
        alreadyReturned: i.returnedQuantity || 0,
        availableToReturn: available,
        returnQty: 0,
        unitPrice: i.unitPrice,
        condition: 'RESALABLE',
      };
    });
    setReturnItems(items);
    setShowReturnModal(true);
  };

  const handleReturnQtyChange = (idx, qty) => {
    const updated = [...returnItems];
    const max = updated[idx].availableToReturn;
    const val = Math.max(0, Math.min(Number(qty) || 0, max));
    updated[idx].returnQty = val;
    setReturnItems(updated);
  };

  const handleReturnConditionChange = (idx, condition) => {
    const updated = [...returnItems];
    updated[idx].condition = condition;
    setReturnItems(updated);
  };

  const submitReturn = async (e) => {
    e.preventDefault();
    const itemsToReturn = returnItems
      .filter((i) => i.returnQty > 0)
      .map((i) => ({
        productId: i.productId,
        batchId: i.batchId,
        quantity: i.returnQty,
        condition: i.condition,
      }));

    if (itemsToReturn.length === 0) {
      alert('Please enter a return quantity greater than 0 for at least one item');
      return;
    }

    try {
      const res = await api.post('/sales/returns/process', {
        saleInvoiceId: selectedInvoice._id,
        returnItems: itemsToReturn,
        refundMethod,
        reason: returnReason,
      });

      if (res.data.success) {
        alert('Return processed successfully! Resalable items have been restored to inventory stock.');
        setShowReturnModal(false);
        fetchInvoices();
        fetchReturns();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to process return');
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
    filterBar: {
      background: 'rgba(30, 41, 59, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '16px',
      padding: '1rem 1.4rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1.2rem',
      marginBottom: '1.8rem',
      flexWrap: 'wrap',
    },
    searchBox: {
      position: 'relative',
      flex: 1,
      minWidth: '220px',
    },
    searchInput: {
      width: '100%',
      boxSizing: 'border-box',
      padding: '0.65rem 1rem 0.65rem 2.5rem',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      borderRadius: '10px',
      color: '#fff',
      fontSize: '0.9rem',
      outline: 'none',
    },
    select: {
      padding: '0.65rem 1rem',
      background: 'rgba(15, 23, 42, 0.8)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      borderRadius: '10px',
      color: '#cbd5e1',
      fontSize: '0.9rem',
      outline: 'none',
      cursor: 'pointer',
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
    actionBtn: {
      background: 'rgba(255, 255, 255, 0.06)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#94a3b8',
      padding: '0.4rem 0.65rem',
      borderRadius: '8px',
      cursor: 'pointer',
      marginRight: '0.4rem',
    },
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

  const calculatedTotalRefund = returnItems.reduce(
    (sum, i) => sum + (i.returnQty || 0) * i.unitPrice,
    0
  );

  return (
    <div>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Invoices & Returns History</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '0.3rem 0 0 0' }}>
            Search invoices, view payment details, print duplicate receipts, and process returns.
          </p>
        </div>

        <div style={styles.tabGroup}>
          <button
            style={styles.tabBtn(activeTab === 'invoices')}
            onClick={() => setActiveTab('invoices')}
          >
            Sales Invoices ({invoices.length})
          </button>
          <button
            style={styles.tabBtn(activeTab === 'returns')}
            onClick={() => setActiveTab('returns')}
          >
            Return Logs ({returns.length})
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      {activeTab === 'invoices' && (
        <div style={styles.filterBar}>
          <div style={styles.searchBox}>
            <MdOutlineSearch size={20} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by invoice #, customer name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.select}
          >
            <option value="">All Payment Statuses</option>
            <option value="PAID">Fully Paid</option>
            <option value="PARTIAL">Partially Paid</option>
            <option value="UNPAID">Unpaid (Balance Due)</option>
          </select>
        </div>
      )}

      {/* Invoices View */}
      {activeTab === 'invoices' && (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Invoice #</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Items</th>
                <th style={styles.th}>Grand Total</th>
                <th style={styles.th}>Paid</th>
                <th style={styles.th}>Balance Due</th>
                <th style={styles.th}>Payment Status</th>
                <th style={styles.th}>Returns</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} style={{ ...styles.td, textAlign: 'center', padding: '3rem' }}>
                    Loading invoices...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ ...styles.td, textAlign: 'center', padding: '3rem' }}>
                    No invoices found.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv._id}>
                    <td style={{ ...styles.td, fontWeight: 700, color: '#38bdf8' }}>{inv.invoiceNumber}</td>
                    <td style={styles.td}>{new Date(inv.createdAt).toLocaleDateString()}</td>
                    <td style={{ ...styles.td, fontWeight: 600, color: '#fff' }}>{inv.customerName}</td>
                    <td style={styles.td}>{inv.items.length}</td>
                    <td style={{ ...styles.td, fontWeight: 700, color: '#34d399' }}>{formatCurrency(inv.totalAmount)}</td>
                    <td style={styles.td}>{formatCurrency(inv.paidAmount)}</td>
                    <td style={{ ...styles.td, color: inv.balanceDue > 0 ? '#fbbf24' : '#94a3b8' }}>
                      {formatCurrency(inv.balanceDue)}
                    </td>
                    <td style={styles.td}>
                      <span
                        style={
                          inv.paymentStatus === 'PAID'
                            ? styles.badge('rgba(16, 185, 129, 0.15)', '#34d399')
                            : styles.badge('rgba(245, 158, 11, 0.15)', '#fbbf24')
                        }
                      >
                        {inv.paymentStatus}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {inv.returnStatus !== 'NONE' ? (
                        <span style={styles.badge('rgba(168, 85, 247, 0.2)', '#c084fc')}>
                          {inv.returnStatus}
                        </span>
                      ) : (
                        <span style={{ color: '#64748b', fontSize: '0.8rem' }}>None</span>
                      )}
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>
                      <button
                        style={styles.actionBtn}
                        title="View Details"
                        onClick={() => handleOpenDetails(inv._id)}
                      >
                        <MdOutlineVisibility size={16} />
                      </button>
                      {inv.returnStatus !== 'FULL' && (
                        <button
                          style={{ ...styles.actionBtn, color: '#f59e0b' }}
                          title="Process Return"
                          onClick={() => handleOpenReturn(inv)}
                        >
                          <MdOutlineAssignmentReturn size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Returns View */}
      {activeTab === 'returns' && (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Return #</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Original Invoice</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Refund Amount</th>
                <th style={styles.th}>Refund Method</th>
                <th style={styles.th}>Reason</th>
                <th style={styles.th}>Processed By</th>
              </tr>
            </thead>
            <tbody>
              {returns.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ ...styles.td, textAlign: 'center', padding: '3rem' }}>
                    No returns processed yet.
                  </td>
                </tr>
              ) : (
                returns.map((ret) => (
                  <tr key={ret._id}>
                    <td style={{ ...styles.td, fontWeight: 700, color: '#f87171' }}>{ret.returnNumber}</td>
                    <td style={styles.td}>{new Date(ret.createdAt).toLocaleDateString()}</td>
                    <td style={{ ...styles.td, color: '#38bdf8' }}>{ret.invoiceNumber}</td>
                    <td style={{ ...styles.td, fontWeight: 600, color: '#fff' }}>{ret.customerName}</td>
                    <td style={{ ...styles.td, fontWeight: 700, color: '#f87171' }}>
                      {formatCurrency(ret.totalRefundAmount)}
                    </td>
                    <td style={styles.td}>{ret.refundMethod}</td>
                    <td style={styles.td}>{ret.reason}</td>
                    <td style={styles.td}>{ret.processedBy?.name || 'Staff'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {showDetailModal && selectedInvoice && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '1.3rem' }}>
                Invoice Details: {selectedInvoice.invoiceNumber}
              </h3>
              <button
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                onClick={() => setShowDetailModal(false)}
              >
                <MdOutlineClose size={24} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.04)', padding: '1rem', borderRadius: '12px' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Customer Name</div>
                <div style={{ fontWeight: 600, color: '#fff' }}>{selectedInvoice.customerName}</div>
                {selectedInvoice.customerPhone && (
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{selectedInvoice.customerPhone}</div>
                )}
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Sale Date & Payment</div>
                <div style={{ fontWeight: 600, color: '#fff' }}>
                  {new Date(selectedInvoice.createdAt).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#34d399' }}>Method: {selectedInvoice.paymentMethod}</div>
              </div>
            </div>

            <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1rem', color: '#38bdf8' }}>Purchased Line Items</h4>
            <table style={{ ...styles.table, marginBottom: '1.5rem' }}>
              <thead>
                <tr>
                  <th style={styles.th}>Item</th>
                  <th style={styles.th}>Batch</th>
                  <th style={styles.th}>Qty</th>
                  <th style={styles.th}>Returned</th>
                  <th style={styles.th}>Unit Price</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.items.map((i, idx) => (
                  <tr key={idx}>
                    <td style={styles.td}>{i.name}</td>
                    <td style={styles.td}>{i.batchNumber || '-'}</td>
                    <td style={styles.td}>{i.quantity}</td>
                    <td style={{ ...styles.td, color: i.returnedQuantity > 0 ? '#f87171' : '#94a3b8' }}>
                      {i.returnedQuantity || 0}
                    </td>
                    <td style={styles.td}>{formatCurrency(i.unitPrice)}</td>
                    <td style={{ ...styles.td, textAlign: 'right', fontWeight: 700, color: '#34d399' }}>
                      {formatCurrency(i.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ color: '#94a3b8' }}>Subtotal</span>
                <span>{formatCurrency(selectedInvoice.subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ color: '#94a3b8' }}>Tax</span>
                <span>{formatCurrency(selectedInvoice.taxAmount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', color: '#34d399', margin: '0.5rem 0' }}>
                <span>Grand Total</span>
                <span>{formatCurrency(selectedInvoice.totalAmount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Amount Paid</span>
                <span>{formatCurrency(selectedInvoice.paidAmount)}</span>
              </div>
              {selectedInvoice.balanceDue > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fbbf24', fontWeight: 700, marginTop: '0.3rem' }}>
                  <span>Balance Due</span>
                  <span>{formatCurrency(selectedInvoice.balanceDue)}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                style={{ padding: '0.6rem 1.4rem', background: '#334155', border: 'none', color: '#fff', borderRadius: '10px', cursor: 'pointer' }}
                onClick={() => setShowDetailModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Process Return Modal */}
      {showReturnModal && selectedInvoice && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#f59e0b' }}>
                Process Return: {selectedInvoice.invoiceNumber}
              </h3>
              <button
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                onClick={() => setShowReturnModal(false)}
              >
                <MdOutlineClose size={24} />
              </button>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.2rem' }}>
              Select items and quantities being returned. Items marked as <strong>RESALABLE</strong> will be restored to your inventory stock.
            </p>

            <form onSubmit={submitReturn}>
              <table style={{ ...styles.table, marginBottom: '1.2rem' }}>
                <thead>
                  <tr>
                    <th style={styles.th}>Item</th>
                    <th style={styles.th}>Sold / Rem</th>
                    <th style={styles.th}>Return Qty</th>
                    <th style={styles.th}>Condition</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Refund</th>
                  </tr>
                </thead>
                <tbody>
                  {returnItems.map((item, idx) => (
                    <tr key={idx}>
                      <td style={styles.td}>{item.productName}</td>
                      <td style={styles.td}>
                        {item.soldQuantity} / <span style={{ color: '#38bdf8' }}>{item.availableToReturn}</span>
                      </td>
                      <td style={styles.td}>
                        <input
                          type="number"
                          min="0"
                          max={item.availableToReturn}
                          style={{
                            width: '60px',
                            padding: '0.3rem',
                            background: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '6px',
                            color: '#fff',
                            textAlign: 'center',
                          }}
                          value={item.returnQty}
                          onChange={(e) => handleReturnQtyChange(idx, e.target.value)}
                        />
                      </td>
                      <td style={styles.td}>
                        <select
                          style={{
                            padding: '0.3rem 0.5rem',
                            background: 'rgba(15, 23, 42, 0.9)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: '6px',
                            color: '#fff',
                            fontSize: '0.8rem',
                          }}
                          value={item.condition}
                          onChange={(e) => handleReturnConditionChange(idx, e.target.value)}
                        >
                          <option value="RESALABLE">Resalable (Restock)</option>
                          <option value="DAMAGED">Damaged / Expired</option>
                        </select>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right', fontWeight: 700, color: '#f87171' }}>
                        {formatCurrency((item.returnQty || 0) * item.unitPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
                    Refund Method
                  </label>
                  <select
                    style={{ ...styles.select, width: '100%' }}
                    value={refundMethod}
                    onChange={(e) => setRefundMethod(e.target.value)}
                  >
                    <option value="CASH">Cash Refund</option>
                    <option value="UPI">UPI / Digital Refund</option>
                    <option value="CREDIT_NOTE">Store Credit Note</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
                    Reason for Return
                  </label>
                  <input
                    type="text"
                    required
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '0.65rem',
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                <div>
                  <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Total Refund Due: </span>
                  <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#f87171' }}>
                    {formatCurrency(calculatedTotalRefund)}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <button
                    type="button"
                    style={{ padding: '0.65rem 1.2rem', background: '#334155', border: 'none', color: '#fff', borderRadius: '10px', cursor: 'pointer' }}
                    onClick={() => setShowReturnModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '0.65rem 1.4rem',
                      background: 'linear-gradient(135deg, #d97706, #f59e0b)',
                      border: 'none',
                      color: '#fff',
                      fontWeight: 700,
                      borderRadius: '10px',
                      cursor: 'pointer',
                    }}
                  >
                    Authorize Return
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesReturnsView;
