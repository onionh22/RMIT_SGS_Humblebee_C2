export type DocumentType = 
  | 'Purchase Order'
  | 'Commercial Invoice'
  | 'Goods Receipt Note'
  | 'Sales Contract'
  | 'Bill of Lading'
  | 'Packing List'
  | 'Certificate of Origin'
  | 'Certificate of Free Sale'
  | 'Certificate of Quality'
  | 'Customs Declaration';

export type DocumentStatus =
  | 'Draft'
  | 'AI Processed'
  | 'Validation Passed'
  | 'Needs Review'
  | 'Pending Approval'
  | 'Approved'
  | 'Authorized'
  | 'Signed'
  | 'Rejected';

export type UserRole =
  | 'Operations Manager'
  | 'Finance Approver'
  | 'Procurement Specialist'
  | 'Compliance Admin'
  | 'AI Agent';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
}

export interface LineItem {
  id: string;
  itemCode: string;
  description: string;
  contractQuantity?: number;
  poQuantity?: number;
  grnQuantity?: number;
  invoiceQuantity?: number;
  packingListQuantity?: number;
  unitPrice: number;
  currency: string;
  unit: string;
  lineTotal: number;
  varianceStatus: 'matched' | 'mismatch' | 'pending' | 'warning';
  notes?: string;
}

export interface DocumentEvent {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  event: string;
  details: string;
  tone: 'green' | 'amber' | 'red' | 'blue';
  hashSnapshot?: string;
}

export interface DocumentRecord {
  id: string;
  name: string;
  type: DocumentType;
  fileExt: 'PDF' | 'DOC' | 'XLS';
  referenceNumber: string;
  counterparty: string;
  updatedDate: string;
  amount: number | null;
  currency: string;
  status: DocumentStatus;
  ownerId: string;
  ownerName: string;
  orderId?: string;
  shipmentId?: string;
  linkedPoRef?: string;
  linkedGrnRef?: string;
  linkedInvoiceRef?: string;
  version: string;
  fileHash: string; // SHA-256 fingerprint
  isTampered?: boolean;
  description: string;
  lineItems: LineItem[];
  events: DocumentEvent[];
  metadata: {
    originCountry?: string;
    destinationCountry?: string;
    vesselName?: string;
    containerNo?: string;
    customsDeclarationNo?: string;
    paymentTerms?: string;
    incoterms?: string;
    [key: string]: any;
  };
}

// 4-Dimensional Status Matrix according to the new business guideline
export type OrderCompletenessStatus = 'Chưa bắt đầu' | 'Chưa đầy đủ' | 'Đầy đủ' | 'Không áp dụng';
export type OrderConsistencyStatus = 'Chưa kiểm tra' | 'Đang kiểm tra' | 'Khớp dữ liệu' | 'Cần kiểm tra' | 'Đã xử lý sai lệch';
export type OrderApprovalStatus = 'Chưa gửi' | 'Chờ phê duyệt' | 'Đang rà soát' | 'Yêu cầu chỉnh sửa' | 'Đã phê duyệt' | 'Bị từ chối';
export type OrderSigningStatus = 'Không yêu cầu ký' | 'Chờ ký' | 'Đang chờ xác thực' | 'Đang xử lý chữ ký' | 'Đã ký' | 'Ký thất bại' | 'Cần ký lại';
export type OrderOverallStatus = 'Cần kiểm tra' | 'Chưa đầy đủ' | 'Chờ kiểm tra' | 'Chờ phê duyệt' | 'Chờ ký' | 'Hoàn tất';

export interface OrderChecklistItem {
  docType: DocumentType;
  required: boolean;
  docId?: string;
  docRef?: string;
  uploadStatus: 'Đã tải lên' | 'Chưa có' | 'Không áp dụng';
  aiReviewStatus: 'Đã kiểm tra' | 'Phát hiện sai lệch' | 'Chưa kiểm tra' | '—';
  approvalStatus: 'Đã phê duyệt' | 'Chưa phê duyệt' | 'Chưa yêu cầu' | 'Không yêu cầu' | '—';
  signingStatus: 'Đã ký' | 'Chờ ký' | 'Không yêu cầu' | '—';
}

export interface ShipmentRecord {
  id: string;
  orderId: string;
  shipmentNumber: string;
  origin: string;
  destination: string;
  carrier: string;
  vesselOrFlight: string;
  containerNo?: string;
  sealNo?: string;
  etd: string;
  eta: string;
  status: 'In Transit' | 'Port Arrived' | 'Customs Cleared' | 'Delivered';
  documentCount: number;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  title: string;
  buyer: string;
  seller: string;
  commodityType: string;
  contractQuantity: number;
  unit: string;
  totalValue: number;
  currency: string;
  incoterms: string;
  orderDate: string;
  expectedDelivery: string;
  paymentTerms: string;
  // 4 Independent Status Dimensions
  completeness: OrderCompletenessStatus;
  completenessCount: { current: number; total: number };
  consistency: OrderConsistencyStatus;
  approval: OrderApprovalStatus;
  signing: OrderSigningStatus;
  overallStatus: OrderOverallStatus;
  checklist: OrderChecklistItem[];
  shipments: ShipmentRecord[];
  discrepancies: Array<{
    field: string;
    sourceA: { docName: string; value: string | number };
    sourceB: { docName: string; value: string | number };
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    explanation: string;
  }>;
}

