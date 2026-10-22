import React, { useState, useEffect } from 'react';
import { 
  INITIAL_DOCUMENTS, 
  INITIAL_APPROVALS, 
  INITIAL_POLICIES, 
  INITIAL_COUNTERPARTIES, 
  INITIAL_AUDIT_LOG, 
  USERS 
} from './data/initialData';
import { INITIAL_ORDERS } from './data/initialOrders';
import { 
  DocumentRecord, 
  ApprovalRecord, 
  PolicyRule, 
  Counterparty, 
  AuditLogEntry, 
  UserSession,
  OrderRecord
} from './types';
import { Language, TRANSLATIONS } from './i18n/translations';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Overview } from './components/Overview';
import { OrdersView } from './components/OrdersView';
import { OrderWorkspaceView } from './components/OrderWorkspaceView';
import { ShipmentsView } from './components/ShipmentsView';
import { DocumentsView } from './components/DocumentsView';
import { ApprovalsView } from './components/ApprovalsView';
import { PoliciesView } from './components/PoliciesView';
import { CounterpartiesView } from './components/CounterpartiesView';
import { AuditTrailView } from './components/AuditTrailView';
import { DocumentInspectorDrawer } from './components/DocumentInspectorDrawer';
import { UploadDocumentModal } from './components/UploadDocumentModal';
import { TideIntegrationModal } from './components/TideIntegrationModal';
import { InstructionModal } from './components/InstructionModal';
import { DemoScenariosModal } from './components/DemoScenariosModal';
import { ArchitectureFlowsModal } from './components/ArchitectureFlowsModal';
import { EvidenceExchange } from './components/EvidenceExchange';
import { SubmissionKitModal } from './components/SubmissionKitModal';
import { TideSecurityCenter } from './components/TideSecurityCenter';
import { TideCloakAuthModal } from './components/TideCloakAuthModal';
import { HackathonPersona } from './types';
import { HACKATHON_PERSONAS } from './utils/quorumEngine';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function App() {
  // Language State - Defaults to 'vi' (Tiếng Việt)
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('cargotrust_lang');
      return (saved === 'vi' || saved === 'en') ? saved : 'vi';
    } catch {
      return 'vi';
    }
  });

  const [currentPage, setCurrentPage] = useState<string>('overview');
  const [currentUser, setCurrentUser] = useState<UserSession>(USERS.sarah); // Default to Operations Manager
  
  // Core Domain State
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [workspaceInitialTab, setWorkspaceInitialTab] = useState<string | undefined>(undefined);

  const [documents, setDocuments] = useState<DocumentRecord[]>(INITIAL_DOCUMENTS);
  const [approvals, setApprovals] = useState<ApprovalRecord[]>(INITIAL_APPROVALS);
  const [policies, setPolicies] = useState<PolicyRule[]>(INITIAL_POLICIES);
  const [counterparties, setCounterparties] = useState<Counterparty[]>(INITIAL_COUNTERPARTIES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOG);

  // Modals & Drawers
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isTideModalOpen, setIsTideModalOpen] = useState(false);
  const [isTideAuthModalOpen, setIsTideAuthModalOpen] = useState(false);
  const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(false);
  const [isScenariosModalOpen, setIsScenariosModalOpen] = useState(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);
  const [isSubmissionKitOpen, setIsSubmissionKitOpen] = useState(false);
  const [hackathonPersona, setHackathonPersona] = useState<HackathonPersona>(HACKATHON_PERSONAS['supplier-admin']);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toast Queue
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const handleToggleLanguage = (newLang: Language) => {
    setLang(newLang);
    try {
      localStorage.setItem('cargotrust_lang', newLang);
    } catch {
      // Ignore storage errors in sandboxed iframes
    }
    showToast(
      newLang === 'vi' ? 'Đã đổi ngôn ngữ' : 'Language Changed',
      newLang === 'vi' ? 'Giao diện đã chuyển sang Tiếng Việt (Mặc định).' : 'Interface switched to English.',
      'info'
    );
  };

  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, title, message, type };
    setToasts(prev => [newToast, ...prev].slice(0, 4));

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addAuditLog = (
    event: string, 
    detail: string, 
    result: 'Success' | 'Exception flagged' | 'Blocked by policy' | 'Signed', 
    tone: 'green' | 'red' | 'amber' = 'green'
  ) => {
    const newEntry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      actor: currentUser.name,
      role: currentUser.role,
      event,
      detail,
      result,
      tone,
      proofHash: `0x${Math.random().toString(16).slice(2, 6)}…${Math.random().toString(16).slice(2, 6)}`
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  // Order Operations
  const handleSelectOrder = (orderId: string, tab?: string) => {
    setSelectedOrderId(orderId);
    setWorkspaceInitialTab(tab || 'overview');
    setCurrentPage('order-detail');
  };

  const handleBackFromWorkspace = () => {
    setCurrentPage('orders');
    setSelectedOrderId(null);
  };

  const handleUpdateOrder = (updatedOrder: OrderRecord) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };

  const handleLaunchDemoScenario = (orderId: string, tab: string = 'ai-review') => {
    setSelectedOrderId(orderId);
    setWorkspaceInitialTab(tab);
    setCurrentPage('order-detail');
    showToast(
      lang === 'vi' ? 'Đã tải kịch bản RMIT Demo' : 'Demo Scenario Loaded',
      lang === 'vi' ? 'Đang mở không gian đơn hàng ORD-2026-001 tại tab AI Đối Chiếu Chéo.' : 'Opening ORD-2026-001 Workspace at AI Cross-Review tab.',
      'info'
    );
  };

  // Document Operations
  const handleUpdateDocument = (updatedDoc: DocumentRecord) => {
    setDocuments(prev => prev.map(d => d.id === updatedDoc.id ? updatedDoc : d));
  };

  const handleUploadSuccess = (newDoc: DocumentRecord) => {
    setDocuments(prev => [newDoc, ...prev]);
    addAuditLog(
      lang === 'vi' ? 'Tiếp nhận chứng từ hoàn tất' : 'Document Ingestion Complete',
      `${newDoc.name} (${newDoc.id}) ingested and fingerprinted.`,
      'Success',
      'green'
    );
  };

  // Approval Operations
  const handleUpdateApproval = (updatedApproval: ApprovalRecord) => {
    setApprovals(prev => prev.map(a => a.id === updatedApproval.id ? updatedApproval : a));
  };

  // Policy Operations
  const handleTogglePolicy = (policyId: string) => {
    setPolicies(prev => prev.map(p => p.id === policyId ? { ...p, enabled: !p.enabled } : p));
    addAuditLog(
      lang === 'vi' ? 'Thay đổi trạng thái chính sách' : 'Policy Setting Toggled',
      `Policy rule ID ${policyId} state toggled by ${currentUser.name}.`,
      'Success',
      'blue' as any
    );
  };

  const handleResetPolicies = () => {
    setPolicies(INITIAL_POLICIES);
    showToast(
      lang === 'vi' ? 'Đã đặt lại chính sách' : 'Policies Reset',
      lang === 'vi' ? 'Đã khôi phục các chính sách quản trị mặc định.' : 'Default workspace governance policies restored.',
      'success'
    );
  };

  // Counterparty Operations
  const handleAddCounterparty = (newCp: Counterparty) => {
    setCounterparties(prev => [newCp, ...prev]);
    addAuditLog(
      lang === 'vi' ? 'Đăng ký đối tác thành công' : 'Counterparty Registered',
      `${newCp.name} (${newCp.code}) added to trading register.`,
      'Success',
      'green'
    );
  };

  // Demo Scenarios Operations
  const handleSimulateTamper = (docId: string, isTampered: boolean) => {
    setDocuments(prev => prev.map(d => {
      if (d.id === docId) {
        return {
          ...d,
          isTampered,
          fileHash: isTampered 
            ? 'sha256: 00000000_TAMPERED_HASH_BREACH_9999' 
            : 'sha256: 6f8a3d9021e8b2d1c7a45691024e',
          status: isTampered ? 'Needs Review' : 'Validation Passed'
        };
      }
      return d;
    }));

    if (isTampered) {
      addAuditLog(
        lang === 'vi' ? 'Cảnh báo tính toàn vẹn: File bị can thiệp' : 'Integrity Alert: File Tampered',
        `Document ${docId} SHA-256 fingerprint mismatch. Signatures revoked by Gatekeeper.`,
        'Exception flagged',
        'red'
      );
    } else {
      addAuditLog(
        lang === 'vi' ? 'Khôi phục tính toàn vẹn mật mã' : 'Cryptographic Integrity Restored',
        `Document ${docId} verified against original root hash.`,
        'Success',
        'green'
      );
    }
  };

  const handleSimulateUploadMissingDocs = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          completeness: 'Đầy đủ',
          completenessCount: { current: 6, total: 6 },
          consistency: 'Khớp dữ liệu',
          checklist: o.checklist.map(item => ({
            ...item,
            uploadStatus: 'Đã tải lên' as const,
            aiReviewStatus: 'Đã kiểm tra' as const,
            approvalStatus: 'Đã phê duyệt' as const,
            signingStatus: (item.docType === 'Sales Contract' || item.docType === 'Bill of Lading') ? ('Đã ký' as const) : ('Không yêu cầu' as const),
            docId: item.docId || (item.docType === 'Packing List' ? 'DOC-PL-004' : item.docType === 'Bill of Lading' ? 'DOC-BL-004' : 'DOC-CO-004'),
            docRef: item.docRef || (item.docType === 'Packing List' ? 'PL-APEX-004' : item.docType === 'Bill of Lading' ? 'BL-APEX-004' : 'CO-CN-004')
          }))
        };
      }
      return o;
    }));
  };

  // Safe Document Resolver: Ensures clicking "Xem file" on Purchase Order or any doc NEVER fails
  const activeDoc = React.useMemo(() => {
    if (!selectedDocId) return null;
    const found = documents.find(d => 
      d.id === selectedDocId || 
      d.referenceNumber === selectedDocId ||
      d.id.toLowerCase() === selectedDocId.toLowerCase()
    );
    if (found) return found;

    // Fallback document so clicking "Xem file" always renders beautifully
    const isPO = selectedDocId.includes('PO') || selectedDocId.includes('1182') || selectedDocId.includes('1168');
    const isInv = selectedDocId.includes('INV') || selectedDocId.includes('2408') || selectedDocId.includes('2391');
    const isBL = selectedDocId.includes('BL');
    const isPL = selectedDocId.includes('PL');
    const isContract = selectedDocId.includes('SC') || selectedDocId.includes('CTR');

    return {
      id: selectedDocId,
      name: `${selectedDocId.replace('DOC-', '')}_Official_Document.pdf`,
      type: isPO ? 'Purchase Order' : isInv ? 'Commercial Invoice' : isBL ? 'Bill of Lading' : isPL ? 'Packing List' : isContract ? 'Sales Contract' : 'Commercial Document',
      fileExt: 'PDF',
      referenceNumber: selectedDocId,
      counterparty: 'Seoul Electronics Ltd.',
      updatedDate: '22 Oct 2026, 10:00',
      amount: 18420.00,
      currency: 'USD',
      status: 'Validation Passed',
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      version: '1.0',
      fileHash: 'sha256: 7f83b1657ff1fc53b92dc18148a1d65d',
      isTampered: false,
      description: 'Chính sách CargoTrust xác nhận tính hợp thức của chứng từ được đối chiếu trên chuỗi.',
      lineItems: [
        {
          id: `li-${selectedDocId}-1`,
          itemCode: 'MCU-ARM-M4-168',
          description: 'ARM Cortex-M4 32-bit MCU 168MHz LQFP-100',
          poQuantity: 220,
          invoiceQuantity: 220,
          unitPrice: 76.75,
          currency: 'USD',
          unit: 'pcs',
          lineTotal: 16885.00,
          varianceStatus: 'matched'
        }
      ],
      events: [
        {
          id: `ev-${selectedDocId}-1`,
          timestamp: '22 Oct 2026, 09:30',
          actor: currentUser.name,
          role: currentUser.role,
          event: 'Tiếp nhận & gắn dấu vết mật mã',
          details: 'Chứng từ được gắn mã băm SHA-256 an toàn.',
          tone: 'green'
        }
      ],
      metadata: {
        originCountry: 'South Korea',
        destinationCountry: 'Hai Phong, Vietnam',
        incoterms: 'CIF Hai Phong',
        paymentTerms: 'L/C at sight, 30 days'
      }
    } as DocumentRecord;
  }, [selectedDocId, documents, currentUser]);

  const existingPos = documents.filter(d => d.type === 'Purchase Order');
  const activeOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onPageChange={(page) => {
          if (page !== 'order-detail') {
            setSelectedOrderId(null);
          }
          setCurrentPage(page);
        }}
        orderCount={orders.length}
        documentCount={documents.length}
        approvalCount={approvals.filter(a => a.status === 'Pending').length}
        currentUser={currentUser}
        lang={lang}
        onOpenTideModal={() => setIsTideModalOpen(true)}
        onOpenInstruction={() => setIsInstructionModalOpen(true)}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          currentPage={currentPage}
          currentUser={currentUser}
          lang={lang}
          onSwitchUser={(user) => {
            setCurrentUser(user);
            showToast(
              lang === 'vi' ? 'Đã đổi vai trò demo' : 'Demo Persona Switched',
              `${lang === 'vi' ? 'Người dùng hiện tại' : 'Active User'}: ${user.name} (${user.role})`,
              'info'
            );
          }}
          onToggleLanguage={handleToggleLanguage}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenNotifications={() => setCurrentPage('approvals')}
          onOpenInstruction={() => setIsInstructionModalOpen(true)}
          onOpenTideAuthModal={() => setIsTideAuthModalOpen(true)}
          onNavigateHome={() => {
            setSelectedOrderId(null);
            setCurrentPage('overview');
          }}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          pendingApprovalsCount={approvals.filter(a => a.status === 'Pending').length}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* OVERVIEW */}
          {currentPage === 'overview' && (
            <Overview
              documents={documents}
              approvals={approvals}
              auditLogs={auditLogs}
              currentUser={currentUser}
              orders={orders}
              lang={lang}
              onOpenDoc={setSelectedDocId}
              onOpenApproval={() => setCurrentPage('approvals')}
              onNavigate={setCurrentPage}
              onOpenUpload={() => setIsUploadOpen(true)}
              onSelectOrder={handleSelectOrder}
              onOpenInstruction={() => setIsInstructionModalOpen(true)}
            />
          )}

          {/* SEMICONDUCTOR EVIDENCE EXCHANGE (FLAGSHIP TIDE UNLOCKED DEMO) */}
          {currentPage === 'evidence' && (
            <EvidenceExchange
              currentPersona={hackathonPersona}
              onSwitchPersona={(pId) => {
                setHackathonPersona(HACKATHON_PERSONAS[pId]);
                showToast(
                  lang === 'vi' ? 'Đã đổi góc nhìn kiểm thử' : 'Persona Switched',
                  `${HACKATHON_PERSONAS[pId].name} (${HACKATHON_PERSONAS[pId].roleTitle})`,
                  'info'
                );
              }}
              lang={lang}
              onOpenSubmissionKit={() => setIsSubmissionKitOpen(true)}
              onOpenDemoScenarios={() => setIsScenariosModalOpen(true)}
            />
          )}

          {/* ORDERS LIST */}
          {currentPage === 'orders' && (
            <OrdersView
              orders={orders}
              lang={lang}
              onSelectOrder={handleSelectOrder}
              onOpenInstruction={() => setIsInstructionModalOpen(true)}
              onShowToast={showToast}
            />
          )}

          {/* ORDER WORKSPACE DETAIL */}
          {currentPage === 'order-detail' && activeOrder && (
            <OrderWorkspaceView
              order={activeOrder}
              allDocuments={documents}
              allApprovals={approvals}
              allAuditLogs={auditLogs}
              currentUser={currentUser}
              policies={policies}
              lang={lang}
              onBack={handleBackFromWorkspace}
              onOpenDoc={setSelectedDocId}
              onUpdateOrder={handleUpdateOrder}
              onUpdateApproval={handleUpdateApproval}
              onAddAuditLog={addAuditLog}
              onShowToast={showToast}
              initialTab={workspaceInitialTab}
            />
          )}

          {/* SHIPMENTS */}
          {currentPage === 'shipments' && (
            <ShipmentsView
              orders={orders}
              lang={lang}
              onSelectOrder={handleSelectOrder}
              onShowToast={showToast}
            />
          )}

          {/* GLOBAL DOCUMENTS REPOSITORY */}
          {currentPage === 'documents' && (
            <DocumentsView
              documents={documents}
              lang={lang}
              onOpenDoc={setSelectedDocId}
              onOpenUpload={() => setIsUploadOpen(true)}
              onShowToast={showToast}
            />
          )}

          {/* APPROVALS */}
          {currentPage === 'approvals' && (
            <ApprovalsView
              approvals={approvals}
              documents={documents}
              currentUser={currentUser}
              policies={policies}
              lang={lang}
              onOpenDoc={setSelectedDocId}
              onUpdateApproval={handleUpdateApproval}
              onUpdateDocument={handleUpdateDocument}
              onAddAuditLog={addAuditLog}
              onShowToast={showToast}
            />
          )}

          {/* POLICIES */}
          {currentPage === 'policies' && (
            <PoliciesView
              policies={policies}
              lang={lang}
              onTogglePolicy={handleTogglePolicy}
              onResetPolicies={handleResetPolicies}
              onShowToast={showToast}
            />
          )}

          {/* COUNTERPARTIES */}
          {currentPage === 'counterparties' && (
            <CounterpartiesView
              counterparties={counterparties}
              lang={lang}
              onAddCounterparty={handleAddCounterparty}
              onShowToast={showToast}
            />
          )}

          {/* AUDIT TRAIL */}
          {currentPage === 'audit' && (
            <AuditTrailView
              auditLogs={auditLogs}
              lang={lang}
              onShowToast={showToast}
            />
          )}

          {/* TIDECLOAK DISTRIBUTED SECURITY CENTER (INTEGRATED FIRST-CLASS FEATURE) */}
          {currentPage === 'tide-security' && (
            <TideSecurityCenter
              lang={lang}
              onNavigate={setCurrentPage}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Slide-over Document Inspector Drawer */}
      {selectedDocId && (
        <DocumentInspectorDrawer
          document={activeDoc}
          allDocuments={documents}
          currentUser={currentUser}
          policies={policies}
          lang={lang}
          onClose={() => setSelectedDocId(null)}
          onUpdateDocument={handleUpdateDocument}
          onAddAuditLog={addAuditLog}
          onShowToast={showToast}
        />
      )}

      {/* Upload Document Modal */}
      {isUploadOpen && (
        <UploadDocumentModal
          counterparties={counterparties}
          existingPos={existingPos}
          currentUser={currentUser}
          lang={lang}
          onClose={() => setIsUploadOpen(false)}
          onUploadSuccess={handleUploadSuccess}
          onShowToast={showToast}
        />
      )}

      {/* Architecture & Tide Integration Modal */}
      {isTideModalOpen && (
        <TideIntegrationModal
          lang={lang}
          onClose={() => setIsTideModalOpen(false)}
          onShowToast={showToast}
        />
      )}

      {/* TideCloak Sign-in, Roles & Access Checks Simulator Modal */}
      <TideCloakAuthModal
        isOpen={isTideAuthModalOpen}
        onClose={() => setIsTideAuthModalOpen(false)}
        currentUser={currentUser}
        onSelectUser={(user) => {
          setCurrentUser(user);
          // Also sync hackathon persona if matching
          if (user.id === 'sarah') setHackathonPersona(HACKATHON_PERSONAS['supplier-admin']);
          if (user.id === 'elena') setHackathonPersona(HACKATHON_PERSONAS['compliance-officer']);
          if (user.id === 'marcus') setHackathonPersona(HACKATHON_PERSONAS['customer-a']);
          if (user.id === 'james') setHackathonPersona(HACKATHON_PERSONAS['customer-b']);
        }}
        lang={lang}
        onShowToast={showToast}
      />

      {/* Interactive Demo Scenarios Center */}
      {isScenariosModalOpen && (
        <DemoScenariosModal
          lang={lang}
          currentUser={currentUser}
          documents={documents}
          orders={orders}
          onClose={() => setIsScenariosModalOpen(false)}
          onSelectOrder={handleSelectOrder}
          onOpenDoc={setSelectedDocId}
          onSwitchUser={(userId) => {
            const user = Object.values(USERS).find(u => u.id === userId);
            if (user) {
              setCurrentUser(user);
              showToast(
                lang === 'vi' ? 'Đã chuyển vai trò' : 'Persona Switched',
                `${user.name} (${user.role})`,
                'info'
              );
            }
          }}
          onSimulateTamper={handleSimulateTamper}
          onSimulateUploadMissingDocs={handleSimulateUploadMissingDocs}
          onShowToast={showToast}
        />
      )}

      {/* System Architecture, User Flow & Tech Infrastructure Blueprint */}
      {isArchitectureModalOpen && (
        <ArchitectureFlowsModal
          lang={lang}
          onClose={() => setIsArchitectureModalOpen(false)}
          onLaunchScenario={(scenarioId) => {
            setIsArchitectureModalOpen(false);
            if (scenarioId === 'scenario-mismatch') {
              handleSelectOrder('ord-101', 'ai-review');
            } else {
              setIsScenariosModalOpen(true);
            }
          }}
        />
      )}

      {/* User Instruction / Onboarding Modal */}
      <InstructionModal
        isOpen={isInstructionModalOpen}
        onClose={() => setIsInstructionModalOpen(false)}
        lang={lang}
        onLaunchDemoScenario={handleLaunchDemoScenario}
      />

      {/* Official Tide UNLOCKED Hackathon Submission Kit Modal */}
      <SubmissionKitModal
        isOpen={isSubmissionKitOpen}
        onClose={() => setIsSubmissionKitOpen(false)}
        lang={lang}
      />

      {/* Toast Notification Container */}
      <div 
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-xl flex items-start gap-3 bg-white text-xs animate-in slide-in-from-bottom-2 duration-150 ${
              t.type === 'success' ? 'border-emerald-200' :
              t.type === 'error' ? 'border-rose-200' : 'border-blue-200'
            }`}
          >
            {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
            {t.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
            {t.type === 'info' && <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />}

            <div className="flex-1 min-w-0">
              <div className="font-bold text-slate-900">{t.title}</div>
              <div className="text-slate-600 mt-0.5 leading-relaxed">{t.message}</div>
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-700 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
