/**
 * Class model for Admin accounts.
 */
export class Admin {
  /**
   * @param {Object} data
   * @param {string} data.id
   * @param {string} data.name
   * @param {string} data.username
   * @param {string} data.email
   * @param {string} data.phone
   * @param {string} data.role
   * @param {string[]} data.permissions
   * @param {string} data.status
   */
  constructor(data = {}) {
    this.id = data.id || '';
    this.name = data.name || data.fullName || '';
    this.username = data.username || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.role = data.role || 'Admin';
    this.permissions = Array.isArray(data.permissions) ? data.permissions : [];
    this.status = data.status || 'Active';
  }
}

/**
 * Class model for platform Employee Staff accounts.
 */
export class Employee {
  /**
   * @param {Object} data
   * @param {string} data.id
   * @param {string} data.name
   * @param {string} data.username
   * @param {string} data.email
   * @param {string} data.mobile
   * @param {string} data.role
   * @param {string} data.department
   * @param {string} data.assignedAdminId
   * @param {string[]} data.permissions
   * @param {string} data.status
   */
  constructor(data = {}) {
    this.id = data.id || '';
    this.name = data.name || data.fullName || '';
    this.username = data.username || '';
    this.email = data.email || '';
    this.mobile = data.mobile || data.phone || '';
    this.role = data.role || 'KYC Officer';
    this.department = data.department || '';
    this.assignedAdminId = data.assignedAdminId || '';
    this.permissions = Array.isArray(data.permissions) ? data.permissions : [];
    this.status = data.status || 'Active';
  }
}

/**
 * Class model for Rider Partners.
 */
export class Rider {
  /**
   * @param {Object} data
   * @param {string} data.id
   * @param {string} data.username
   * @param {string} data.fullName
   * @param {string} data.mobileNumber
   * @param {string} data.email
   * @param {string} data.address
   * @param {string} data.status
   * @param {number} data.wallet
   * @param {number} data.revenue
   * @param {number} data.grossEarnings
   * @param {number} data.referralEarnings
   * @param {number} data.referralCount
   * @param {string[]} data.currentServiceTypes
   * @param {number} data.ratings
   * @param {number} data.completionRate
   * @param {number} data.cancellationRate
   */
  constructor(data = {}) {
    this.id = data.id || '';
    this.username = data.username || '';
    this.fullName = data.fullName || '';
    this.mobileNumber = data.mobileNumber || '';
    this.email = data.email || '';
    this.address = data.address || '';
    this.status = data.status || 'Active';
    this.wallet = typeof data.wallet === 'number' ? data.wallet : 0;
    this.revenue = typeof data.revenue === 'number' ? data.revenue : 0;
    this.grossEarnings = typeof data.grossEarnings === 'number' ? data.grossEarnings : 0;
    this.referralEarnings = typeof data.referralEarnings === 'number' ? data.referralEarnings : 0;
    this.referralCount = typeof data.referralCount === 'number' ? data.referralCount : 0;
    this.currentServiceTypes = Array.isArray(data.currentServiceTypes) ? data.currentServiceTypes : [];
    this.ratings = typeof data.ratings === 'number' ? data.ratings : 0;
    this.completionRate = typeof data.completionRate === 'number' ? data.completionRate : 0;
    this.cancellationRate = typeof data.cancellationRate === 'number' ? data.cancellationRate : 0;
  }
}

/**
 * Class model for Rider KYC Document Verification requests.
 */
export class KycRequest {
  /**
   * @param {Object} data
   * @param {string} data.riderId
   * @param {string} data.mobile
   * @param {string} data.username
   * @param {string} data.serviceType
   * @param {string} data.dateJoined
   * @param {string} data.status
   * @param {string} data.approvedBy
   * @param {Object} data.personalKyc
   * @param {string} data.personalKyc.aadhaar
   * @param {string} data.personalKyc.pan
   * @param {string} data.personalKyc.dl
   * @param {string} data.personalKyc.selfieUrl
   * @param {Object} data.vehicleKyc
   * @param {string} data.vehicleKyc.rc
   * @param {string} data.vehicleKyc.insurance
   * @param {string} data.vehicleKyc.pollution
   * @param {string[]} data.vehicleKyc.vehiclePhotos
   * @param {Array<{date: string, action: string, note: string}>} data.history
   */
  constructor(data = {}) {
    this.riderId = data.riderId || '';
    this.mobile = data.mobile || '';
    this.username = data.username || '';
    this.serviceType = data.serviceType || '';
    this.dateJoined = data.dateJoined || '';
    this.status = data.status || 'Pending';
    this.approvedBy = data.approvedBy || 'N/A';
    this.personalKyc = data.personalKyc || {
      aadhaar: '',
      pan: '',
      dl: '',
      selfieUrl: ''
    };
    this.vehicleKyc = data.vehicleKyc || {
      rc: '',
      insurance: '',
      pollution: '',
      vehiclePhotos: []
    };
    this.history = Array.isArray(data.history) ? data.history : [];
  }
}