export interface ApprovalRecord {
  id: string;
  docId: string;
  orderId?: string;
  title: string;
  counterparty: string;
  amount: number | null;
  currency: string;
  kind: 'Invoice exception' | 'Contract signature' | 'PO release' | 'Freight handover';
  submittedDate: string;
  requesterId: string;
  requesterName: string;
  requiredApprovals: number;
  receivedApprovals: number;
  approvers: Array<{
    userId: string;
    userName: string;
    role: UserRole;
    timestamp: string;
    note?: string;
  }>;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface PolicyRule {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  description: string;
  ruleStatement: string;
  enabled: boolean;
  category: 'authorization' | 'integrity' | 'ai_guardrails' | 'audit';
}

export interface Counterparty {
  id: string;
  name: string;
  code: string;
  type: 'Supplier' | 'Buyer' | 'Carrier' | 'Freight forwarder' | 'Customs broker';
  country: string;
  countryCode: string;
  status: 'Verified' | 'Pending Verification' | 'Workspace Partner';
  linkedDocsCount: number;
  contactEmail: string;
  trustScore: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  event: string;
  detail: string;
  result: 'Success' | 'Exception flagged' | 'Blocked by policy' | 'Verified' | 'Signed';
  tone: 'green' | 'red' | 'amber' | 'blue';
  docId?: string;
  orderId?: string;
  proofHash?: string;
}

export interface MatchingResult {
  isFullyMatched: boolean;
  discrepancyCount: number;
  matchScore: number; // 0 - 100
  items: Array<{
    itemCode: string;
    description: string;
    poQty: number;
    grnQty: number;
    invQty: number;
    qtyDiff: number;
    poPrice: number;
    invPrice: number;
    priceDiff: number;
    status: 'match' | 'qty_mismatch' | 'price_mismatch' | 'missing_item';
    comment: string;
  }>;
  summaryMessage: string;
  recommendedAction: 'PROCEED_TO_APPROVAL' | 'REQUIRE_MANUAL_REVIEW' | 'REJECT_INVOICE';
}

export interface PolicyEvaluationResult {
  allowed: boolean;
  violatesSeparationOfDuties: boolean;
  violatesAiRestriction: boolean;
  requiresDualApprover: boolean;
  violatesVersionIntegrity: boolean;
  violatesDiscrepancyCheck: boolean;
  reasons: string[];
}

// ----------------------------------------------------
// TIDE UNLOCKED HACKATHON: SEMICONDUCTOR EVIDENCE EXCHANGE
// ----------------------------------------------------

export type EvidenceClassification = 'Public Compliance' | 'Confidential Partner Scope' | 'Restricted Dual-Key';

export interface EvidenceDocumentItem {
  id: string;
  name: string;
  category: 'Fab Wafer Audit' | 'RoHS & Conflict Minerals' | 'Failure Analysis' | 'ASIC Blueprints' | 'ITAR Compliance';
  size: string;
  hash: string;
  encrypted: boolean;
  restrictedNotes?: string;
}

export interface QuorumSignature {
  signerId: string;
  signerName: string;
  signerRole: string;
  signerOrg: string;
  signedAt: string;
  keyFingerprint: string;
  decision: 'APPROVE' | 'REJECT';
}

export interface EvidenceAccessAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  org: string;
  action: string;
  outcome: 'ALLOWED' | 'BLOCKED_NO_QUORUM' | 'BLOCKED_CROSS_TENANT' | 'OVERRIDE_REJECTED' | 'QUORUM_SIGNED';
  detail: string;
}

export interface EvidencePackage {
  id: string;
  packageCode: string;
  title: string;
  industry: 'Semiconductor & Electronics';
  componentFamily: string;
  supplierOrg: string;
  classification: EvidenceClassification;
  sha256Hash: string;
  status: 'Published' | 'Pending Quorum' | 'Emergent Authority Active' | 'Revoked';
  pendingTenantRequest?: {
    tenantId: string;
    tenantName: string;
    requestedBy: string;
    requestedAt: string;
    reason: string;
  };
  authorizedTenants: string[]; // List of tenant IDs
  requiredSignatures: number; // 2 for 2-of-2 Dual-Key
  signatures: QuorumSignature[];
  documents: EvidenceDocumentItem[];
  accessLogs: EvidenceAccessAuditLog[];
}

export interface HackathonPersona {
  id: 'supplier-admin' | 'compliance-officer' | 'customer-a' | 'customer-b' | 'auditor';
  name: string;
  roleTitle: string;
  orgName: string;
  tenantId: string;
  avatarText: string;
  canProposeQuorum: boolean;
  canCoSignQuorum: boolean;
  description: string;
}

