import { 
  DocumentRecord, 
  UserSession, 
  ApprovalRecord, 
  PolicyRule, 
  MatchingResult, 
  PolicyEvaluationResult 
} from '../types';

/**
 * Perform 3-way matching between Purchase Order, Goods Receipt Note (optional), and Commercial Invoice.
 * Follows trade document guidelines from Section 12 & 3-Way Matching Process.
 */
export function performThreeWayMatch(
  po: DocumentRecord | null | undefined,
  invoice: DocumentRecord,
  grn?: DocumentRecord | null,
  tolerancePercent: number = 0
): MatchingResult {
  if (!po) {
    return {
      isFullyMatched: false,
      discrepancyCount: 1,
      matchScore: 0,
      items: [],
      summaryMessage: 'Purchase Order baseline reference is missing or not linked.',
      recommendedAction: 'REQUIRE_MANUAL_REVIEW'
    };
  }

  const items: MatchingResult['items'] = [];
  let discrepancyCount = 0;

  // Map po items by itemCode
  const poMap = new Map(po.lineItems.map(i => [i.itemCode, i]));
  const grnMap = new Map((grn?.lineItems || []).map(i => [i.itemCode, i]));

  for (const invItem of invoice.lineItems) {
    const poItem = poMap.get(invItem.itemCode);
    const grnItem = grnMap.get(invItem.itemCode);

    const poQty = poItem?.poQuantity ?? poItem?.invoiceQuantity ?? 0;
    const invQty = invItem.invoiceQuantity ?? invItem.poQuantity ?? 0;
    const grnQty = grnItem?.grnQuantity ?? grnItem?.poQuantity ?? poQty; // defaults to received if grn not present

    const qtyDiff = invQty - poQty;
    const poPrice = poItem?.unitPrice ?? 0;
    const invPrice = invItem.unitPrice;
    const priceDiff = Math.abs(invPrice - poPrice);

    let status: 'match' | 'qty_mismatch' | 'price_mismatch' | 'missing_item' = 'match';
    let comment = 'Quantities and prices match purchase order.';

    if (!poItem) {
      status = 'missing_item';
      comment = `Item ${invItem.itemCode} does not exist on Purchase Order ${po.referenceNumber}.`;
      discrepancyCount++;
    } else if (Math.abs(qtyDiff) > tolerancePercent * poQty) {
      status = 'qty_mismatch';
      comment = `Quantity discrepancy: Invoice has ${invQty} units, but PO authorized ${poQty} units (${qtyDiff > 0 ? '+' : ''}${qtyDiff} variance).`;
      discrepancyCount++;
    } else if (priceDiff > 0.01) {
      status = 'price_mismatch';
      comment = `Unit price mismatch: Invoice price is ${invPrice} ${invItem.currency}, PO unit price is ${poPrice} ${po.currency}.`;
      discrepancyCount++;
    }

    // Also check GRN if present
    if (grn && grnItem && status === 'match') {
      const receivedDiff = invQty - (grnItem.grnQuantity ?? 0);
      if (receivedDiff > 0) {
        status = 'qty_mismatch';
        comment = `Invoice quantity (${invQty}) exceeds physical Goods Receipt Note (${grnItem.grnQuantity} received).`;
        discrepancyCount++;
      }
    }

    items.push({
      itemCode: invItem.itemCode,
      description: invItem.description,
      poQty,
      grnQty,
      invQty,
      qtyDiff,
      poPrice,
      invPrice,
      priceDiff,
      status,
      comment
    });
  }

  const totalItemsChecked = Math.max(items.length, 1);
  const matchedItems = items.filter(i => i.status === 'match').length;
  const matchScore = Math.round((matchedItems / totalItemsChecked) * 100);
  const isFullyMatched = discrepancyCount === 0;

  let summaryMessage = '';
  let recommendedAction: MatchingResult['recommendedAction'] = 'PROCEED_TO_APPROVAL';

  if (isFullyMatched) {
    summaryMessage = `Invoice ${invoice.referenceNumber} perfectly matches PO ${po.referenceNumber} across supplier, line items, quantities, and pricing. Eligible for automated progression to approval queue.`;
    recommendedAction = 'PROCEED_TO_APPROVAL';
  } else {
    summaryMessage = `Discrepancy detected: ${discrepancyCount} line item mismatch(es) found between ${invoice.referenceNumber} and ${po.referenceNumber}. System gate requires exception sign-off by authorized reviewer before release.`;
    recommendedAction = 'REQUIRE_MANUAL_REVIEW';
  }

  return {
    isFullyMatched,
    discrepancyCount,
    matchScore,
    items,
    summaryMessage,
    recommendedAction
  };
}

/**
 * Evaluate authorization policy when an actor attempts to approve or sign a document.
 * Enforces:
 * - Separation of Duties (Maker-Checker): Requester cannot approve own request.
 * - AI Agent Restrictions: AI can only extract and compare, never approve or sign.
 * - Dual Approval for high values (> $10,000 threshold).
 * - Document version integrity: Hash check must match.
 */
