import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Bot, 
  Users, 
  Scale, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { PolicyRule, UserRole } from '../types';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface PoliciesViewProps {
  policies: PolicyRule[];
  lang: Language;
  onTogglePolicy: (policyId: string) => void;
  onResetPolicies: () => void;
  onShowToast: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
}

export const PoliciesView: React.FC<PoliciesViewProps> = ({
  policies,
  lang,
  onTogglePolicy,
  onResetPolicies,
  onShowToast
}) => {
  const t = TRANSLATIONS[lang];
  const [simRole, setSimRole] = useState<UserRole>('Procurement Specialist');
  const [simIsOwner, setSimIsOwner] = useState(true);
  const [simAmount, setSimAmount] = useState<number>(18420);
  const [simHasDiscrepancy, setSimHasDiscrepancy] = useState(true);
  const [simIsTampered, setSimIsTampered] = useState(false);
  const [simAction, setSimAction] = useState<'Approve' | 'Sign' | 'Disburse'>('Approve');

  const simulateVerdict = () => {
    const isSepDutiesEnabled = policies.find(p => p.id === 'pol-separation')?.enabled ?? true;
    const isAiLimitEnabled = policies.find(p => p.id === 'pol-ai-limits')?.enabled ?? true;
    const isDualApprovalEnabled = policies.find(p => p.id === 'pol-signing')?.enabled ?? true;
    const isIntegrityEnabled = policies.find(p => p.id === 'pol-integrity')?.enabled ?? true;
    const isToleranceEnabled = policies.find(p => p.id === 'pol-tolerance')?.enabled ?? true;

    const reasons: string[] = [];
    let allowed = true;

    if (isAiLimitEnabled && simRole === 'AI Agent') {
      allowed = false;
      reasons.push(
        lang === 'vi'
          ? 'Ranh giới AI: Đại lý AI tự trị không có quyền phê duyệt, ký kết hoặc giải ngân tài chính.'
          : 'AI Boundary: Autonomous AI cannot approve, sign, or disburse funds.'
      );
    }

    if (isSepDutiesEnabled && simIsOwner && simRole !== 'Compliance Admin') {
      allowed = false;
      reasons.push(
        lang === 'vi'
          ? 'Phân tách trách nhiệm (Maker-Checker): Người tạo/yêu cầu không được tự phê duyệt chứng từ của chính mình.'
          : 'Separation of Duties: The submitter cannot approve or sign their own document.'
      );
    }

    if (isIntegrityEnabled && simIsTampered) {
      allowed = false;
      reasons.push(
        lang === 'vi'
          ? 'Tính toàn vẹn phiên bản: Dấu vân tay băm mật mã bị sai lệch. Các phê duyệt trước đó bị thu hồi.'
          : 'Version Integrity: Cryptographic hash mismatch. Prior approvals are revoked.'
      );
    }

    if (isToleranceEnabled && simHasDiscrepancy && simAction === 'Sign') {
      allowed = false;
      reasons.push(
        lang === 'vi'
          ? 'Cổng không sai lệch: Tồn tại chênh lệch số lượng/giá chưa được duyệt. Chặn thực thi ký.'
          : 'Zero-Tolerance Gate: Unresolved 3-way quantity/price mismatch blocks signing.'
      );
    }

    if (isDualApprovalEnabled && simAmount >= 10000 && simAction === 'Sign') {
      reasons.push(
        lang === 'vi'
          ? 'Biểu quyết đa bên (> $10k): Giá trị giao dịch lớn đòi hỏi 2 chữ ký từ 2 phòng ban độc lập.'
          : 'Dual-Control Quorum: Value >= $10,000 requires 2 independent departmental signatures.'
      );
    }

    return { allowed, reasons };
  };

  const simResult = simulateVerdict();

  const getPolicyIcon = (name: string) => {
    switch (name) {
      case 'ShieldCheck': return ShieldCheck;
      case 'Users': return Users;
      case 'Lock': return Lock;
      case 'Bot': return Bot;
      case 'Scale': return Scale;
      default: return ShieldCheck;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t.policies.pageTitle}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.policies.pageSubtitle}
          </p>
        </div>

        <button
          onClick={onResetPolicies}
          className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.common.resetDefaults}</span>
        </button>
      </div>

      {/* Policy Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {policies.map((policy) => {
          const Icon = getPolicyIcon(policy.iconName);
          return (
            <div 
              key={policy.id}
              className={`p-5 rounded-xl border transition-all ${
                policy.enabled 
                  ? 'bg-white border-slate-200 shadow-xs' 
                  : 'bg-slate-50/60 border-slate-200 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    policy.enabled ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-slate-200 text-slate-500'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{policy.title}</h3>
                    <div className="text-[11px] text-slate-400">{policy.subtitle}</div>
                  </div>
                </div>

                {/* Toggle switch */}
                <button
                  role="switch"
                  aria-checked={policy.enabled}
                  onClick={() => {
                    onTogglePolicy(policy.id);
                    onShowToast(
                      lang === 'vi' ? 'Cập nhật chính sách' : 'Policy Updated',
                      `${policy.title} ${policy.enabled ? (lang === 'vi' ? 'đã tắt' : 'disabled') : (lang === 'vi' ? 'đã bật' : 'enabled')}.`,
                      'info'
                    );
                  }}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    policy.enabled ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      policy.enabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {policy.description}
              </p>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 font-mono text-[11px] text-slate-700">
                <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                  {lang === 'vi' ? 'Điều kiện thực thi' : 'Enforcement Logic'}
                </div>
                {policy.ruleStatement}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Policy Sandbox / Simulator */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-5 md:p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t.policies.simulatorTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {t.policies.simulatorSubtitle}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2.5 py-1 rounded border border-blue-200">
            {t.policies.realtimeTestBadge}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Simulation Inputs */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label className="block font-bold text-slate-700 mb-1">{t.policies.simActorRole}</label>
              <select
                value={simRole}
                onChange={(e) => setSimRole(e.target.value as UserRole)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-medium"
              >
                <option value="Procurement Specialist">
                  {lang === 'vi' ? 'Chuyên viên Mua hàng (Maker)' : 'Procurement Specialist (Maker)'}
                </option>
                <option value="Operations Manager">
                  {lang === 'vi' ? 'Quản lý Vận hành (Checker)' : 'Operations Manager (Checker)'}
                </option>
                <option value="Finance Approver">
                  {lang === 'vi' ? 'Người duyệt Tài chính (Treasury)' : 'Finance Approver (Treasury)'}
                </option>
                <option value="Compliance Admin">
                  {lang === 'vi' ? 'Quản trị viên Tuân thủ (Audit)' : 'Compliance Admin (Audit)'}
                </option>
                <option value="AI Agent">
                  {lang === 'vi' ? 'Đại lý AI Tự Trị (Autonomous LLM)' : 'AI Agent (Autonomous LLM)'}
                </option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">{t.policies.simIsOwner}</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSimIsOwner(true)}
                  className={`flex-1 py-1.5 rounded-lg border font-semibold ${
                    simIsOwner ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  {lang === 'vi' ? 'Có (Chính chủ)' : 'Yes (Maker)'}
                </button>
                <button
                  type="button"
                  onClick={() => setSimIsOwner(false)}
                  className={`flex-1 py-1.5 rounded-lg border font-semibold ${
                    !simIsOwner ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  {lang === 'vi' ? 'Không (Độc lập)' : 'No (Independent)'}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">{t.policies.simAction}</label>
              <select
                value={simAction}
                onChange={(e) => setSimAction(e.target.value as any)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-medium"
              >
                <option value="Approve">{lang === 'vi' ? 'Phê duyệt chứng từ' : 'Approve Document'}</option>
                <option value="Sign">{lang === 'vi' ? 'Thực hiện Ký duyệt bảo vệ' : 'Request Protected Signing'}</option>
                <option value="Disburse">{lang === 'vi' ? 'Giải ngân thanh toán' : 'Disburse Payment'}</option>
              </select>
            </div>
          </div>

          {/* Document Properties */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label className="block font-bold text-slate-700 mb-1">{t.policies.simAmount}</label>
              <input
                type="number"
                value={simAmount}
                onChange={(e) => setSimAmount(Number(e.target.value))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-mono font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                {lang === 'vi' ? 'Giá trị ≥ $10,000 kích hoạt quy tắc 2 người duyệt' : 'Values ≥ $10,000 trigger dual-control policy'}
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">{t.policies.simDiscrepancy}</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSimHasDiscrepancy(false)}
                  className={`flex-1 py-1.5 rounded-lg border font-semibold ${
                    !simHasDiscrepancy ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  {lang === 'vi' ? 'Khớp hoàn toàn' : 'Clean Parity'}
                </button>
                <button
                  type="button"
                  onClick={() => setSimHasDiscrepancy(true)}
                  className={`flex-1 py-1.5 rounded-lg border font-semibold ${
                    simHasDiscrepancy ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  {lang === 'vi' ? 'Lệch (+20 pcs)' : 'Mismatch (+20 pcs)'}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">{t.policies.simTamper}</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSimIsTampered(false)}
                  className={`flex-1 py-1.5 rounded-lg border font-semibold ${
                    !simIsTampered ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  {lang === 'vi' ? 'Nguyên bản SHA-256' : 'Intact SHA-256'}
                </button>
                <button
                  type="button"
                  onClick={() => setSimIsTampered(true)}
                  className={`flex-1 py-1.5 rounded-lg border font-semibold ${
                    simIsTampered ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  {lang === 'vi' ? 'Đã bị can thiệp' : 'Tampered Post-Edit'}
                </button>
              </div>
            </div>
          </div>

          {/* Engine Live Verdict Output */}
          <div className="p-4 bg-slate-900 text-white rounded-xl flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                {lang === 'vi' ? 'Phán Quyết Thực Thi Của Policy Engine' : 'Policy Engine Execution Verdict'}
              </div>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-3 ${
                simResult.allowed 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}>
                {simResult.allowed ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t.policies.simPermitted}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{t.policies.simBlocked}</span>
                  </>
                )}
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-300">
                {simResult.reasons.length > 0 ? (
                  simResult.reasons.map((r, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold shrink-0">›</span>
                      <span>{r}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-emerald-300">
                    {lang === 'vi' 
                      ? 'Tất cả điều kiện an toàn đều được thỏa mãn. Người dùng có thẩm quyền thực hiện.'
                      : 'All compliance invariants satisfied. Actor has delegated operational authority.'}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-400 font-mono">
              CargoTrust Policy Gatekeeper
            </div>
          </div>
        </div>
      </div>

      {/* Role & Capability Matrix */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">{t.policies.matrixTitle}</h3>
          <p className="text-xs text-slate-500">{t.policies.matrixSubtitle}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase border-b border-slate-200">
                <th className="py-2.5 px-4">{lang === 'vi' ? 'Quyền hạn / Thao tác' : 'Capability / Operation'}</th>
                <th className="py-2.5 px-3">{lang === 'vi' ? 'Mua hàng (Maker)' : 'Procurement (Maker)'}</th>
                <th className="py-2.5 px-3">{lang === 'vi' ? 'QL Vận hành (Checker)' : 'Operations Mgr'}</th>
                <th className="py-2.5 px-3">{lang === 'vi' ? 'Người duyệt Tài chính' : 'Finance Approver'}</th>
                <th className="py-2.5 px-3">{lang === 'vi' ? 'Quản trị Tuân thủ' : 'Compliance Admin'}</th>
                <th className="py-2.5 px-3 text-purple-700">CargoTrust AI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-800">{t.policies.capUpload}</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">{lang === 'vi' ? 'Cho phép' : 'Allowed'}</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">{lang === 'vi' ? 'Cho phép' : 'Allowed'}</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">{lang === 'vi' ? 'Cho phép' : 'Allowed'}</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">{lang === 'vi' ? 'Cho phép' : 'Allowed'}</td>
                <td className="py-2.5 px-3 text-purple-700 font-bold">{lang === 'vi' ? 'Tự động hóa' : 'Automated'}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-800">{t.policies.capThreeWay}</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">{lang === 'vi' ? 'Xem' : 'View'}</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">{lang === 'vi' ? 'Xem' : 'View'}</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">{lang === 'vi' ? 'Xem' : 'View'}</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">{lang === 'vi' ? 'Xem' : 'View'}</td>
                <td className="py-2.5 px-3 text-purple-700 font-bold">{lang === 'vi' ? 'Engine chính' : 'Primary Engine'}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-800">{t.policies.capSelfApprove}</td>
                <td className="py-2.5 px-3 text-rose-700 font-bold">{lang === 'vi' ? 'Bị chặn' : 'Blocked'}</td>
                <td className="py-2.5 px-3 text-rose-700 font-bold">{lang === 'vi' ? 'Bị chặn' : 'Blocked'}</td>
                <td className="py-2.5 px-3 text-rose-700 font-bold">{lang === 'vi' ? 'Bị chặn' : 'Blocked'}</td>
                <td className="py-2.5 px-3 text-rose-700 font-bold">{lang === 'vi' ? 'Bị chặn' : 'Blocked'}</td>
                <td className="py-2.5 px-3 text-rose-700 font-bold">{lang === 'vi' ? 'Bị chặn' : 'Blocked'}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-800">{t.policies.capPeerApprove}</td>
                <td className="py-2.5 px-3 text-slate-400">{lang === 'vi' ? 'Giới hạn' : 'Limited'}</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">{lang === 'vi' ? 'Vận hành' : 'Operational'}</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">{lang === 'vi' ? 'Tài chính' : 'Financial'}</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">{lang === 'vi' ? 'Biểu quyết' : 'Quorum'}</td>
                <td className="py-2.5 px-3 text-rose-700 font-bold">{lang === 'vi' ? 'Nghiêm cấm' : 'Strictly Barred'}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-800">{t.policies.capSign}</td>
                <td className="py-2.5 px-3 text-rose-700 font-bold">{lang === 'vi' ? 'Nghiêm cấm' : 'Barred'}</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">{lang === 'vi' ? 'Theo Quorum' : 'With Quorum'}</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">{lang === 'vi' ? 'Theo Quorum' : 'With Quorum'}</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">{lang === 'vi' ? 'Biểu quyết' : 'Quorum'}</td>
                <td className="py-2.5 px-3 text-rose-700 font-bold">{lang === 'vi' ? 'Nghiêm cấm' : 'Strictly Barred'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
