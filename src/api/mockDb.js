import {
  Admin,
  Employee,
  Rider,
  KycRequest,
  SupportTicket,
  Withdrawal,
  Ride,
  City,
  Service
} from '../types';

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockDB = {
  services: [
    new Service({ id: 'intracity', name: 'Intracity', baseFare: 50, perKmFare: 12, commission: 15, cancellationCharge: 20, surgePricing: 1.0, enabled: true }),
    new Service({ id: 'car-taxi', name: 'Car Taxi', baseFare: 80, perKmFare: 18, commission: 15, cancellationCharge: 30, surgePricing: 1.2, enabled: true }),
    new Service({ id: 'car-pooling', name: 'Car Pooling', baseFare: 40, perKmFare: 8, commission: 10, cancellationCharge: 15, surgePricing: 1.0, enabled: true }),
    new Service({ id: 'private-travels', name: 'Private Travels', baseFare: 250, perKmFare: 22, commission: 12, cancellationCharge: 50, surgePricing: 1.0, enabled: true }),
    new Service({ id: 'car-rentals', name: 'Car Rentals', baseFare: 800, perKmFare: 15, commission: 15, cancellationCharge: 100, surgePricing: 1.0, enabled: true }),
    new Service({ id: 'bike-rentals', name: 'Bike Rentals', baseFare: 150, perKmFare: 6, commission: 10, cancellationCharge: 20, surgePricing: 1.0, enabled: true })
  ],
  cities: [
    new City({ id: 'c1', name: 'Hyderabad', state: 'Telangana', status: 'Active', radius: 35, taxes: 5 }),
    new City({ id: 'c2', name: 'Bangalore', state: 'Karnataka', status: 'Active', radius: 40, taxes: 6 }),
    new City({ id: 'c3', name: 'Chennai', state: 'Tamil Nadu', status: 'Active', radius: 30, taxes: 5 }),
    new City({ id: 'c4', name: 'Mumbai', state: 'Maharashtra', status: 'Active', radius: 50, taxes: 7 }),
    new City({ id: 'c5', name: 'Pune', state: 'Maharashtra', status: 'Inactive', radius: 25, taxes: 6 })
  ],
  employees: [
    new Employee({ id: 'EMP001', name: 'Rajesh Kumar', role: 'Super Admin', email: 'rajesh@happiride.com', mobile: '9876543210', status: 'Active', permissions: ['Dashboard', 'Analytics', 'Wallet', 'Support', 'KYC', 'Settings'] }),
    new Employee({ id: 'EMP002', name: 'Anjali Sharma', role: 'Operations Manager', email: 'anjali@happiride.com', mobile: '9876543211', status: 'Active', permissions: ['Dashboard', 'Analytics', 'Support', 'KYC'] }),
    new Employee({ id: 'EMP003', name: 'Vikram Singh', role: 'Finance Manager', email: 'vikram@happiride.com', mobile: '9876543212', status: 'Active', permissions: ['Dashboard', 'Wallet'] }),
    new Employee({ id: 'EMP004', name: 'Neha Gupta', role: 'Support Manager', email: 'neha@happiride.com', mobile: '9876543213', status: 'Active', permissions: ['Dashboard', 'Support'] }),
    new Employee({ id: 'EMP005', name: 'Sanjay Patel', role: 'KYC Officer', email: 'sanjay@happiride.com', mobile: '9876543214', status: 'Active', permissions: ['Dashboard', 'KYC'] })
  ],
  users: [
    new Employee({ id: 'USR001', fullName: 'Amit Sharma', username: 'amit_sharma', mobile: '+919988776655', email: 'amit@gmail.com', role: 'User', status: 'Active' }),
    new Employee({ id: 'USR002', fullName: 'Priya Patel', username: 'priya_patel', mobile: '+919988776656', email: 'priya@gmail.com', role: 'User', status: 'Active' }),
    new Employee({ id: 'USR003', fullName: 'Rohit Reddy', username: 'rohit_reddy', mobile: '+919988776657', email: 'rohit@gmail.com', role: 'User', status: 'Active' })
  ],
  riders: [
    new Rider({ id: 'RDR001', username: 'suresh_cab', fullName: 'Suresh Kumar', mobileNumber: '+919876540001', email: 'suresh@gmail.com', address: 'Madhapur, Hyderabad', status: 'Active', wallet: 1250, revenue: 340, grossEarnings: 2200, referralEarnings: 150, referralCount: 2, currentServiceTypes: ['Intracity Cab', 'Car Taxi'], ratings: 4.8, completionRate: 94, cancellationRate: 3 }),
    new Rider({ id: 'RDR002', username: 'mahesh_auto', fullName: 'Mahesh Babu', mobileNumber: '+919876540002', email: 'mahesh@gmail.com', address: 'Indiranagar, Bangalore', status: 'Active', wallet: 850, revenue: 120, grossEarnings: 950, referralEarnings: 50, referralCount: 1, currentServiceTypes: ['Intracity Auto'], ratings: 4.5, completionRate: 98, cancellationRate: 1 }),
    new Rider({ id: 'RDR003', username: 'arjun_pool', fullName: 'Arjun Reddy', mobileNumber: '+919876540003', email: 'arjun@gmail.com', address: 'Gachibowli, Hyderabad', status: 'Active', wallet: 350, revenue: 80, grossEarnings: 600, referralEarnings: 0, referralCount: 0, currentServiceTypes: ['Car Pooling', 'Car Taxi'], ratings: 4.2, completionRate: 88, cancellationRate: 6 })
  ],
  rides: [
    new Ride({ id: 'RID001', user: 'Amit Sharma', rider: 'Suresh Kumar', service: 'Car Taxi', pickup: 'Madhapur Metro Station', drop: 'Inorbit Mall', fare: 250, status: 'Completed', date: '2026-06-09T10:15:00Z', type: 'Intracity' }),
    new Ride({ id: 'RID002', user: 'Priya Patel', rider: 'Mahesh Babu', service: 'Intracity Auto', pickup: 'Indiranagar 12th Main', drop: 'Halasuru Metro', fare: 120, status: 'Completed', date: '2026-06-09T11:30:00Z', type: 'Intracity' }),
    new Ride({ id: 'RID003', user: 'Rohit Reddy', rider: 'Arjun Reddy', service: 'Car Pooling', pickup: 'Gachibowli DLF', drop: 'Wipro Circle', fare: 80, status: 'Ongoing', date: '2026-06-09T17:45:00Z', type: 'Car Pooling' })
  ],
  withdrawals: [
    new Withdrawal({ id: 'WDR001', riderId: 'RDR001', riderName: 'Suresh Kumar', amount: 1500, date: '2026-06-09T08:30:00Z', status: 'Pending', bankAccount: 'HDFC - ******4321', trxnId: 'N/A' }),
    new Withdrawal({ id: 'WDR002', riderId: 'RDR002', riderName: 'Mahesh Babu', amount: 800, date: '2026-06-09T09:15:00Z', status: 'Pending', bankAccount: 'SBI - ******8765', trxnId: 'N/A' }),
    new Withdrawal({ id: 'WDR003', riderId: 'RDR003', riderName: 'Arjun Reddy', amount: 500, date: '2026-06-08T10:00:00Z', status: 'Approved', bankAccount: 'ICICI - ******2468', trxnId: 'TXN20260608001' })
  ],
  kycList: [
    new KycRequest({
      riderId: 'RDR001',
      mobile: '+919876540001',
      username: 'suresh_cab',
      serviceType: 'Car Taxi',
      dateJoined: '2026-05-10',
      status: 'Approved',
      approvedBy: 'Sanjay Patel',
      personalKyc: {
        aadhaar: '5432-8765-1029',
        pan: 'ABCDE1234F',
        dl: 'DL-20210034231',
        selfieUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      },
      vehicleKyc: {
        rc: 'TS-08-EX-4321',
        insurance: 'INS-99887766',
        pollution: 'PUC-2026-09-01',
        vehiclePhotos: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=150']
      },
      history: [
        { date: '2026-05-10', action: 'KYC Submitted', note: 'Initial registry' },
        { date: '2026-05-12', action: 'Approved', note: 'All documents verified' }
      ]
    }),
    new KycRequest({
      riderId: 'RDR002',
      mobile: '+919876540002',
      username: 'mahesh_auto',
      serviceType: 'Intracity Auto',
      dateJoined: '2026-06-01',
      status: 'Pending',
      approvedBy: 'N/A',
      personalKyc: {
        aadhaar: '1234-5678-9012',
        pan: 'XYZPW9876D',
        dl: 'DL-20180029302',
        selfieUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
      },
      vehicleKyc: {
        rc: 'KA-03-MM-1212',
        insurance: 'INS-10203040',
        pollution: 'PUC-2026-12-15',
        vehiclePhotos: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=150']
      },
      history: [
        { date: '2026-06-01', action: 'KYC Submitted', note: 'Document check pending queue' }
      ]
    }),
    new KycRequest({
      riderId: 'RDR003',
      mobile: '+919876540003',
      username: 'arjun_pool',
      serviceType: 'Car Pooling',
      dateJoined: '2026-06-05',
      status: 'Rejected',
      approvedBy: 'Sanjay Patel',
      personalKyc: {
        aadhaar: '9876-5432-1098',
        pan: 'MNOQR7654L',
        dl: 'DL-20220038472',
        selfieUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
      },
      vehicleKyc: {
        rc: 'MH-12-PQ-9988',
        insurance: 'INS-77665544',
        pollution: 'PUC-2025-05-10',
        vehiclePhotos: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=150']
      },
      history: [
        { date: '2026-06-05', action: 'KYC Submitted', note: 'Initial submission' },
        { date: '2026-06-06', action: 'Rejected', note: 'Expired documents.' }
      ]
    })
  ],
  tickets: [
    new SupportTicket({ id: 'TCK001', clientName: 'Amit Sharma', clientType: 'User', category: 'Payment', priority: 'High', status: 'Open', createdDate: '2026-06-09T08:00:00Z', assignedEmployee: 'Neha Gupta', desc: 'Charged twice for the Ride RID001. Please refund.' }),
    new SupportTicket({ id: 'TCK002', clientName: 'Mahesh Babu', clientType: 'Rider', category: 'Refund', priority: 'Medium', status: 'Pending', createdDate: '2026-06-09T09:30:00Z', assignedEmployee: 'Sanjay Patel', desc: 'Cash payment did not sync to available balance.' }),
    new SupportTicket({ id: 'TCK003', clientName: 'Rohit Reddy', clientType: 'User', category: 'Ride', priority: 'Low', status: 'Closed', createdDate: '2026-06-08T14:00:00Z', assignedEmployee: 'Rajesh Kumar', desc: 'Driver arrived late at pickup point.', solution: 'Issued apology email and ride coupon.' })
  ],
  admins: [
    new Admin({ id: 'ADM001', name: 'Rajesh Kumar', username: 'rajesh_admin', email: 'admin@happiride.com', phone: '9876543210', role: 'Super Admin', permissions: ['Dashboard', 'Analytics', 'Wallet', 'Support', 'KYC', 'Settings'], status: 'Active' }),
    new Admin({ id: 'ADM002', name: 'Anjali Sharma', username: 'anjali_ops', email: 'operations@happiride.com', phone: '9876543211', role: 'Operations Manager', permissions: ['Dashboard', 'Analytics', 'Support', 'KYC'], status: 'Active' })
  ]
};
