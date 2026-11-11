const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { Organization } = require('../models/Organization');
const { User } = require('../models/User');
const { Product } = require('../models/sales/Product');
const { ProductBatch } = require('../models/sales/ProductBatch');
const { InventoryMovement } = require('../models/sales/InventoryMovement');
const { Customer } = require('../models/sales/Customer');
const { Supplier } = require('../models/sales/Supplier');
const { SaleInvoice } = require('../models/sales/SaleInvoice');
const { Payment } = require('../models/sales/Payment');
const { PurchaseOrder } = require('../models/sales/PurchaseOrder');

async function seedSalesData() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB for seeding sales data.');

    const primaryOrg = await Organization.findOne({ slug: 'primary-enterprise' });
    if (!primaryOrg) {
      console.error('Primary organization not found! Run migration first.');
      process.exit(1);
    }
    const orgId = primaryOrg._id;

    const adminUser = await User.findOne({ email: 'admin@gmail.com' });
    const adminId = adminUser ? adminUser._id : null;

    // Clear existing sales records for Primary Organization only (preserving HRM data!)
    await Product.deleteMany({ organizationId: orgId });
    await ProductBatch.deleteMany({ organizationId: orgId });
    await InventoryMovement.deleteMany({ organizationId: orgId });
    await Customer.deleteMany({ organizationId: orgId });
    await Supplier.deleteMany({ organizationId: orgId });
    await SaleInvoice.deleteMany({ organizationId: orgId });
    await Payment.deleteMany({ organizationId: orgId });
    await PurchaseOrder.deleteMany({ organizationId: orgId });

    console.log('Seeding Customers...');
    const cust1 = await Customer.create({
      organizationId: orgId,
      name: 'Apex Health Clinic',
      phone: '+1 555-0192',
      email: 'orders@apexclinic.org',
      address: '124 Hospital Blvd, Medical District',
      outstandingBalance: 145.0,
      totalSpent: 1820.0,
    });

    const cust2 = await Customer.create({
      organizationId: orgId,
      name: 'Dr. Marcus Vance',
      phone: '+1 555-0843',
      email: 'marcus.vance@carenet.com',
      address: '88 North Suite 4A',
      outstandingBalance: 0,
      totalSpent: 940.0,
    });

    const cust3 = await Customer.create({
      organizationId: orgId,
      name: 'Sunrise Care Home',
      phone: '+1 555-0421',
      email: 'procurement@sunrisecare.org',
      address: '52 Elm Street',
      outstandingBalance: 310.5,
      totalSpent: 2450.0,
    });

    const cust4 = await Customer.create({
      organizationId: orgId,
      name: 'Sarah Jenkins',
      phone: '+1 555-0779',
      email: 's.jenkins@gmail.com',
      address: '712 Pine Ave',
      outstandingBalance: 0,
      totalSpent: 125.0,
    });

    console.log('Seeding Suppliers...');
    const sup1 = await Supplier.create({
      organizationId: orgId,
      name: 'MedEquip Global Supplies',
      contactPerson: 'David Warner',
      phone: '+1 800-443-221',
      email: 'sales@medequipglobal.com',
      address: '900 Logistics Parkway',
      outstandingBalance: 1200.0,
    });

    const sup2 = await Supplier.create({
      organizationId: orgId,
      name: 'BioPharma Labs Distributors',
      contactPerson: 'Elena Rostova',
      phone: '+1 800-992-108',
      email: 'orders@biopharmalabs.com',
      address: '45 Science Park Drive',
      outstandingBalance: 650.0,
    });

    const sup3 = await Supplier.create({
      organizationId: orgId,
      name: 'Apex Surgical & Hygiene Ltd',
      contactPerson: 'Vikram Mehta',
      phone: '+1 800-332-901',
      email: 'contact@apexsurgical.com',
      address: '12 Harbor Point Way',
      outstandingBalance: 0,
    });

    console.log('Seeding Products & Batches...');
    const now = new Date();

    // 1. Paracetamol
    const p1 = await Product.create({
      organizationId: orgId,
      name: 'Paracetamol 500mg Tablets',
      sku: 'MED-PARA-500',
      barcode: '890103001',
      category: 'Pharmaceuticals',
      description: 'Analgesic and antipyretic tablets for pain and fever relief.',
      purchaseCost: 1.2,
      sellingPrice: 3.5,
      reorderThreshold: 20,
      unit: 'strip',
      hasBatches: true,
      currentStock: 150,
      status: 'active',
    });
    const b1_1 = await ProductBatch.create({
      organizationId: orgId,
      productId: p1._id,
      batchNumber: 'PARA-26A',
      purchaseCost: 1.2,
      sellingPrice: 3.5,
      initialQuantity: 50,
      currentQuantity: 50,
      expiryDate: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000), // 45 days
    });
    const b1_2 = await ProductBatch.create({
      organizationId: orgId,
      productId: p1._id,
      batchNumber: 'PARA-26B',
      purchaseCost: 1.2,
      sellingPrice: 3.5,
      initialQuantity: 100,
      currentQuantity: 100,
      expiryDate: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000), // 1 year
    });

    // 2. Amoxicillin (Near expiry batch included!)
    const p2 = await Product.create({
      organizationId: orgId,
      name: 'Amoxicillin 250mg Suspension',
      sku: 'MED-AMOX-250',
      barcode: '890103002',
      category: 'Pharmaceuticals',
      description: 'Broad-spectrum antibiotic suspension for bacterial infections.',
      purchaseCost: 4.5,
      sellingPrice: 11.0,
      reorderThreshold: 15,
      unit: 'bottle',
      hasBatches: true,
      currentStock: 60,
      status: 'active',
    });
    const b2_1 = await ProductBatch.create({
      organizationId: orgId,
      productId: p2._id,
      batchNumber: 'AMOX-EXP-20',
      purchaseCost: 4.5,
      sellingPrice: 11.0,
      initialQuantity: 15,
      currentQuantity: 15,
      expiryDate: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000), // 18 days! (Expiring soon)
    });
    const b2_2 = await ProductBatch.create({
      organizationId: orgId,
      productId: p2._id,
      batchNumber: 'AMOX-27X',
      purchaseCost: 4.5,
      sellingPrice: 11.0,
      initialQuantity: 45,
      currentQuantity: 45,
      expiryDate: new Date(now.getTime() + 420 * 24 * 60 * 60 * 1000),
    });

    // 3. Digital BP Monitor
    const p3 = await Product.create({
      organizationId: orgId,
      name: 'Digital Upper-Arm BP Monitor',
      sku: 'DEV-BPM-01',
      barcode: '890103003',
      category: 'Medical Devices',
      description: 'Automatic clinical digital blood pressure monitor with LCD display.',
      purchaseCost: 22.0,
      sellingPrice: 49.99,
      reorderThreshold: 10,
      unit: 'box',
      hasBatches: false,
      currentStock: 25,
      status: 'active',
    });

    // 4. Surgical Face Masks (LOW STOCK ALERT: threshold 20, stock 6)
    const p4 = await Product.create({
      organizationId: orgId,
      name: '3-Ply Surgical Masks (50 Pack)',
      sku: 'PPE-MASK-50',
      barcode: '890103004',
      category: 'PPE & Hygiene',
      description: 'Certified 3-ply high-filtration surgical face masks.',
      purchaseCost: 3.0,
      sellingPrice: 8.5,
      reorderThreshold: 20,
      unit: 'box',
      hasBatches: false,
      currentStock: 6,
      status: 'active',
    });

    // 5. Infrared Forehead Thermometer (OUT OF STOCK ALERT: stock 0)
    const p5 = await Product.create({
      organizationId: orgId,
      name: 'Non-Contact Infrared Thermometer',
      sku: 'DEV-THERM-01',
      barcode: '890103005',
      category: 'Medical Devices',
      description: 'Instant 1-second temperature scanning with fever indicator alert.',
      purchaseCost: 14.0,
      sellingPrice: 34.9,
      reorderThreshold: 8,
      unit: 'pcs',
      hasBatches: false,
      currentStock: 0,
      status: 'active',
    });

    // 6. Vitamin C
    const p6 = await Product.create({
      organizationId: orgId,
      name: 'Vitamin C 1000mg + Zinc (60 Tablets)',
      sku: 'SUPP-VITC-100',
      barcode: '890103006',
      category: 'Supplements',
      description: 'Daily immune defense chewable formula.',
      purchaseCost: 5.5,
      sellingPrice: 14.25,
      reorderThreshold: 15,
      unit: 'bottle',
      hasBatches: true,
      currentStock: 80,
      status: 'active',
    });
    await ProductBatch.create({
      organizationId: orgId,
      productId: p6._id,
      batchNumber: 'VITC-2027',
      purchaseCost: 5.5,
      sellingPrice: 14.25,
      initialQuantity: 80,
      currentQuantity: 80,
      expiryDate: new Date(now.getTime() + 240 * 24 * 60 * 60 * 1000),
    });

    // 7. Deluxe First Aid Kit
    const p7 = await Product.create({
      organizationId: orgId,
      name: 'Deluxe Emergency First Aid Kit',
      sku: 'KIT-FAID-DX',
      barcode: '890103007',
      category: 'First Aid',
      description: '120-piece comprehensive workplace and home first aid emergency kit.',
      purchaseCost: 18.0,
      sellingPrice: 39.0,
      reorderThreshold: 10,
      unit: 'kit',
      hasBatches: false,
      currentStock: 18,
      status: 'active',
    });

    // 8. Hand Sanitizer Gel 500ml
    const p8 = await Product.create({
      organizationId: orgId,
      name: 'Instant Hand Sanitizer Gel 500ml',
      sku: 'HYG-SAN-500',
      barcode: '890103008',
      category: 'PPE & Hygiene',
      description: '70% alcohol antimicrobial instant hand sanitizer pump bottle.',
      purchaseCost: 2.1,
      sellingPrice: 5.5,
      reorderThreshold: 25,
      unit: 'bottle',
      hasBatches: false,
      currentStock: 70,
      status: 'active',
    });

    console.log('Seeding Inventory Movements...');
    const products = [p1, p2, p3, p4, p6, p7, p8];
    for (const prod of products) {
      await InventoryMovement.create({
        organizationId: orgId,
        productId: prod._id,
        movementType: 'MANUAL_ADJUSTMENT',
        quantity: prod.currentStock,
        previousStock: 0,
        newStock: prod.currentStock,
        reason: 'Opening stock count',
        performedBy: adminId,
      });
    }

    console.log('Seeding Invoices & Sales...');
    // Seed invoices spanning across the past 5 days
    const invoiceDates = [
      new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      new Date(), // Today
    ];

    // Invoice 1 (4 days ago)
    const inv1 = await SaleInvoice.create({
      organizationId: orgId,
      invoiceNumber: 'INV-100201',
      customerId: cust1._id,
      customerName: cust1.name,
      customerPhone: cust1.phone,
      items: [
        {
          productId: p1._id,
          batchId: b1_1._id,
          batchNumber: b1_1.batchNumber,
          name: p1.name,
          sku: p1.sku,
          quantity: 20,
          unitPrice: 3.5,
          unitCost: 1.2,
          subtotal: 70.0,
          total: 70.0,
        },
        {
          productId: p3._id,
          name: p3.name,
          sku: p3.sku,
          quantity: 2,
          unitPrice: 49.99,
          unitCost: 22.0,
          subtotal: 99.98,
          total: 99.98,
        },
      ],
      subtotal: 169.98,
      taxAmount: 8.5,
      totalAmount: 178.48,
      paidAmount: 178.48,
      balanceDue: 0,
      paymentMethod: 'UPI',
      paymentStatus: 'PAID',
      createdBy: adminId,
      createdAt: invoiceDates[0],
    });

    // Invoice 2 (3 days ago)
    const inv2 = await SaleInvoice.create({
      organizationId: orgId,
      invoiceNumber: 'INV-100202',
      customerId: cust2._id,
      customerName: cust2.name,
      customerPhone: cust2.phone,
      items: [
        {
          productId: p6._id,
          name: p6.name,
          sku: p6.sku,
          quantity: 5,
          unitPrice: 14.25,
          unitCost: 5.5,
          subtotal: 71.25,
          total: 71.25,
        },
        {
          productId: p7._id,
          name: p7.name,
          sku: p7.sku,
          quantity: 2,
          unitPrice: 39.0,
          unitCost: 18.0,
          subtotal: 78.0,
          total: 78.0,
        },
      ],
      subtotal: 149.25,
      taxAmount: 7.46,
      totalAmount: 156.71,
      paidAmount: 156.71,
      paymentMethod: 'CARD',
      paymentStatus: 'PAID',
      createdBy: adminId,
      createdAt: invoiceDates[1],
    });

    // Invoice 3 (2 days ago)
    const inv3 = await SaleInvoice.create({
      organizationId: orgId,
      invoiceNumber: 'INV-100203',
      customerId: cust3._id,
      customerName: cust3.name,
      customerPhone: cust3.phone,
      items: [
        {
          productId: p8._id,
          name: p8.name,
          sku: p8.sku,
          quantity: 25,
          unitPrice: 5.5,
          unitCost: 2.1,
          subtotal: 137.5,
          total: 137.5,
        },
        {
          productId: p4._id,
          name: p4.name,
          sku: p4.sku,
          quantity: 10,
          unitPrice: 8.5,
          unitCost: 3.0,
          subtotal: 85.0,
          total: 85.0,
        },
      ],
      subtotal: 222.5,
      taxAmount: 11.13,
      totalAmount: 233.63,
      paidAmount: 100.0,
      balanceDue: 133.63,
      paymentMethod: 'BANK_TRANSFER',
      paymentStatus: 'PARTIAL',
      createdBy: adminId,
      createdAt: invoiceDates[2],
    });

    // Invoice 4 (Yesterday)
    const inv4 = await SaleInvoice.create({
      organizationId: orgId,
      invoiceNumber: 'INV-100204',
      customerId: cust4._id,
      customerName: cust4.name,
      customerPhone: cust4.phone,
      items: [
        {
          productId: p1._id,
          batchId: b1_1._id,
          batchNumber: b1_1.batchNumber,
          name: p1.name,
          sku: p1.sku,
          quantity: 6,
          unitPrice: 3.5,
          unitCost: 1.2,
          subtotal: 21.0,
          total: 21.0,
        },
      ],
      subtotal: 21.0,
      taxAmount: 1.05,
      totalAmount: 22.05,
      paidAmount: 22.05,
      paymentMethod: 'CASH',
      paymentStatus: 'PAID',
      createdBy: adminId,
      createdAt: invoiceDates[3],
    });

    // Invoice 5 (Today!)
    const inv5 = await SaleInvoice.create({
      organizationId: orgId,
      invoiceNumber: 'INV-100205',
      customerName: 'Walk-in Customer (City Center)',
      items: [
        {
          productId: p3._id,
          name: p3.name,
          sku: p3.sku,
          quantity: 1,
          unitPrice: 49.99,
          unitCost: 22.0,
          subtotal: 49.99,
          total: 49.99,
        },
        {
          productId: p6._id,
          name: p6.name,
          sku: p6.sku,
          quantity: 2,
          unitPrice: 14.25,
          unitCost: 5.5,
          subtotal: 28.5,
          total: 28.5,
        },
      ],
      subtotal: 78.49,
      taxAmount: 3.92,
      totalAmount: 82.41,
      paidAmount: 82.41,
      paymentMethod: 'CASH',
      paymentStatus: 'PAID',
      createdBy: adminId,
      createdAt: invoiceDates[4],
    });

    // Record corresponding payments
    await Payment.create({
      organizationId: orgId,
      paymentNumber: 'PAY-1001',
      paymentType: 'CUSTOMER_PAYMENT',
      referenceType: 'SaleInvoice',
      referenceId: inv1._id,
      partyId: cust1._id,
      partyName: cust1.name,
      amount: 178.48,
      paymentMethod: 'UPI',
      notes: 'Payment for INV-100201',
      processedBy: adminId,
      paymentDate: invoiceDates[0],
    });

    await Payment.create({
      organizationId: orgId,
      paymentNumber: 'PAY-1002',
      paymentType: 'CUSTOMER_PAYMENT',
      referenceType: 'SaleInvoice',
      referenceId: inv2._id,
      partyId: cust2._id,
      partyName: cust2.name,
      amount: 156.71,
      paymentMethod: 'CARD',
      notes: 'Payment for INV-100202',
      processedBy: adminId,
      paymentDate: invoiceDates[1],
    });

    await Payment.create({
      organizationId: orgId,
      paymentNumber: 'PAY-1003',
      paymentType: 'CUSTOMER_PAYMENT',
      referenceType: 'SaleInvoice',
      referenceId: inv3._id,
      partyId: cust3._id,
      partyName: cust3.name,
      amount: 100.0,
      paymentMethod: 'BANK_TRANSFER',
      notes: 'Partial payment for INV-100203',
      processedBy: adminId,
      paymentDate: invoiceDates[2],
    });

    await Payment.create({
      organizationId: orgId,
      paymentNumber: 'PAY-1004',
      paymentType: 'CUSTOMER_PAYMENT',
      referenceType: 'SaleInvoice',
      referenceId: inv5._id,
      partyName: 'Walk-in Customer (City Center)',
      amount: 82.41,
      paymentMethod: 'CASH',
      notes: 'Payment for INV-100205',
      processedBy: adminId,
      paymentDate: invoiceDates[4],
    });

    console.log('Seeding Purchase Order...');
    await PurchaseOrder.create({
      organizationId: orgId,
      poNumber: 'PO-88201',
      supplierId: sup1._id,
      items: [
        {
          productId: p3._id,
          productName: p3.name,
          quantity: 20,
          receivedQuantity: 20,
          unitCost: 22.0,
          totalCost: 440.0,
        },
      ],
      totalAmount: 440.0,
      paidAmount: 440.0,
      paymentStatus: 'PAID',
      orderStatus: 'RECEIVED',
      orderDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      receivedDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      notes: 'Replenishment for digital BP monitors',
      createdBy: adminId,
    });

    console.log('--- Sales & Inventory seed data generated successfully! ---');
    process.exit(0);
  } catch (err) {
    console.error('Seed sales data error:', err);
    process.exit(1);
  }
}

seedSalesData();
