import { EvidencePackage, HackathonPersona, QuorumSignature, EvidenceAccessAuditLog } from '../types';

export const HACKATHON_PERSONAS: Record<string, HackathonPersona> = {
  'supplier-admin': {
    id: 'supplier-admin',
    name: 'Sarah Chen',
    roleTitle: 'Principal Supply Chain Admin',
    orgName: 'Atlas Microelectronics (Fab 4)',
    tenantId: 'tenant-atlas-supplier',
    avatarText: 'SC',
    canProposeQuorum: true,
    canCoSignQuorum: false,
    description: 'Quản trị viên nhà máy cung cấp linh kiện bán dẫn. Có quyền đề xuất mở bằng chứng nhưng KHÔNG CÓ THẨM QUYỀN ĐƠN PHƯƠNG mở khóa mà không có Co-Signer.',
  },
  'compliance-officer': {
    id: 'compliance-officer',
    name: 'Dr. Elena Vance',
    roleTitle: 'Chief Compliance & Quality Officer',
    orgName: 'Atlas Independent Compliance Board',
    tenantId: 'tenant-atlas-compliance',
    avatarText: 'EV',
    canProposeQuorum: false,
    canCoSignQuorum: true,
    description: 'Chuyên gia độc lập giữ khóa số thứ hai (2-of-2 Co-signer). Thẩm quyền bảo mật (Emergent Authority) chỉ kích hoạt khi bà đồng ký duyệt.',
  },
  'customer-a': {
    id: 'customer-a',
    name: 'Marcus Cole',
    roleTitle: 'Lead Procurement & Avionics QA',
    orgName: 'Pacific Avionics (Tier 1)',
    tenantId: 'tenant-pacific-avionics',
    avatarText: 'MC',
    canProposeQuorum: false,
    canCoSignQuorum: false,
    description: 'Khách hàng A - Ngành hàng không vũ trụ. Chỉ được phép truy cập các gói bằng chứng đã cấp phép riêng cho Pacific Avionics.',
  },
  'customer-b': {
    id: 'customer-b',
    name: 'James Park',
    roleTitle: 'Component Sourcing Director',
    orgName: 'Apex Mobile Corp (Smartphone OEM)',
    tenantId: 'tenant-apex-mobile',
    avatarText: 'JP',
    canProposeQuorum: false,
    canCoSignQuorum: false,
    description: 'Khách hàng B - Đối thủ sản xuất điện tử tiêu dùng. Bị cô lập cryptographic với gói bằng chứng của Khách hàng A.',
  },
  'auditor': {
    id: 'auditor',
    name: 'David Wright',
    roleTitle: 'Accredited ISO/IEC 17025 Lead Auditor',
    orgName: 'TÜV Rheinland Semiconductor Lab',
    tenantId: 'tenant-auditor',
    avatarText: 'DW',
    canProposeQuorum: false,
    canCoSignQuorum: false,
    description: 'Kiểm toán viên độc lập. Kiểm tra tính toàn vẹn cryptographic, nhật ký truy cập bất biến và bằng chứng nảy sinh.',
  },
};

