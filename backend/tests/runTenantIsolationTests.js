const mongoose = require('mongoose');
const http = require('http');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');

// Import models
const { Organization } = require('../models/Organization');
const { User } = require('../models/User');
const { Department } = require('../models/Department');
const { Employee } = require('../models/Employee');
const Salary = require('../models/Salary');
const Leave = require('../models/Leave');
const { Attendance } = require('../models/Attendance');
const { Product } = require('../models/sales/Product');
const { ProductBatch } = require('../models/sales/ProductBatch');
const { InventoryMovement } = require('../models/sales/InventoryMovement');
const { SaleInvoice } = require('../models/sales/SaleInvoice');
const { Payment } = require('../models/sales/Payment');
const { Return } = require('../models/sales/Return');
const { Customer } = require('../models/sales/Customer');
const { Supplier } = require('../models/sales/Supplier');
const { PurchaseOrder } = require('../models/sales/PurchaseOrder');

// Setup test server
const app = express();
app.use(cors());
app.use(express.json());

const authRouter = require('../routes/auth');
const departmentRouter = require('../routes/department');
const employeeRouter = require('../routes/employee');
const salaryRouter = require('../routes/salary');
const leaveRouter = require('../routes/leave');
const attendanceRouter = require('../routes/attendance');
const salesRouter = require('../routes/sales');

