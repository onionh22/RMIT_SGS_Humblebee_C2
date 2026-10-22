import React, { useState } from 'react';
import { 
  Shield, 
  Key, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Fingerprint, 
  Terminal, 
  ArrowRight, 
  Copy, 
  Check, 
  UserCheck, 
  X 
} from 'lucide-react';
import { UserSession } from '../types';
import { USERS } from '../data/initialData';
import { Language } from '../i18n/translations';

interface TideCloakAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSession;
  onSelectUser: (user: UserSession) => void;
  lang: Language;
  onShowToast: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
}

interface SimulatedTideProfile {
  id: string;
  name: string;
  role: string;
  vuid: string;
  roles: string[];
  tenantId: string;
  dpopThumbprint: string;
  descriptionVi: string;
  descriptionEn: string;
  allowedActions: string[];
  restrictedActions: string[];
}

const TIDE_PROFILES: Record<string, SimulatedTideProfile> = {
  'sarah': {
    id: 'sarah',
    name: 'Sarah Chen',
    role: 'Principal Supply Chain Admin',
    vuid: 'vuid_0x8f2a1b94e37c569100fae412891d4e08a4c',
    roles: ['supplier.admin', 'order.manager', 'quorum.proposer'],
    tenantId: 'tenant-atlas-supplier',
    dpopThumbprint: 'dpop_jkt_a94f1c8e2b774d01',
    descriptionVi: 'Quản trị viên nhà máy Atlas Microelectronics. Có quyền tạo đơn và đề xuất Quorum (Key 1/2).',
    descriptionEn: 'Atlas Microelectronics Fab Admin. Can manage orders and propose Quorum (Key 1/2).',
    allowedActions: ['Tạo đơn hàng', 'Đề xuất ký 2-of-2 Quorum', 'Tải lên fab yield data'],
    restrictedActions: ['Đơn phương mở khóa không có Co-Signer', 'Xem chứng từ nội bộ của đối thủ']
  },
  'elena': {
    id: 'elena',
    name: 'Dr. Elena Vance',
    role: 'Chief Compliance & Quality Officer',
    vuid: 'vuid_0x4e77b10298a0fc2389104c99a01f56be31d',
    roles: ['compliance.officer', 'audit.lead', 'quorum.cosigner'],
    tenantId: 'tenant-atlas-compliance',
    dpopThumbprint: 'dpop_jkt_0b88ef1923c4a912',
    descriptionVi: 'Chuyên viên kiểm toán độc lập. Nắm giữ chìa khóa thứ hai (2-of-2 Co-signer).',
    descriptionEn: 'Independent Compliance Officer. Holds the second co-signing key (2-of-2 Co-signer).',
    allowedActions: ['Đồng ký Quorum (Key 2/2)', 'Xem audit trail bất biến', 'Kích hoạt Emergent Authority'],
    restrictedActions: ['Tạo đơn hàng mới', 'Thay đổi yield thresholds nhà máy']
  },
  'marcus': {
    id: 'marcus',
    name: 'Marcus Cole',
    role: 'Lead Procurement & Avionics QA',
    vuid: 'vuid_0x11029adbe4478129fca082103498bced102',
    roles: ['customer.pacific_aero', 'evidence.viewer'],
    tenantId: 'tenant-pacific-avionics',
    dpopThumbprint: 'dpop_jkt_f78103bc294a8190',
    descriptionVi: 'Khách hàng A (Hàng không vũ trụ). Chỉ giải mã được package cấp phép cho Pacific Avionics.',
    descriptionEn: 'Customer A (Aerospace Tier 1). Authorized solely for Pacific Avionics evidence packages.',
    allowedActions: ['Giải mã wafer lot PKG-SEMI-2026-A1', 'Tải báo cáo kiểm định AEC-Q100'],
    restrictedActions: ['Truy cập chứng từ của Nova Mobile (Customer B)', 'Ký duyệt chứng từ nhà máy']
  },
  'james': {
    id: 'james',
    name: 'James Park',
    role: 'Component Sourcing Director',
    vuid: 'vuid_0x77c48901baef481029ca99014528fbb019e',
    roles: ['customer.nova_mobile', 'evidence.viewer'],
    tenantId: 'tenant-nova-mobile',
    dpopThumbprint: 'dpop_jkt_294bca1189fed001',
    descriptionVi: 'Khách hàng B (Smartphone OEM). Bị cô lập mật mã học với các gói dữ liệu của Khách hàng A.',
    descriptionEn: 'Customer B (Smartphone OEM). Cryptographically isolated from Customer A packages.',
    allowedActions: ['Xem PO của Nova Mobile', 'Kiểm tra tiến độ giao hàng'],
    restrictedActions: ['Mở wafer lot của Pacific Avionics (Bị chặn 403 Forbidden)', 'Can thiệp Quorum']
  },
  'alex': {
    id: 'alex',
    name: 'Alex Rivera',
    role: 'Platform Operations Admin',
    vuid: 'vuid_0x000189fae019234857bca10293847561829',
    roles: ['platform.admin', 'infrastructure.monitor'],
    tenantId: 'tenant-cargotrust-infra',
    dpopThumbprint: 'dpop_jkt_981a2b0c3d4e5f60',
    descriptionVi: 'Quản trị viên hạ tầng. Thử nghiệm kịch bản Rogue Admin Override (bị chặn bởi 0-master-key).',
    descriptionEn: 'Platform Infra Admin. Demonstrates Rogue Admin Override blocked by 0-master-key rule.',
    allowedActions: ['Xem health check cụm 4 node', 'Kiểm tra hạ tầng mạng ORK'],
    restrictedActions: ['Đơn phương giải mã dữ liệu tenant (0 Master Key)', 'Bypass 2-of-2 Quorum']
  }
};

