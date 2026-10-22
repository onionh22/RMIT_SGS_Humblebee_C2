<div align="center">

# 🔐 CargoTrust — Trade Document Authority & Execution Gateway

**AI-powered document intelligence and distributed authorization gateway for semiconductor trade documents**

*UNLOCKED Hackathon — RMIT × Tide Foundation, October 2026*

</div>

---

## Project Overview

**One-sentence description:** CargoTrust is a semiconductor supply-chain document gateway where sensitive evidence packages (wafer yield data, ITAR-controlled schematics, ASIC blueprints) can only be accessed through TideCloak's Emergent Authority — no single administrator, server, or AI agent can unilaterally unlock protected data.

### 1. What possibility does your app unlock?

Semiconductor manufacturers must share restricted fabrication evidence (defect density logs, radiation-tolerance test data, conflict minerals proofs) with customers for compliance — but sharing means trusting one admin with a master key to everything. CargoTrust unlocks **trustworthy cross-organization evidence sharing** where competing customers (e.g., an aerospace firm vs. a smartphone OEM) access only their authorized packages, and no single party can leak the other's data.

### 2. What trust problem holds it back today?

Today, a single supply-chain administrator holds a master key that can unilaterally decrypt and share any customer's confidential fab data. One compromised admin = total exposure of proprietary wafer yields, export-controlled schematics, and trade secrets across all customers simultaneously.

### 3. How does TideCloak change what your app can do?

TideCloak's **Emergent Authority** replaces the master key with a **2-of-2 dual-key quorum**: a Supplier Admin proposes access, and an independent Compliance Officer must co-sign before the threshold-cryptographic authority *emerges*. No assembled master key ever exists. Cross-tenant cryptographic isolation ensures Customer A's aerospace data is mathematically invisible to Customer B's consumer electronics team.

### 4. What is TideCloak's role in your prototype?

TideCloak enforces: **(a)** threshold-based evidence unlocking (2-of-2 quorum signing), **(b)** cross-tenant cryptographic isolation between competing customers, **(c)** rogue admin override detection (unilateral bypass attempts are blocked and audit-logged), and **(d)** AI agent guardrails — the AI can extract and analyze documents but is policy-blocked from approving or signing.

### 5. What would break if you removed TideCloak?

Without TideCloak, the system reverts to a single admin with a master key. One phished credential = all customers' ITAR data, wafer yields, and ASIC blueprints exposed simultaneously. The 2-of-2 quorum becomes a checkbox, not a cryptographic guarantee. Cross-tenant isolation becomes a database filter any SQL injection bypasses.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🔑 **2-of-2 Emergent Authority Quorum** | Dual-key signing: Supplier Admin + Compliance Officer must both sign before access emerges |
| 🏢 **Cross-Tenant Cryptographic Isolation** | Competing customers (Pacific Avionics vs. Apex Mobile) mathematically isolated |
| 🤖 **AI Document Intelligence** | Gemini-powered 3-way matching (PO ↔ Invoice ↔ GRN) with policy-enforced AI guardrails |
| 🛡️ **Rogue Admin Detection** | Unilateral override attempts are blocked and immutably audit-logged |
| 👥 **5-Persona Role Switching** | Live demo with Supplier Admin, Compliance Officer, Customer A, Customer B, Auditor |
| 🌐 **Bilingual (Vietnamese/English)** | Full interface in both languages |
| 📊 **TideCloak Security Center** | Real-time view of distributed nodes, capability tokens, and consensus status |

---

## 🚀 Run Locally

**Prerequisites:** Node.js 18+

```bash
# 1. Install dependencies
npm install

# 2. Set your Gemini API key (for AI document matching)
cp .env.example .env.local
# Edit .env.local and set GEMINI_API_KEY

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> **Note:** The app works fully without a Gemini API key — AI features will gracefully degrade. All TideCloak security features (quorum, isolation, rogue detection) work independently.

---

## 🎮 Demo Walkthrough

### Scenario: Semiconductor Evidence Exchange

1. **Start as Sarah Chen** (Supplier Admin) → Navigate to "Evidence Exchange"
2. **Propose quorum** on a Pending package → Key 1/2 is provided
3. **Switch to Dr. Elena Vance** (Compliance Officer) → Co-sign the quorum → Emergent Authority activates!
4. **Switch to Marcus Cole** (Customer A - Aerospace) → Access the unlocked evidence ✅
5. **Switch to James Park** (Customer B - Mobile) → Access DENIED (cross-tenant isolation) 🚫
6. **Try "Rogue Admin Override"** → BLOCKED by Emergent Authority 🛡️
7. **Switch to David Wright** (Auditor) → Inspect the immutable audit trail 📋

### Bonus: AI Document Intelligence

- Navigate to "Orders" → Select ORD-2026-001 → "AI Cross-Review" tab
- Watch AI perform 3-way matching — then try to make AI approve (blocked by policy!)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CargoTrust Frontend                    │
│  React + Vite + TailwindCSS + Motion                     │
├──────────────┬──────────────┬───────────────────────────┤
│ Evidence     │ Document     │ TideCloak Security        │
│ Exchange     │ Intelligence │ Center                    │
│ (Quorum UI)  │ (3-Way Match)│ (Nodes + Tokens)         │
├──────────────┴──────────────┴───────────────────────────┤
│                    Policy Engine                         │
│  quorumEngine.ts  │  policyEngine.ts  │  orderEngine.ts │
│  - 2-of-2 Quorum  │  - Separation of  │  - Document     │
│  - Tenant Isolate  │    Duties         │    Lifecycle    │
│  - Rogue Detect    │  - AI Guardrails  │  - Status FSM   │
├─────────────────────────────────────────────────────────┤
│              TideCloak Emergent Authority                 │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                │
│  │Node 1│  │Node 2│  │Node 3│  │Node 4│  (Distributed) │
│  │US-E  │  │EU-C  │  │APAC  │  │CH-ZH │  (No Master    │
│  │Share1│  │Share2│  │Share3│  │Share4│   Key)          │
│  └──────┘  └──────┘  └──────┘  └──────┘                │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Tech Stack

- **Frontend:** React 19 + TypeScript + Vite 8
- **Styling:** TailwindCSS 4 + DM Sans + JetBrains Mono
- **AI:** Google Gemini API (document intelligence)
- **Animation:** Motion (framer-motion)
- **Icons:** Lucide React
- **Security:** TideCloak Emergent Authority (simulated)

---

## 📁 Project Structure

```
src/
├── App.tsx                    # Main app with routing & state
├── components/
│   ├── EvidenceExchange.tsx    # 🌟 Flagship: Quorum + Tenant Isolation
│   ├── TideSecurityCenter.tsx  # Distributed node monitoring
│   ├── OrderWorkspaceView.tsx  # AI 3-way matching workspace
│   ├── ApprovalsView.tsx       # Policy-enforced approval flows
│   ├── PoliciesView.tsx        # Governance policy configuration
│   └── ...                    # 15+ more components
├── utils/
│   ├── quorumEngine.ts        # 🔑 Emergent Authority engine
│   ├── policyEngine.ts        # Separation of Duties + AI limits
│   └── orderEngine.ts         # Document lifecycle management
├── types/index.ts             # Full TypeScript type system
├── data/                      # Realistic semiconductor trade data
└── i18n/                      # Vietnamese/English translations
```

---

## 📜 License

MIT

---

<div align="center">

**Built for UNLOCKED — RMIT × Tide Foundation Hackathon 2026**

*"What would you build if trust stopped being the bottleneck?"*

</div>
