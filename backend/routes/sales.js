const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addBatch,
  getBatches,
  exportProductsCSV,
} = require('../controller/sales/productController');

const {
  getMovements,
  adjustStock,
  writeOffStock,
  getAlerts,
} = require('../controller/sales/inventoryController');

const {
  searchPosProducts,
  createSale,
  getInvoices,
  getInvoiceById,
} = require('../controller/sales/posController');

const {
  processReturn,
  getReturns,
} = require('../controller/sales/returnController');

const {
  createPurchaseOrder,
  getPurchaseOrders,
  receivePurchaseOrder,
} = require('../controller/sales/purchaseController');

const {
  getCustomers,
  createCustomer,
  getCustomerById,
  recordCustomerPayment,
} = require('../controller/sales/customerController');

const {
  getSuppliers,
  createSupplier,
  getSupplierById,
  recordSupplierPayment,
} = require('../controller/sales/supplierController');

const {
  getDashboardMetrics,
  getDetailedReport,
  exportReportCSV,
} = require('../controller/sales/reportController');

// All Sales & Inventory endpoints require authenticated tenant session
router.use(authMiddleware);

// --- Products & Batches ---
router.get('/products', getProducts);
router.get('/products/export-csv', exportProductsCSV);
router.get('/products/batches', getBatches);
router.get('/products/:id', getProductById);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.post('/products/batch', addBatch);

// --- Inventory & Auditing ---
router.get('/inventory/movements', getMovements);
router.get('/inventory/alerts', getAlerts);
router.post('/inventory/adjust', adjustStock);
router.post('/inventory/write-off', writeOffStock);

// --- POS & Billing ---
router.get('/pos/search', searchPosProducts);
router.post('/pos/checkout', createSale);
router.get('/pos/invoices', getInvoices);
router.get('/pos/invoices/:id', getInvoiceById);
router.get('/invoices', getInvoices);
router.get('/invoices/:id', getInvoiceById);

// --- Returns ---
router.post('/returns/process', processReturn);
router.get('/returns', getReturns);

// --- Purchases & Receiving ---
router.get('/purchases', getPurchaseOrders);
router.post('/purchases', createPurchaseOrder);
router.post('/purchases/:id/receive', receivePurchaseOrder);

// --- Customers & Accounts Receivable ---
router.get('/customers', getCustomers);
router.post('/customers', createCustomer);
router.get('/customers/:id', getCustomerById);
router.post('/customers/payment', recordCustomerPayment);

// --- Suppliers & Accounts Payable ---
router.get('/suppliers', getSuppliers);
router.post('/suppliers', createSupplier);
router.get('/suppliers/:id', getSupplierById);
router.post('/suppliers/payment', recordSupplierPayment);

// --- Reports & Dashboard ---
router.get('/reports/dashboard', getDashboardMetrics);
router.get('/reports/detailed', getDetailedReport);
router.get('/reports/export-csv', exportReportCSV);

module.exports = router;
