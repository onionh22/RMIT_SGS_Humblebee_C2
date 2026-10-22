import {
  HACKATHON_PERSONAS,
  INITIAL_EVIDENCE_PACKAGES,
  evaluateEvidenceAccess,
  proposeScopeExpansion,
  coSignQuorumApproval,
  attemptRogueAdminOverride,
} from './quorumEngine';

function runTests() {
  console.log('--- STARTING QUORUM & EMERGENT AUTHORITY TESTS ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  const supplierAdmin = HACKATHON_PERSONAS['supplier-admin'];
  const complianceOfficer = HACKATHON_PERSONAS['compliance-officer'];
  const customerA = HACKATHON_PERSONAS['customer-a'];
  const customerB = HACKATHON_PERSONAS['customer-b'];
  const auditor = HACKATHON_PERSONAS['auditor'];

  const pkg1 = INITIAL_EVIDENCE_PACKAGES[0]; // Active, authorized for Customer A (Pacific Avionics)
  const pkg2 = INITIAL_EVIDENCE_PACKAGES[1]; // Pending Quorum (1/2 signatures)

  // Test 1: Customer A can access pkg1 (Authorized, 2/2 signed)
  const res1 = evaluateEvidenceAccess(customerA, pkg1);
  assert(res1.allowed && res1.code === 'OK', 'Customer A can access authorized package PKG-SEMI-2026-A1');

  // Test 2: Customer B is BLOCKED from accessing pkg1 (Cross-tenant violation)
  const res2 = evaluateEvidenceAccess(customerB, pkg1);
  assert(!res2.allowed && res2.code === 'CROSS_TENANT_VIOLATION', 'Customer B is blocked by Cross-Tenant boundary for PKG-SEMI-2026-A1');

  // Test 3: Customer A CANNOT access pkg2 yet because it has only 1/2 signatures (Pending Quorum)
  const res3 = evaluateEvidenceAccess(customerA, pkg2);
  assert(!res3.allowed && res3.code === 'NO_QUORUM', 'Customer A blocked from PKG-AVIO-770 because 2-of-2 Quorum is incomplete');

  // Test 4: Rogue Admin attempt to unilaterally override fails unconditionally
  const rogueAttempt = attemptRogueAdminOverride(pkg2, supplierAdmin, customerA.tenantId);
  assert(rogueAttempt.success === false && rogueAttempt.auditEntry.outcome === 'OVERRIDE_REJECTED', 'Rogue Admin override fails: No unilateral master key exists');

  // Test 5: Compliance Officer co-signs -> Emergent Authority emerges and Customer A gains access
  const coSignResult = coSignQuorumApproval(pkg2, complianceOfficer);
  assert(coSignResult.success === true, 'Compliance officer successfully provides second cryptographic key (2/2)');
  assert(coSignResult.updatedPkg.status === 'Emergent Authority Active', 'Status elevates to Emergent Authority Active');
  
  const resPostCoSign = evaluateEvidenceAccess(customerA, coSignResult.updatedPkg);
  assert(resPostCoSign.allowed === true, 'Customer A can now access PKG-AVIO-770 after 2/2 co-signing');

  // Test 6: Supplier Admin initiates proposal for pkg4
  const pkg4 = INITIAL_EVIDENCE_PACKAGES[3];
  const proposalResult = proposeScopeExpansion(pkg4, supplierAdmin, customerB.tenantId, customerB.orgName, 'Testing supplier expansion');
  assert(proposalResult.success === true && proposalResult.updatedPkg.signatures.length === 1, 'Supplier Admin proposes scope expansion (Key 1/2 provided)');

  console.log(`\nTEST SUMMARY: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