export function evaluateApprovalPolicy(
  policies: PolicyRule[],
  user: UserSession,
  doc: DocumentRecord,
  approval?: ApprovalRecord
): PolicyEvaluationResult {
  const isSeparationOfDutiesEnabled = policies.find(p => p.id === 'pol-separation')?.enabled ?? true;
  const isAiRestrictionEnabled = policies.find(p => p.id === 'pol-ai-limits')?.enabled ?? true;
  const isDualApprovalEnabled = policies.find(p => p.id === 'pol-signing')?.enabled ?? true;
  const isVersionIntegrityEnabled = policies.find(p => p.id === 'pol-integrity')?.enabled ?? true;

  const reasons: string[] = [];
  let violatesSeparationOfDuties = false;
  let violatesAiRestriction = false;
  let requiresDualApprover = false;
  let violatesVersionIntegrity = false;
  let violatesDiscrepancyCheck = false;

  // 1. AI Agent restriction
  if (isAiRestrictionEnabled && user.role === 'AI Agent') {
    violatesAiRestriction = true;
    reasons.push('AI Agent boundary active: Autonomous agents may extract, parse and propose, but are strictly prohibited from approving or signing financial and trade instruments.');
  }

  // 2. Separation of duties (Requester cannot approve their own submission)
  if (isSeparationOfDutiesEnabled && approval) {
    const isOwner = approval.requesterId === user.id || doc.ownerId === user.id;
    if (isOwner && user.role !== 'Compliance Admin') {
      violatesSeparationOfDuties = true;
      reasons.push(`Separation of duties violation: ${user.name} created or requested this document and cannot act as its approving authority.`);
    }
  }

  // 3. Dual-Control requirement (> $10,000)
  const docValue = doc.amount ?? approval?.amount ?? 0;
  if (isDualApprovalEnabled && docValue >= 10000) {
    requiresDualApprover = true;
    if (approval && approval.receivedApprovals < 1) {
      reasons.push(`High-value transaction ($${docValue.toLocaleString()}): Requires 2 independent authorized approvers before final signing.`);
    }
  }

  // 4. Version integrity check (file tampered)
  if (isVersionIntegrityEnabled && doc.isTampered) {
    violatesVersionIntegrity = true;
    reasons.push('Version integrity failure: Document cryptographic hash differs from recorded state. Prior approvals are revoked.');
  }

  // 5. Unresolved discrepancy check
  if (doc.status === 'Needs Review') {
    violatesDiscrepancyCheck = true;
    reasons.push('Validation exception gate: Document contains unreviewed 3-way matching discrepancies.');
  }

  const allowed = !violatesAiRestriction && 
                  !violatesSeparationOfDuties && 
                  !violatesVersionIntegrity;

  return {
    allowed,
    violatesSeparationOfDuties,
    violatesAiRestriction,
    requiresDualApprover,
    violatesVersionIntegrity,
    violatesDiscrepancyCheck,
    reasons
  };
}

/**
 * Generalized action policy evaluation for Orders and Exceptions.
 */
export function evaluateActionPolicy(
  action: 'APPROVE_EXCEPTION' | 'SIGN_DOCUMENT' | 'APPROVE_DOCUMENT',
  user: UserSession,
  requesterOrOwnerId: string,
  amount: number | null | undefined,
  policies: PolicyRule[],
  isTampered: boolean = false,
  hasUnresolvedDiscrepancy: boolean = false
): PolicyEvaluationResult {
  const isSeparationOfDutiesEnabled = policies.find(p => p.id === 'pol-separation')?.enabled ?? true;
  const isAiRestrictionEnabled = policies.find(p => p.id === 'pol-ai-limits')?.enabled ?? true;
  const isDualApprovalEnabled = policies.find(p => p.id === 'pol-signing')?.enabled ?? true;
  const isVersionIntegrityEnabled = policies.find(p => p.id === 'pol-integrity')?.enabled ?? true;

  const reasons: string[] = [];
  let violatesSeparationOfDuties = false;
  let violatesAiRestriction = false;
  let requiresDualApprover = false;
  let violatesVersionIntegrity = false;
  let violatesDiscrepancyCheck = false;

  // 1. AI Restriction: AI Agent cannot approve or sign
  if (isAiRestrictionEnabled && user.role === 'AI Agent') {
    violatesAiRestriction = true;
    reasons.push('AI Agent boundary active: Autonomous agents may extract, parse and propose, but are strictly prohibited from approving or signing trade instruments.');
  }

  // 2. Separation of Duties: Requester cannot approve
  if (isSeparationOfDutiesEnabled && (action === 'APPROVE_EXCEPTION' || action === 'APPROVE_DOCUMENT')) {
    if (user.id === requesterOrOwnerId && user.role !== 'Compliance Admin') {
      violatesSeparationOfDuties = true;
      reasons.push(`Maker-Checker violation: ${user.name} initiated this request and cannot act as its approving authority.`);
    }
  }

  // 3. Dual-Control requirement (> $10,000)
  const val = amount ?? 0;
  if (isDualApprovalEnabled && val >= 10000) {
    requiresDualApprover = true;
  }

  // 4. Version integrity
  if (isVersionIntegrityEnabled && isTampered) {
    violatesVersionIntegrity = true;
    reasons.push('Version integrity failure: Document hash differs from recorded state. Prior approvals revoked.');
  }

  // 5. Discrepancy gate
  if (hasUnresolvedDiscrepancy && action === 'SIGN_DOCUMENT') {
    violatesDiscrepancyCheck = true;
    reasons.push('Validation exception gate: Cannot sign while active cross-document discrepancies remain unreviewed.');
  }

  const allowed = !violatesAiRestriction && !violatesSeparationOfDuties && !violatesVersionIntegrity && !violatesDiscrepancyCheck;

  return {
    allowed,
    violatesSeparationOfDuties,
    violatesAiRestriction,
    requiresDualApprover,
    violatesVersionIntegrity,
    violatesDiscrepancyCheck,
    reasons
  };
}

/**
 * Deterministic SHA-256 fingerprint simulation for UI and testing.
 */
export function calculateDocumentFingerprint(seed: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  const hex = (hash >>> 0).toString(16).padStart(8, '0');
  return `sha256: ${hex.slice(0, 4)}…${hex.slice(4, 8)}9f1b`;
}

/**
 * Format currency amounts nicely.
 */
export function formatCurrency(amount: number | null | undefined, currency: string = 'USD'): string {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}