/**
 * Class model for Support Tickets.
 */
export class SupportTicket {
  /**
   * @param {Object} data
   * @param {string} data.id
   * @param {string} data.clientName
   * @param {string} data.clientType
   * @param {string} data.category
   * @param {string} data.priority
   * @param {string} data.status
   * @param {string} data.createdDate
   * @param {string} data.assignedEmployee
   * @param {string} data.desc
   * @param {string} [data.solution]
   */
  constructor(data = {}) {
    this.id = data.id || '';
    this.clientName = data.clientName || '';
    this.clientType = data.clientType || 'User';
    this.category = data.category || 'General';
    this.priority = data.priority || 'Low';
    this.status = data.status || 'Open';
    this.createdDate = data.createdDate || '';
    this.assignedEmployee = data.assignedEmployee || '';
    this.desc = data.desc || '';
    this.solution = data.solution || '';
  }
}

/**
 * Class model for Wallet Withdrawal requests.
 */
export class Withdrawal {
  /**
   * @param {Object} data
   * @param {string} data.id
   * @param {string} data.riderId
   * @param {string} data.riderName
   * @param {number} data.amount
   * @param {string} data.date
   * @param {string} data.status
   * @param {string} data.bankAccount
   * @param {string} data.trxnId
   * @param {string} [data.rejectionReason]
   */
  constructor(data = {}) {
    this.id = data.id || '';
    this.riderId = data.riderId || '';
    this.riderName = data.riderName || '';
    this.amount = typeof data.amount === 'number' ? data.amount : 0;
    this.date = data.date || '';
    this.status = data.status || 'Pending';
    this.bankAccount = data.bankAccount || '';
    this.trxnId = data.trxnId || '';
    this.rejectionReason = data.rejectionReason || '';
  }
}

/**
 * Class model for Platform Rides history logs.
 */
export class Ride {
  /**
   * @param {Object} data
   * @param {string} data.id
   * @param {string} data.user
   * @param {string} data.rider
   * @param {string} data.service
   * @param {string} data.pickup
   * @param {string} data.drop
   * @param {number} data.fare
   * @param {string} data.status
   * @param {string} data.date
   * @param {string} data.type
   */
  constructor(data = {}) {
    this.id = data.id || '';
    this.user = data.user || '';
    this.rider = data.rider || '';
    this.service = data.service || '';
    this.pickup = data.pickup || '';
    this.drop = data.drop || '';
    this.fare = typeof data.fare === 'number' ? data.fare : 0;
    this.status = data.status || 'Pending';
    this.date = data.date || '';
    this.type = data.type || 'Intracity';
  }
}

/**
 * Class model for Operational Cities Configurations.
 */
export class City {
  /**
   * @param {Object} data
   * @param {string} data.id
   * @param {string} data.name
   * @param {string} data.state
   * @param {string} data.status
   * @param {number} data.radius
   * @param {number} data.taxes
   */
  constructor(data = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.state = data.state || '';
    this.status = data.status || 'Active';
    this.radius = typeof data.radius === 'number' ? data.radius : 0;
    this.taxes = typeof data.taxes === 'number' ? data.taxes : 0;
  }
}

/**
 * Class model for Service fare profiles.
 */
export class Service {
  /**
   * @param {Object} data
   * @param {string} data.id
   * @param {string} data.name
   * @param {number} data.baseFare
   * @param {number} data.perKmFare
   * @param {number} data.commission
   * @param {number} data.cancellationCharge
   * @param {number} data.surgePricing
   * @param {boolean} data.enabled
   */
  constructor(data = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.baseFare = typeof data.baseFare === 'number' ? data.baseFare : 0;
    this.perKmFare = typeof data.perKmFare === 'number' ? data.perKmFare : 0;
    this.commission = typeof data.commission === 'number' ? data.commission : 0;
    this.cancellationCharge = typeof data.cancellationCharge === 'number' ? data.cancellationCharge : 0;
    this.surgePricing = typeof data.surgePricing === 'number' ? data.surgePricing : 1.0;
    this.enabled = typeof data.enabled === 'boolean' ? data.enabled : true;
  }
}
