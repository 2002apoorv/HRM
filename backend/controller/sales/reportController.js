const { SaleInvoice } = require('../../models/sales/SaleInvoice');
const { Product } = require('../../models/sales/Product');
const { ProductBatch } = require('../../models/sales/ProductBatch');
const { Customer } = require('../../models/sales/Customer');
const { Supplier } = require('../../models/sales/Supplier');
const { InventoryMovement } = require('../../models/sales/InventoryMovement');
const mongoose = require('mongoose');

const getDashboardMetrics = async (req, res) => {
  try {
    const orgId = req.organizationId;
    const now = new Date();

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thirtyDaysAhead = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
    startOfToday.setHours(0, 0, 0, 0);

    const [
      todaySalesAgg,
      monthSalesAgg,
      totalProducts,
      lowStockCount,
      outOfStockCount,
      expiringBatchesCount,
      customerReceivablesAgg,
      supplierPayablesAgg,
      recentInvoices,
      allProductsForValuation,
      recentInvoicesForProfit,
    ] = await Promise.all([
      // Today sales
      SaleInvoice.aggregate([
        { $match: { organizationId: orgId, createdAt: { $gte: startOfToday } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
      ]),
      // Month sales
      SaleInvoice.aggregate([
        { $match: { organizationId: orgId, createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
      ]),
      // Total products
      Product.countDocuments({ organizationId: orgId }),
      // Low stock
      Product.countDocuments({
        organizationId: orgId,
        status: 'active',
        currentStock: { $gt: 0 },
        $expr: { $lte: ['$currentStock', '$reorderThreshold'] },
      }),
      // Out of stock
      Product.countDocuments({
        organizationId: orgId,
        status: 'active',
        currentStock: { $lte: 0 },
      }),
      // Expiring batches in 30 days
      ProductBatch.countDocuments({
        organizationId: orgId,
        currentQuantity: { $gt: 0 },
        expiryDate: { $lte: thirtyDaysAhead },
      }),
      // Customer receivables
      Customer.aggregate([
        { $match: { organizationId: orgId } },
        { $group: { _id: null, total: { $sum: '$outstandingBalance' } } },
      ]),
      // Supplier payables
      Supplier.aggregate([
        { $match: { organizationId: orgId } },
        { $group: { _id: null, total: { $sum: '$outstandingBalance' } } },
      ]),
      // Recent invoices
      SaleInvoice.find({ organizationId: orgId })
        .sort({ createdAt: -1 })
        .limit(6),
      // All products for valuation
      Product.find({ organizationId: orgId, currentStock: { $gt: 0 } }, 'currentStock purchaseCost'),
      // Invoices for Gross Profit
      SaleInvoice.find({ organizationId: orgId, createdAt: { $gte: startOfMonth } }, 'items totalAmount subtotal'),
    ]);

    // Inventory Valuation at cost
    const inventoryValuation = allProductsForValuation.reduce(
      (sum, p) => sum + (p.currentStock || 0) * (p.purchaseCost || 0),
      0
    );

    // Calculate gross profit for this month: Revenue - COGS
    let totalRevenue = 0;
    let totalCogs = 0;
    for (const inv of recentInvoicesForProfit) {
      totalRevenue += inv.totalAmount || 0;
      for (const item of inv.items) {
        totalCogs += (item.quantity - (item.returnedQuantity || 0)) * (item.unitCost || 0);
      }
    }
    const grossProfit = Math.round((totalRevenue - totalCogs) * 100) / 100;

    // 7-day sales trend
    const salesLast7Days = await SaleInvoice.aggregate([
      {
        $match: {
          organizationId: orgId,
          createdAt: { $gte: new Date(sevenDaysAgo.setHours(0, 0, 0, 0)) },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top selling products aggregation
    const topSelling = await SaleInvoice.aggregate([
      { $match: { organizationId: orgId } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          name: { $first: '$items.name' },
          sku: { $first: '$items.sku' },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.subtotal' },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
    ]);

    return res.status(200).json({
      success: true,
      metrics: {
        todaySales: todaySalesAgg[0]?.total || 0,
        todaySalesCount: todaySalesAgg[0]?.count || 0,
        monthlySales: monthSalesAgg[0]?.total || 0,
        monthlySalesCount: monthSalesAgg[0]?.count || 0,
        grossProfit,
        totalProducts,
        inventoryValuation: Math.round(inventoryValuation * 100) / 100,
        lowStockCount,
        outOfStockCount,
        expiringBatchesCount,
        customerReceivables: customerReceivablesAgg[0]?.total || 0,
        supplierPayables: supplierPayablesAgg[0]?.total || 0,
        salesTrend: salesLast7Days,
        topSelling,
        recentInvoices,
      },
    });
  } catch (err) {
    console.error('Get dashboard metrics error:', err);
    return res.status(500).json({ success: false, error: 'Failed to calculate dashboard metrics' });
  }
};

const getDetailedReport = async (req, res) => {
  try {
    const orgId = req.organizationId;
    const { type = 'SALES_SUMMARY', startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter.$lte = end;
    }

    let reportData = [];

    switch (type) {
      case 'SALES_SUMMARY': {
        const query = { organizationId: orgId };
        if (Object.keys(dateFilter).length > 0) query.createdAt = dateFilter;
        reportData = await SaleInvoice.find(query).sort({ createdAt: -1 });
        break;
      }

      case 'GROSS_PROFIT': {
        const query = { organizationId: orgId };
        if (Object.keys(dateFilter).length > 0) query.createdAt = dateFilter;
        const invoices = await SaleInvoice.find(query);

        const productMap = {};
        for (const inv of invoices) {
          for (const item of inv.items) {
            const pid = item.productId.toString();
            if (!productMap[pid]) {
              productMap[pid] = {
                productId: pid,
                name: item.name,
                sku: item.sku,
                soldQuantity: 0,
                totalRevenue: 0,
                totalCogs: 0,
                grossProfit: 0,
              };
            }
            const netQty = item.quantity - (item.returnedQuantity || 0);
            const lineRev = item.subtotal;
            const lineCost = netQty * (item.unitCost || 0);
            productMap[pid].soldQuantity += netQty;
            productMap[pid].totalRevenue += lineRev;
            productMap[pid].totalCogs += lineCost;
            productMap[pid].grossProfit += lineRev - lineCost;
          }
        }
        reportData = Object.values(productMap);
        break;
      }

      case 'INVENTORY_VALUATION': {
        reportData = await Product.find({ organizationId: orgId }).sort({ name: 1 });
        break;
      }

      case 'EXPIRY_REPORT': {
        reportData = await ProductBatch.find({ organizationId: orgId, currentQuantity: { $gt: 0 } })
          .populate('productId', 'name sku unit')
          .sort({ expiryDate: 1 });
        break;
      }

      case 'STOCK_MOVEMENTS': {
        const query = { organizationId: orgId };
        if (Object.keys(dateFilter).length > 0) query.timestamp = dateFilter;
        reportData = await InventoryMovement.find(query)
          .populate('productId', 'name sku unit')
          .populate('batchId', 'batchNumber')
          .sort({ timestamp: -1 })
          .limit(200);
        break;
      }

      case 'CUSTOMER_RECEIVABLES': {
        reportData = await Customer.find({ organizationId: orgId, outstandingBalance: { $gt: 0 } }).sort({
          outstandingBalance: -1,
        });
        break;
      }

      case 'SUPPLIER_PAYABLES': {
        reportData = await Supplier.find({ organizationId: orgId, outstandingBalance: { $gt: 0 } }).sort({
          outstandingBalance: -1,
        });
        break;
      }

      default:
        return res.status(400).json({ success: false, error: 'Invalid report type' });
    }

    return res.status(200).json({ success: true, type, reportData });
  } catch (err) {
    console.error('Detailed report error:', err);
    return res.status(500).json({ success: false, error: 'Failed to generate report' });
  }
};

const exportReportCSV = async (req, res) => {
  try {
    const orgId = req.organizationId;
    const { type = 'SALES_SUMMARY' } = req.query;

    let csvContent = '';

    if (type === 'SALES_SUMMARY') {
      const invoices = await SaleInvoice.find({ organizationId: orgId }).sort({ createdAt: -1 });
      const header = ['Invoice Number', 'Date', 'Customer', 'Items Count', 'Subtotal', 'Tax', 'Discount', 'Total', 'Paid', 'Status'];
      const rows = invoices.map(i => [
        `"${i.invoiceNumber}"`,
        `"${new Date(i.createdAt).toLocaleDateString()}"`,
        `"${i.customerName}"`,
        i.items.length,
        i.subtotal,
        i.taxAmount,
        i.discountAmount,
        i.totalAmount,
        i.paidAmount,
        `"${i.paymentStatus}"`,
      ]);
      csvContent = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
    } else if (type === 'INVENTORY_VALUATION') {
      const products = await Product.find({ organizationId: orgId }).sort({ name: 1 });
      const header = ['SKU', 'Product Name', 'Category', 'Stock', 'Unit Cost', 'Selling Price', 'Total Valuation'];
      const rows = products.map(p => [
        `"${p.sku}"`,
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.category}"`,
        p.currentStock,
        p.purchaseCost,
        p.sellingPrice,
        (p.currentStock * p.purchaseCost).toFixed(2),
      ]);
      csvContent = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
    } else {
      csvContent = 'Report,Generated\n' + type + ',' + new Date().toISOString();
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${type.toLowerCase()}_report.csv"`);
    return res.status(200).send(csvContent);
  } catch (err) {
    console.error('Export report CSV error:', err);
    return res.status(500).json({ success: false, error: 'Failed to export report CSV' });
  }
};

module.exports = {
  getDashboardMetrics,
  getDetailedReport,
  exportReportCSV,
};
