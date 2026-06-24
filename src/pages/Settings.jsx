import React, { useState } from 'react';
import { useSettings } from '../hooks/useSettings';
import { useEmployees } from '../hooks/useEmployees';
import { formatCurrency } from '../utils/helpers';
import ReusableModal from '../components/ReusableModal';
import { 
  Users, 
  Settings as SettingsIcon, 
  MapPin, 
  Plus, 
  Sliders, 
  CheckCircle2, 
  XCircle,
  ToggleLeft,
  ToggleRight,
  Info,
  Loader2
} from 'lucide-react';

function Settings() {
  const {
    services,
    cities,
    loading,
    error: settingsError,
    updateServiceConfig,
    updateCityStatus,
    updateCityConfig
  } = useSettings();

  const {
    employees,
    createEmployee,
    toggleEmployeeStatus,
    error: employeesError
  } = useEmployees();

  // Settings active section tab
  const [activeTab, setActiveTab] = useState('employees');

  // Modals state
  const [modalType, setModalType] = useState(null); // 'add_emp', 'edit_service', 'edit_city'
  const [actionError, setActionError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Form states
  const [selectedService, setSelectedService] = useState(null);
  const [serviceForm, setServiceForm] = useState({ baseFare: 0, perKmFare: 0, commission: 0, cancellationCharge: 0, surgePricing: 1.0 });

  const [selectedCity, setSelectedCity] = useState(null);
  const [cityForm, setCityForm] = useState({ name: '', state: '', radius: 0, taxes: 0 });

  const [employeeForm, setEmployeeForm] = useState({ name: '', role: 'KYC Officer', email: '', mobile: '', permissions: [] });

  const openEditService = (service) => {
    setSelectedService(service);
    setServiceForm({
      baseFare: service.baseFare,
      perKmFare: service.perKmFare,
      commission: service.commission,
      cancellationCharge: service.cancellationCharge,
      surgePricing: service.surgePricing
    });
    setModalType('edit_service');
    setActionError('');
  };

  const openEditCity = (city) => {
    setSelectedCity(city);
    setCityForm({
      name: city.name,
      state: city.state,
      radius: city.radius,
      taxes: city.taxes
    });
    setModalType('edit_city');
    setActionError('');
  };

  const handleServiceSubmit = async () => {
    setActionLoading(true);
    setActionError('');
    const res = await updateServiceConfig(selectedService.id, serviceForm);
    setActionLoading(false);
    
    if (res.success) {
      setModalType(null);
    } else {
      setActionError(res.error || 'Failed to update service config');
    }
  };

  const handleCitySubmit = async () => {
    setActionLoading(true);
    setActionError('');
    const res = await updateCityConfig(selectedCity.id, cityForm);
    setActionLoading(false);
    
    if (res.success) {
      setModalType(null);
    } else {
      setActionError(res.error || 'Failed to update city settings');
    }
  };

  const handleAddEmployee = async () => {
    if (!employeeForm.name || !employeeForm.email || !employeeForm.mobile) {
      setActionError('Please fill in all employee details');
      return;
    }
    setActionLoading(true);
    setActionError('');
    
    // Automatically map permissions according to select role
    let perms = ['Dashboard'];
    if (employeeForm.role === 'Super Admin') perms = ['Dashboard', 'Analytics', 'Wallet', 'Support', 'KYC', 'Settings'];
    else if (employeeForm.role === 'Operations Manager') perms = ['Dashboard', 'Analytics', 'Support', 'KYC'];
    else if (employeeForm.role === 'Finance Manager') perms = ['Dashboard', 'Wallet'];
    else if (employeeForm.role === 'Support Manager') perms = ['Dashboard', 'Support'];
    else if (employeeForm.role === 'KYC Officer') perms = ['Dashboard', 'KYC'];

    const newEmp = {
      name: employeeForm.name,
      role: employeeForm.role,
      email: employeeForm.email,
      mobile: employeeForm.mobile,
      permissions: perms
    };

    const res = await createEmployee(newEmp);
    setActionLoading(false);
    
    if (res.success) {
      setEmployeeForm({ name: '', role: 'KYC Officer', email: '', mobile: '', permissions: [] });
      setModalType(null);
    } else {
      setActionError(res.error || 'Failed to register employee');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight font-sans">System Settings & Configurations</h2>
        <p className="text-xs text-slate-400 font-medium">Configure transport pricing, tax policies, operational cities boundaries, and administrator staff access.</p>
      </div>

      {(settingsError || employeesError) && (
        <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-lg flex items-start gap-2.5 text-xs text-rose-600">
          <Info size={16} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Error loading settings data</p>
            <p className="mt-0.5">{settingsError || employeesError}</p>
          </div>
        </div>
      )}

      {/* TABS SELECTOR */}
      <div className="flex bg-white border border-slate-200 rounded-lg p-1 max-w-md shadow-sm">
        <button
          onClick={() => setActiveTab('employees')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'employees' ? 'bg-olive-500 text-white' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users size={14} />
          Admins & Staff
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'services' ? 'bg-olive-500 text-white' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders size={14} />
          Services Fares
        </button>
        <button
          onClick={() => setActiveTab('cities')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'cities' ? 'bg-olive-500 text-white' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin size={14} />
          Cities Settings
        </button>
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: MANAGE ADMINS & STAFF */}
      {/* ======================================================== */}
      {activeTab === 'employees' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Administrator Accounts & Staff Permissions</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Control role-based access parameters for Happi Ride modules.</p>
            </div>
            <button
              onClick={() => { setModalType('add_emp'); setActionError(''); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-olive-500 hover:bg-olive-600 text-white rounded-md text-xs font-bold uppercase tracking-wider shadow-sm transition-colors"
            >
              <Plus size={14} />
              Add Employee
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-500 uppercase tracking-wider font-semibold text-[10px] border-b border-slate-200">
                    <th className="px-6 py-3">Employee ID</th>
                    <th className="px-6 py-3">Full Name</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Email Address</th>
                    <th className="px-6 py-3">Mobile No</th>
                    <th className="px-6 py-3">Permissions Scope</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-8 text-slate-400">Loading roster...</td>
                    </tr>
                  ) : (
                    employees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-800">{emp.id}</td>
                        <td className="px-6 py-4 font-medium text-slate-700">{emp.name}</td>
                        <td className="px-6 py-4 font-bold text-slate-600">{emp.role}</td>
                        <td className="px-6 py-4">{emp.email}</td>
                        <td className="px-6 py-4">{emp.mobile}</td>
                        <td className="px-6 py-4 min-w-[200px]">
                          <div className="flex flex-wrap gap-1">
                            {emp.permissions.map(p => (
                              <span key={p} className="px-1.5 py-0.5 rounded bg-olive-50 text-olive-700 text-[9px] font-semibold">
                                {p}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {emp.status === 'Active' ? (
                            <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-green-50 text-green-700 border border-green-100 uppercase">ACTIVE</span>
                          ) : (
                            <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-slate-100 text-slate-500 border border-slate-200 uppercase">INACTIVE</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => toggleEmployeeStatus(emp.id, emp.status)}
                            className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                              emp.status === 'Active'
                                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                                : 'bg-olive-50 hover:bg-olive-100 text-olive-700'
                            }`}
                          >
                            {emp.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 2: SERVICES FARES CONFIG */}
      {/* ======================================================== */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Service Fares & Tariffs</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Edit base fares, per KM calculations, platform commissions and surge rates.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {loading ? (
              <div className="col-span-3 text-center py-8 text-slate-400">Loading service segments config...</div>
            ) : (
              services.map((srv) => (
                <div key={srv.id} className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between hover:shadow-sm transition-shadow shadow-sm">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 tracking-tight">{srv.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {srv.id}</span>
                      </div>
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                        srv.enabled ? 'bg-olive-50 text-olive-700 border border-olive-100' : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}>
                        {srv.enabled ? 'ENABLED' : 'DISABLED'}
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-600 mb-6">
                      <div className="flex justify-between"><span className="text-slate-400">Base Fare:</span> <span className="font-semibold text-slate-800">{formatCurrency(srv.baseFare)}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Per KM Charges:</span> <span className="font-semibold text-slate-800">{formatCurrency(srv.perKmFare)}/KM</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Platform Fee (Commission):</span> <span className="font-semibold text-slate-800">{srv.commission}%</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Cancellation Cost:</span> <span className="font-semibold text-slate-800">{formatCurrency(srv.cancellationCharge)}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Surge Pricing Multiplier:</span> <span className="font-bold text-olive-600">{srv.surgePricing.toFixed(1)}x</span></div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 flex gap-2">
                    <button
                      onClick={() => openEditService(srv)}
                      className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
                    >
                      Configure Tariffs
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 3: CITIES SETTINGS */}
      {/* ======================================================== */}
      {activeTab === 'cities' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Cities and Local Governance rules</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Add boundaries radius, regional municipal tax rules and toggle city operations.</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-500 uppercase tracking-wider font-semibold text-[10px] border-b border-slate-200">
                    <th className="px-6 py-3">City ID</th>
                    <th className="px-6 py-3">City Name</th>
                    <th className="px-6 py-3">State</th>
                    <th className="px-6 py-3 text-right">Service Radius (KM)</th>
                    <th className="px-6 py-3 text-right">Municipal Tax Percentage</th>
                    <th className="px-6 py-3">Operational Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-8 text-slate-400">Loading cities database...</td>
                    </tr>
                  ) : (
                    cities.map((city) => (
                      <tr key={city.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-800">{city.id}</td>
                        <td className="px-6 py-4 font-medium text-slate-700">{city.name}</td>
                        <td className="px-6 py-4 text-slate-500">{city.state}</td>
                        <td className="px-6 py-4 text-right font-semibold text-slate-700">{city.radius} KM</td>
                        <td className="px-6 py-4 text-right font-semibold text-slate-700">{city.taxes}%</td>
                        <td className="px-6 py-4">
                          {city.status === 'Active' ? (
                            <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-green-50 text-green-700 border border-green-100 uppercase">ACTIVE</span>
                          ) : (
                            <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-slate-100 text-slate-400 border border-slate-200 uppercase">INACTIVE</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => openEditCity(city)}
                            className="px-2.5 py-1 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded font-semibold text-[11px]"
                          >
                            Edit
                          </button>
                          
                          <button
                            onClick={() => updateCityStatus(city.id, city.status === 'Active' ? 'Inactive' : 'Active')}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold whitespace-nowrap ${
                              city.status === 'Active'
                                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                                : 'bg-olive-50 hover:bg-olive-100 text-olive-700'
                            }`}
                          >
                            {city.status === 'Active' ? 'Disable Service' : 'Enable Service'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* REUSABLE CONFIGURATION MODALS */}
      {/* ======================================================== */}
      
      {/* 1. Add Employee Modal */}
      <ReusableModal
        isOpen={modalType === 'add_emp'}
        onClose={() => setModalType(null)}
        title="Register New Staff Account"
        size="md"
      >
        <div className="space-y-4">
          {actionError && (
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded text-xs">{actionError}</div>
          )}

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Employee Full Name</label>
              <input
                type="text"
                value={employeeForm.name}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ramesh Sharma"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-olive-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Email Address</label>
              <input
                type="email"
                value={employeeForm.email}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="ramesh@happiride.com"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-olive-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Mobile Number</label>
              <input
                type="text"
                value={employeeForm.mobile}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, mobile: e.target.value }))}
                placeholder="9988776655"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-olive-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Department Role</label>
              <select
                value={employeeForm.role}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, role: e.target.value }))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-olive-500"
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Operations Manager">Operations Manager</option>
                <option value="Finance Manager">Finance Manager</option>
                <option value="Support Manager">Support Manager</option>
                <option value="KYC Officer">KYC Officer</option>
              </select>
            </div>
            
            <div className="p-3 bg-olive-50 text-olive-700 rounded-lg text-[11px] leading-normal flex gap-2">
              <Info size={16} className="shrink-0 mt-0.5" />
              <span>Permission modules are pre-mapped for roles. (e.g. KYC Officers are restricted to KYC checking & General console Dashboard)</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button 
              onClick={() => setModalType(null)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleAddEmployee}
              disabled={actionLoading}
              className="px-4 py-2 bg-olive-500 hover:bg-olive-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              {actionLoading && <Loader2 size={13} className="animate-spin" />}
              Create Account
            </button>
          </div>
        </div>
      </ReusableModal>

      {/* 2. Edit Service Modal */}
      <ReusableModal
        isOpen={modalType === 'edit_service'}
        onClose={() => setModalType(null)}
        title={selectedService ? `Configure ${selectedService.name} Tariffs` : 'Service Fares'}
        size="md"
      >
        <div className="space-y-4">
          {actionError && (
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded text-xs">{actionError}</div>
          )}

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Base Minimum Fare (₹)</label>
              <input
                type="number"
                value={serviceForm.baseFare}
                onChange={(e) => setServiceForm(prev => ({ ...prev, baseFare: Number(e.target.value) }))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-olive-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Distance Charges Per KM (₹)</label>
              <input
                type="number"
                value={serviceForm.perKmFare}
                onChange={(e) => setServiceForm(prev => ({ ...prev, perKmFare: Number(e.target.value) }))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-olive-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Platform Commission Fee (%)</label>
              <input
                type="number"
                value={serviceForm.commission}
                onChange={(e) => setServiceForm(prev => ({ ...prev, commission: Number(e.target.value) }))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-olive-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Driver Cancellation Fee (₹)</label>
              <input
                type="number"
                value={serviceForm.cancellationCharge}
                onChange={(e) => setServiceForm(prev => ({ ...prev, cancellationCharge: Number(e.target.value) }))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-olive-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Surge Multiplier Pricing</label>
              <input
                type="number"
                step="0.1"
                value={serviceForm.surgePricing}
                onChange={(e) => setServiceForm(prev => ({ ...prev, surgePricing: Number(e.target.value) }))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-olive-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button 
              onClick={() => setModalType(null)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleServiceSubmit}
              disabled={actionLoading}
              className="px-4 py-2 bg-olive-500 hover:bg-olive-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              {actionLoading && <Loader2 size={13} className="animate-spin" />}
              Save Config
            </button>
          </div>
        </div>
      </ReusableModal>

      {/* 3. Edit City Modal */}
      <ReusableModal
        isOpen={modalType === 'edit_city'}
        onClose={() => setModalType(null)}
        title={selectedCity ? `Edit ${selectedCity.name} Logistics` : 'City Config'}
        size="md"
      >
        <div className="space-y-4">
          {actionError && (
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded text-xs">{actionError}</div>
          )}

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Operating City Boundary Radius (KM)</label>
              <input
                type="number"
                value={cityForm.radius}
                onChange={(e) => setCityForm(prev => ({ ...prev, radius: Number(e.target.value) }))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-olive-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">State Municipal Taxes (%)</label>
              <input
                type="number"
                value={cityForm.taxes}
                onChange={(e) => setCityForm(prev => ({ ...prev, taxes: Number(e.target.value) }))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-olive-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button 
              onClick={() => setModalType(null)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleCitySubmit}
              disabled={actionLoading}
              className="px-4 py-2 bg-olive-500 hover:bg-olive-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              {actionLoading && <Loader2 size={13} className="animate-spin" />}
              Save Changes
            </button>
          </div>
        </div>
      </ReusableModal>

    </div>
  );
};

export default Settings;