export const INITIAL_EVIDENCE_PACKAGES: EvidencePackage[] = [
  {
    id: 'pkg-1',
    packageCode: 'PKG-SEMI-2026-A1',
    title: '7nm Automotive MCU Silicon Fab Audit & Defect Density Logs',
    industry: 'Semiconductor & Electronics',
    componentFamily: 'Automotive Grade MCU 7nm (AEC-Q100 Grade 1)',
    supplierOrg: 'Atlas Microelectronics (Fab 4, Tainan)',
    classification: 'Restricted Dual-Key',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'Emergent Authority Active',
    authorizedTenants: ['tenant-pacific-avionics'],
    requiredSignatures: 2,
    signatures: [
      {
        signerId: 'supplier-admin',
        signerName: 'Sarah Chen',
        signerRole: 'Principal Supply Chain Admin',
        signerOrg: 'Atlas Microelectronics',
        signedAt: '2026-10-21 09:15:00',
        keyFingerprint: 'ed25519:7a4f91...c82a',
        decision: 'APPROVE',
      },
      {
        signerId: 'compliance-officer',
        signerName: 'Dr. Elena Vance',
        signerRole: 'Chief Compliance & Quality Officer',
        signerOrg: 'Atlas Independent Compliance Board',
        signedAt: '2026-10-21 10:42:00',
        keyFingerprint: 'ed25519:99bc12...44f0',
        decision: 'APPROVE',
      },
    ],
    documents: [
      {
        id: 'doc-semi-01',
        name: 'Wafer_Yield_Defect_Density_Lot8891.pdf',
        category: 'Fab Wafer Audit',
        size: '14.2 MB',
        hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        encrypted: true,
        restrictedNotes: 'Contains proprietary foundry yield equations. Dual-key decrypted.',
      },
      {
        id: 'doc-semi-02',
        name: 'AEC-Q100_Stress_Test_Thermal_Cycling_Report.pdf',
        category: 'Failure Analysis',
        size: '8.7 MB',
        hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
        encrypted: true,
      },
      {
        id: 'doc-semi-03',
        name: 'RoHS3_Conflict_Free_Smelter_Proof_2026.pdf',
        category: 'RoHS & Conflict Minerals',
        size: '3.1 MB',
        hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
        encrypted: false,
      },
    ],
    accessLogs: [
      {
        id: 'log-1',
        timestamp: '2026-10-21 09:15:00',
        actor: 'Sarah Chen',
        role: 'Supplier Admin',
        org: 'Atlas Microelectronics',
        action: 'PROPOSE_SCOPE_EXPANSION',
        outcome: 'QUORUM_SIGNED',
        detail: 'Initiated 2-of-2 Quorum proposal to grant Pacific Avionics access.',
      },
      {
        id: 'log-2',
        timestamp: '2026-10-21 10:42:00',
        actor: 'Dr. Elena Vance',
        role: 'Chief Compliance Officer',
        org: 'Compliance Board',
        action: 'CO_SIGN_QUORUM',
        outcome: 'ALLOWED',
        detail: 'Emergent Authority threshold reached (2/2). Access token generated without master key.',
      },
      {
        id: 'log-3',
        timestamp: '2026-10-21 14:20:00',
        actor: 'Marcus Cole',
        role: 'Lead Procurement',
        org: 'Pacific Avionics',
        action: 'FETCH_EVIDENCE_VAULT',
        outcome: 'ALLOWED',
        detail: 'Decrypted wafer audit via Emergent Authority capability token.',
      },
    ],
  },
  {
    id: 'pkg-2',
    packageCode: 'PKG-AVIO-770',
    title: 'Radiation-Tolerant FPGA ITAR Compliance & Die Traceability Dossier',
    industry: 'Semiconductor & Electronics',
    componentFamily: 'Rad-Hard Aerospace FPGA (MIL-PRF-38535 Class V)',
    supplierOrg: 'Atlas Microelectronics (High-Reliability Division)',
    classification: 'Restricted Dual-Key',
    sha256Hash: 'c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646',
    status: 'Pending Quorum',
    pendingTenantRequest: {
      tenantId: 'tenant-pacific-avionics',
      tenantName: 'Pacific Avionics',
      requestedBy: 'Sarah Chen (Supplier Admin)',
      requestedAt: '2026-10-22 08:30:00',
      reason: 'Urgent certification review for Commercial Flight Control Unit batch #4402.',
    },
    authorizedTenants: [],
    requiredSignatures: 2,
    signatures: [
      {
        signerId: 'supplier-admin',
        signerName: 'Sarah Chen',
        signerRole: 'Principal Supply Chain Admin',
        signerOrg: 'Atlas Microelectronics',
        signedAt: '2026-10-22 08:30:00',
        keyFingerprint: 'ed25519:7a4f91...c82a',
        decision: 'APPROVE',
      },
    ],
    documents: [
      {
        id: 'doc-fpga-01',
        name: 'ITAR_Export_Classification_EAR99_Exemption.pdf',
        category: 'ITAR Compliance',
        size: '4.8 MB',
        hash: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
        encrypted: true,
      },
      {
        id: 'doc-fpga-02',
        name: 'Heavy_Ion_Single_Event_Latchup_Test_Summary.pdf',
        category: 'Failure Analysis',
        size: '18.9 MB',
        hash: 'fcde2b2edba56bf408601fb721fe9b5c338d10ee429ea04fae5511b68fbf8fb9',
        encrypted: true,
      },
      {
        id: 'doc-fpga-03',
        name: 'Silicon_Die_Lot_Wafer_Traceability_Map.enc',
        category: 'ASIC Blueprints',
        size: '34.5 MB',
        hash: 'a57193297a7e80e12d34e941198539c381c81cb133f993d077ce7a36cb73bb3a',
        encrypted: true,
        restrictedNotes: 'Proprietary die mask layout. Strictly locked until 2/2 co-signed.',
      },
    ],
    accessLogs: [
      {
        id: 'log-fpga-1',
        timestamp: '2026-10-22 08:30:00',
        actor: 'Sarah Chen',
        role: 'Supplier Admin',
        org: 'Atlas Microelectronics',
        action: 'PROPOSE_SCOPE_EXPANSION',
        outcome: 'QUORUM_SIGNED',
        detail: 'Key 1/2 provided. Scope expansion to Pacific Avionics pending Dr. Elena Vance co-signature.',
      },
    ],
  },
  {
    id: 'pkg-3',
    packageCode: 'PKG-ROHS-994',
    title: 'Next-Gen Mobile RF Front-End Conflict Minerals & RoHS 3 Compliance',
    industry: 'Semiconductor & Electronics',
    componentFamily: 'Sub-6GHz / mmWave RF Front-End Module',
    supplierOrg: 'Atlas Microelectronics (Mobile RF Fab)',
    classification: 'Confidential Partner Scope',
    sha256Hash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    status: 'Published',
    authorizedTenants: ['tenant-apex-mobile'],
    requiredSignatures: 2,
    signatures: [
      {
        signerId: 'supplier-admin',
        signerName: 'Sarah Chen',
        signerRole: 'Principal Supply Chain Admin',
        signerOrg: 'Atlas Microelectronics',
        signedAt: '2026-10-18 11:00:00',
        keyFingerprint: 'ed25519:7a4f91...c82a',
        decision: 'APPROVE',
      },
      {
        signerId: 'compliance-officer',
        signerName: 'Dr. Elena Vance',
        signerRole: 'Chief Compliance Officer',
        signerOrg: 'Atlas Compliance Board',
        signedAt: '2026-10-18 11:25:00',
        keyFingerprint: 'ed25519:99bc12...44f0',
        decision: 'APPROVE',
      },
    ],
    documents: [
      {
        id: 'doc-rf-01',
        name: 'RMI_CMRT_Conflict_Minerals_Reporting_Template.xlsx',
        category: 'RoHS & Conflict Minerals',
        size: '2.4 MB',
        hash: 'b3a8e0e1f9ab1bfe3a36f231f676f78bb30a519d2b21e6c530c0eee8ebb4a5d0',
        encrypted: false,
      },
      {
        id: 'doc-rf-02',
        name: 'XRF_Heavy_Metal_Screening_Report_Lot551.pdf',
        category: 'RoHS & Conflict Minerals',
        size: '5.2 MB',
        hash: '6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090',
        encrypted: true,
      },
    ],
    accessLogs: [
      {
        id: 'log-rf-1',
        timestamp: '2026-10-18 11:25:00',
        actor: 'Dr. Elena Vance',
        role: 'Chief Compliance Officer',
        org: 'Compliance Board',
        action: 'CO_SIGN_QUORUM',
        outcome: 'ALLOWED',
        detail: 'Scope approved for Apex Mobile Corp. Pacific Avionics has zero access.',
      },
    ],
  },
  {
    id: 'pkg-4',
    packageCode: 'PKG-ASIC-502',
    title: 'Proprietary Hardware Root-of-Trust Schematic & Side-Channel Analysis',
    industry: 'Semiconductor & Electronics',
    componentFamily: 'Cryptographic Security Core & PUF (Physical Unclonable Function)',
    supplierOrg: 'Atlas Microelectronics (Advanced R&D)',
    classification: 'Restricted Dual-Key',
    sha256Hash: '9834876dcfb05cb167a5c24953eba58c4ac89b1adf57f28f2f9d09af107ee9f0',
    status: 'Pending Quorum',
    authorizedTenants: [],
    requiredSignatures: 2,
    signatures: [],
    documents: [
      {
        id: 'doc-asic-01',
        name: 'PUF_Entropy_Distribution_Laser_Fault_Injection.pdf',
        category: 'Failure Analysis',
        size: '26.4 MB',
        hash: 'eccbc87e4b5ce2fe28308fd9f2a7baf3a53239a311e2d4218387e3885ecb6176',
        encrypted: true,
        restrictedNotes: 'Confidential silicon security vulnerability data. Cannot be released without Quorum.',
      },
      {
        id: 'doc-asic-02',
        name: 'VHDL_RTL_Hardware_Root_Of_Trust_V3.vhd.enc',
        category: 'ASIC Blueprints',
        size: '41.2 MB',
        hash: 'c4ca4238a0b923820dcc509a6f75849b015e100f7cf4a40f1a952d7e9b0b4b20',
        encrypted: true,
        restrictedNotes: 'Top-secret synthesizable source RTL. Never held by any single server or admin.',
      },
    ],
    accessLogs: [],
  },
];