export const TideCloakAuthModal: React.FC<TideCloakAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
  lang,
  onShowToast
}) => {
  const [selectedProfileId, setSelectedProfileId] = useState<string>(currentUser.id);
  const [activeTab, setActiveTab] = useState<'signin' | 'token' | 'checks'>('signin');
  const [copiedToken, setCopiedToken] = useState(false);

  if (!isOpen) return null;

  const currentProfile = TIDE_PROFILES[selectedProfileId] || TIDE_PROFILES['sarah'];

  const simulatedTokenPayload = {
    iss: 'https://auth.tide.org/realms/cargotrust-trade-realm',
    sub: currentProfile.vuid,
    aud: 'cargotrust-api-gateway',
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000),
    jti: 'urn:uuid:' + Math.random().toString(36).substring(2, 15),
    cnf: {
      jkt: currentProfile.dpopThumbprint
    },
    tide: {
      auth_mechanism: 'PRISM_THRESHOLD',
      ork_quorum: '14/20',
      master_keys_count: 0,
      emergent_authority: true
    },
    realm_access: {
      roles: currentProfile.roles
    },
    tenant_context: {
      tenant_id: currentProfile.tenantId,
      isolation_mode: 'CRYPTOGRAPHIC_PARTITION'
    }
  };

  const handleSimulateLogin = (profileId: string) => {
    setSelectedProfileId(profileId);
    const targetUser = USERS[profileId];
    if (targetUser) {
      onSelectUser(targetUser);
      onShowToast(
        lang === 'vi' ? 'Đã xác thực qua TideCloak' : 'TideCloak Authentication Successful',
        lang === 'vi' 
          ? `Đã cấp DPoP Token cho ${targetUser.name} (${currentProfile.roles.join(', ')})`
          : `Issued DPoP Token to ${targetUser.name} (${currentProfile.roles.join(', ')})`,
        'success'
      );
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(JSON.stringify(simulatedTokenPayload, null, 2));
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">TideCloak Identity & Access Simulator</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-400/20 text-blue-300 border border-blue-400/30 font-semibold">
                  DPoP Proof-of-Possession
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Realm: <code className="text-blue-300 font-mono">cargotrust-trade-realm</code> · 0 Central Master Keys
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('signin')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'signin' 
                ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? '1. Đăng Nhập & Vai Trò' : '1. Sign-In & Roles'}</span>
          </button>
          <button
            onClick={() => setActiveTab('token')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'token' 
                ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? '2. DPoP JWT Token' : '2. DPoP JWT Token'}</span>
          </button>
          <button
            onClick={() => setActiveTab('checks')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'checks' 
                ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? '3. Kiểm Tra Phân Quyền (Access Checks)' : '3. Access Checks'}</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* TAB 1: Sign-in & Roles */}
          {activeTab === 'signin' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 flex items-start gap-3">
                <Shield className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <div className="font-bold">
                    {lang === 'vi' 
                      ? 'Cơ chế xác thực không lưu mật khẩu (Tide PRISM Threshold)' 
                      : 'Passwordless Threshold Authentication (Tide PRISM)'}
                  </div>
                  <p className="text-[11px] text-blue-800 leading-relaxed">
                    {lang === 'vi'
                      ? 'TideCloak không lưu trữ mật khẩu trung tâm. Mỗi phiên đăng nhập tạo một cặp khóa DPoP ECDSA trên trình duyệt, liên kết với VUID phân tán được đồng thuận bởi 14/20 node ORK.'
                      : 'TideCloak eliminates central password stores. Each sign-in derives an ephemeral DPoP keypair in the browser bound to a verifiable user ID (VUID) validated across 14/20 ORKs.'}
                  </p>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-2 block">
                  {lang === 'vi' ? 'Chọn tài khoản TideCloak để mô phỏng đăng nhập:' : 'Select TideCloak Persona to Authenticate:'}
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {Object.values(TIDE_PROFILES).map((prof) => {
                    const isSelected = selectedProfileId === prof.id;
                    return (
                      <div
                        key={prof.id}
                        onClick={() => handleSimulateLogin(prof.id)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between gap-3 ${
                          isSelected 
                            ? 'border-blue-600 bg-blue-50/70 shadow-xs' 
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {prof.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm truncate">{prof.name}</span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                {prof.tenantId}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate">{prof.role}</p>
                            <div className="flex items-center gap-1 mt-1 flex-wrap">
                              {prof.roles.map(r => (
                                <span key={r} className="text-[9.5px] font-mono bg-blue-100/70 text-blue-800 px-1.5 py-0.2 rounded">
                                  {r}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                          {isSelected ? (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              {lang === 'vi' ? 'Đang hoạt động' : 'Active'}
                            </span>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSimulateLogin(prof.id);
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold bg-white border border-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-slate-700 rounded-lg transition-colors cursor-pointer"
                            >
                              {lang === 'vi' ? 'Đăng nhập' : 'Sign in'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Token Details */}
          {activeTab === 'token' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Decoded DPoP Bound Access Token</h4>
                  <p className="text-[11px] text-slate-500 font-mono">Algorithm: EdDSA / P-256 · Bound to client jkt</p>
                </div>
                <button
                  onClick={copyToken}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
                >
                  {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedToken ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>

              <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] overflow-x-auto border border-slate-800">
                <pre>{JSON.stringify(simulatedTokenPayload, null, 2)}</pre>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-slate-500 font-medium mb-1">Subject (VUID):</div>
                  <code className="text-blue-700 font-bold break-all">{currentProfile.vuid}</code>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-slate-500 font-medium mb-1">DPoP Key Thumbprint (jkt):</div>
                  <code className="text-emerald-700 font-bold break-all">{currentProfile.dpopThumbprint}</code>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Access Checks Matrix */}
          {activeTab === 'checks' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="font-bold text-slate-900 mb-1">
                  {lang === 'vi' ? 'Quy tắc phân quyền cho:' : 'Evaluated Access Policies for:'} <span className="text-blue-700">{currentProfile.name}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {lang === 'vi' ? currentProfile.descriptionVi : currentProfile.descriptionEn}
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  {lang === 'vi' ? 'Hành động được cấp quyền (Allowed by TideCloak RBAC):' : 'Permitted Actions:'}
                </h5>
                <div className="space-y-1.5">
                  {currentProfile.allowedActions.map((action, i) => (
                    <div key={i} className="p-2.5 bg-emerald-50/60 border border-emerald-200/80 rounded-lg flex items-center gap-2 text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-medium text-[11.5px]">{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  {lang === 'vi' ? 'Hành động bị cấm (Blocked by Emergent Authority / Isolation):' : 'Strictly Enforced Barriers:'}
                </h5>
                <div className="space-y-1.5">
                  {currentProfile.restrictedActions.map((action, i) => (
                    <div key={i} className="p-2.5 bg-rose-50/60 border border-rose-200/80 rounded-lg flex items-center gap-2 text-rose-900">
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span className="font-medium text-[11.5px]">{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>TideCloak Mock Engine: Active (Zero Single Point of Failure)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0f294a] hover:bg-[#1a3d68] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            {lang === 'vi' ? 'Đóng cửa sổ' : 'Close Window'}
          </button>
        </div>

      </div>
    </div>
  );
};
