import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  performThreeWayMatch, 
  evaluateApprovalPolicy, 
  calculateDocumentFingerprint,
  formatCurrency 
} from './policyEngine';
import { DocumentRecord, UserSession, ApprovalRecord, PolicyRule } from '../types';

const mockPo: DocumentRecord = {
  id: 'DOC-PO-01',
  name: 'Purchase_Order_PO-1182.pdf',
  type: 'Purchase Order',
  fileExt: 'PDF',
  referenceNumber: 'PO-1182',
  counterparty: 'Nippon Components Ltd.',
  updatedDate: '21 Oct 2026',
  amount: 16885,
  currency: 'USD',
  status: 'Approved',
  ownerId: 'usr-sarah',
  ownerName: 'Sarah Chen',
  version: '1.0',
  fileHash: 'sha256: 22c1…91a7',
  description: 'PO for microcontrollers',
  lineItems: [
    {
      id: 'item-1',
      itemCode: 'MCU-STM32F4',
      description: '32-bit Microcontroller IC',
      poQuantity: 220,
      unitPrice: 76.75,
      currency: 'USD',
      unit: 'pcs',
      lineTotal: 16885,
      varianceStatus: 'matched'
    }
  ],
  events: [],
  metadata: {}
};

const mockMatchingInvoice: DocumentRecord = {
  id: 'DOC-INV-01',
  name: 'Commercial_Invoice_INV-2391.pdf',
  type: 'Commercial Invoice',
  fileExt: 'PDF',
  referenceNumber: 'INV-2391',
  counterparty: 'Nippon Components Ltd.',
  updatedDate: '22 Oct 2026',
  amount: 16885,
  currency: 'USD',
  status: 'AI Processed',
  ownerId: 'usr-minh',
  ownerName: 'Minh Le',
  version: '1.0',
  fileHash: 'sha256: 6f8a…b2d1',
  description: 'Invoice matching PO-1182',
  lineItems: [
    {
      id: 'inv-item-1',
      itemCode: 'MCU-STM32F4',
      description: '32-bit Microcontroller IC',
      invoiceQuantity: 220,
      unitPrice: 76.75,
      currency: 'USD',
      unit: 'pcs',
      lineTotal: 16885,
      varianceStatus: 'matched'
    }
  ],
  events: [],
  metadata: {}
};

const mockMismatchInvoice: DocumentRecord = {
  ...mockMatchingInvoice,
  id: 'DOC-INV-02',
  referenceNumber: 'INV-2408',
  amount: 18420,
  lineItems: [
    {
      id: 'inv-item-1',
      itemCode: 'MCU-STM32F4',
      description: '32-bit Microcontroller IC',
      invoiceQuantity: 240, // 240 instead of 220!
      unitPrice: 76.75,
      currency: 'USD',
      unit: 'pcs',
      lineTotal: 18420,
      varianceStatus: 'mismatch'
    }
  ]
};

const samplePolicies: PolicyRule[] = [
  {
    id: 'pol-signing',
    title: 'Document signing quorum',
    subtitle: 'High value threshold protection',
    iconName: 'Shield',
    description: 'Requires 2 approvers for value >= $10,000',
    ruleStatement: 'Invoices >= $10,000 require 2 distinct approvers.',
    enabled: true,
    category: 'authorization'
  },
  {
    id: 'pol-separation',
    title: 'Separation of duties',
    subtitle: 'Maker cannot be checker',
    iconName: 'Users',
    description: 'Requester cannot approve their own submission',
    ruleStatement: 'Approver ID != Requester ID',
    enabled: true,
    category: 'authorization'
  },
  {
    id: 'pol-integrity',
    title: 'Version integrity',
    subtitle: 'Hash verification',
    iconName: 'Hash',
    description: 'Invalidates approvals if document hash changes',
    ruleStatement: 'File hash must match recorded state.',
    enabled: true,
    category: 'integrity'
  },
  {
    id: 'pol-ai-limits',
    title: 'AI agent boundary',
    subtitle: 'Restrict automated execution',
    iconName: 'Bot',
    description: 'AI can extract & compare but cannot approve or sign',
    ruleStatement: 'AI agent is barred from approval & signing endpoints.',
    enabled: true,
    category: 'ai_guardrails'
  }
];