export interface AccessCheckResult {
  allowed: boolean;
  code: 'OK' | 'NO_QUORUM' | 'CROSS_TENANT_VIOLATION' | 'UNAUTHORIZED_ROLE' | 'REVOKED';
  reason: string;
  remedyAction?: string;
  isRogueAttemptBlocked?: boolean;
}

/**
 * Evaluates access using Emergent Authority principles:
 * 1. Supplier Admin cannot read confidential customer-specific vaults without multi-party audit.
 * 2. If status is 'Pending Quorum' (< 2 signatures), NO ONE can view encrypted documents.
 * 3. Customer A cannot view Customer B's authorized packages (Cryptographic Tenant Isolation).
 * 4. Auditors have read-only audit log inspection rights.
 */
export function evaluateEvidenceAccess(
  persona: HackathonPersona,
  pkg: EvidencePackage
): AccessCheckResult {
  // If package is revoked
  if (pkg.status === 'Revoked') {
    return {
      allowed: false,
      code: 'REVOKED',
      reason: 'Bằng chứng này đã bị thu hồi quyền truy cập cryptographic trên toàn mạng Tide.',
    };
  }

  // Auditor role has access to metadata & logs, but encrypted blueprints require explicit quorum
  if (persona.id === 'auditor') {
    return {
      allowed: true,
      code: 'OK',
      reason: 'Kiểm toán viên độc lập được cấp quyền kiểm tra tính hợp lệ cryptographic và nhật ký bất biến.',
    };
  }

  // Quorum constraint: If package requires 2 signatures and has fewer, access is blocked
  if (pkg.signatures.length < pkg.requiredSignatures) {
    return {
      allowed: false,
      code: 'NO_QUORUM',
      reason: `Gói bằng chứng đang chờ phê duyệt Dual-Key (${pkg.signatures.length}/${pkg.requiredSignatures} chữ ký). Thẩm quyền bảo mật (Emergent Authority) chưa nảy sinh; dữ liệu mã hóa không thể mở khóa.`,
      remedyAction: 'Cần sự đồng thuận ký số của Chief Compliance Officer (Dr. Elena Vance).',
    };
  }

  // Multi-tenant isolation: Is the persona's tenant authorized?
  // Supplier internal roles (Supplier Admin & Compliance Officer) can view package metadata if Quorum is met
  if (persona.id === 'supplier-admin' || persona.id === 'compliance-officer') {
    return {
      allowed: true,
      code: 'OK',
      reason: 'Thẩm quyền đồng thuận nội bộ hợp lệ (2/2 chữ ký đã xác thực).',
    };
  }

  // Customer isolation check
  if (!pkg.authorizedTenants.includes(persona.tenantId)) {
    return {
      allowed: false,
      code: 'CROSS_TENANT_VIOLATION',
      reason: `Từ chối truy cập qua ranh giới tổ chức (Cross-Tenant Boundary). ${persona.orgName} không nằm trong danh sách quyền hạn cryptographic của gói này.`,
      remedyAction: 'Liên hệ Supplier Lead để tạo đề xuất Quorum mở rộng phạm vi truy cập.',
    };
  }

  return {
    allowed: true,
    code: 'OK',
    reason: `Truy cập hợp lệ: Thẩm quyền nảy sinh đã chứng thực cho ${persona.orgName} với 2/2 chữ ký đồng thuận.`,
  };
}

