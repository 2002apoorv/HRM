import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import {
  MdOutlineAnalytics,
  MdOutlineFileDownload,
  MdOutlineTrendingUp,
  MdOutlineInventory,
  MdOutlineHourglassBottom,
  MdOutlineAccountBalanceWallet,
} from 'react-icons/md';

export const ReportsAnalyticsView = () => {
  const [reportType, setReportType] = useState('SALES_SUMMARY');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchReport();
  }, [reportType, startDate, endDate]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = { type: reportType };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await api.get('/sales/reports/detailed', { params });
      if (res.data.success) {
        setReportData(res.data.reportData || []);
      }
    } catch (err) {
      console.error('Fetch report error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    window.open(
      `http://localhost:5000/api/sales/reports/export-csv?type=${reportType}&token=${localStorage.getItem('token')}`,
      '_blank'
    );
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
    exportBtn: {
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
    controlsBar: {
      background: 'rgba(30, 41, 59, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '16px',
      padding: '1.2rem 1.4rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1.2rem',
      marginBottom: '1.8rem',
      flexWrap: 'wrap',
    },
    select: {
      padding: '0.65rem 1rem',
      background: 'rgba(15, 23, 42, 0.9)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '10px',
      color: '#fff',
      fontSize: '0.9rem',
      outline: 'none',
    },
    dateInput: {
      padding: '0.6rem 0.9rem',
      background: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '10px',
      color: '#fff',
      fontSize: '0.85rem',
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
  };

  return (
    <div>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Business Reports & Analytics</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '0.3rem 0 0 0' }}>
            Audited financial, valuation, expiry, and profit reporting strictly scoped to your tenant.
          </p>
        </div>

        <button style={styles.exportBtn} onClick={handleExportCSV}>
          <MdOutlineFileDownload size={18} />
          <span>Export Report to CSV</span>
        </button>
      </div>

      {/* Report Switcher & Filter Controls */}
      <div style={styles.controlsBar}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Select Report</label>
          <select
            style={styles.select}
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="SALES_SUMMARY">📈 Sales Summary Report</option>
            <option value="GROSS_PROFIT">💰 Product-Wise Gross Profit</option>
            <option value="INVENTORY_VALUATION">📦 Inventory Valuation at Cost</option>
            <option value="EXPIRY_REPORT">⏳ Batch Expiry Monitoring</option>
            <option value="CUSTOMER_RECEIVABLES">💳 Customer Receivables (A/R)</option>
            <option value="SUPPLIER_PAYABLES">🚚 Supplier Payables (A/P)</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Start Date</label>
          <input
            type="date"
            style={styles.dateInput}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>End Date</label>
          <input
            type="date"
            style={styles.dateInput}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Render Table According to Selected Report */}
      <div style={styles.tableWrapper}>
        {reportType === 'SALES_SUMMARY' && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Invoice #</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Items Count</th>
                <th style={styles.th}>Subtotal</th>
                <th style={styles.th}>Tax</th>
                <th style={styles.th}>Discount</th>
                <th style={styles.th}>Grand Total</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} style={{ ...styles.td, textAlign: 'center', padding: '3rem' }}>Generating report...</td></tr>
              ) : reportData.length === 0 ? (
                <tr><td colSpan={9} style={{ ...styles.td, textAlign: 'center', padding: '3rem' }}>No sales data for selected period.</td></tr>
              ) : (
                reportData.map((inv) => (
                  <tr key={inv._id}>
                    <td style={{ ...styles.td, fontWeight: 700, color: '#38bdf8' }}>{inv.invoiceNumber}</td>
                    <td style={styles.td}>{new Date(inv.createdAt).toLocaleDateString()}</td>
                    <td style={{ ...styles.td, color: '#fff' }}>{inv.customerName}</td>
                    <td style={styles.td}>{inv.items.length}</td>
                    <td style={styles.td}>{formatCurrency(inv.subtotal)}</td>
                    <td style={styles.td}>{formatCurrency(inv.taxAmount)}</td>
                    <td style={styles.td}>{formatCurrency(inv.discountAmount)}</td>
                    <td style={{ ...styles.td, fontWeight: 700, color: '#34d399' }}>{formatCurrency(inv.totalAmount)}</td>
                    <td style={styles.td}>{inv.paymentStatus}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {reportType === 'GROSS_PROFIT' && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Product Name</th>
                <th style={styles.th}>SKU</th>
                <th style={styles.th}>Units Sold</th>
                <th style={styles.th}>Gross Revenue</th>
                <th style={styles.th}>Cost of Goods (COGS)</th>
                <th style={styles.th}>Gross Profit</th>
                <th style={styles.th}>Profit Margin %</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ ...styles.td, textAlign: 'center', padding: '3rem' }}>Calculating profit margins...</td></tr>
              ) : reportData.length === 0 ? (
                <tr><td colSpan={7} style={{ ...styles.td, textAlign: 'center', padding: '3rem' }}>No sales found to compute profit.</td></tr>
              ) : (
                reportData.map((p, idx) => {
                  const marginPercent = p.totalRevenue > 0 ? Math.round((p.grossProfit / p.totalRevenue) * 100) : 0;
                  return (
                    <tr key={idx}>
                      <td style={{ ...styles.td, fontWeight: 700, color: '#fff' }}>{p.name}</td>
                      <td style={{ ...styles.td, color: '#38bdf8' }}>{p.sku}</td>
                      <td style={styles.td}>{p.soldQuantity}</td>
                      <td style={{ ...styles.td, fontWeight: 600 }}>{formatCurrency(p.totalRevenue)}</td>
                      <td style={styles.td}>{formatCurrency(p.totalCogs)}</td>
                      <td style={{ ...styles.td, fontWeight: 800, color: '#34d399' }}>{formatCurrency(p.grossProfit)}</td>
                      <td style={{ ...styles.td, fontWeight: 700, color: '#38bdf8' }}>{marginPercent}%</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}

        {reportType === 'INVENTORY_VALUATION' && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>SKU</th>
                <th style={styles.th}>Product Name</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>In-Stock Qty</th>
                <th style={styles.th}>Unit Cost</th>
                <th style={styles.th}>Selling Price</th>
                <th style={styles.th}>Valuation at Cost</th>
                <th style={styles.th}>Retail Valuation</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ ...styles.td, textAlign: 'center', padding: '3rem' }}>Valuating inventory...</td></tr>
              ) : (
                reportData.map((prod) => (
                  <tr key={prod._id}>
                    <td style={{ ...styles.td, fontWeight: 700, color: '#38bdf8' }}>{prod.sku}</td>
                    <td style={{ ...styles.td, fontWeight: 600, color: '#fff' }}>{prod.name}</td>
                    <td style={styles.td}>{prod.category}</td>
                    <td style={{ ...styles.td, fontWeight: 700 }}>{prod.currentStock} {prod.unit}</td>
                    <td style={styles.td}>{formatCurrency(prod.purchaseCost)}</td>
                    <td style={styles.td}>{formatCurrency(prod.sellingPrice)}</td>
                    <td style={{ ...styles.td, fontWeight: 800, color: '#fbbf24' }}>
                      {formatCurrency(prod.currentStock * prod.purchaseCost)}
                    </td>
                    <td style={{ ...styles.td, fontWeight: 800, color: '#34d399' }}>
                      {formatCurrency(prod.currentStock * prod.sellingPrice)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {reportType === 'EXPIRY_REPORT' && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Batch Number</th>
                <th style={styles.th}>Product Name</th>
                <th style={styles.th}>SKU</th>
                <th style={styles.th}>Stock in Batch</th>
                <th style={styles.th}>Expiry Date</th>
                <th style={styles.th}>Days Remaining</th>
                <th style={styles.th}>Batch Valuation</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ ...styles.td, textAlign: 'center', padding: '3rem' }}>Checking batch dates...</td></tr>
              ) : reportData.length === 0 ? (
                <tr><td colSpan={7} style={{ ...styles.td, textAlign: 'center', padding: '3rem' }}>No active batches found.</td></tr>
              ) : (
                reportData.map((b) => {
                  const daysLeft = Math.ceil((new Date(b.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                  return (
                    <tr key={b._id}>
                      <td style={{ ...styles.td, fontWeight: 700, color: '#38bdf8' }}>{b.batchNumber}</td>
                      <td style={{ ...styles.td, fontWeight: 600, color: '#fff' }}>{b.productId?.name}</td>
                      <td style={styles.td}>{b.productId?.sku}</td>
                      <td style={{ ...styles.td, fontWeight: 700 }}>{b.currentQuantity}</td>
                      <td style={styles.td}>{new Date(b.expiryDate).toLocaleDateString()}</td>
                      <td style={{ ...styles.td, fontWeight: 700, color: daysLeft <= 30 ? '#f87171' : '#34d399' }}>
                        {daysLeft <= 0 ? 'EXPIRED' : `${daysLeft} days`}
                      </td>
                      <td style={styles.td}>{formatCurrency(b.currentQuantity * b.purchaseCost)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}

        {reportType === 'CUSTOMER_RECEIVABLES' && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Customer Name</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Address</th>
                <th style={styles.th}>Outstanding Balance</th>
                <th style={styles.th}>Lifetime Purchases</th>
              </tr>
            </thead>
            <tbody>
              {reportData.length === 0 ? (
                <tr><td colSpan={6} style={{ ...styles.td, textAlign: 'center', padding: '3rem' }}>No outstanding receivables.</td></tr>
              ) : (
                reportData.map((c) => (
                  <tr key={c._id}>
                    <td style={{ ...styles.td, fontWeight: 700, color: '#fff' }}>{c.name}</td>
                    <td style={styles.td}>{c.phone || '-'}</td>
                    <td style={styles.td}>{c.email || '-'}</td>
                    <td style={styles.td}>{c.address || '-'}</td>
                    <td style={{ ...styles.td, fontWeight: 800, color: '#fbbf24' }}>{formatCurrency(c.outstandingBalance)}</td>
                    <td style={styles.td}>{formatCurrency(c.totalSpent)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {reportType === 'SUPPLIER_PAYABLES' && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Supplier Name</th>
                <th style={styles.th}>Contact Person</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Outstanding Payables</th>
              </tr>
            </thead>
            <tbody>
              {reportData.length === 0 ? (
                <tr><td colSpan={5} style={{ ...styles.td, textAlign: 'center', padding: '3rem' }}>No outstanding supplier payables.</td></tr>
              ) : (
                reportData.map((s) => (
                  <tr key={s._id}>
                    <td style={{ ...styles.td, fontWeight: 700, color: '#fff' }}>{s.name}</td>
                    <td style={styles.td}>{s.contactPerson || '-'}</td>
                    <td style={styles.td}>{s.phone || '-'}</td>
                    <td style={styles.td}>{s.email || '-'}</td>
                    <td style={{ ...styles.td, fontWeight: 800, color: '#f87171' }}>{formatCurrency(s.outstandingBalance)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReportsAnalyticsView;
