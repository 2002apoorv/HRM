const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { Organization } = require('../models/Organization');
const { User } = require('../models/User');
const { Department } = require('../models/Department');
const { Employee } = require('../models/Employee');
const Salary = require('../models/Salary');
const Leave = require('../models/Leave');
const { Attendance } = require('../models/Attendance');

async function runMigration() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB.');

    // 1. Ensure or find Primary Organization
    let primaryOrg = await Organization.findOne({ slug: 'primary-enterprise' });
    if (!primaryOrg) {
      primaryOrg = await Organization.create({
        name: 'Primary Enterprise',
        slug: 'primary-enterprise',
        code: 'ORG-001',
        currency: 'USD',
        taxRate: 5,
        status: 'active',
      });
      console.log('Created Primary Organization:', primaryOrg._id);
    } else {
      console.log('Found existing Primary Organization:', primaryOrg._id);
    }

    // 2. Associate admin user as owner if available
    const adminUser = await User.findOne({ email: 'admin@gmail.com' });
    if (adminUser && !primaryOrg.owner) {
      primaryOrg.owner = adminUser._id;
      await primaryOrg.save();
    }

    const orgId = primaryOrg._id;

    // 3. Migrate Users
    const usersResult = await User.updateMany(
      { organizationId: { $exists: false } },
      { $set: { organizationId: orgId } }
    );
    console.log(`Migrated users: ${usersResult.modifiedCount}`);

    // 4. Migrate Departments
    const deptResult = await Department.updateMany(
      { organizationId: { $exists: false } },
      { $set: { organizationId: orgId } }
    );
    console.log(`Migrated departments: ${deptResult.modifiedCount}`);

    // 5. Migrate Employees
    // Check if legacy employeeId_1 unique index exists on employees collection
    try {
      const empIndexes = await Employee.collection.indexes();
      const legacyIndex = empIndexes.find(idx => idx.name === 'employeeId_1');
      if (legacyIndex) {
        await Employee.collection.dropIndex('employeeId_1');
        console.log('Dropped legacy unique index on employeeId_1');
      }
    } catch (e) {
      console.log('Index cleanup check:', e.message);
    }

    const empResult = await Employee.updateMany(
      { organizationId: { $exists: false } },
      { $set: { organizationId: orgId } }
    );
    console.log(`Migrated employees: ${empResult.modifiedCount}`);

    // 6. Migrate Salaries
    const salaryResult = await Salary.updateMany(
      { organizationId: { $exists: false } },
      { $set: { organizationId: orgId } }
    );
    console.log(`Migrated salaries: ${salaryResult.modifiedCount}`);

    // 7. Migrate Leaves
    const leaveResult = await Leave.updateMany(
      { organizationId: { $exists: false } },
      { $set: { organizationId: orgId } }
    );
    console.log(`Migrated leaves: ${leaveResult.modifiedCount}`);

    // 8. Migrate Attendances
    const attResult = await Attendance.updateMany(
      { organizationId: { $exists: false } },
      { $set: { organizationId: orgId } }
    );
    console.log(`Migrated attendances: ${attResult.modifiedCount}`);

    console.log('--- Migration completed successfully! All records preserved and associated with tenant. ---');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