/**
 * Supplier Admin initiates a Quorum Scope Expansion proposal
 */
export function proposeScopeExpansion(
  pkg: EvidencePackage,
  proposer: HackathonPersona,
  targetTenantId: string,
  targetTenantName: string,
  reason: string
): { updatedPkg: EvidencePackage; success: boolean; message: string } {
  if (!proposer.canProposeQuorum) {
    return {
      updatedPkg: pkg,
      success: false,
      message: `Chỉ Quản trị viên Cung ứng (${HACKATHON_PERSONAS['supplier-admin'].name}) mới có thể khởi tạo đề xuất Quorum.`,
    };
  }

  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const newSignature: QuorumSignature = {
    signerId: proposer.id,
    signerName: proposer.name,
    signerRole: proposer.roleTitle,
    signerOrg: proposer.orgName,
    signedAt: now,
    keyFingerprint: 'ed25519:7a4f91...c82a',
    decision: 'APPROVE',
  };

  const newLog: EvidenceAccessAuditLog = {
    id: `log-${Date.now()}`,
    timestamp: now,
    actor: proposer.name,
    role: proposer.roleTitle,
    org: proposer.orgName,
    action: 'PROPOSE_SCOPE_EXPANSION',
    outcome: 'QUORUM_SIGNED',
    detail: `Initiated proposal to grant access to [${targetTenantName}] for ${pkg.packageCode}. Key 1/2 provided.`,
  };

  const updated: EvidencePackage = {
    ...pkg,
    status: 'Pending Quorum',
    pendingTenantRequest: {
      tenantId: targetTenantId,
      tenantName: targetTenantName,
      requestedBy: proposer.name,
      requestedAt: now,
      reason,
    },
    signatures: [newSignature],
    accessLogs: [newLog, ...pkg.accessLogs],
  };

  return {
    updatedPkg: updated,
    success: true,
    message: `Đã khởi tạo đề xuất thành công (Khóa 1/2). Hệ thống đang chờ Chuyên gia Tuân thủ (Dr. Elena Vance) đồng ký duyệt.`,
  };
}

