import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import {
  MdOutlinePeople,
  MdOutlinePersonAdd,
  MdOutlinePayment,
  MdOutlineVisibility,
  MdOutlineClose,
  MdOutlineSearch,
} from 'react-icons/md';

export const CustomersReceivablesView = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerInvoices, setCustomerInvoices] = useState([]);
  const [customerPayments, setCustomerPayments] = useState([]);

  // Forms
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    paymentMethod: 'CASH',
    notes: '',
  });

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/sales/customers', { params: { search } });
      if (res.data.success) {
        setCustomers(res.data.customers || []);
      }
    } catch (err) {
      console.error('Fetch customers error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/sales/customers', newCustomer);
      if (res.data.success) {
        setShowAddModal(false);
        setNewCustomer({ name: '', phone: '', email: '', address: '' });
        fetchCustomers();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create customer');
    }
  };

  const handleOpenPayment = (customer) => {
    setSelectedCustomer(customer);
    setPaymentForm({
      amount: customer.outstandingBalance,
      paymentMethod: 'CASH',
      notes: 'Settlement for outstanding balance',
    });
    setShowPaymentModal(true);
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/sales/customers/payment', {
        customerId: selectedCustomer._id,
        amount: paymentForm.amount,
        paymentMethod: paymentForm.paymentMethod,
        notes: paymentForm.notes,
      });

      if (res.data.success) {
        alert('Payment recorded successfully! Customer balance updated.');
        setShowPaymentModal(false);
        fetchCustomers();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to record payment');
    }
  };

  const handleOpenDetails = async (customer) => {
    setSelectedCustomer(customer);
    try {
      const res = await api.get(`/sales/customers/${customer._id}`);
      if (res.data.success) {
        setCustomerInvoices(res.data.invoices || []);
        setCustomerPayments(res.data.payments || []);
        setShowDetailModal(true);
      }
    } catch (err) {
      alert('Failed to load customer profile');
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
    searchBox: {
      position: 'relative',
      maxWidth: '400px',
      marginBottom: '1.5rem',
    },
    searchInput: {
      width: '100%',
      boxSizing: 'border-box',
      padding: '0.7rem 1rem 0.7rem 2.6rem',
      background: 'rgba(30, 41, 59, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      color: '#fff',
      fontSize: '0.9rem',
      outline: 'none',
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
      maxWidth: '600px',
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
          <h1 style={styles.title}>Customers & Accounts Receivable</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '0.3rem 0 0 0' }}>
            Customer profiles, total spent, outstanding balance ledgers, and payment recording.
          </p>
        </div>

        <button style={styles.primaryBtn} onClick={() => setShowAddModal(true)}>
          <MdOutlinePersonAdd size={20} />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Search */}
      <div style={styles.searchBox}>
        <MdOutlineSearch size={20} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <input
          type="text"
          placeholder="Search by name, phone, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Customers Table */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Customer Name</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Address</th>
              <th style={styles.th}>Lifetime Purchases</th>
              <th style={styles.th}>Outstanding Balance</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ ...styles.td, textAlign: 'center', padding: '3rem' }}>
                  Loading customers...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ ...styles.td, textAlign: 'center', padding: '3rem' }}>
                  No customer profiles found. Click "Add New Customer" to register clients.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c._id}>
                  <td style={{ ...styles.td, fontWeight: 700, color: '#fff' }}>{c.name}</td>
                  <td style={styles.td}>{c.phone || '-'}</td>
                  <td style={styles.td}>{c.email || '-'}</td>
                  <td style={styles.td}>{c.address || '-'}</td>
                  <td style={{ ...styles.td, fontWeight: 700, color: '#38bdf8' }}>{formatCurrency(c.totalSpent)}</td>
                  <td style={{ ...styles.td, fontWeight: 800, color: c.outstandingBalance > 0 ? '#fbbf24' : '#34d399' }}>
                    {formatCurrency(c.outstandingBalance)}
                  </td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>
                    <button
                      style={styles.actionBtn}
                      title="View Customer Profile & History"
                      onClick={() => handleOpenDetails(c)}
                    >
                      <MdOutlineVisibility size={16} />
                    </button>
                    {c.outstandingBalance > 0 && (
                      <button
                        style={{ ...styles.actionBtn, color: '#34d399' }}
                        title="Record Payment"
                        onClick={() => handleOpenPayment(c)}
                      >
                        <MdOutlinePayment size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalCard, maxWidth: '480px' }}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Add New Customer</h3>
              <button
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                onClick={() => setShowAddModal(false)}
              >
                <MdOutlineClose size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>
                  Customer / Business Name *
                </label>
                <input
                  type="text"
                  required
                  style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>
                    Phone Number
                  </label>
                  <input
                    type="text"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>
                  Address
                </label>
                <input
                  type="text"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
                <button
                  type="button"
                  style={{ padding: '0.65rem 1.2rem', background: '#334155', border: 'none', color: '#fff', borderRadius: '10px' }}
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.primaryBtn}>
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showPaymentModal && selectedCustomer && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalCard, maxWidth: '440px' }}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#34d399' }}>
                Record Payment: {selectedCustomer.name}
              </h3>
              <button
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                onClick={() => setShowPaymentModal(false)}
              >
                <MdOutlineClose size={24} />
              </button>
            </div>

            <form onSubmit={handleRecordPayment}>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '0.8rem', borderRadius: '10px', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Total Outstanding Due:</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24' }}>
                  {formatCurrency(selectedCustomer.outstandingBalance)}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>
                  Payment Amount ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  min="0.01"
                  max={selectedCustomer.outstandingBalance}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', fontSize: '1.1rem', fontWeight: 700 }}
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>
                  Payment Method
                </label>
                <select
                  style={{ width: '100%', padding: '0.65rem', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#fff' }}
                  value={paymentForm.paymentMethod}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                >
                  <option value="CASH">Cash</option>
                  <option value="UPI">UPI / Digital</option>
                  <option value="CARD">Credit/Debit Card</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>
                  Reference Note / Transaction ID
                </label>
                <input
                  type="text"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
                <button
                  type="button"
                  style={{ padding: '0.65rem 1.2rem', background: '#334155', border: 'none', color: '#fff', borderRadius: '10px' }}
                  onClick={() => setShowPaymentModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.primaryBtn}>
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Profile & History Modal */}
      {showDetailModal && selectedCustomer && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalCard, maxWidth: '680px' }}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Customer Profile: {selectedCustomer.name}</h3>
              <button
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                onClick={() => setShowDetailModal(false)}
              >
                <MdOutlineClose size={24} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.04)', padding: '1rem', borderRadius: '12px' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Contact Info</div>
                <div style={{ fontWeight: 600, color: '#fff' }}>{selectedCustomer.phone || 'No phone'}</div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{selectedCustomer.email || 'No email'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Total Lifetime Spent</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>
                  {formatCurrency(selectedCustomer.totalSpent)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Outstanding Receivables</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: selectedCustomer.outstandingBalance > 0 ? '#fbbf24' : '#34d399' }}>
                  {formatCurrency(selectedCustomer.outstandingBalance)}
                </div>
              </div>
            </div>

            <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1rem', color: '#38bdf8' }}>Sales Invoices</h4>
            <table style={{ ...styles.table, marginBottom: '1.5rem' }}>
              <thead>
                <tr>
                  <th style={styles.th}>Invoice #</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Paid</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {customerInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ ...styles.td, textAlign: 'center', color: '#94a3b8' }}>
                      No invoices recorded for this customer yet.
                    </td>
                  </tr>
                ) : (
                  customerInvoices.map((inv) => (
                    <tr key={inv._id}>
                      <td style={{ ...styles.td, fontWeight: 700, color: '#38bdf8' }}>{inv.invoiceNumber}</td>
                      <td style={styles.td}>{new Date(inv.createdAt).toLocaleDateString()}</td>
                      <td style={{ ...styles.td, fontWeight: 700 }}>{formatCurrency(inv.totalAmount)}</td>
                      <td style={styles.td}>{formatCurrency(inv.paidAmount)}</td>
                      <td style={styles.td}>{inv.paymentStatus}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                style={{ padding: '0.6rem 1.4rem', background: '#334155', border: 'none', color: '#fff', borderRadius: '10px', cursor: 'pointer' }}
                onClick={() => setShowDetailModal(false)}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersReceivablesView;
