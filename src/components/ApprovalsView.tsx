import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck
} from 'lucide-react';
import { ApprovalRecord, DocumentRecord, UserSession, PolicyRule } from '../types';
import { formatCurrency, evaluateApprovalPolicy } from '../utils/policyEngine';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface ApprovalsViewProps {
  approvals: ApprovalRecord[];
  documents: DocumentRecord[];
  currentUser: UserSession;
  policies: PolicyRule[];
  lang: Language;
  onOpenDoc: (docId: string) => void;
  onUpdateApproval: (approval: ApprovalRecord) => void;
  onUpdateDocument: (doc: DocumentRecord) => void;
  onAddAuditLog: (event: string, detail: string, result: 'Success' | 'Exception flagged' | 'Blocked by policy', tone: 'green' | 'red' | 'amber') => void;
  onShowToast: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
}

export const ApprovalsView: React.FC<ApprovalsViewProps> = ({
  approvals,
  documents,
  currentUser,
  policies,
  lang,
  onOpenDoc,
  onUpdateApproval,
  onUpdateDocument,
  onAddAuditLog,
  onShowToast
}) => {
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRecord | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const t = TRANSLATIONS[lang];

  const handleOpenReviewModal = (approval: ApprovalRecord) => {
    setSelectedApproval(approval);
    setReviewNote('');
  };

  const handleApprove = (approval: ApprovalRecord) => {
    const doc = documents.find(d => d.id === approval.docId);
    if (!doc) return;

    const policyEval = evaluateApprovalPolicy(policies, currentUser, doc, approval);

    if (!policyEval.allowed) {
      onShowToast(
        lang === 'vi' ? 'Phê duyệt bị chặn bởi chính sách' : 'Approval Blocked by Policy',
        policyEval.reasons[0] || (lang === 'vi' ? 'Hành động không hợp lệ.' : 'Unauthorized action.'),
        'error'
      );
      onAddAuditLog(
        'Approval Attempt Blocked',
        `${currentUser.name} (${currentUser.role}) attempted to approve ${approval.title}. Violation: ${policyEval.reasons.join('; ')}`,
        'Blocked by policy',
        'amber'
      );
      return;
    }

    const alreadyApproved = approval.approvers.some(a => a.userId === currentUser.id);
    if (alreadyApproved) {
      onShowToast(
        lang === 'vi' ? 'Đã phê duyệt trước đó' : 'Duplicate Approval',
        lang === 'vi' ? 'Bạn đã ghi nhận phê duyệt cho yêu cầu này rồi.' : 'You have already recorded your approval on this request.',
        'info'
      );
      return;
    }

    const nextApprovals = approval.receivedApprovals + 1;
    const isQuorumReached = nextApprovals >= approval.requiredApprovals;

    const updatedApproval: ApprovalRecord = {
      ...approval,
      receivedApprovals: nextApprovals,
      status: isQuorumReached ? 'Approved' : 'Pending',
      approvers: [
        ...approval.approvers,
        {
          userId: currentUser.id,
          userName: currentUser.name,
          role: currentUser.role,
          timestamp: new Date().toLocaleString('en-GB'),
          note: reviewNote || (lang === 'vi' ? 'Đã phê duyệt theo thẩm quyền vận hành được ủy quyền.' : 'Approved under delegated operational authority.')
        }
      ]
    };

    onUpdateApproval(updatedApproval);

    if (isQuorumReached) {
      const updatedDoc: DocumentRecord = {
        ...doc,
        status: 'Authorized',
        events: [
          ...doc.events,
          {
            id: `ev-${Date.now()}`,
            timestamp: new Date().toLocaleString('en-GB'),
            actor: currentUser.name,
            role: currentUser.role,
            event: 'Full Approval Quorum Reached',
            details: `Threshold met (${nextApprovals}/${approval.requiredApprovals} approvals). Document authorized for execution/signing.`,
            tone: 'green'
          }
        ]
      };
      onUpdateDocument(updatedDoc);
    }

    onShowToast(
      isQuorumReached 
        ? (lang === 'vi' ? 'Đạt đủ điều kiện & Đã cấp thẩm quyền' : 'Quorum Completed & Authorized') 
        : (lang === 'vi' ? 'Đã ghi nhận phê duyệt' : 'Approval Recorded'),
      lang === 'vi' 
        ? `Phê duyệt được ghi nhận bởi ${currentUser.name}. (${nextApprovals}/${approval.requiredApprovals} hoàn tất).`
        : `Approval recorded by ${currentUser.name}. (${nextApprovals}/${approval.requiredApprovals} complete).`,
      'success'
    );

    onAddAuditLog(
      isQuorumReached ? 'Quorum Reached' : 'Approval Recorded',
      `${approval.title} approved by ${currentUser.name} (${currentUser.role}). Progress: ${nextApprovals}/${approval.requiredApprovals}. Note: ${reviewNote || 'None'}`,
      'Success',
      'green'
    );

    setSelectedApproval(null);
  };

  const handleRequestChanges = (approval: ApprovalRecord) => {
    const doc = documents.find(d => d.id === approval.docId);

    const updatedApproval: ApprovalRecord = {
      ...approval,
      status: 'Rejected'
    };
    onUpdateApproval(updatedApproval);

    if (doc) {
      const updatedDoc: DocumentRecord = {
        ...doc,
        status: 'Needs Review',
        events: [
          ...doc.events,
          {
            id: `ev-${Date.now()}`,
            timestamp: new Date().toLocaleString('en-GB'),
            actor: currentUser.name,
            role: currentUser.role,
            event: 'Revisions Requested',
            details: `Returned by ${currentUser.name}. Note: ${reviewNote || 'Supplier must adjust line items.'}`,
            tone: 'red'
          }
        ]
      };
      onUpdateDocument(updatedDoc);
    }

    onShowToast(
      lang === 'vi' ? 'Đã yêu cầu chỉnh sửa' : 'Revisions Requested',
      lang === 'vi' ? `Yêu cầu ${approval.id} đã được trả về để điều chỉnh.` : `Request ${approval.id} returned for correction.`,
      'error'
    );

    onAddAuditLog(
      'Approval Rejected',
      `${approval.title} returned for changes by ${currentUser.name}. Reason: ${reviewNote || 'Specification revision required.'}`,
      'Exception flagged',
      'red'
    );

    setSelectedApproval(null);
  };

  return (
    <div className="space-y-6">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t.approvals.pageTitle}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.approvals.pageSubtitle}
          </p>
        </div>

        <div className="text-xs text-slate-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-700" />
          <span>{t.common.activePersona}: <strong>{currentUser.name}</strong> ({currentUser.role})</span>
        </div>
      </div>

      {/* Approvals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {approvals.map((req) => {
          const doc = documents.find(d => d.id === req.docId);
          const policyEval = doc ? evaluateApprovalPolicy(policies, currentUser, doc, req) : { allowed: true, reasons: [] };

          return (
            <div key={req.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {req.kind}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1.5">{req.title}</h3>
                    <div className="text-xs text-slate-500">{req.counterparty} · Ref: {req.id}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-slate-900 text-sm">
                      {formatCurrency(req.amount, req.currency)}
                    </div>
                    <div className="text-[10px] text-slate-400">{t.approvals.targetValue}</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-600 mb-4 leading-relaxed">
                  <div className="font-semibold text-slate-800 mb-0.5">{t.approvals.auditNote}</div>
                  {req.reason}
                </div>

                {/* Quorum and approvers list */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">{t.approvals.quorumProgress}</span>
                    <span className="font-bold text-slate-800">
                      {req.receivedApprovals} / {req.requiredApprovals} {lang === 'vi' ? 'người duyệt' : 'approvers'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${(req.receivedApprovals / req.requiredApprovals) * 100}%` }}
                    />
                  </div>

                  {req.approvers.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-2">
                      {req.approvers.map((a, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{a.userName} ({a.role})</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Policy preview badge */}
                {!policyEval.allowed && (
                  <div className="p-2 mb-3 bg-rose-50 border border-rose-200 rounded text-[11px] text-rose-800 flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span>
                      {lang === 'vi' ? 'Vai trò hiện tại không thể phê duyệt:' : 'Current persona cannot approve:'} {policyEval.reasons[0]}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenDoc(req.docId)}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {t.approvals.inspectSource}
                </button>
                <button
                  onClick={() => handleOpenReviewModal(req)}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
                >
                  {t.approvals.reviewDecide}
                </button>
              </div>
            </div>
          );
        })}

        {approvals.length === 0 && (
          <div className="col-span-2 py-16 text-center bg-white border border-slate-200 rounded-xl">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800">
              {lang === 'vi' ? 'Tất cả phê duyệt đã hoàn tất' : 'All Approvals Clear'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {lang === 'vi' ? 'Không còn chứng từ nào đang chờ phê duyệt.' : 'There are no pending documents waiting for decision.'}
            </p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedApproval && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/60">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {selectedApproval.kind}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">
                  {t.approvals.modalTitle} {selectedApproval.title}
                </h3>
                <div className="text-xs text-slate-500">
                  {selectedApproval.counterparty} · {lang === 'vi' ? 'Giá trị:' : 'Value:'} {formatCurrency(selectedApproval.amount, selectedApproval.currency)}
                </div>
              </div>
              <button
                onClick={() => setSelectedApproval(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1"
                aria-label={t.common.close}
              >
                ×
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-semibold text-slate-800">{t.approvals.submissionDetails}</div>
                <div className="text-slate-600">{selectedApproval.reason}</div>
                <div className="text-[11px] text-slate-500 pt-1">
                  {lang === 'vi' ? 'Người yêu cầu:' : 'Requester:'} <strong className="text-slate-700">{selectedApproval.requesterName}</strong> · {lang === 'vi' ? 'Thời gian:' : 'Submitted:'} {selectedApproval.submittedDate}
                </div>
              </div>

              {/* Policy Engine Evaluation Banner */}
              {(() => {
                const doc = documents.find(d => d.id === selectedApproval.docId);
                const evalRes = doc ? evaluateApprovalPolicy(policies, currentUser, doc, selectedApproval) : { allowed: true, reasons: [] };

                return (
                  <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                    evalRes.allowed 
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' 
                      : 'bg-rose-50/80 border-rose-200 text-rose-900'
                  }`}>
                    {evalRes.allowed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-bold">
                        {evalRes.allowed 
                          ? (lang === 'vi' ? 'Kiểm tra thẩm quyền: HỢP LỆ' : 'Authorized Approver Check: PASSED')
                          : (lang === 'vi' ? 'Chính Sách Khóa Phê Duyệt' : 'Authorization Policy Block')}
                      </div>
                      <div className="text-[11px] mt-0.5">
                        {evalRes.allowed
                          ? (lang === 'vi'
                              ? `Người dùng hiện tại (${currentUser.name} - ${currentUser.role}) có đủ thẩm quyền độc lập để phê duyệt chứng từ này.`
                              : `Current persona (${currentUser.name} - ${currentUser.role}) has valid independent authority to sign off on this item.`)
                          : evalRes.reasons.join(' ')}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Reviewer Note Input */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t.approvals.decisionNotes}
                </label>
                <textarea
                  rows={3}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder={t.approvals.decisionPlaceholder}
                  className="w-full p-2.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedApproval(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors"
              >
                {t.common.cancel}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRequestChanges(selectedApproval)}
                  className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
                >
                  {t.approvals.requestChangesBtn}
                </button>
                <button
                  onClick={() => handleApprove(selectedApproval)}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
                >
                  {t.approvals.recordApprovalBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
