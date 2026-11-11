const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

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
const { Customer } = require('../models/sales/Customer');
const { Supplier } = require('../models/sales/Supplier');
const { SaleInvoice } = require('../models/sales/SaleInvoice');
const { Payment } = require('../models/sales/Payment');
const { PurchaseOrder } = require('../models/sales/PurchaseOrder');
const { Return } = require('../models/sales/Return');

async function resetToBlankSlate() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB.');

    // 1. Safety backup before wiping
    const backupDir = path.join(__dirname, '../backups');
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const collections = await mongoose.connection.db.listCollections().toArray();
    const backupData = {};
    for (const col of collections) {
      backupData[col.name] = await mongoose.connection.db.collection(col.name).find({}).toArray();
    }
    const backupFile = path.join(backupDir, `backup_before_blank_slate_${timestamp}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
    console.log(`Safety snapshot created at ${backupFile}`);

    // 2. Find and protect Primary Organization and Admin User
    let primaryOrg = await Organization.findOne({ slug: 'primary-enterprise' });
    if (!primaryOrg) {
      primaryOrg = await Organization.findOne({});
    }

    const adminUser = await User.findOne({ email: 'admin@gmail.com' });
    if (!adminUser) {
      console.error('Admin user (admin@gmail.com) not found! Aborting wipe to protect login.');
      process.exit(1);
    }

    console.log(`Keeping Admin: ${adminUser.email} (ID: ${adminUser._id})`);
    console.log(`Keeping Workspace: ${primaryOrg?.name} (ID: ${primaryOrg?._id})`);

    // 3. Clear HRM records
    const delEmployees = await Employee.deleteMany({});
    console.log(`Cleared Employees: ${delEmployees.deletedCount}`);

    const delDepartments = await Department.deleteMany({});
    console.log(`Cleared Departments: ${delDepartments.deletedCount}`);

    const delSalaries = await Salary.deleteMany({});
    console.log(`Cleared Salaries: ${delSalaries.deletedCount}`);

    const delLeaves = await Leave.deleteMany({});
    console.log(`Cleared Leaves: ${delLeaves.deletedCount}`);

    const delAttendances = await Attendance.deleteMany({});
    console.log(`Cleared Attendances: ${delAttendances.deletedCount}`);

    // Clear all users except admin@gmail.com
    const delUsers = await User.deleteMany({ _id: { $ne: adminUser._id } });
    console.log(`Cleared Non-Admin Users: ${delUsers.deletedCount}`);

    // 4. Clear Sales & Inventory records
    const delProducts = await Product.deleteMany({});
    console.log(`Cleared Products: ${delProducts.deletedCount}`);

    const delBatches = await ProductBatch.deleteMany({});
    console.log(`Cleared Product Batches: ${delBatches.deletedCount}`);

    const delMovements = await InventoryMovement.deleteMany({});
    console.log(`Cleared Inventory Movements: ${delMovements.deletedCount}`);

    const delCustomers = await Customer.deleteMany({});
    console.log(`Cleared Customers: ${delCustomers.deletedCount}`);

    const delSuppliers = await Supplier.deleteMany({});
    console.log(`Cleared Suppliers: ${delSuppliers.deletedCount}`);

    const delInvoices = await SaleInvoice.deleteMany({});
    console.log(`Cleared Invoices: ${delInvoices.deletedCount}`);

    const delPayments = await Payment.deleteMany({});
    console.log(`Cleared Payments: ${delPayments.deletedCount}`);

    const delPOs = await PurchaseOrder.deleteMany({});
    console.log(`Cleared Purchase Orders: ${delPOs.deletedCount}`);

    const delReturns = await Return.deleteMany({});
    console.log(`Cleared Returns: ${delReturns.deletedCount}`);

    console.log('\n--- SUCCESS: Database reset to a completely clean blank slate! ---');
    console.log('Only the Admin user and Primary Organization workspace remain.');
    process.exit(0);
  } catch (err) {
    console.error('Error during blank slate reset:', err);
    process.exit(1);
  }
}

resetToBlankSlate();
