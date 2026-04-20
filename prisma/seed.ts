import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Owner
  const hashedPassword = await bcrypt.hash('GymFit@123', 12);
  const owner = await prisma.user.upsert({
    where: { email: 'admin@gymfit.com' },
    update: {},
    create: {
      email: 'admin@gymfit.com',
      password: hashedPassword,
      name: 'Raj Kumar',
      role: 'OWNER',
    },
  });

  // Create Trainer Users
  const trainerPassword = await bcrypt.hash('Trainer@123', 12);
  const trainerUser1 = await prisma.user.upsert({
    where: { email: 'trainer1@atomfit.com' },
    update: {},
    create: {
      email: 'trainer1@atomfit.com',
      password: trainerPassword,
      name: 'Vikram Singh',
      role: 'TRAINER',
    },
  });

  const trainerUser2 = await prisma.user.upsert({
    where: { email: 'trainer2@pulsefit.com' },
    update: {},
    create: {
      email: 'trainer2@pulsefit.com',
      password: trainerPassword,
      name: 'Arjun Mehta',
      role: 'TRAINER',
    },
  });

  // Create Gyms
  const gyms = [
    { name: 'Atom Fit', slug: 'atom-fit', address: 'No. 12, Anna Nagar, Chennai - 600040', phone: '+91 98765 43210' },
    { name: 'Pulse Fit', slug: 'pulse-fit', address: 'No. 45, Velachery, Chennai - 600042', phone: '+91 98765 43211' },
    { name: 'Power Fit', slug: 'power-fit', address: 'No. 78, OMR, Sholinganallur, Chennai - 600119', phone: '+91 98765 43212' },
    { name: 'Impact Fit', slug: 'impact-fit', address: 'No. 23, T. Nagar, Chennai - 600017', phone: '+91 98765 43213' },
  ];

  const createdGyms: { id: string; name: string; slug: string }[] = [];
  for (const gymData of gyms) {
    const gym = await prisma.gym.upsert({
      where: { slug: gymData.slug },
      update: {},
      create: gymData,
    });
    createdGyms.push(gym);
  }

  const atomFit = createdGyms[0];
  const pulseFit = createdGyms[1];

  // Create Trainers for Atom Fit
  const trainer1 = await prisma.trainer.upsert({
    where: { userId: trainerUser1.id },
    update: {},
    create: {
      name: 'Vikram Singh',
      salary: 35000,
      experience: 6,
      mobileNo: '+91 99887 66554',
      specialization: 'Strength Training',
      gymId: atomFit.id,
      userId: trainerUser1.id,
      reportingTo: 'Raj Kumar (Owner)',
    },
  });

  await prisma.trainer.upsert({
    where: { userId: trainerUser2.id },
    update: {},
    create: {
      name: 'Arjun Mehta',
      salary: 30000,
      experience: 4,
      mobileNo: '+91 88776 55443',
      specialization: 'Weight Loss & Cardio',
      gymId: pulseFit.id,
      userId: trainerUser2.id,
      reportingTo: 'Raj Kumar (Owner)',
    },
  });

  // Add more trainers without user accounts
  await prisma.trainer.create({
    data: {
      name: 'Priya Sharma',
      salary: 32000,
      experience: 5,
      mobileNo: '+91 77665 44332',
      specialization: 'Yoga & Flexibility',
      gymId: atomFit.id,
      reportingTo: 'Vikram Singh',
    },
  });

  await prisma.trainer.create({
    data: {
      name: 'Karthik Rajan',
      salary: 28000,
      experience: 3,
      mobileNo: '+91 66554 33221',
      specialization: 'General Fitness',
      gymId: createdGyms[2].id,
      reportingTo: 'Raj Kumar (Owner)',
    },
  });

  // Create Staff
  const staffData = [
    { name: 'Suresh Kumar', salary: 18000, monthlyExpenditure: 1200, role: 'Receptionist', gymId: atomFit.id, mobileNo: '+91 55443 22110' },
    { name: 'Meena Devi', salary: 15000, monthlyExpenditure: 800, role: 'Cleaning Staff', gymId: atomFit.id, mobileNo: '+91 44332 11009' },
    { name: 'Ravi Chandran', salary: 20000, monthlyExpenditure: 1500, role: 'Manager', gymId: pulseFit.id, mobileNo: '+91 33221 00998' },
  ];

  for (const staff of staffData) {
    await prisma.staff.create({ data: staff });
  }

  // Create Equipment for Atom Fit
  const equipmentData = [
    { name: 'Treadmill Pro X500', yearOfManufacture: 2022, price: 85000, gymId: atomFit.id, condition: 'Excellent' },
    { name: 'Power Rack Station', yearOfManufacture: 2021, price: 120000, gymId: atomFit.id, condition: 'Good' },
    { name: 'Dumbbells Set (5-50kg)', yearOfManufacture: 2020, price: 65000, gymId: atomFit.id, condition: 'Good' },
    { name: 'Cable Crossover Machine', yearOfManufacture: 2019, price: 95000, gymId: atomFit.id, condition: 'Fair' },
    { name: 'Stationary Bike', yearOfManufacture: 2023, price: 45000, gymId: atomFit.id, condition: 'Excellent' },
    { name: 'Lat Pulldown Machine', yearOfManufacture: 2021, price: 55000, gymId: pulseFit.id, condition: 'Good' },
    { name: 'Smith Machine', yearOfManufacture: 2020, price: 110000, gymId: pulseFit.id, condition: 'Good' },
    { name: 'Rowing Machine', yearOfManufacture: 2022, price: 78000, gymId: pulseFit.id, condition: 'Excellent' },
    { name: 'Leg Press Machine', yearOfManufacture: 2018, price: 90000, gymId: createdGyms[2].id, condition: 'Fair' },
    { name: 'Olympic Barbell Set', yearOfManufacture: 2021, price: 35000, gymId: createdGyms[2].id, condition: 'Good' },
  ];

  for (const eq of equipmentData) {
    await prisma.equipment.create({ data: eq });
  }

  // Create Members
  const memberData = [
    {
      name: 'Arun Krishnamurthy',
      ageGroup: 'Adults (20-40)',
      gender: 'Male',
      fitnessGoal: 'Muscle Building',
      experienceLevel: 'Intermediate',
      motivationLevel: 'Goal-Oriented',
      personality: 'Planner',
      membershipPlan: 'Annual',
      gymId: atomFit.id,
      personalTrainerId: trainer1.id,
      mobileNo: '+91 90011 22334',
      healthConditions: '[]',
    },
    {
      name: 'Divya Nair',
      ageGroup: 'Adults (20-40)',
      gender: 'Female',
      fitnessGoal: 'Weight Loss',
      experienceLevel: 'Beginner',
      motivationLevel: 'Goal-Oriented',
      personality: 'Solo Trainer',
      membershipPlan: 'Quarterly',
      gymId: atomFit.id,
      personalTrainerId: trainer1.id,
      mobileNo: '+91 91122 33445',
      healthConditions: '[]',
    },
    {
      name: 'Mohan Srinivasan',
      ageGroup: 'Seniors (40+)',
      gender: 'Male',
      fitnessGoal: 'General Fitness',
      experienceLevel: 'Beginner',
      motivationLevel: 'Medical/Rehab',
      personality: 'Solo Trainer',
      membershipPlan: 'Monthly',
      gymId: atomFit.id,
      mobileNo: '+91 92233 44556',
      healthConditions: '["aged", "kneePain"]',
    },
    {
      name: 'Sneha Patel',
      ageGroup: 'Adults (20-40)',
      gender: 'Female',
      fitnessGoal: 'Flexibility & Mobility',
      experienceLevel: 'Intermediate',
      motivationLevel: 'Casual/Recreational',
      personality: 'Social Gym-Goer',
      membershipPlan: 'Half-Yearly',
      gymId: atomFit.id,
      mobileNo: '+91 93344 55667',
      healthConditions: '[]',
    },
    {
      name: 'Ramesh Babu',
      ageGroup: 'Seniors (40+)',
      gender: 'Male',
      fitnessGoal: 'General Fitness',
      experienceLevel: 'Beginner',
      motivationLevel: 'Medical/Rehab',
      personality: 'Solo Trainer',
      membershipPlan: 'Monthly',
      gymId: pulseFit.id,
      mobileNo: '+91 94455 66778',
      healthConditions: '["aged", "diabetic"]',
    },
    {
      name: 'Lakshmi Venkat',
      ageGroup: 'Adults (20-40)',
      gender: 'Female',
      fitnessGoal: 'Weight Loss',
      experienceLevel: 'Beginner',
      motivationLevel: 'Goal-Oriented',
      personality: 'Planner',
      membershipPlan: 'Quarterly',
      gymId: pulseFit.id,
      mobileNo: '+91 95566 77889',
      healthConditions: '[]',
    },
  ];

  for (const member of memberData) {
    await prisma.member.create({ data: member });
  }

  // Create some Expenses
  const expenseData = [
    { title: 'Electricity Bill', amount: 12000, category: 'Utilities', gymId: atomFit.id, description: 'Monthly electricity bill for April' },
    { title: 'Trainer Salaries', amount: 67000, category: 'Salary', gymId: atomFit.id, description: 'Monthly salary for all trainers' },
    { title: 'Treadmill Maintenance', amount: 8500, category: 'Maintenance', gymId: atomFit.id, description: 'Annual servicing of treadmills' },
    { title: 'Social Media Marketing', amount: 15000, category: 'Marketing', gymId: atomFit.id, description: 'Facebook & Instagram ads' },
    { title: 'Staff Salaries', amount: 33000, category: 'Salary', gymId: pulseFit.id, description: 'Monthly salary for staff' },
    { title: 'Water Bill', amount: 3500, category: 'Utilities', gymId: pulseFit.id, description: 'Monthly water bill' },
  ];

  for (const expense of expenseData) {
    await prisma.expense.create({ data: expense });
  }

  // Create Events
  const eventData = [
    {
      title: 'Summer Fitness Challenge 2026',
      description: 'Join our 30-day summer fitness challenge! Compete with other members, win prizes, and transform your body. Daily tracking and group activities included.',
      date: new Date('2026-05-01'),
      targetAudience: 'ALL',
      gymId: atomFit.id,
    },
    {
      title: 'Trainer Certification Workshop',
      description: 'Advanced certification workshop for all trainers. Topics include advanced training techniques, nutrition guidance, and member psychology.',
      date: new Date('2026-04-28'),
      targetAudience: 'TRAINERS',
      gymId: atomFit.id,
    },
    {
      title: 'New Membership Drive - Bring a Friend',
      description: 'Bring a friend to the gym and get 1 month free! Your friend gets 20% off their first membership. Valid till end of month.',
      date: new Date('2026-04-25'),
      targetAudience: 'MEMBERS',
      gymId: atomFit.id,
    },
    {
      title: 'Weekend Yoga Session',
      description: 'Free yoga and flexibility session every Sunday morning at 7 AM. Special focus on joint health and stress relief.',
      date: new Date('2026-04-27'),
      targetAudience: 'ALL',
      gymId: pulseFit.id,
    },
  ];

  for (const event of eventData) {
    await prisma.event.create({ data: event });
  }

  // Create some attendance records
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const members = await prisma.member.findMany({ where: { gymId: atomFit.id } });
  const trainers = await prisma.trainer.findMany({ where: { gymId: atomFit.id } });

  for (const member of members.slice(0, 3)) {
    await prisma.attendance.create({
      data: {
        date: today,
        checkInTime: '06:30',
        checkOutTime: '08:00',
        type: 'MEMBER',
        memberId: member.id,
        gymId: atomFit.id,
        status: 'PRESENT',
      },
    });
  }

  for (const trainer of trainers) {
    await prisma.attendance.create({
      data: {
        date: today,
        checkInTime: '06:00',
        checkOutTime: '14:00',
        type: 'TRAINER',
        trainerId: trainer.id,
        gymId: atomFit.id,
        status: 'PRESENT',
      },
    });
  }

  console.log('✅ Seeding complete!');
  console.log('');
  console.log('📧 Owner Login:');
  console.log('   Email: admin@gymfit.com');
  console.log('   Password: GymFit@123');
  console.log('');
  console.log('📧 Trainer Login (Atom Fit):');
  console.log('   Email: trainer1@atomfit.com');
  console.log('   Password: Trainer@123');
  console.log('');
  console.log('📧 Trainer Login (Pulse Fit):');
  console.log('   Email: trainer2@pulsefit.com');
  console.log('   Password: Trainer@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