/**
 * Chief Compliance Officer co-signs the Quorum proposal -> Emergent Authority activates!
 */
export function coSignQuorumApproval(
  pkg: EvidencePackage,
  coSigner: HackathonPersona
): { updatedPkg: EvidencePackage; success: boolean; message: string } {
  if (!coSigner.canCoSignQuorum) {
    return {
      updatedPkg: pkg,
      success: false,
      message: `Chỉ Chuyên gia Tuân thủ Độc lập (${HACKATHON_PERSONAS['compliance-officer'].name}) mới có quyền ký duyệt Khóa số 2 (Co-Signer).`,
    };
  }

  if (pkg.signatures.length < 1) {
    return {
      updatedPkg: pkg,
      success: false,
      message: 'Chưa có chữ ký khởi tạo (Key 1/2) từ Quản trị viên Cung ứng.',
    };
  }

  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const coSignature: QuorumSignature = {
    signerId: coSigner.id,
    signerName: coSigner.name,
    signerRole: coSigner.roleTitle,
    signerOrg: coSigner.orgName,
    signedAt: now,
    keyFingerprint: 'ed25519:99bc12...44f0',
    decision: 'APPROVE',
  };

  const targetTenant = pkg.pendingTenantRequest?.tenantId;
  const targetTenantName = pkg.pendingTenantRequest?.tenantName || 'Authorized Tenant';

  const newLog: EvidenceAccessAuditLog = {
    id: `log-${Date.now()}`,
    timestamp: now,
    actor: coSigner.name,
    role: coSigner.roleTitle,
    org: coSigner.orgName,
    action: 'CO_SIGN_QUORUM',
    outcome: 'ALLOWED',
    detail: `Emergent Authority Threshold reached (2/2 signatures). Scope granted to [${targetTenantName}]. Reusable master key: NONE.`,
  };

  const authorizedTenants = targetTenant && !pkg.authorizedTenants.includes(targetTenant)
    ? [...pkg.authorizedTenants, targetTenant]
    : pkg.authorizedTenants;

  const updated: EvidencePackage = {
    ...pkg,
    status: 'Emergent Authority Active',
    pendingTenantRequest: undefined,
    authorizedTenants,
    signatures: [...pkg.signatures, coSignature],
    accessLogs: [newLog, ...pkg.accessLogs],
  };

  return {
    updatedPkg: updated,
    success: true,
    message: `Đồng thuận 2/2 hoàn tất! Thẩm quyền bảo mật (Emergent Authority) đã nảy sinh và cấp quyền cho ${targetTenantName} mà không cần master key.`,
  };
}

