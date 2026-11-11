import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import {
  MdOutlineSearch,
  MdOutlineAdd,
  MdOutlineFileDownload,
  MdOutlineEdit,
  MdOutlineDelete,
  MdOutlineInventory2,
  MdOutlineClose,
  MdOutlineWarning,
} from 'react-icons/md';

export const ProductManagementView = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockStatus, setStockStatus] = useState('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showViewBatchesModal, setShowViewBatchesModal] = useState(false);

  const [activeProduct, setActiveProduct] = useState(null);
  const [productBatches, setProductBatches] = useState([]);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    category: 'General',
    description: '',
    purchaseCost: 0,
    sellingPrice: 0,
    reorderThreshold: 10,
    unit: 'pcs',
    hasBatches: false,
    initialStock: 0,
    batchNumber: '',
    expiryDate: '',
  });

  const [batchFormData, setBatchFormData] = useState({
    batchNumber: '',
    purchaseCost: 0,
    sellingPrice: 0,
    quantity: 10,
    expiryDate: '',
  });

  useEffect(() => {
    fetchProducts();
  }, [search, selectedCategory, stockStatus]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (stockStatus) params.stockStatus = stockStatus;

      const res = await api.get('/sales/products', { params });
      if (res.data.success) {
        setProducts(res.data.products);
        setCategories(res.data.categories || []);
      }
    } catch (err) {
      console.error('Fetch products error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      sku: `SKU-${Date.now().toString().slice(-5)}`,
      barcode: '',
      category: 'General',
      description: '',
      purchaseCost: 0,
      sellingPrice: 0,
      reorderThreshold: 10,
      unit: 'pcs',
      hasBatches: false,
      initialStock: 0,
      batchNumber: '',
      expiryDate: '',
    });
    setShowAddModal(true);
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/sales/products', formData);
      if (res.data.success) {
        setShowAddModal(false);
        fetchProducts();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create product');
    }
  };

  const handleOpenEdit = (p) => {
    setActiveProduct(p);
    setFormData({
      name: p.name,
      sku: p.sku,
      barcode: p.barcode || '',
      category: p.category || 'General',
      description: p.description || '',
      purchaseCost: p.purchaseCost,
      sellingPrice: p.sellingPrice,
      reorderThreshold: p.reorderThreshold,
      unit: p.unit || 'pcs',
      hasBatches: p.hasBatches || false,
      status: p.status || 'active',
    });
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/sales/products/${activeProduct._id}`, formData);
      if (res.data.success) {
        setShowEditModal(false);
        fetchProducts();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update product');
    }
  };

  const handleDeleteProduct = async (p) => {
    if (!window.confirm(`Are you sure you want to delete or deactivate ${p.name}?`)) return;
    try {
      const res = await api.delete(`/sales/products/${p._id}`);
      if (res.data.success) {
        fetchProducts();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete product');
    }
  };

  const handleOpenAddBatch = (p) => {
    setActiveProduct(p);
    setBatchFormData({
      batchNumber: `BAT-${Date.now().toString().slice(-4)}`,
      purchaseCost: p.purchaseCost,
      sellingPrice: p.sellingPrice,
      quantity: 20,
      expiryDate: '',
    });
    setShowBatchModal(true);
  };

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/sales/products/batch', {
        productId: activeProduct._id,
        ...batchFormData,
      });
      if (res.data.success) {
        setShowBatchModal(false);
        fetchProducts();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add batch');
    }
  };

  const handleViewBatches = async (p) => {
    setActiveProduct(p);
    try {
      const res = await api.get(`/sales/products/${p._id}`);
      if (res.data.success) {
        setProductBatches(res.data.batches || []);
        setShowViewBatchesModal(true);
      }
    } catch (err) {
      alert('Failed to load batches');
    }
  };

  const handleExportCSV = () => {
    window.open('http://localhost:5000/api/sales/products/export-csv?token=' + localStorage.getItem('token'), '_blank');
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
    exportBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: 'rgba(255, 255, 255, 0.08)',
      color: '#cbd5e1',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '10px',
      padding: '0.65rem 1.1rem',
      fontWeight: 600,
      fontSize: '0.92rem',
      cursor: 'pointer',
    },
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
      fontSize: '0.9rem',
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
      padding: '0.4rem 0.6rem',
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
      maxWidth: '560px',
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
    row: {
      display: 'flex',
      gap: '1rem',
    },
  };

  return (
    <div>
      {/* Top Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Product & Batch Management</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '0.3rem 0 0 0' }}>
            Catalog of products, pharmacy batches, expiry monitoring, and stock levels.
          </p>
        </div>

        <div style={styles.topActions}>
          <button style={styles.exportBtn} onClick={handleExportCSV}>
            <MdOutlineFileDownload size={18} />
            <span>Export CSV</span>
          </button>
          <button style={styles.primaryBtn} onClick={handleOpenAdd}>
            <MdOutlineAdd size={20} />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={styles.filterBar}>
        <div style={styles.searchBox}>
          <MdOutlineSearch size={20} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by product name, SKU, or barcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={styles.select}
        >
          <option value="All">All Categories</option>
          {categories.map((c, idx) => (
            <option key={idx} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={stockStatus}
          onChange={(e) => setStockStatus(e.target.value)}
          style={styles.select}
        >
          <option value="">All Stock Levels</option>
          <option value="low">Low Stock (At or Below Threshold)</option>
          <option value="out">Out of Stock (Zero Stock)</option>
        </select>
      </div>

      {/* Products Table */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>SKU</th>
              <th style={styles.th}>Product Name</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Selling Price</th>
              <th style={styles.th}>Unit Cost</th>
              <th style={styles.th}>Current Stock</th>
              <th style={styles.th}>Batches</th>
              <th style={styles.th}>Status</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} style={{ ...styles.td, textAlign: 'center', padding: '3rem' }}>
                  Loading catalog...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ ...styles.td, textAlign: 'center', padding: '3rem' }}>
                  No products found. Click "Add New Product" to populate your catalog.
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const isLow = p.currentStock > 0 && p.currentStock <= p.reorderThreshold;
                const isOut = p.currentStock <= 0;

                return (
                  <tr key={p._id}>
                    <td style={{ ...styles.td, fontWeight: 700, color: '#38bdf8' }}>{p.sku}</td>
                    <td style={{ ...styles.td, fontWeight: 600, color: '#fff' }}>{p.name}</td>
                    <td style={styles.td}>
                      <span style={{ background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                        {p.category}
                      </span>
                    </td>
                    <td style={{ ...styles.td, fontWeight: 700, color: '#34d399' }}>{formatCurrency(p.sellingPrice)}</td>
                    <td style={styles.td}>{formatCurrency(p.purchaseCost)}</td>
                    <td style={styles.td}>
                      <span
                        style={
                          isOut
                            ? styles.badge('rgba(239, 68, 68, 0.2)', '#fca5a5')
                            : isLow
                            ? styles.badge('rgba(245, 158, 11, 0.2)', '#fcd34d')
                            : styles.badge('rgba(16, 185, 129, 0.15)', '#6ee7b7')
                        }
                      >
                        {isLow && <MdOutlineWarning size={14} />}
                        {p.currentStock} {p.unit}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {p.hasBatches ? (
                        <button
                          style={{
                            background: 'rgba(56, 189, 248, 0.15)',
                            border: '1px solid rgba(56, 189, 248, 0.3)',
                            color: '#38bdf8',
                            borderRadius: '6px',
                            padding: '0.25rem 0.6rem',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                          onClick={() => handleViewBatches(p)}
                        >
                          View Batches
                        </button>
                      ) : (
                        <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Standard</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      <span
                        style={
                          p.status === 'active'
                            ? styles.badge('rgba(16, 185, 129, 0.15)', '#34d399')
                            : styles.badge('rgba(148, 163, 184, 0.15)', '#94a3b8')
                        }
                      >
                        {p.status}
                      </span>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>
                      {p.hasBatches && (
                        <button
                          style={{ ...styles.actionBtn, color: '#34d399' }}
                          title="Add Pharmacy Batch"
                          onClick={() => handleOpenAddBatch(p)}
                        >
                          +Batch
                        </button>
                      )}
                      <button
                        style={styles.actionBtn}
                        title="Edit Product"
                        onClick={() => handleOpenEdit(p)}
                      >
                        <MdOutlineEdit size={16} />
                      </button>
                      <button
                        style={{ ...styles.actionBtn, color: '#f87171' }}
                        title="Delete Product"
                        onClick={() => handleDeleteProduct(p)}
                      >
                        <MdOutlineDelete size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Add New Product</h3>
              <button
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                onClick={() => setShowAddModal(false)}
              >
                <MdOutlineClose size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Product Name *</label>
                <input
                  type="text"
                  required
                  style={styles.input}
                  placeholder="e.g. Paracetamol 500mg"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div style={styles.row}>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>SKU (Stock Keeping Unit) *</label>
                  <input
                    type="text"
                    required
                    style={styles.input}
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Barcode</label>
                  <input
                    type="text"
                    style={styles.input}
                    placeholder="Scan or enter"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  />
                </div>
              </div>

              <div style={styles.row}>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Category</label>
                  <input
                    type="text"
                    style={styles.input}
                    placeholder="e.g. Pharmaceuticals"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Unit of Measure</label>
                  <input
                    type="text"
                    style={styles.input}
                    placeholder="e.g. pcs, strip, box"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  />
                </div>
              </div>

              <div style={styles.row}>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Purchase Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    style={styles.input}
                    value={formData.purchaseCost}
                    onChange={(e) => setFormData({ ...formData, purchaseCost: e.target.value })}
                  />
                </div>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Selling Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    style={styles.input}
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                  />
                </div>
              </div>

              <div style={styles.row}>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Initial Stock</label>
                  <input
                    type="number"
                    style={styles.input}
                    value={formData.initialStock}
                    onChange={(e) => setFormData({ ...formData, initialStock: e.target.value })}
                  />
                </div>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Reorder Threshold</label>
                  <input
                    type="number"
                    style={styles.input}
                    value={formData.reorderThreshold}
                    onChange={(e) => setFormData({ ...formData, reorderThreshold: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ ...styles.formGroup, background: 'rgba(255,255,255,0.04)', padding: '0.8rem', borderRadius: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', color: '#e2e8f0', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.hasBatches}
                    onChange={(e) => setFormData({ ...formData, hasBatches: e.target.checked })}
                  />
                  <span>Track batches with independent expiry dates (Pharmacy / Perishable)</span>
                </label>
              </div>

              {formData.hasBatches && Number(formData.initialStock) > 0 && (
                <div style={styles.row}>
                  <div style={{ ...styles.formGroup, flex: 1 }}>
                    <label style={styles.label}>Initial Batch Number</label>
                    <input
                      type="text"
                      style={styles.input}
                      placeholder="e.g. BAT-2026-A"
                      value={formData.batchNumber}
                      onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                    />
                  </div>
                  <div style={{ ...styles.formGroup, flex: 1 }}>
                    <label style={styles.label}>Batch Expiry Date</label>
                    <input
                      type="date"
                      style={styles.input}
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  style={{ ...styles.exportBtn, padding: '0.6rem 1.2rem' }}
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.primaryBtn}>
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Edit Product: {activeProduct?.name}</h3>
              <button
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                onClick={() => setShowEditModal(false)}
              >
                <MdOutlineClose size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Product Name</label>
                <input
                  type="text"
                  required
                  style={styles.input}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div style={styles.row}>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>SKU</label>
                  <input
                    type="text"
                    required
                    style={styles.input}
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Category</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
              </div>

              <div style={styles.row}>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Purchase Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    style={styles.input}
                    value={formData.purchaseCost}
                    onChange={(e) => setFormData({ ...formData, purchaseCost: e.target.value })}
                  />
                </div>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Selling Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    style={styles.input}
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                  />
                </div>
              </div>

              <div style={styles.row}>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Unit</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  />
                </div>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Status</label>
                  <select
                    style={styles.select}
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  style={{ ...styles.exportBtn, padding: '0.6rem 1.2rem' }}
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.primaryBtn}>
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Batch Modal */}
      {showBatchModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '1.3rem' }}>
                Add Batch: {activeProduct?.name}
              </h3>
              <button
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                onClick={() => setShowBatchModal(false)}
              >
                <MdOutlineClose size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateBatch}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Batch Number / Lot *</label>
                <input
                  type="text"
                  required
                  style={styles.input}
                  placeholder="e.g. LOT-2026-X"
                  value={batchFormData.batchNumber}
                  onChange={(e) => setBatchFormData({ ...batchFormData, batchNumber: e.target.value })}
                />
              </div>

              <div style={styles.row}>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Quantity to Add *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    style={styles.input}
                    value={batchFormData.quantity}
                    onChange={(e) => setBatchFormData({ ...batchFormData, quantity: e.target.value })}
                  />
                </div>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Expiry Date *</label>
                  <input
                    type="date"
                    required
                    style={styles.input}
                    value={batchFormData.expiryDate}
                    onChange={(e) => setBatchFormData({ ...batchFormData, expiryDate: e.target.value })}
                  />
                </div>
              </div>

              <div style={styles.row}>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Batch Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    style={styles.input}
                    value={batchFormData.purchaseCost}
                    onChange={(e) => setBatchFormData({ ...batchFormData, purchaseCost: e.target.value })}
                  />
                </div>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Batch Selling Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    style={styles.input}
                    value={batchFormData.sellingPrice}
                    onChange={(e) => setBatchFormData({ ...batchFormData, sellingPrice: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  style={{ ...styles.exportBtn, padding: '0.6rem 1.2rem' }}
                  onClick={() => setShowBatchModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.primaryBtn}>
                  Add Batch & Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Batches Modal */}
      {showViewBatchesModal && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalCard, maxWidth: '680px' }}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '1.3rem' }}>
                Batches for {activeProduct?.name}
              </h3>
              <button
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                onClick={() => setShowViewBatchesModal(false)}
              >
                <MdOutlineClose size={24} />
              </button>
            </div>

            <div style={{ marginBottom: '1rem', color: '#94a3b8', fontSize: '0.9rem' }}>
              Allocations in POS follow earliest-expiry-first (FEFO) order. Expired batches are automatically locked.
            </div>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Batch Number</th>
                  <th style={styles.th}>Current Qty</th>
                  <th style={styles.th}>Expiry Date</th>
                  <th style={styles.th}>Days Left</th>
                  <th style={styles.th}>Unit Cost</th>
                </tr>
              </thead>
              <tbody>
                {productBatches.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ ...styles.td, textAlign: 'center', color: '#94a3b8' }}>
                      No batches recorded for this product yet.
                    </td>
                  </tr>
                ) : (
                  productBatches.map((b) => {
                    const daysLeft = Math.ceil((new Date(b.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                    const isExpired = daysLeft <= 0;
                    const isSoon = daysLeft > 0 && daysLeft <= 30;

                    return (
                      <tr key={b._id}>
                        <td style={{ ...styles.td, fontWeight: 700, color: '#38bdf8' }}>{b.batchNumber}</td>
                        <td style={{ ...styles.td, fontWeight: 600 }}>{b.currentQuantity}</td>
                        <td style={styles.td}>{new Date(b.expiryDate).toLocaleDateString()}</td>
                        <td style={styles.td}>
                          <span
                            style={
                              isExpired
                                ? styles.badge('rgba(239, 68, 68, 0.2)', '#f87171')
                                : isSoon
                                ? styles.badge('rgba(245, 158, 11, 0.2)', '#fbbf24')
                                : styles.badge('rgba(16, 185, 129, 0.2)', '#34d399')
                            }
                          >
                            {isExpired ? 'EXPIRED' : `${daysLeft} days`}
                          </span>
                        </td>
                        <td style={styles.td}>{formatCurrency(b.purchaseCost)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                style={{ ...styles.exportBtn, padding: '0.6rem 1.4rem' }}
                onClick={() => setShowViewBatchesModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagementView;
