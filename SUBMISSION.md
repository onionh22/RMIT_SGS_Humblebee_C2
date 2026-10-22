# 🏆 RMIT UNLOCKED Hackathon — Submission Package

**Team**: Humblebee  
**Challenge**: Challenge 2 — UNLOCKED (Tide Foundation × RMIT)  
**Project**: CargoTrust — Trade Document Authority & Execution Gateway  
**Repository**: [onionh22/RMIT_SGS_Humblebee_C2](https://github.com/onionh22/RMIT_SGS_Humblebee_C2)  
**Demo Video**: [Humblebee.mp4 on Google Drive](https://drive.google.com/file/d/1OlzRfKkmDd5HobUww7VbboO0Wmh1Ihzb/view)  

---

## 1. Project Overview (≤300 words)

Semiconductor supply chains require competing customers (e.g., aerospace primes and smartphone manufacturers) to rely on shared fabrication facilities while strictly isolating proprietary wafer yield maps and ITAR-controlled provenance records. Today, these supply chains depend on centralized document platforms where a single compromised cloud administrator or automated AI ingestion pipeline can unilaterally decrypt and exfiltrate all tenant data.

**CargoTrust** solves this by enforcing **TideCloak Emergent Authority** directly onto trade execution workflows. In CargoTrust, no single administrator, tenant, or AI agent can unilaterally release sensitive semiconductor evidence packages:

1. **2-of-2 Quorum Signing**: Releasing a sensitive wafer evidence package requires independent cryptographic co-signing from both Supplier Operations (Sarah Chen) and External Compliance (Dr. Elena Vance). The authority key emerges only when the threshold is met across independent nodes.
2. **Cross-Tenant Cryptographic Isolation**: Even after evidence release, customer data is partitioned so Customer A (Pacific Aerospace) cannot view packages addressed to Customer B (Nova Mobile), even if a malicious admin attempts an override.
3. **AI Policy Guardrails**: Gemini AI performs deep 3-way discrepancy analysis across Bills of Lading, Commercial Invoices, and Packing Lists, but policies explicitly revoke autonomous signing power from AI.
4. **Zero Single-Point-of-Failure**: Modeled on TideCloak's distributed threshold cryptography with 0 master keys.

---

## 2. TideCloak Integration Architecture

- **Matched Tide Scenario**: `policy-governed-signing` (threshold quorum + multi-party policy enforcement)
- **Emergent Authority**: Modeled across 4 independent decentralized nodes
- **RBAC & DPoP Token Binding**: Role-based access control with cryptographic proof-of-possession

---

## 3. Quickstart & Verification

```bash
# Clone
git clone https://github.com/onionh22/RMIT_SGS_Humblebee_C2.git
cd RMIT_SGS_Humblebee_C2

# Install dependencies
npm install --legacy-peer-deps

# Run type check
npx tsc --noEmit

# Start dev server
npm run dev
```

App runs at `http://localhost:3000`.

---

## 4. 2-Minute Demo Flow

1. **Dashboard Overview**: Multi-persona gateway view.
2. **Evidence Exchange**: Propose Quorum (Key 1/2) with Supplier Admin.
3. **Emergent Authority**: Co-sign with Compliance Officer (Key 2/2) ➔ Threshold unlocks package.
4. **Tenant Isolation**: Switch to Customer A (Granted) vs Customer B (Denied).
5. **Rogue Admin Block**: Attempt unauthorized override ➔ Blocked by decentralized policy.