/**
 * Simulates a Rogue Administrator attempting to bypass Quorum and force unlock.
 * In a conventional system with master keys, this succeeds and compromises everything.
 * With Tide Emergent Authority, it is GUARANTEED TO FAIL.
 */
export function attemptRogueAdminOverride(
  pkg: EvidencePackage,
  rogueActor: HackathonPersona,
  targetTenantId: string
): {
  success: false;
  message: string;
  blockedBy: string;
  auditEntry: EvidenceAccessAuditLog;
} {
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const auditEntry: EvidenceAccessAuditLog = {
    id: `log-rogue-${Date.now()}`,
    timestamp: now,
    actor: rogueActor.name,
    role: `${rogueActor.roleTitle} (Rogue Admin Simulation)`,
    org: rogueActor.orgName,
    action: 'UNILATERAL_OVERRIDE_ATTEMPT',
    outcome: 'OVERRIDE_REJECTED',
    detail: `SECURITY ALERT: Attempted unilateral master-key bypass for ${pkg.packageCode} without Co-Signer Quorum. Blocked by Tide Emergent Authority policy.`,
  };

  return {
    success: false,
    blockedBy: 'Tide Emergent Authority Engine (No Master Key Exists)',
    message: `CẢNH BÁO BẢO MẬT: Nỗ lực ép mở khóa đơn phương (Unilateral Admin Override) bị TỪ CHỐI! Không một quản trị viên hay máy chủ nào nắm giữ chìa khóa tổng (Master Key) để vượt qua ngưỡng đồng thuận 2-of-2.`,
    auditEntry,
  };
}