app.use('/api/auth', authRouter);
app.use('/api/department', departmentRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/salary', salaryRouter);
app.use('/api/leave', leaveRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/sales', salesRouter);

const TEST_PORT = 5099;
const BASE_URL = `http://localhost:${TEST_PORT}`;

async function runTests() {
  let server;
  let orgA, orgB;
  let userA, userB;
  let tokenA, tokenB;
  let testDeptB, testEmpB, testSalB, testAttB, testProdB, testInvB;

  let passedCount = 0;
  let failedCount = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passedCount++;
    } else {
      console.error(`  [FAIL] ${message}`);
      failedCount++;
    }
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to DB for automated tenant isolation testing.');

    server = app.listen(TEST_PORT);
    console.log(`Test server running on port ${TEST_PORT}`);

    // --- SETUP: Create Organization A and Organization B ---
    console.log('\n--- Setting up Test Tenants ---');

    await Organization.deleteMany({ slug: { $in: ['test-org-a', 'test-org-b'] } });
    await User.deleteMany({ email: { $in: ['test.admin.a@test.com', 'test.admin.b@test.com'] } });

    orgA = await Organization.create({
      name: 'Alpha Enterprise A',
      slug: 'test-org-a',
      code: 'ORG-TEST-A',
      currency: 'USD',
      taxRate: 5,
    });

    orgB = await Organization.create({
      name: 'Beta Enterprise B',
      slug: 'test-org-b',
      code: 'ORG-TEST-B',
      currency: 'USD',
      taxRate: 10,
    });

    const hashedPassword = await bcrypt.hash('secret123', 10);

    userA = await User.create({
      name: 'Admin Alpha',
      email: 'test.admin.a@test.com',
      password: hashedPassword,
      role: 'admin',
      organizationId: orgA._id,
    });
    orgA.owner = userA._id;
    await orgA.save();

    userB = await User.create({
      name: 'Admin Beta',
      email: 'test.admin.b@test.com',
      password: hashedPassword,
      role: 'admin',
      organizationId: orgB._id,
    });
    orgB.owner = userB._id;
    await orgB.save();

    tokenA = jwt.sign(
      { _id: userA._id, role: userA.role, organizationId: orgA._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    tokenB = jwt.sign(
      { _id: userB._id, role: userB.role, organizationId: orgB._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const clientA = axios.create({
      baseURL: BASE_URL,
      headers: { Authorization: `Bearer ${tokenA}` },
    });

    const clientB = axios.create({
      baseURL: BASE_URL,
      headers: { Authorization: `Bearer ${tokenB}` },
    });

    // Seed B's data
    testDeptB = await Department.create({
      organizationId: orgB._id,
      dep_name: 'Beta Secret R&D',
      description: 'Confidential R&D of Org B',
    });

    testEmpB = await Employee.create({
      organizationId: orgB._id,
      userId: userB._id,
      employeeId: 'EMP-B-999',
      designation: 'Lead Chemist',
      department: testDeptB._id,
      salary: 85000,
    });

    testSalB = await Salary.create({
      organizationId: orgB._id,
      employeeId: testEmpB._id,
      basicSalary: 85000,
      allowance: 5000,
      deductions: 2000,
      netSalary: 88000,
      payDate: new Date(),
    });

    testAttB = await Attendance.create({
      organizationId: orgB._id,
      employeeId: testEmpB._id,
      date: '2026-10-14',
      status: 'Present',
    });

    testProdB = await Product.create({
      organizationId: orgB._id,
      name: 'Beta Confidential Drug X',
      sku: 'DRUG-X-999',
      purchaseCost: 50,
      sellingPrice: 120,
      currentStock: 250,
      category: 'Pharmaceuticals',
      status: 'active',
    });

    console.log('Seed data for Organization B created.');

    // ==========================================
    // TEST 1: HRM Department Isolation
    // ==========================================
    console.log('\n--- Executing Test 1: HRM Department Isolation ---');
    const deptRes = await clientA.get('/api/department');
    assert(deptRes.data.success === true, 'Org A get department request succeeds');
    const hasOrgBDept = deptRes.data.departments.some(d => d._id.toString() === testDeptB._id.toString());
    assert(!hasOrgBDept, 'Org A CANNOT view Org B departments in list');

    // ==========================================
    // TEST 2: HRM Employee Isolation & IDOR
    // ==========================================
    console.log('\n--- Executing Test 2: HRM Employee Isolation & IDOR Protection ---');
    const empRes = await clientA.get('/api/employee');
    const hasOrgBEmp = empRes.data.employees.some(e => e._id.toString() === testEmpB._id.toString());
    assert(!hasOrgBEmp, 'Org A CANNOT view Org B employees in employee list');

    let idorEmpRejected = false;
    try {
      await clientA.get(`/api/employee/${testEmpB._id}`);
    } catch (e) {
      idorEmpRejected = e.response && e.response.status === 404;
    }
    assert(idorEmpRejected, 'Org A CANNOT retrieve Org B employee by ID (IDOR prevented)');

    // ==========================================
    // TEST 3: HRM Salary & Attendance Isolation
    // ==========================================
    console.log('\n--- Executing Test 3: HRM Salary & Attendance Isolation ---');
    let idorSalaryRejected = false;
    try {
      await clientA.get(`/api/salary/${testEmpB._id}`);
    } catch (e) {
      idorSalaryRejected = e.response && e.response.status === 404;
    }
    assert(idorSalaryRejected, 'Org A CANNOT view Org B employee salary (IDOR prevented)');

    const attRes = await clientA.get('/api/attendance?date=2026-10-14');
    const hasOrgBAtt = attRes.data.attendances.some(a => a._id.toString() === testAttB._id.toString());
    assert(!hasOrgBAtt, 'Org A CANNOT access Org B attendance records');

    // ==========================================
    // TEST 4: Sales Product Catalog Isolation
    // ==========================================
    console.log('\n--- Executing Test 4: Sales Product Catalog Isolation ---');
    const prodListA = await clientA.get('/api/sales/products');
    const hasOrgBProd = prodListA.data.products.some(p => p._id.toString() === testProdB._id.toString());
    assert(!hasOrgBProd, 'Org A CANNOT view Org B products in catalog');

    let idorProdRejected = false;
    try {
      await clientA.get(`/api/sales/products/${testProdB._id}`);
    } catch (e) {
      idorProdRejected = e.response && e.response.status === 404;
    }
    assert(idorProdRejected, 'Org A CANNOT view Org B product details by ID (IDOR prevented)');

    // Verify tenant-scoped uniqueness: Org A can create product with same SKU 'DRUG-X-999'
    const sameSkuCreateRes = await clientA.post('/api/sales/products', {
      name: 'Alpha Generic Compound X',
      sku: 'DRUG-X-999',
      purchaseCost: 20,
      sellingPrice: 45,
      initialStock: 100,
    });
    assert(sameSkuCreateRes.data.success === true, 'Org A can independently use same SKU (DRUG-X-999) under their tenant');

    // ==========================================
    // TEST 5: Stock Modification & IDOR Protection
    // ==========================================
    console.log('\n--- Executing Test 5: Stock Modification & Tampering Protection ---');
    let idorStockRejected = false;
    try {
      await clientA.post('/api/sales/inventory/adjust', {
        productId: testProdB._id,
        quantityChange: -50,
        reason: 'Malicious adjustment attempt',
      });
    } catch (e) {
      idorStockRejected = e.response && e.response.status === 404;
    }
    assert(idorStockRejected, 'Org A CANNOT modify or adjust Org B product stock');

    // Verify Org B stock was NOT modified
    const verifyProdB = await Product.findById(testProdB._id);
    assert(verifyProdB.currentStock === 250, 'Org B stock remains untampered at 250');

    // ==========================================
    // TEST 6: POS Billing, Invoices & Isolation
    // ==========================================
    console.log('\n--- Executing Test 6: POS Invoices & Isolation ---');
    // Org B creates an invoice
    const orgBCheckoutRes = await clientB.post('/api/sales/pos/checkout', {
      customerName: 'Beta VIP Client',
      cartItems: [
        {
          productId: testProdB._id,
          quantity: 10,
          unitPrice: 120,
        },
      ],
      paidAmount: 1200,
      paymentMethod: 'CASH',
    });
    assert(orgBCheckoutRes.data.success === true, 'Org B POS checkout succeeds');
    testInvB = orgBCheckoutRes.data.invoice;

    // Org A lists invoices
    const invListA = await clientA.get('/api/sales/pos/invoices');
    const hasOrgBInvoice = invListA.data.invoices.some(i => i._id.toString() === testInvB._id.toString());
    assert(!hasOrgBInvoice, 'Org A CANNOT view Org B invoices in invoice list');

    let idorInvoiceRejected = false;
    try {
      await clientA.get(`/api/sales/pos/invoices/${testInvB._id}`);
    } catch (e) {
      idorInvoiceRejected = e.response && e.response.status === 404;
    }
    assert(idorInvoiceRejected, 'Org A CANNOT retrieve Org B invoice by ID');

    // ==========================================
    // TEST 7: Dashboard Metrics Isolation
    // ==========================================
    console.log('\n--- Executing Test 7: Dashboard Metrics Isolation ---');
    const metricsA = await clientA.get('/api/sales/reports/dashboard');
    assert(metricsA.data.metrics.todaySales === 0, 'Org A dashboard shows $0 today sales despite Org B having sales');
    assert(metricsA.data.metrics.recentInvoices.length === 0, 'Org A dashboard has 0 invoices from Org B');

    const metricsB = await clientB.get('/api/sales/reports/dashboard');
    assert(metricsB.data.metrics.todaySales >= 1200, 'Org B dashboard shows their own $1200+ sales');

    // ==========================================
    // TEST 8: CSV Data Export Isolation
    // ==========================================
    console.log('\n--- Executing Test 8: CSV Data Export Isolation ---');
    const csvResA = await clientA.get('/api/sales/products/export-csv');
    assert(typeof csvResA.data === 'string', 'CSV export returns string content');
    assert(!csvResA.data.includes('Beta Confidential Drug X'), 'Org A CSV export does NOT contain Org B products');
    assert(csvResA.data.includes('Alpha Generic Compound X'), 'Org A CSV export contains Org A products');

    // ==========================================
    // TEST 9: Client Tampering with organizationId in Request Body
    // ==========================================
    console.log('\n--- Executing Test 9: Client Tampering Prevention ---');
    const tamperedRes = await clientA.post('/api/sales/products', {
      organizationId: orgB._id, // malicious client sends Org B's ID
      name: 'Tamper Attempt Product',
      sku: 'TAMPER-001',
      purchaseCost: 10,
      sellingPrice: 20,
    });
    assert(tamperedRes.data.success === true, 'Product creation handled');
    const createdTampered = await Product.findOne({ sku: 'TAMPER-001' });
    assert(
      createdTampered.organizationId.toString() === orgA._id.toString(),
      'Server derived organizationId from token; client-provided org ID was ignored!'
    );

    // ==========================================
    // TEST 10: Pharmacy Earliest-Expiry-First POS Allocation
    // ==========================================
    console.log('\n--- Executing Test 10: Pharmacy Earliest-Expiry-First (FEFO) Allocation ---');
    const pharmaProd = await Product.create({
      organizationId: orgA._id,
      name: 'Azithromycin 500mg',
      sku: 'AZITH-500',
      purchaseCost: 15,
      sellingPrice: 30,
      currentStock: 100,
      hasBatches: true,
    });

    const now = new Date();
    // Batch 1: Expiring in 10 days (earliest) - 20 qty
    const batch1 = await ProductBatch.create({
      organizationId: orgA._id,
      productId: pharmaProd._id,
      batchNumber: 'AZ-EARLY-10',
      purchaseCost: 15,
      sellingPrice: 30,
      initialQuantity: 20,
      currentQuantity: 20,
      expiryDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
    });

    // Batch 2: Expiring in 180 days (later) - 80 qty
    const batch2 = await ProductBatch.create({
      organizationId: orgA._id,
      productId: pharmaProd._id,
      batchNumber: 'AZ-LATER-180',
      purchaseCost: 15,
      sellingPrice: 30,
      initialQuantity: 80,
      currentQuantity: 80,
      expiryDate: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000),
    });

    // POS Checkout for 25 units: should take all 20 from batch1 and 5 from batch2
    const checkoutPharmaRes = await clientA.post('/api/sales/pos/checkout', {
      customerName: 'Pharmacy Walk-in',
      cartItems: [
        {
          productId: pharmaProd._id,
          quantity: 25,
          unitPrice: 30,
        },
      ],
      paidAmount: 750,
      paymentMethod: 'CASH',
    });
    assert(checkoutPharmaRes.data.success === true, 'Pharma batch checkout succeeds');

    const updatedBatch1 = await ProductBatch.findById(batch1._id);
    const updatedBatch2 = await ProductBatch.findById(batch2._id);
    assert(updatedBatch1.currentQuantity === 0, 'Earliest batch (AZ-EARLY-10) was fully consumed first (0 left)');
    assert(updatedBatch2.currentQuantity === 75, 'Later batch (AZ-LATER-180) supplied the remaining 5 units (75 left)');

    // ==========================================
    // TEST 11: Returns & Stock Restoration
    // ==========================================
    console.log('\n--- Executing Test 11: Return Processing & Resalable Stock Restoration ---');
    const pharmaInvoice = checkoutPharmaRes.data.invoice;
    const returnRes = await clientA.post('/api/sales/returns/process', {
      saleInvoiceId: pharmaInvoice._id,
      returnItems: [
        {
          productId: pharmaProd._id,
          quantity: 5,
          condition: 'RESALABLE',
        },
      ],
      refundMethod: 'CASH',
      reason: 'Wrong prescription presented',
    });
    assert(returnRes.data.success === true, 'Return processed successfully');
    assert(returnRes.data.returnRecord.totalRefundAmount === 150, 'Calculated refund is $150 (5 * $30)');

    const reloadedPharma = await Product.findById(pharmaProd._id);
    assert(reloadedPharma.currentStock === 80, 'Stock restored by 5 units from 75 to 80 for resalable item');

    console.log('\n======================================================');
    console.log(`TOTAL TESTS: ${passedCount + failedCount} | PASSED: ${passedCount} | FAILED: ${failedCount}`);
    console.log('======================================================\n');

    // Cleanup
    await Organization.deleteMany({ _id: { $in: [orgA._id, orgB._id] } });
    await User.deleteMany({ organizationId: { $in: [orgA._id, orgB._id] } });
    await Department.deleteMany({ organizationId: { $in: [orgA._id, orgB._id] } });
    await Employee.deleteMany({ organizationId: { $in: [orgA._id, orgB._id] } });
    await Salary.deleteMany({ organizationId: { $in: [orgA._id, orgB._id] } });
    await Attendance.deleteMany({ organizationId: { $in: [orgA._id, orgB._id] } });
    await Product.deleteMany({ organizationId: { $in: [orgA._id, orgB._id] } });
    await ProductBatch.deleteMany({ organizationId: { $in: [orgA._id, orgB._id] } });
    await InventoryMovement.deleteMany({ organizationId: { $in: [orgA._id, orgB._id] } });
    await SaleInvoice.deleteMany({ organizationId: { $in: [orgA._id, orgB._id] } });
    await Payment.deleteMany({ organizationId: { $in: [orgA._id, orgB._id] } });
    await Return.deleteMany({ organizationId: { $in: [orgA._id, orgB._id] } });
    await Customer.deleteMany({ organizationId: { $in: [orgA._id, orgB._id] } });
    await Supplier.deleteMany({ organizationId: { $in: [orgA._id, orgB._id] } });
    await PurchaseOrder.deleteMany({ organizationId: { $in: [orgA._id, orgB._id] } });

    server.close();
    process.exit(failedCount > 0 ? 1 : 0);
  } catch (err) {
    console.error('Fatal test execution error:', err);
    if (server) server.close();
    process.exit(1);
  }
}

runTests();
