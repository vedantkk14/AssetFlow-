import 'dotenv/config';
import { PrismaClient, Role, Status, AssetStatus, AssetCondition } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@assetflow.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin@123';
  const adminName = process.env.ADMIN_NAME ?? 'Super Admin';

  // 1. Seed Admin User
  let admin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!admin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    admin = await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: Role.ADMIN,
        status: Status.ACTIVE,
      },
    });
    console.log(`Admin account created: ${adminEmail}`);
  } else {
    console.log(`Admin account already exists (${adminEmail}), reusing.`);
  }

  // 2. Seed Departments
  const departmentsData = [
    { name: 'IT Support', code: 'IT', description: 'Information Technology and Systems Support' },
    { name: 'Human Resources', code: 'HR', description: 'Talent Acquisition and Employee Welfare' },
    { name: 'Sales & Marketing', code: 'MKT', description: 'Business Development and Client Marketing' },
    { name: 'Finance & Operations', code: 'FIN', description: 'Financial Accounting and Facility Operations' },
  ];

  const departments: Record<string, string> = {};
  for (const dept of departmentsData) {
    let existing = await prisma.department.findUnique({ where: { code: dept.code } });
    if (!existing) {
      existing = await prisma.department.create({
        data: {
          name: dept.name,
          code: dept.code,
          description: dept.description,
          status: Status.ACTIVE,
        },
      });
    }
    departments[dept.code] = existing.id;
  }
  console.log('Departments seeded.');

  // 3. Seed Asset Categories
  const categoriesData = [
    { name: 'Laptops', description: 'Office laptops and development workstations', defaultWarrantyMonths: 36 },
    { name: 'Furniture', description: 'Ergonomic desks, chairs, and conference tables', defaultWarrantyMonths: 60 },
    { name: 'Vehicles', description: 'Corporate logistics cars and utility vans', defaultWarrantyMonths: 48 },
    { name: 'Office Projectors', description: 'High-definition projectors for conference rooms', defaultWarrantyMonths: 24 },
    { name: 'Mobile Devices', description: 'Testing smartphones and tablet devices', defaultWarrantyMonths: 24 },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoriesData) {
    let existing = await prisma.assetCategory.findUnique({ where: { name: cat.name } });
    if (!existing) {
      existing = await prisma.assetCategory.create({
        data: {
          name: cat.name,
          description: cat.description,
          defaultWarrantyMonths: cat.defaultWarrantyMonths,
          status: Status.ACTIVE,
        },
      });
    }
    categories[cat.name] = existing.id;
  }
  console.log('Asset Categories seeded.');

  // 4. Seed 10 Assets
  const assetsData = [
    {
      name: 'MacBook Pro M2 Max',
      serialNumber: 'SN-MBP-9871',
      category: 'Laptops',
      department: 'IT',
      location: 'IT Rack B1',
      purchaseDate: new Date('2025-01-10'),
      purchaseCost: 2499.99,
      condition: AssetCondition.NEW,
      status: AssetStatus.AVAILABLE,
      manufacturer: 'Apple',
      model: 'MacBook Pro 16"',
      vendor: 'Apple Business Store',
      isBookable: false,
    },
    {
      name: 'Dell Latitude 5420',
      serialNumber: 'SN-DELL-8821',
      category: 'Laptops',
      department: 'IT',
      location: 'IT Storage Closet',
      purchaseDate: new Date('2024-06-15'),
      purchaseCost: 1200.00,
      condition: AssetCondition.GOOD,
      status: AssetStatus.AVAILABLE,
      manufacturer: 'Dell',
      model: 'Latitude 5420',
      vendor: 'Dell Enterprise India',
      isBookable: false,
    },
    {
      name: 'Lenovo ThinkPad X1 Carbon',
      serialNumber: 'SN-TPAD-2291',
      category: 'Laptops',
      department: 'IT',
      location: 'Engineering Lab desk',
      purchaseDate: new Date('2024-08-20'),
      purchaseCost: 1650.00,
      condition: AssetCondition.GOOD,
      status: AssetStatus.ALLOCATED,
      manufacturer: 'Lenovo',
      model: 'ThinkPad X1 Gen 10',
      vendor: 'Lenovo Commercial',
      isBookable: false,
    },
    {
      name: 'Ergonomic Mesh Chair',
      serialNumber: 'SN-FUR-5541',
      category: 'Furniture',
      department: 'HR',
      location: 'HR Office Cab 2',
      purchaseDate: new Date('2024-02-10'),
      purchaseCost: 350.00,
      condition: AssetCondition.GOOD,
      status: AssetStatus.ALLOCATED,
      manufacturer: 'Featherlite',
      model: 'Liberate High Back',
      vendor: 'Featherlite Retailers',
      isBookable: false,
    },
    {
      name: 'Conference Room Table (10 Seater)',
      serialNumber: 'SN-FUR-1120',
      category: 'Furniture',
      department: 'FIN',
      location: 'Main Conference Room',
      purchaseDate: new Date('2023-11-01'),
      purchaseCost: 1500.00,
      condition: AssetCondition.FAIR,
      status: AssetStatus.AVAILABLE,
      manufacturer: 'Herman Miller',
      model: 'Sense Table',
      vendor: 'Herman Miller India',
      isBookable: true,
    },
    {
      name: 'Honda Civic (Admin Pool Car)',
      serialNumber: 'SN-VEH-0099',
      category: 'Vehicles',
      department: 'FIN',
      location: 'Basement Parking Slot A4',
      purchaseDate: new Date('2023-05-10'),
      purchaseCost: 22000.00,
      condition: AssetCondition.GOOD,
      status: AssetStatus.AVAILABLE,
      manufacturer: 'Honda',
      model: 'Civic 2023 VTEC',
      vendor: 'Honda Capital Sales',
      isBookable: true,
    },
    {
      name: 'Epson EB-2250U Projector',
      serialNumber: 'SN-PRJ-3341',
      category: 'Office Projectors',
      department: 'MKT',
      location: 'Training Hall East',
      purchaseDate: new Date('2024-04-12'),
      purchaseCost: 950.00,
      condition: AssetCondition.GOOD,
      status: AssetStatus.RESERVED,
      manufacturer: 'Epson',
      model: 'EB-2250U',
      vendor: 'Epson Authorized Dealer',
      isBookable: true,
    },
    {
      name: 'iPad Pro 11"',
      serialNumber: 'SN-MOB-1102',
      category: 'Mobile Devices',
      department: 'IT',
      location: 'IT Storage Closet',
      purchaseDate: new Date('2025-02-15'),
      purchaseCost: 899.00,
      condition: AssetCondition.NEW,
      status: AssetStatus.AVAILABLE,
      manufacturer: 'Apple',
      model: 'iPad Pro M4',
      vendor: 'Apple Business Store',
      isBookable: true,
    },
    {
      name: 'Samsung Galaxy S23 (Test Unit)',
      serialNumber: 'SN-MOB-7720',
      category: 'Mobile Devices',
      department: 'IT',
      location: 'Mobile Development Desk 4',
      purchaseDate: new Date('2024-09-01'),
      purchaseCost: 799.00,
      condition: AssetCondition.FAIR,
      status: AssetStatus.UNDER_MAINTENANCE,
      manufacturer: 'Samsung',
      model: 'Galaxy S23 5G',
      vendor: 'Samsung Commercial Sales',
      isBookable: false,
    },
    {
      name: 'Sony 4K Meeting Room TV',
      serialNumber: 'SN-TV-0421',
      category: 'Office Projectors',
      department: 'MKT',
      location: 'Marketing Huddle Room',
      purchaseDate: new Date('2023-12-10'),
      purchaseCost: 1100.00,
      condition: AssetCondition.DAMAGED,
      status: AssetStatus.RETIRED,
      manufacturer: 'Sony',
      model: 'Bravia 65" 4K',
      vendor: 'Sony Retail Centre',
      isBookable: false,
    },
  ];

  for (let i = 0; i < assetsData.length; i++) {
    const data = assetsData[i];
    const tagNum = i + 1;
    const assetTag = `AF-${String(tagNum).padStart(6, '0')}`;
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${assetTag}`;

    const existingAsset = await prisma.asset.findUnique({ where: { serialNumber: data.serialNumber } });
    if (!existingAsset) {
      const warrantyStart = data.purchaseDate;
      const warrantyEnd = new Date(data.purchaseDate);
      warrantyEnd.setMonth(warrantyEnd.getMonth() + 36); // Default 3 years warranty

      await prisma.asset.create({
        data: {
          assetTag,
          name: data.name,
          serialNumber: data.serialNumber,
          categoryId: categories[data.category],
          departmentId: departments[data.department],
          location: data.location,
          purchaseDate: data.purchaseDate,
          purchaseCost: data.purchaseCost,
          condition: data.condition,
          status: data.status,
          manufacturer: data.manufacturer,
          model: data.model,
          vendor: data.vendor,
          warrantyStart,
          warrantyEnd,
          imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60', // Beautiful placeholder
          qrCode,
          isBookable: data.isBookable,
          createdBy: admin.id,
        },
      });
    }
  }

  console.log('Assets seeded successfully.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
