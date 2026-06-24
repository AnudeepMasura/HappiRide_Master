# HappiRide Master Admin Portal - API Integration Notes

This documentation details the API contracts, payloads, response schemas, and logic flows required to connect the Master Admin Portal frontend to the backend services.

## Authentication and Security
All API endpoints (except login) require bearer JWT authentication.
- **Header format**: `Authorization: Bearer <JWT_TOKEN>`
- **Token Storage**: Stored inside `localStorage` under key `happi_admin_user` in the `token` property of the user object.

---

## 1. Authentication APIs

### Login Admin
- **Endpoint**: `POST /api/auth/login`
- **Description**: Authenticate admin staff credentials.
- **Payload**:
```json
{
  "email": "admin@happiride.com",
  "password": "password"
}
```
- **Response (Success - 200 OK)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "ADM001",
    "fullName": "Rajesh Kumar",
    "username": "rajesh_admin",
    "email": "admin@happiride.com",
    "phone": "9876543210",
    "role": "Super Admin",
    "permissions": ["Dashboard", "Analytics", "Wallet", "Support", "KYC", "Settings"],
    "status": "Active"
  }
}
```

### Logout Admin
- **Endpoint**: `POST /api/auth/logout`
- **Description**: Invalidate the current session token.
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Session invalidated successfully"
}
```

### Refresh Token
- **Endpoint**: `POST /api/auth/refresh`
- **Description**: Refresh an expired JWT token using cookies or headers.
- **Response (200 OK)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 2. Dashboard APIs

### Get KPI Statistics
- **Endpoint**: `GET /api/dashboard/stats`
- **Description**: Retrieve active platform logistics counts and financial order values.
- **Response (200 OK)**:
```json
{
  "totalRidesToday": 142,
  "totalActiveRides": 18,
  "totalActiveUsers": 1240,
  "totalActiveRiders": 850,
  "ridesPerUser": 0.1,
  "ridesPerRider": 0.2,
  "grossOrderValue": 84200,
  "platformRevenue": 12630,
  "totalSupportTickets": 35,
  "activeTickets": 12
}
```

### Get Charts Data
- **Endpoint**: `GET /api/dashboard/charts`
- **Description**: Retrieve time-series dataset details for rendering analytics charts.
- **Response (200 OK)**:
```json
{
  "dailyRideTrend": [
    { "date": "Mon", "count": 120 },
    { "date": "Tue", "count": 180 }
  ],
  "revenueTrend": [
    { "date": "Mon", "amount": 15000 },
    { "date": "Tue", "amount": 22000 }
  ],
  "riderGrowth": [
    { "date": "Week 1", "count": 80 }
  ],
  "userGrowth": [
    { "date": "Week 1", "count": 400 }
  ]
}
```

---

## 3. Admin APIs

### Create Admin
- **Endpoint**: `POST /api/admin/create`
- **Description**: Called when Master Admin registers a new KYC/Operations/Finance Admin account.
- **Payload**:
```json
{
  "fullName": "Amit Verma",
  "username": "amit_verma",
  "phone": "9988776655",
  "email": "amit@happiride.com",
  "password": "SecurePassword123",
  "role": "KYC Officer"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "adminId": "ADM003"
}
```

### Get Admin Accounts List
- **Endpoint**: `GET /api/admin/list`
- **Response (200 OK)**: Array of Admin objects.

### Suspend Admin Account
- **Endpoint**: `POST /api/admin/:id/suspend`
- **Response (200 OK)**:
```json
{
  "id": "ADM003",
  "status": "Suspended"
}
```

---

## 4. Employee/Staff APIs

### Create Employee Account
- **Endpoint**: `POST /api/employees/create`
- **Description**: Register a new platform staff support agent.
- **Payload**:
```json
{
  "fullName": "Suresh Babu",
  "username": "suresh_support",
  "phone": "9876501234",
  "email": "suresh@happiride.com",
  "password": "EmpPassword99",
  "department": "Support",
  "assignedAdminId": "ADM001"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "employee": {
    "id": "EMP006",
    "name": "Suresh Babu",
    "username": "suresh_support",
    "email": "suresh@happiride.com",
    "mobile": "9876501234",
    "role": "Support Manager",
    "department": "Support",
    "assignedAdminId": "ADM001",
    "permissions": ["Dashboard", "Support"],
    "status": "Active"
  }
}
```

### Fetch Employee Directory
- **Endpoint**: `GET /api/employees/list`
- **Response (200 OK)**: Array of Employee objects.

---

## 5. Rider Partner APIs

### Fetch Rider Directory
- **Endpoint**: `GET /api/riders/list`
- **Response (200 OK)**: Array of Rider objects.

### Update Rider Status
- **Endpoint**: `POST /api/riders/:id/status`
- **Payload**:
```json
{
  "status": "Restricted" 
}
```
- **Response (200 OK)**: Updated Rider object.

---

## 6. Driver KYC APIs

### Get Pending KYC Requests
- **Endpoint**: `GET /api/kyc/pending`
- **Response (200 OK)**: Array of pending KycRequest objects.

### Approve KYC Documents
- **Endpoint**: `POST /api/kyc/:riderId/status`
- **Payload**:
```json
{
  "status": "Approved",
  "officerName": "Sanjay Patel"
}
```
- **Response (200 OK)**: Updated KycRequest object.

### Reject KYC Documents
- **Endpoint**: `POST /api/kyc/:riderId/status`
- **Payload**:
```json
{
  "status": "Rejected",
  "officerName": "Sanjay Patel",
  "rejectionNote": "PAN Card copy is blurry and illegible."
}
```
- **Response (200 OK)**: Updated KycRequest object.

### Request Document Re-upload
- **Endpoint**: `POST /api/kyc/:riderId/status`
- **Payload**:
```json
{
  "status": "Request Reupload",
  "officerName": "Sanjay Patel",
  "rejectionNote": "Reupload requested: Driver License front copy has glares. Please re-shoot without flash."
}
```
- **Response (200 OK)**: Updated KycRequest object.

---

## 7. Customer Support Ticket APIs

### Fetch Tickets List
- **Endpoint**: `GET /api/support/tickets`
- **Response (200 OK)**: Array of SupportTicket objects.

### Assign Ticket to Agent Staff
- **Endpoint**: `POST /api/support/tickets/:id/assign`
- **Payload**:
```json
{
  "employeeName": "Neha Gupta"
}
```
- **Response (200 OK)**: Updated SupportTicket object.

### Resolve/Update Ticket Status
- **Endpoint**: `POST /api/support/tickets/:id/status`
- **Payload**:
```json
{
  "status": "Closed",
  "solution": "Refund initiated for double transaction charge."
}
```
- **Response (200 OK)**: Updated SupportTicket object.

---

## 8. Wallet Withdrawal / Payout APIs

### Fetch Withdrawal Requests
- **Endpoint**: `GET /api/wallet/withdrawals`
- **Response (200 OK)**: Array of Withdrawal objects.

### Approve Payout Request
- **Endpoint**: `POST /api/wallet/withdrawals/:id/approve`
- **Payload**:
```json
{
  "transactionId": "TXN20260609042"
}
```
- **Response (200 OK)**: Updated Withdrawal object.

### Reject Payout Request
- **Endpoint**: `POST /api/wallet/withdrawals/:id/reject`
- **Payload**:
```json
{
  "reason": "Bank Account details mismatch."
}
```
- **Response (200 OK)**: Updated Withdrawal object.
