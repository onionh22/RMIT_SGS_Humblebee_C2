import React, { useState } from 'react';
import { 
  Shield, 
  Key, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  CheckCircle2, 
  FileCode, 
  Building2, 
  Fingerprint, 
  Eye, 
  UserCheck, 
  ArrowRight, 
  Radio, 
  Sparkles,
  RefreshCw,
  ShieldAlert,
  FileCheck
} from 'lucide-react';
import { 
  EvidencePackage, 
  HackathonPersona 
} from '../types';
import { 
  HACKATHON_PERSONAS, 
  INITIAL_EVIDENCE_PACKAGES, 
  evaluateEvidenceAccess,
  coSignQuorumApproval,
  attemptRogueAdminOverride,
  proposeScopeExpansion
} from '../utils/quorumEngine';

interface EvidenceExchangeProps {
  currentPersona: HackathonPersona;
  onSwitchPersona: (personaId: HackathonPersona['id']) => void;
  lang?: 'vi' | 'en';
  onOpenSubmissionKit: () => void;
  onOpenDemoScenarios: () => void;
}

export const EvidenceExchange: React.FC<EvidenceExchangeProps> = ({
  currentPersona,
  onSwitchPersona,
  lang = 'vi',
  onOpenSubmissionKit,
  onOpenDemoScenarios,
}) => {
  const [packages, setPackages] = useState<EvidencePackage[]>(INITIAL_EVIDENCE_PACKAGES);
  const [selectedPkg, setSelectedPkg] = useState<EvidencePackage | null>(INITIAL_EVIDENCE_PACKAGES[1]);
  const [viewingDocPackage, setViewingDocPackage] = useState<EvidencePackage | null>(null);
  const [alertNotice, setAlertNotice] = useState<{
    type: 'success' | 'danger' | 'warning' | 'info';
    title: string;
    message: string;
    technicalDetails?: string;
  } | null>(null);

  // Trigger Rogue Admin override simulation
  const handleSimulateRogueOverride = (pkg: EvidencePackage) => {
    const roguePersona = HACKATHON_PERSONAS['supplier-admin'];
    const result = attemptRogueAdminOverride(pkg, roguePersona, 'tenant-pacific-avionics');
    
    // Add audit entry to package logs
    setPackages(prev => prev.map(p => {
      if (p.id === pkg.id) {
        return {
          ...p,
          accessLogs: [result.auditEntry, ...p.accessLogs]
        };
      }
      return p;
    }));

    if (selectedPkg?.id === pkg.id) {
      setSelectedPkg(prev => prev ? { ...prev, accessLogs: [result.auditEntry, ...prev.accessLogs] } : null);
    }

    setAlertNotice({
      type: 'danger',
      title: 'HÀNH VI ĐƠN PHƯƠNG BỊ TỪ CHỐI (UNILATERAL OVERRIDE BLOCKED)',
      message: result.message,
      technicalDetails: `Chính sách TideCloak: Thiếu chữ ký 2-of-2 Quorum. Không tìm thấy bất kỳ Master Key nào trên server. Thẩm quyền đơn phương bị vô hiệu hóa.`
    });
  };

  // Co-sign Quorum as Elena Vance
  const handleCoSign = (pkg: EvidencePackage) => {
    const complianceOfficer = HACKATHON_PERSONAS['compliance-officer'];
    const res = coSignQuorumApproval(pkg, complianceOfficer);
    
    if (res.success) {
      setPackages(prev => prev.map(p => p.id === pkg.id ? res.updatedPkg : p));
      setSelectedPkg(res.updatedPkg);
      setAlertNotice({
        type: 'success',
        title: 'THẨM QUYỀN NẢY SINH ĐÃ KÍCH HOẠT (EMERGENT AUTHORITY ACTIVATED)',
        message: res.message,
        technicalDetails: `Ngưỡng 2-of-2 đạt đủ. Token năng lực cryptographic đã được đúc độc lập bởi mạng Tide. Không một bên nào giữ master key vĩnh viễn.`
      });
    } else {
      setAlertNotice({
        type: 'warning',
        title: 'KHÔNG THỂ ĐỒNG KÝ',
        message: res.message,
      });
    }
  };

  // Propose scope expansion as Sarah Chen
  const handlePropose = (pkg: EvidencePackage) => {
    const supplierAdmin = HACKATHON_PERSONAS['supplier-admin'];
    const res = proposeScopeExpansion(
      pkg, 
      supplierAdmin, 
      'tenant-pacific-avionics', 
      'Pacific Avionics (Tier 1)',
      'Cung cấp chứng chỉ ITAR & kiểm định bán dẫn cho lô linh kiện hàng không.'
    );

    if (res.success) {
      setPackages(prev => prev.map(p => p.id === pkg.id ? res.updatedPkg : p));
      setSelectedPkg(res.updatedPkg);
      setAlertNotice({
        type: 'info',
        title: 'ĐÃ KHỞI TẠO ĐỀ XUẤT QUORUM (KEY 1/2)',
        message: res.message,
        technicalDetails: `Khóa 1/2 từ Sarah Chen. Gói được bảo vệ bằng mã hóa đa bên, đang chờ Dr. Elena Vance đồng ký duyệt.`
      });
    }
  };

  // Check access for current persona on selected package
  const activeAccessCheck = selectedPkg 
    ? evaluateEvidenceAccess(currentPersona, selectedPkg) 
    : { allowed: false, code: 'NO_QUORUM', reason: 'Chưa chọn gói' };

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2563eb] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Tide UNLOCKED 2026 Challenge · Emergent Authority
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-500 font-mono">No Unilateral Control Guarantee</span>
            </div>
            <h1 className="text-xl font-bold text-[#0f294a] truncate">
              {lang === 'vi' ? 'Nền tảng Trao đổi Bằng chứng Bán dẫn' : 'Semiconductor Evidence Exchange'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'vi' 
                ? 'Bảo vệ hồ sơ kiểm định bán dẫn 7nm & FPGA bằng cơ chế Emergent Authority — Không ai nắm Master Key đơn quyền.'
                : 'Protecting 7nm & FPGA foundry compliance proofs with Emergent Authority — Zero single-point master keys.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onOpenSubmissionKit}
              className="px-3 py-1.5 bg-[#0f294a] hover:bg-[#1e3a5f] text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <FileCheck className="w-3.5 h-3.5 text-blue-300" />
              <span>{lang === 'vi' ? 'Hồ sơ dự thi (README < 300 từ)' : 'Submission Kit (README < 300w)'}</span>
            </button>
            <button
              onClick={onOpenDemoScenarios}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2563eb]" />
              <span>{lang === 'vi' ? 'Kịch bản Test (4 Scenarios)' : 'Test Scenarios'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Persona Bar - Immediate switching for judges */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-600">
            {lang === 'vi' ? 'Góc nhìn kiểm thử (Persona Switcher):' : 'Active Persona Perspective:'}
          </span>
          <span className="text-xs font-bold text-[#0f294a] bg-white px-2 py-0.5 rounded border border-slate-200">
            {currentPersona.name} ({currentPersona.roleTitle})
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {(Object.keys(HACKATHON_PERSONAS) as Array<HackathonPersona['id']>).map(pId => {
            const p = HACKATHON_PERSONAS[pId];
            const isSelected = currentPersona.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSwitchPersona(p.id)}
                className={`px-2.5 py-1 text-xs rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected 
                    ? 'bg-[#2563eb] text-white font-semibold shadow-xs' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
                title={p.description}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
                <span>{p.name.split(' ')[0]}</span>
                <span className="text-[10px] opacity-75">({p.id === 'supplier-admin' ? 'Admin' : p.id === 'compliance-officer' ? 'Co-Signer' : p.id === 'customer-a' ? 'Avionics' : p.id === 'customer-b' ? 'Apex' : 'Auditor'})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Alert Banner if triggered */}
      {alertNotice && (
        <div className={`p-4 rounded-lg border text-xs animate-in fade-in duration-150 ${
          alertNotice.type === 'danger' 
            ? 'bg-rose-50 border-rose-200 text-rose-900' 
            : alertNotice.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : alertNotice.type === 'warning'
            ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-blue-50 border-blue-200 text-blue-900'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2.5">
              {alertNotice.type === 'danger' ? (
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              ) : alertNotice.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="font-bold text-sm">{alertNotice.title}</h4>
                <p className="mt-1 leading-relaxed">{alertNotice.message}</p>
                {alertNotice.technicalDetails && (
                  <p className="mt-1.5 text-[11px] font-mono opacity-80 bg-white/60 p-2 rounded border border-current/20">
                    {alertNotice.technicalDetails}
                  </p>
                )}
              </div>
            </div>
            <button 
              onClick={() => setAlertNotice(null)}
              className="text-slate-400 hover:text-slate-600 font-bold ml-2"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* 2-Column Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Evidence Packages List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#0f294a]">
              {lang === 'vi' ? 'Hồ sơ Bằng chứng Bán dẫn' : 'Semiconductor Evidence Packages'}
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              {packages.length} packages
            </span>
          </div>

          <div className="space-y-3">
            {packages.map(pkg => {
              const isSelected = selectedPkg?.id === pkg.id;
              const accessCheck = evaluateEvidenceAccess(currentPersona, pkg);
              const is2of2 = pkg.signatures.length >= pkg.requiredSignatures;

              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPkg(pkg)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-white border-[#2563eb] shadow-sm ring-1 ring-[#2563eb]' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-[#2563eb]">
                      {pkg.packageCode}
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                      is2of2 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : pkg.signatures.length === 1 
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {is2of2 ? '✓ 2/2 Quorum Active' : `${pkg.signatures.length}/${pkg.requiredSignatures} Chờ Co-Sign`}
                    </span>
                  </div>

                  <h3 className="text-xs font-semibold text-[#0f294a] line-clamp-2 mb-1.5">
                    {pkg.title}
                  </h3>

                  <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2 mt-2">
                    <span>{pkg.componentFamily}</span>
                    <span className="flex items-center gap-1 font-mono">
                      {accessCheck.allowed ? (
                        <span className="text-emerald-600 font-medium flex items-center gap-0.5">
                          <Unlock className="w-3 h-3" /> Được phép
                        </span>
                      ) : (
                        <span className="text-rose-600 font-medium flex items-center gap-0.5">
                          <Lock className="w-3 h-3" /> Bị khóa
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Package Detail & Cryptographic Proofs (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedPkg ? (
            <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-5">
              
              {/* Package Header */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#2563eb]">
                      {selectedPkg.packageCode}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500">{selectedPkg.industry}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {selectedPkg.classification}
                  </span>
                </div>

                <h2 className="text-base font-bold text-[#0f294a]">
                  {selectedPkg.title}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Đơn vị xuất bản: {selectedPkg.supplierOrg}
                </p>
              </div>

              {/* Emergent Authority Status Card */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-[#2563eb]" />
                    <span className="text-xs font-semibold text-[#0f294a]">
                      Trạng thái Quorum 2-of-2 (Emergent Authority)
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-700">
                    {selectedPkg.signatures.length} / {selectedPkg.requiredSignatures} Signatures
                  </span>
                </div>

                {/* Signers list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded bg-white border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-700">Khóa 1/2: Supplier Admin</span>
                      {selectedPkg.signatures.some(s => s.signerId === 'supplier-admin') ? (
                        <span className="text-[10px] text-emerald-600 font-bold">ĐÃ KÝ</span>
                      ) : (
                        <span className="text-[10px] text-slate-400">CHƯA KÝ</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">Sarah Chen (Atlas Microelectronics)</p>
                  </div>

                  <div className="p-2.5 rounded bg-white border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-700">Khóa 2/2: Compliance Officer</span>
                      {selectedPkg.signatures.some(s => s.signerId === 'compliance-officer') ? (
                        <span className="text-[10px] text-emerald-600 font-bold">ĐÃ KÝ</span>
                      ) : (
                        <span className="text-[10px] text-amber-600 font-bold">CHỜ ĐỒNG THUẬN</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">Dr. Elena Vance (Compliance Board)</p>
                  </div>
                </div>

                {/* Current Persona Access Verdict */}
                <div className={`p-3 rounded border text-xs flex items-start gap-2.5 ${
                  activeAccessCheck.allowed 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}>
                  {activeAccessCheck.allowed ? (
                    <Unlock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Lock className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <span className="font-semibold">
                      {activeAccessCheck.allowed ? 'Quyền truy cập: HỢP LỆ' : 'Quyền truy cập: BỊ TỪ CHỐI'}
                    </span>
                    <p className="mt-0.5 text-[11px] leading-relaxed">
                      {activeAccessCheck.reason}
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Hackathon Demonstration Actions */}
              <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0f294a]">
                    Thao tác Thử nghiệm (Interactive Hackathon Controls)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Real Policy Engine</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Simulate Rogue Admin */}
                  <button
                    onClick={() => handleSimulateRogueOverride(selectedPkg)}
                    className="p-2.5 rounded border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                    title="Mô phỏng admin cố ý vượt quyền đơn phương"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Thử Rogue Admin Override</span>
                  </button>

                  {/* Co-Sign as Elena Vance */}
                  {selectedPkg.signatures.length < selectedPkg.requiredSignatures ? (
                    <button
                      onClick={() => handleCoSign(selectedPkg)}
                      className="p-2.5 rounded bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      title="Ký xác nhận khóa 2/2 với tư cách Dr. Elena Vance"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Co-Sign Quorum (Khóa 2/2)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setViewingDocPackage(selectedPkg)}
                      disabled={!activeAccessCheck.allowed}
                      className={`p-2.5 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                        activeAccessCheck.allowed 
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs' 
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem Bằng Chứng Giải Mã</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Documents in package */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-700">
                    Tài liệu đính kèm trong gói ({selectedPkg.documents.length})
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">AES-256 GCM</span>
                </div>

                <div className="space-y-1.5">
                  {selectedPkg.documents.map(doc => (
                    <div 
                      key={doc.id}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-slate-400" />
                        <div>
                          <div className="font-medium text-slate-800">{doc.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {doc.category} · {doc.size}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {doc.encrypted ? (
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                            ENCRYPTED
                          </span>
                        ) : (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-mono">
                            CLEAR
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Immutable Tide Audit Log */}
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <h4 className="text-xs font-semibold text-slate-700">
                  Nhật ký Xác thực Bất biến (Immutable Tide Ledger)
                </h4>
                <div className="space-y-1.5 max-h-40 overflow-y-auto font-mono text-[11px]">
                  {selectedPkg.accessLogs.map(log => (
                    <div 
                      key={log.id}
                      className={`p-2 rounded border ${
                        log.outcome === 'OVERRIDE_REJECTED' 
                          ? 'bg-rose-50 border-rose-200 text-rose-800'
                          : log.outcome === 'ALLOWED' 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] opacity-75">
                        <span>{log.timestamp} · {log.actor} ({log.role})</span>
                        <span className="font-bold">{log.outcome}</span>
                      </div>
                      <p className="mt-0.5 text-xs">{log.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center bg-white border border-slate-200 rounded-lg text-slate-400 text-xs">
              Vui lòng chọn một gói bằng chứng bên trái để xem chi tiết
            </div>
          )}
        </div>

      </div>

      {/* Decrypted Document Viewer Modal */}
      {viewingDocPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f294a]/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-2xl p-6 space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Unlock className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-[#0f294a]">
                  Hồ sơ Bằng chứng Đã Giải Mã (Emergent Token Verified)
                </h3>
              </div>
              <button 
                onClick={() => setViewingDocPackage(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900 leading-relaxed">
              <strong>Xác thực Thành công:</strong> Dữ liệu đã được giải mã thông qua capability token tạm thời sinh ra từ sự đồng thuận của 2 khóa độc lập. Không có master key nào được lưu trữ hay tái sử dụng.
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700">Tài liệu đã mở khóa:</span>
              {viewingDocPackage.documents.map(d => (
                <div key={d.id} className="p-3 bg-slate-50 border border-slate-200 rounded text-xs flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-800">{d.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      SHA256: {d.hash.substring(0, 32)}...
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] font-medium text-[#2563eb]">
                    Verified Clean
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-end">
              <button
                onClick={() => setViewingDocPackage(null)}
                className="px-4 py-2 bg-[#0f294a] text-white rounded text-xs font-medium hover:bg-slate-800"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