test('3-Way Matching: detects exact match correctly', () => {
  const result = performThreeWayMatch(mockPo, mockMatchingInvoice);
  assert.equal(result.isFullyMatched, true);
  assert.equal(result.discrepancyCount, 0);
  assert.equal(result.matchScore, 100);
  assert.equal(result.recommendedAction, 'PROCEED_TO_APPROVAL');
});

test('3-Way Matching: detects quantity mismatch and flags exception', () => {
  const result = performThreeWayMatch(mockPo, mockMismatchInvoice);
  assert.equal(result.isFullyMatched, false);
  assert.equal(result.discrepancyCount, 1);
  assert.equal(result.items[0].qtyDiff, 20);
  assert.equal(result.items[0].status, 'qty_mismatch');
  assert.equal(result.recommendedAction, 'REQUIRE_MANUAL_REVIEW');
});

test('Policy Engine: Separation of duties blocks requester from self-approving', () => {
  const requesterUser: UserSession = {
    id: 'usr-minh',
    name: 'Minh Le',
    email: 'minh.le@example.com',
    role: 'Procurement Specialist',
    avatar: 'ML',
    department: 'Procurement'
  };

  const approvalReq: ApprovalRecord = {
    id: 'APR-101',
    docId: mockMismatchInvoice.id,
    title: 'Commercial Invoice INV-2408',
    counterparty: 'Nippon Components Ltd.',
    amount: 18420,
    currency: 'USD',
    kind: 'Invoice exception',
    submittedDate: '22 Oct 2026',
    requesterId: 'usr-minh', // same as user
    requesterName: 'Minh Le',
    requiredApprovals: 2,
    receivedApprovals: 0,
    approvers: [],
    reason: 'Invoice quantity mismatch',
    status: 'Pending'
  };

  const evalResult = evaluateApprovalPolicy(samplePolicies, requesterUser, mockMismatchInvoice, approvalReq);
  assert.equal(evalResult.allowed, false);
  assert.equal(evalResult.violatesSeparationOfDuties, true);
  assert.ok(evalResult.reasons.some(r => r.includes('Separation of duties violation')));
});

test('Policy Engine: AI Agent is barred from approving or signing sensitive actions', () => {
  const aiUser: UserSession = {
    id: 'usr-ai',
    name: 'CargoTrust AI',
    email: 'ai@cargotrust.internal',
    role: 'AI Agent',
    avatar: 'AI',
    department: 'Autonomous Intelligence'
  };

  const evalResult = evaluateApprovalPolicy(samplePolicies, aiUser, mockMatchingInvoice);
  assert.equal(evalResult.allowed, false);
  assert.equal(evalResult.violatesAiRestriction, true);
  assert.ok(evalResult.reasons.some(r => r.includes('AI Agent boundary active')));
});

test('Policy Engine: Independent Finance Manager is allowed to approve valid request', () => {
  const financeUser: UserSession = {
    id: 'usr-sarah',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    role: 'Finance Approver',
    avatar: 'SC',
    department: 'Finance'
  };

  const approvalReq: ApprovalRecord = {
    id: 'APR-102',
    docId: mockMatchingInvoice.id,
    title: 'Commercial Invoice INV-2391',
    counterparty: 'Nippon Components Ltd.',
    amount: 16885,
    currency: 'USD',
    kind: 'Invoice exception',
    submittedDate: '22 Oct 2026',
    requesterId: 'usr-minh', // different from financeUser
    requesterName: 'Minh Le',
    requiredApprovals: 2,
    receivedApprovals: 0,
    approvers: [],
    reason: 'Final invoice approval',
    status: 'Pending'
  };

  const evalResult = evaluateApprovalPolicy(samplePolicies, financeUser, mockMatchingInvoice, approvalReq);
  assert.equal(evalResult.allowed, true);
  assert.equal(evalResult.violatesSeparationOfDuties, false);
  assert.equal(evalResult.requiresDualApprover, true); // $16,885 > $10,000 threshold
});

test('Formatting & Hashing utilities work deterministically', () => {
  const formatted = formatCurrency(18420, 'USD');
  assert.equal(formatted, '$18,420.00');

  const fp1 = calculateDocumentFingerprint('seed-1');
  const fp2 = calculateDocumentFingerprint('seed-1');
  const fp3 = calculateDocumentFingerprint('seed-2');
  assert.equal(fp1, fp2);
  assert.notEqual(fp1, fp3);
});
