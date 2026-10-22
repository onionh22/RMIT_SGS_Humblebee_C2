import { 
  DocumentRecord, 
  ApprovalRecord, 
  PolicyRule, 
  Counterparty, 
  AuditLogEntry, 
  UserSession 
} from '../types';

export const USERS: Record<string, UserSession> = {
  sarah: {
    id: 'usr-sarah',
    name: 'Sarah Chen',
    email: 'sarah.chen@atlascomponents.com',
    role: 'Operations Manager',
    avatar: 'SC',
    department: 'Supply Chain Operations'
  },
  minh: {
    id: 'usr-minh',
    name: 'Minh Le',
    email: 'minh.le@atlascomponents.com',
    role: 'Procurement Specialist',
    avatar: 'ML',
    department: 'Procurement'
  },
  david: {
    id: 'usr-david',
    name: 'David Nguyen',
    email: 'david.nguyen@atlascomponents.com',
    role: 'Finance Approver',
    avatar: 'DN',
    department: 'Treasury & Finance'
  },
  admin: {
    id: 'usr-admin',
    name: 'Elena Rostova',
    email: 'elena.r@atlascomponents.com',
    role: 'Compliance Admin',
    avatar: 'ER',
    department: 'Internal Controls & Audit'
  },
  ai: {
    id: 'usr-ai',
    name: 'CargoTrust AI Engine',
    email: 'ai-gateway@cargotrust.internal',
    role: 'AI Agent',
    avatar: 'AI',
    department: 'Document Intelligence'
  }
};

export const INITIAL_COUNTERPARTIES: Counterparty[] = [
  {
    id: 'CP-01',
    name: 'Nippon Components Ltd.',
    code: 'NCL-JP',
    type: 'Supplier',
    country: 'Japan',
    countryCode: 'JP',
    status: 'Verified',
    linkedDocsCount: 4,
    contactEmail: 'orders@nipponcomponents.co.jp',
    trustScore: 98
  },
  {
    id: 'CP-02',
    name: 'Meridian Trade GmbH',
    code: 'MTG-DE',
    type: 'Buyer',
    country: 'Germany',
    countryCode: 'DE',
    status: 'Verified',
    linkedDocsCount: 3,
    contactEmail: 'logistics@meridiantrade.de',
    trustScore: 95
  },
  {
    id: 'CP-03',
    name: 'BlueWave Shipping Ltd.',
    code: 'BWS-SG',
    type: 'Carrier',
    country: 'Singapore',
    countryCode: 'SG',
    status: 'Verified',
    linkedDocsCount: 2,
    contactEmail: 'ocean-ops@bluewave.sg',
    trustScore: 99
  },
  {
    id: 'CP-04',
    name: 'Eastport Logistics JSC',
    code: 'EPL-VN',
    type: 'Freight forwarder',
    country: 'Vietnam',
    countryCode: 'VN',
    status: 'Verified',
    linkedDocsCount: 3,
    contactEmail: 'customs@eastport.vn',
    trustScore: 96
  },
  {
    id: 'CP-05',
    name: 'Shenzhen Apex Semiconductors',
    code: 'SAS-CN',
    type: 'Supplier',
    country: 'China',
    countryCode: 'CN',
    status: 'Pending Verification',
    linkedDocsCount: 1,
    contactEmail: 'sales@apexsemi.cn',
    trustScore: 88
  },
  {
    id: 'CP-06',
    name: 'Seoul Electronics Ltd.',
    code: 'SEL-KR',
    type: 'Supplier',
    country: 'South Korea',
    countryCode: 'KR',
    status: 'Verified',
    linkedDocsCount: 5,
    contactEmail: 'export@seoulelectronics.co.kr',
    trustScore: 97
  }
];

export const INITIAL_DOCUMENTS: DocumentRecord[] = [
  {
    id: 'DOC-2408',
    name: 'Commercial_Invoice_INV-2408.pdf',
    type: 'Commercial Invoice',
    fileExt: 'PDF',
    referenceNumber: 'INV-2408',
    counterparty: 'Nippon Components Ltd.',
    updatedDate: '22 Oct 2026, 09:43',
    amount: 18420.00,
    currency: 'USD',
    status: 'Needs Review',
    ownerId: 'usr-minh',
    ownerName: 'Minh Le',
    linkedPoRef: 'PO-1182',
    linkedGrnRef: 'GRN-8841',
    version: '1.0',
    fileHash: 'sha256: 6f8a3d9021e8b2d1c7a45691024e',
    isTampered: false,
    description: 'Invoice for shipment SHP-8841. AI 3-Way Match detected quantity variance: 240 units billed vs 220 authorized on PO-1182.',
    lineItems: [
      {
        id: 'li-2408-1',
        itemCode: 'MCU-STM32F4-LQFP',
        description: 'ARM Cortex-M4 32-bit MCU 168MHz LQFP-100',
        poQuantity: 220,
        grnQuantity: 220,
        invoiceQuantity: 240, // Discrepancy!
        unitPrice: 76.75,
        currency: 'USD',
        unit: 'pcs',
        lineTotal: 18420.00,
        varianceStatus: 'mismatch',
        notes: 'Billed 240 pcs. Physical receipt GRN-8841 only confirmed 220 pcs.'
      }
    ],
    events: [
      {
        id: 'ev-1',
        timestamp: '22 Oct 2026, 09:42:15',
        actor: 'Minh Le',
        role: 'Procurement Specialist',
        event: 'Document uploaded',
        details: 'Uploaded supplier commercial invoice PDF for shipment SHP-8841.',
        tone: 'blue'
      },
      {
        id: 'ev-2',
        timestamp: '22 Oct 2026, 09:43:01',
        actor: 'CargoTrust AI',
        role: 'AI Agent',
        event: 'OCR Extraction & 3-Way Cross Check',
        details: 'Extracted 1 line item. Detected +20 units quantity variance vs Purchase Order PO-1182.',
        tone: 'red'
      },
      {
        id: 'ev-3',
        timestamp: '22 Oct 2026, 09:43:18',
        actor: 'Policy Engine',
        role: 'System Gate',
        event: 'Execution Gate Locked',
        details: 'Signing blocked. Exception review requested before authorized release.',
        tone: 'amber'
      }
    ],
    metadata: {
      originCountry: 'Japan',
      destinationCountry: 'Vietnam (Hai Phong Port)',
      containerNo: 'TGHU-9921408',
      incoterms: 'CIF Hai Phong',
      paymentTerms: 'Net 30 Days'
    }
  },
  {
    id: 'DOC-2407',
    name: 'Purchase_Order_PO-1182.pdf',
    type: 'Purchase Order',
    fileExt: 'PDF',
    referenceNumber: 'PO-1182',
    counterparty: 'Nippon Components Ltd.',
    updatedDate: '21 Oct 2026, 15:46',
    amount: 16885.00,
    currency: 'USD',
    status: 'Approved',
    ownerId: 'usr-sarah',
    ownerName: 'Sarah Chen',
    version: '1.0',
    fileHash: 'sha256: 22c198bfa76191a742cd9018e472',
    isTampered: false,
    description: 'Authorized purchase order baseline for microcontrollers, shipment SHP-8841.',
    lineItems: [
      {
        id: 'li-1182-1',
        itemCode: 'MCU-STM32F4-LQFP',
        description: 'ARM Cortex-M4 32-bit MCU 168MHz LQFP-100',
        poQuantity: 220,
        unitPrice: 76.75,
        currency: 'USD',
        unit: 'pcs',
        lineTotal: 16885.00,
        varianceStatus: 'matched'
      }
    ],
    events: [
      {
        id: 'ev-po-1',
        timestamp: '21 Oct 2026, 14:10:00',
        actor: 'Minh Le',
        role: 'Procurement Specialist',
        event: 'PO Draft created',
        details: 'Draft PO prepared for Q4 manufacturing run.',
        tone: 'blue'
      },
      {
        id: 'ev-po-2',
        timestamp: '21 Oct 2026, 15:46:20',
        actor: 'Sarah Chen',
        role: 'Operations Manager',
        event: 'Procurement approval recorded',
        details: 'Budget verified against Project Atlas Q4 allocations.',
        tone: 'green'
      }
    ],
    metadata: {
      originCountry: 'Japan',
      destinationCountry: 'Vietnam',
      paymentTerms: 'Net 30 Days',
      incoterms: 'CIF Hai Phong'
    }
  },
  {
    id: 'DOC-2409',
    name: 'Goods_Receipt_GRN-8841.pdf',
    type: 'Goods Receipt Note',
    fileExt: 'PDF',
    referenceNumber: 'GRN-8841',
    counterparty: 'Eastport Logistics JSC',
    updatedDate: '22 Oct 2026, 08:30',
    amount: null,
    currency: 'USD',
    status: 'Validation Passed',
    ownerId: 'usr-sarah',
    ownerName: 'Sarah Chen',
    linkedPoRef: 'PO-1182',
    version: '1.0',
    fileHash: 'sha256: ee8419ca012847c1f8a93108c5e2',
    isTampered: false,
    description: 'Hai Phong Bonded Warehouse receipt verification for container TGHU-9921408.',
    lineItems: [
      {
        id: 'li-grn-1',
        itemCode: 'MCU-STM32F4-LQFP',
        description: 'ARM Cortex-M4 32-bit MCU 168MHz LQFP-100',
        grnQuantity: 220,
        unitPrice: 76.75,
        currency: 'USD',
        unit: 'pcs',
        lineTotal: 16885.00,
        varianceStatus: 'matched',
        notes: 'Seal intact (BWS-9982). 11 cartons inspected, exactly 220 units received in good order.'
      }
    ],
    events: [
      {
        id: 'ev-grn-1',
        timestamp: '22 Oct 2026, 08:30:11',
        actor: 'Warehouse Intake Clerk',
        role: 'Operations Staff',
        event: 'Tally sheet verified',
        details: 'Physical count completed and uploaded to CargoTrust warehouse node.',
        tone: 'green'
      }
    ],
    metadata: {
      containerNo: 'TGHU-9921408',
      customsDeclarationNo: 'VN-HP-2026-98124'
    }
  },
  {
    id: 'DOC-2406',
    name: 'Sales_Contract_SC-092.pdf',
    type: 'Sales Contract',
    fileExt: 'PDF',
    referenceNumber: 'SC-092',
    counterparty: 'Meridian Trade GmbH',
    updatedDate: '21 Oct 2026, 11:05',
    amount: 42000.00,
    currency: 'USD',
    status: 'Pending Approval',
    ownerId: 'usr-minh',
    ownerName: 'Minh Le',
    version: '2.0',
    fileHash: 'sha256: 7a3d99e0192ca821ef903417b321',
    isTampered: false,
    description: 'High-value European export agreement ($42,000 > $10,000 threshold). 2 independent authorized approvals required.',
    lineItems: [
      {
        id: 'li-sc-1',
        itemCode: 'PWR-MOD-500W',
        description: 'Industrial Isolated Power Converters',
        poQuantity: 600,
        invoiceQuantity: 600,
        unitPrice: 70.00,
        currency: 'USD',
        unit: 'units',
        lineTotal: 42000.00,
        varianceStatus: 'matched'
      }
    ],
    events: [
      {
        id: 'ev-sc-1',
        timestamp: '21 Oct 2026, 11:05:00',
        actor: 'Minh Le',
        role: 'Procurement Specialist',
        event: 'Draft created',
        details: 'Initial bilateral sales contract terms agreed.',
        tone: 'blue'
      },
      {
        id: 'ev-sc-2',
        timestamp: '21 Oct 2026, 14:12:00',
        actor: 'Sarah Chen',
        role: 'Operations Manager',
        event: 'First approval recorded',
        details: 'Operations capacity and logistics schedule approved (1 of 2 required).',
        tone: 'green'
      }
    ],
    metadata: {
      originCountry: 'Vietnam',
      destinationCountry: 'Germany (Hamburg)',
      incoterms: 'FOB Da Nang',
      paymentTerms: 'Irrevocable L/C at Sight'
    }
  },
  {
    id: 'DOC-2404',
    name: 'Bill_of_Lading_BL-5531.pdf',
    type: 'Bill of Lading',
    fileExt: 'PDF',
    referenceNumber: 'BL-5531',
    counterparty: 'BlueWave Shipping Ltd.',
    updatedDate: '20 Oct 2026, 09:03',
    amount: null,
    currency: 'USD',
    status: 'Signed',
    ownerId: 'usr-sarah',
    ownerName: 'Sarah Chen',
    version: '3.0',
    fileHash: 'sha256: 45bf8901ac8708c2a912e7428109',
    isTampered: false,
    description: 'Ocean Bill of Lading with cryptographic signing verification and port release credentials.',
    lineItems: [
      {
        id: 'li-bl-1',
        itemCode: 'SHP-CONTAINER-40HC',
        description: '1 x 40ft High Cube Container (80 pallets components)',
        poQuantity: 80,
        unitPrice: 0,
        currency: 'USD',
        unit: 'pallets',
        lineTotal: 0,
        varianceStatus: 'matched'
      }
    ],
    events: [
      {
        id: 'ev-bl-1',
        timestamp: '20 Oct 2026, 08:21:00',
        actor: 'BlueWave Master Port Agent',
        role: 'Carrier',
        event: 'Draft B/L lodged',
        details: 'Vessel Viking Ocean voyage 42B loading completed.',
        tone: 'blue'
      },
      {
        id: 'ev-bl-2',
        timestamp: '20 Oct 2026, 09:03:10',
        actor: 'David Nguyen',
        role: 'Finance Approver',
        event: 'Protected signing verified',
        details: 'Cryptographic authorization token stamped to document hash.',
        tone: 'green'
      }
    ],
    metadata: {
      vesselName: 'M/V Viking Ocean v.42B',
      containerNo: 'MSCU-1029841',
      originCountry: 'Singapore',
      destinationCountry: 'Hai Phong, Vietnam'
    }
  },
  {
    id: 'DOC-2402',
    name: 'Commercial_Invoice_INV-2391.pdf',
    type: 'Commercial Invoice',
    fileExt: 'PDF',
    referenceNumber: 'INV-2391',
    counterparty: 'Meridian Trade GmbH',
    updatedDate: '18 Oct 2026, 10:48',
    amount: 9750.00,
    currency: 'USD',
    status: 'Signed',
    ownerId: 'usr-minh',
    ownerName: 'Minh Le',
    linkedPoRef: 'PO-1168',
    version: '2.0',
    fileHash: 'sha256: 990cd18e401289fe81bc427810aa',
    isTampered: false,
    description: '3-Way matching clean pass. Matched with PO-1168 and signed under policy authority.',
    lineItems: [
      {
        id: 'li-2391-1',
        itemCode: 'REL-IND-24V',
        description: 'Industrial Heavy-Duty Relay Modules 24V DC',
        poQuantity: 150,
        invoiceQuantity: 150,
        unitPrice: 65.00,
        currency: 'USD',
        unit: 'pcs',
        lineTotal: 9750.00,
        varianceStatus: 'matched'
      }
    ],
    events: [
      {
        id: 'ev-inv2-1',
        timestamp: '18 Oct 2026, 10:15:00',
        actor: 'CargoTrust AI',
        role: 'AI Agent',
        event: 'AI extraction completed',
        details: 'All 4 critical fields match baseline PO-1168 perfectly.',
        tone: 'green'
      },
      {
        id: 'ev-inv2-2',
        timestamp: '18 Oct 2026, 10:48:30',
        actor: 'Sarah Chen',
        role: 'Operations Manager',
        event: 'Authorized execution completed',
        details: 'Payment instructions dispatched to treasury.',
        tone: 'green'
      }
    ],
    metadata: {
      paymentTerms: 'Net 15 Days',
      incoterms: 'FOB Da Nang'
    }
  },
  {
    id: 'DOC-SC-001',
    name: 'Sales_Contract_SC-2026-KR.pdf',
    type: 'Sales Contract',
    fileExt: 'PDF',
    referenceNumber: 'SC-2026-KR',
    counterparty: 'Seoul Electronics Ltd.',
    updatedDate: '15 Oct 2026, 14:20',
    amount: 18420.00,
    currency: 'USD',
    status: 'Approved',
    ownerId: 'usr-minh',
    ownerName: 'Minh Le',
    version: '1.0',
    fileHash: 'sha256: 3c1a892b109e44ff81dc990172ba',
    isTampered: false,
    description: 'Bilateral international sales contract for ARM Cortex-M4 microcontrollers. 220 pcs contracted at $76.75/unit + CIF Hai Phong freight.',
    lineItems: [
      {
        id: 'li-sc001-1',
        itemCode: 'MCU-ARM-M4-168',
        description: 'ARM Cortex-M4 32-bit MCU 168MHz LQFP-100',
        poQuantity: 220,
        unitPrice: 76.75,
        currency: 'USD',
        unit: 'pcs',
        lineTotal: 16885.00,
        varianceStatus: 'matched'
      }
    ],
    events: [
      {
        id: 'ev-sc1-1',
        timestamp: '15 Oct 2026, 14:20:00',
        actor: 'Minh Le',
        role: 'Procurement Specialist',
        event: 'Contract ratified & uploaded',
        details: 'Signed bilateral contract terms registered into CargoTrust.',
        tone: 'blue'
      }
    ],
    metadata: {
      originCountry: 'South Korea',
      destinationCountry: 'Hai Phong, Vietnam',
      incoterms: 'CIF Hai Phong',
      paymentTerms: 'L/C at sight, 30 days'
    }
  },
  {
    id: 'DOC-PL-2408',
    name: 'Packing_List_PL-2408.pdf',
    type: 'Packing List',
    fileExt: 'PDF',
    referenceNumber: 'PL-2408',
    counterparty: 'Seoul Electronics Ltd.',
    updatedDate: '22 Oct 2026, 09:44',
    amount: null,
    currency: 'USD',
    status: 'Needs Review',
    ownerId: 'usr-minh',
    ownerName: 'Minh Le',
    linkedPoRef: 'PO-1182',
    version: '1.0',
    fileHash: 'sha256: 77a1bc9204fe8812eac9001b9199',
    isTampered: false,
    description: 'Supplier packing list specification. Lists 12 cartons x 20 pcs = 240 pcs total (+20 pcs variance vs PO-1182).',
    lineItems: [
      {
        id: 'li-pl2408-1',
        itemCode: 'MCU-ARM-M4-168',
        description: 'ARM Cortex-M4 32-bit MCU (Cartons 01-12)',
        poQuantity: 220,
        invoiceQuantity: 240,
        unitPrice: 0,
        currency: 'USD',
        unit: 'pcs',
        lineTotal: 0,
        varianceStatus: 'mismatch',
        notes: 'Cartons count indicates 240 pcs packaged instead of 220 pcs agreed.'
      }
    ],
    events: [
      {
        id: 'ev-pl-1',
        timestamp: '22 Oct 2026, 09:44:00',
        actor: 'CargoTrust AI',
        role: 'AI Agent',
        event: 'Packing list variance detected',
        details: 'Package specification indicates 240 units billed and shipped.',
        tone: 'red'
      }
    ],
    metadata: {
      containerNo: 'TGHU-9921408',
      sealNo: 'BWS-9982',
      grossWeight: '48.5 kg',
      packagesCount: '12 Cartons'
    }
  },
  {
    id: 'DOC-BL-8841',
    name: 'Bill_of_Lading_BL-8841-BWS.pdf',
    type: 'Bill of Lading',
    fileExt: 'PDF',
    referenceNumber: 'BL-8841-BWS',
    counterparty: 'BlueWave Shipping Ltd.',
    updatedDate: '22 Oct 2026, 07:15',
    amount: null,
    currency: 'USD',
    status: 'Signed',
    ownerId: 'usr-sarah',
    ownerName: 'Sarah Chen',
    version: '1.0',
    fileHash: 'sha256: 881bc2014ea7190011feaa498021',
    isTampered: false,
    description: 'Clean on Board Ocean Bill of Lading for container TGHU-9921408 on M/V Pacific Carrier voyage 12E.',
    lineItems: [
      {
        id: 'li-bl8841-1',
        itemCode: 'CONTAINER-20GP',
        description: '1 x 20ft Standard Dry Container (Electronic components)',
        poQuantity: 1,
        unitPrice: 0,
        currency: 'USD',
        unit: 'cntr',
        lineTotal: 0,
        varianceStatus: 'matched'
      }
    ],
    events: [
      {
        id: 'ev-bl8841-1',
        timestamp: '22 Oct 2026, 07:15:00',
        actor: 'BlueWave Port Operations',
        role: 'Carrier',
        event: 'Ocean B/L release lodged',
        details: 'Vessel arrived at Hai Phong Tan Vu Port.',
        tone: 'green'
      }
    ],
    metadata: {
      vesselName: 'M/V Pacific Carrier v.12E',
      containerNo: 'TGHU-9921408',
      sealNo: 'BWS-9982',
      portOfLoading: 'Busan Port, Korea',
      portOfDischarge: 'Hai Phong Port, Vietnam'
    }
  },
  {
    id: 'DOC-CO-8841',
    name: 'Certificate_of_Origin_CO-KR-8841.pdf',
    type: 'Certificate of Origin',
    fileExt: 'PDF',
    referenceNumber: 'CO-KR-8841',
    counterparty: 'Seoul Electronics Ltd.',
    updatedDate: '22 Oct 2026, 10:15',
    amount: null,
    currency: 'USD',
    status: 'Validation Passed',
    ownerId: 'usr-minh',
    ownerName: 'Minh Le',
    version: '1.0',
    fileHash: 'sha256: 91fe4012ca7781b29401dd89012a',
    isTampered: false,
    description: 'Preferential Certificate of Origin Form VK (Vietnam-Korea Free Trade Agreement) issued by Korea Chamber of Commerce.',
    lineItems: [
      {
        id: 'li-co8841-1',
        itemCode: 'HS-8542.31.00',
        description: 'Electronic integrated circuits: Processors & controllers',
        poQuantity: 220,
        unitPrice: 0,
        currency: 'USD',
        unit: 'pcs',
        lineTotal: 0,
        varianceStatus: 'matched'
      }
    ],
    events: [
      {
        id: 'ev-co8841-1',
        timestamp: '22 Oct 2026, 10:15:00',
        actor: 'Korea Chamber of Commerce',
        role: 'Authority',
        event: 'C/O Form VK certified',
        details: 'Tariff preference eligible under VKFTA agreement.',
        tone: 'green'
      }
    ],
    metadata: {
      originCountry: 'South Korea',
      destinationCountry: 'Vietnam',
      hsCode: '8542.31.00',
      issuingAuthority: 'Korea Chamber of Commerce & Industry'
    }
  },
  {
    id: 'DOC-INV-092',
    name: 'Commercial_Invoice_INV-092.pdf',
    type: 'Commercial Invoice',
    fileExt: 'PDF',
    referenceNumber: 'INV-092',
    counterparty: 'Meridian Trade GmbH',
    updatedDate: '21 Oct 2026, 11:30',
    amount: 42000.00,
    currency: 'USD',
    status: 'Pending Approval',
    ownerId: 'usr-minh',
    ownerName: 'Minh Le',
    linkedPoRef: 'SC-092',
    version: '1.0',
    fileHash: 'sha256: 12ac4901fef788210384719002bb',
    isTampered: false,
    description: 'Export commercial invoice for 600 units industrial power modules. Matches Sales Contract SC-092 perfectly.',
    lineItems: [
      {
        id: 'li-inv092-1',
        itemCode: 'PWR-MOD-500W',
        description: 'Industrial Isolated Power Converters 500W',
        poQuantity: 600,
        invoiceQuantity: 600,
        unitPrice: 70.00,
        currency: 'USD',
        unit: 'units',
        lineTotal: 42000.00,
        varianceStatus: 'matched'
      }
    ],
    events: [
      {
        id: 'ev-inv092-1',
        timestamp: '21 Oct 2026, 11:30:00',
        actor: 'Minh Le',
        role: 'Procurement Specialist',
        event: 'Export Invoice drafted',
        details: '600 units billed to Meridian Trade GmbH at $70.00/unit FOB Da Nang.',
        tone: 'blue'
      }
    ],
    metadata: {
      originCountry: 'Vietnam',
      destinationCountry: 'Germany',
      incoterms: 'FOB Da Nang',
      paymentTerms: 'Irrevocable L/C at Sight'
    }
  },
  {
    id: 'DOC-PL-092',
    name: 'Packing_List_PL-092.pdf',
    type: 'Packing List',
    fileExt: 'PDF',
    referenceNumber: 'PL-092',
    counterparty: 'Meridian Trade GmbH',
    updatedDate: '21 Oct 2026, 12:00',
    amount: null,
    currency: 'USD',
    status: 'Approved',
    ownerId: 'usr-minh',
    ownerName: 'Minh Le',
    version: '1.0',
    fileHash: 'sha256: 9481fe01ac8829011ee90014ca99',
    isTampered: false,
    description: 'Export packing list: 30 wooden crates x 20 units = 600 units total. All serial numbers verified.',
    lineItems: [
      {
        id: 'li-pl092-1',
        itemCode: 'PWR-MOD-500W',
        description: 'Power Converters (Crates 01-30)',
        poQuantity: 600,
        invoiceQuantity: 600,
        unitPrice: 0,
        currency: 'USD',
        unit: 'units',
        lineTotal: 0,
        varianceStatus: 'matched'
      }
    ],
    events: [
      {
        id: 'ev-pl092-1',
        timestamp: '21 Oct 2026, 12:00:00',
        actor: 'Atlas Factory QA Team',
        role: 'Operations Staff',
        event: 'Packaging inspected',
        details: 'Quality assurance certificate attached.',
        tone: 'green'
      }
    ],
    metadata: {
      containerNo: 'CMAU-8812901',
      grossWeight: '1,840 kg',
      packagesCount: '30 Crates'
    }
  },
  {
    id: 'DOC-BL-9912',
    name: 'Bill_of_Lading_BL-9912.pdf',
    type: 'Bill of Lading',
    fileExt: 'PDF',
    referenceNumber: 'BL-9912',
    counterparty: 'Eastport Logistics JSC',
    updatedDate: '22 Oct 2026, 08:00',
    amount: null,
    currency: 'USD',
    status: 'Signed',
    ownerId: 'usr-sarah',
    ownerName: 'Sarah Chen',
    version: '1.0',
    fileHash: 'sha256: a120ef992147bb0187219904ee21',
    isTampered: false,
    description: 'Ocean Bill of Lading for vessel CMA CGM Voltaire voyage 88 from Tien Sa Port, Da Nang to Hamburg.',
    lineItems: [
      {
        id: 'li-bl9912-1',
        itemCode: 'CONTAINER-40GP',
        description: '1 x 40ft General Purpose Container',
        poQuantity: 1,
        unitPrice: 0,
        currency: 'USD',
        unit: 'cntr',
        lineTotal: 0,
        varianceStatus: 'matched'
      }
    ],
    events: [
      {
        id: 'ev-bl9912-1',
        timestamp: '22 Oct 2026, 08:00:00',
        actor: 'Eastport Logistics JSC',
        role: 'Carrier',
        event: 'B/L confirmed on-board',
        details: 'Customs seal verified.',
        tone: 'green'
      }
    ],
    metadata: {
      vesselName: 'CMA CGM Voltaire v.88',
      containerNo: 'CMAU-8812901',
      portOfLoading: 'Da Nang, Vietnam',
      portOfDischarge: 'Hamburg, Germany'
    }
  },
  {
    id: 'DOC-CO-092',
    name: 'Certificate_of_Origin_CO-EUR1-092.pdf',
    type: 'Certificate of Origin',
    fileExt: 'PDF',
    referenceNumber: 'CO-EUR1-092',
    counterparty: 'Meridian Trade GmbH',
    updatedDate: '21 Oct 2026, 16:30',
    amount: null,
    currency: 'USD',
    status: 'Approved',
    ownerId: 'usr-minh',
    ownerName: 'Minh Le',
    version: '1.0',
    fileHash: 'sha256: 77281bc09144ee81099274ca8102',
    isTampered: false,
    description: 'Movement Certificate EUR.1 under EU-Vietnam Free Trade Agreement (EVFTA).',
    lineItems: [
      {
        id: 'li-co092-1',
        itemCode: 'HS-8504.40.90',
        description: 'Static converters for industrial automation',
        poQuantity: 600,
        unitPrice: 0,
        currency: 'USD',
        unit: 'units',
        lineTotal: 0,
        varianceStatus: 'matched'
      }
    ],
    events: [
      {
        id: 'ev-co092-1',
        timestamp: '21 Oct 2026, 16:30:00',
        actor: 'Vietnam Ministry of Industry & Trade',
        role: 'Authority',
        event: 'EUR.1 Form stamped',
        details: 'Origin criteria fulfilled under EVFTA protocol.',
        tone: 'green'
      }
    ],
    metadata: {
      originCountry: 'Vietnam',
      destinationCountry: 'Germany',
      agreement: 'EVFTA'
    }
  },
  {
    id: 'DOC-CD-092',
    name: 'Customs_Declaration_CD-DN-2026-90.pdf',
    type: 'Customs Declaration',
    fileExt: 'PDF',
    referenceNumber: 'CD-DN-2026-90',
    counterparty: 'Eastport Logistics JSC',
    updatedDate: '22 Oct 2026, 09:10',
    amount: null,
    currency: 'USD',
    status: 'Approved',
    ownerId: 'usr-sarah',
    ownerName: 'Sarah Chen',
    version: '1.0',
    fileHash: 'sha256: f19082bc814400192ea710294bba',
    isTampered: false,
    description: 'Vietnam Export Customs Declaration (Green Channel / Luồng xanh) approved by Da Nang Customs.',
    lineItems: [
      {
        id: 'li-cd092-1',
        itemCode: 'CD-EXPORT-GREEN',
        description: 'Export clearance channel cleared',
        poQuantity: 600,
        unitPrice: 0,
        currency: 'USD',
        unit: 'units',
        lineTotal: 0,
        varianceStatus: 'matched'
      }
    ],
    events: [
      {
        id: 'ev-cd092-1',
        timestamp: '22 Oct 2026, 09:10:00',
        actor: 'Da Nang Customs Department',
        role: 'Authority',
        event: 'Customs Clearance Approved',
        details: 'Green lane customs release issued.',
        tone: 'green'
      }
    ],
    metadata: {
      customsOffice: 'Da Nang Port Customs Sub-Department',
      declarationChannel: 'Green (Luồng Xanh)'
    }
  },
  {
    id: 'DOC-2401',
    name: 'Purchase_Order_PO-1168.pdf',
    type: 'Purchase Order',
    fileExt: 'PDF',
    referenceNumber: 'PO-1168',
    counterparty: 'Nippon Components Ltd.',
    updatedDate: '05 Oct 2026, 09:00',
    amount: 9750.00,
    currency: 'USD',
    status: 'Signed',
    ownerId: 'usr-minh',
    ownerName: 'Minh Le',
    version: '1.0',
    fileHash: 'sha256: 110948acfe8912e774011289feaa',
    isTampered: false,
    description: 'Purchase order for 150 industrial heavy-duty relays 24V DC at $65.00/unit.',
    lineItems: [
      {
        id: 'li-po1168-1',
        itemCode: 'REL-IND-24V',
        description: 'Industrial Heavy-Duty Relay Modules 24V DC',
        poQuantity: 150,
        unitPrice: 65.00,
        currency: 'USD',
        unit: 'pcs',
        lineTotal: 9750.00,
        varianceStatus: 'matched'
      }
    ],
    events: [
      {
        id: 'ev-po1168-1',
        timestamp: '05 Oct 2026, 09:00:00',
        actor: 'Minh Le',
        role: 'Procurement Specialist',
        event: 'PO authorized and transmitted',
        details: 'Approved PO sent to Nippon Components.',
        tone: 'green'
      }
    ],
    metadata: {
      originCountry: 'Japan',
      destinationCountry: 'Vietnam',
      paymentTerms: 'Net 15 Days',
      incoterms: 'FOB Da Nang'
    }
  },
  {
    id: 'DOC-PL-1168',
    name: 'Packing_List_PL-1168.pdf',
    type: 'Packing List',
    fileExt: 'PDF',
    referenceNumber: 'PL-1168',
    counterparty: 'Nippon Components Ltd.',
    updatedDate: '10 Oct 2026, 14:00',
    amount: null,
    currency: 'USD',
    status: 'Signed',
    ownerId: 'usr-sarah',
    ownerName: 'Sarah Chen',
    version: '1.0',
    fileHash: 'sha256: 441098fe7712a0149921bc8901aa',
    isTampered: false,
    description: 'Nippon Components packing specification: 15 cartons x 10 pcs = 150 pcs.',
    lineItems: [
      {
        id: 'li-pl1168-1',
        itemCode: 'REL-IND-24V',
        description: 'Industrial Relays (Cartons 01-15)',
        poQuantity: 150,
        unitPrice: 0,
        currency: 'USD',
        unit: 'pcs',
        lineTotal: 0,
        varianceStatus: 'matched'
      }
    ],
    events: [
      {
        id: 'ev-pl1168-1',
        timestamp: '10 Oct 2026, 14:00:00',
        actor: 'Nippon Warehouse Operations',
        role: 'Supplier',
        event: 'Pallets packed & verified',
        details: 'Full count matches PO-1168.',
        tone: 'green'
      }
    ],
    metadata: {
      packagesCount: '15 Cartons',
      containerNo: 'MSCU-1029841'
    }
  },
  {
    id: 'DOC-2403',
    name: 'Certificate_of_Origin_CO-118.pdf',
    type: 'Certificate of Origin',
    fileExt: 'PDF',
    referenceNumber: 'CO-118',
    counterparty: 'Nippon Components Ltd.',
    updatedDate: '12 Oct 2026, 10:00',
    amount: null,
    currency: 'USD',
    status: 'Signed',
    ownerId: 'usr-minh',
    ownerName: 'Minh Le',
    version: '1.0',
    fileHash: 'sha256: 6601fe88410291ba440192eacc01',
    isTampered: false,
    description: 'Certificate of Origin Form VJ (Vietnam-Japan Economic Partnership Agreement).',
    lineItems: [
      {
        id: 'li-co118-1',
        itemCode: 'HS-8536.41.00',
        description: 'Relays for a voltage not exceeding 60 V',
        poQuantity: 150,
        unitPrice: 0,
        currency: 'USD',
        unit: 'pcs',
        lineTotal: 0,
        varianceStatus: 'matched'
      }
    ],
    events: [
      {
        id: 'ev-co118-1',
        timestamp: '12 Oct 2026, 10:00:00',
        actor: 'Japan Chamber of Commerce',
        role: 'Authority',
        event: 'Form VJ Issued',
        details: 'Origin certified Japan.',
        tone: 'green'
      }
    ],
    metadata: {
      originCountry: 'Japan',
      destinationCountry: 'Vietnam',
      agreement: 'VJEPA'
    }
  },
  {
    id: 'DOC-CD-1168',
    name: 'Customs_Declaration_CD-HP-1168.pdf',
    type: 'Customs Declaration',
    fileExt: 'PDF',
    referenceNumber: 'CD-HP-1168',
    counterparty: 'Eastport Logistics JSC',
    updatedDate: '18 Oct 2026, 11:00',
    amount: null,
    currency: 'USD',
    status: 'Signed',
    ownerId: 'usr-david',
    ownerName: 'David Nguyen',
    version: '1.0',
    fileHash: 'sha256: 994012fe7741009124ac881023ba',
    isTampered: false,
    description: 'Import customs clearance completed at Hai Phong Port.',
    lineItems: [
      {
        id: 'li-cd1168-1',
        itemCode: 'CUSTOMS-CLEAR-HP',
        description: 'Duty paid and clearance granted',
        poQuantity: 150,
        unitPrice: 0,
        currency: 'USD',
        unit: 'pcs',
        lineTotal: 0,
        varianceStatus: 'matched'
      }
    ],
    events: [
      {
        id: 'ev-cd1168-1',
        timestamp: '18 Oct 2026, 11:00:00',
        actor: 'Hai Phong Customs',
        role: 'Authority',
        event: 'Customs Clearance Released',
        details: 'Goods released to Atlas Hai Phong Warehouse.',
        tone: 'green'
      }
    ],
    metadata: {
      customsOffice: 'Hai Phong Port Customs',
      declarationChannel: 'Green'
    }
  },
  {
    id: 'DOC-SC-004',
    name: 'Sales_Contract_SC-APEX-004.pdf',
    type: 'Sales Contract',
    fileExt: 'PDF',
    referenceNumber: 'SC-APEX-004',
    counterparty: 'Shenzhen Apex Semiconductors',
    updatedDate: '20 Oct 2026, 10:00',
    amount: 31500.00,
    currency: 'USD',
    status: 'Pending Approval',
    ownerId: 'usr-minh',
    ownerName: 'Minh Le',
    version: '1.0',
    fileHash: 'sha256: a491fe00921471029471bb019482',
    isTampered: false,
    description: 'Supply contract for 500 silicon wafers at $63.00/wafer DAP Dinh Vu Industrial Zone.',
    lineItems: [
      {
        id: 'li-sc004-1',
        itemCode: 'WFR-SILICON-300MM',
        description: 'Prime Grade 300mm Silicon Wafers',
        poQuantity: 500,
        unitPrice: 63.00,
        currency: 'USD',
        unit: 'wafers',
        lineTotal: 31500.00,
        varianceStatus: 'matched'
      }
    ],
    events: [
      {
        id: 'ev-sc004-1',
        timestamp: '20 Oct 2026, 10:00:00',
        actor: 'Minh Le',
        role: 'Procurement Specialist',
        event: 'Contract draft prepared',
        details: 'Initial procurement contract agreement.',
        tone: 'blue'
      }
    ],
    metadata: {
      originCountry: 'China',
      destinationCountry: 'Vietnam (Hai Phong)',
      incoterms: 'DAP Dinh Vu Industrial Zone',
      paymentTerms: 'T/T 50% advance, 50% upon delivery'
    }
  },
  {
    id: 'DOC-PO-004',
    name: 'Purchase_Order_PO-1199.pdf',
    type: 'Purchase Order',
    fileExt: 'PDF',
    referenceNumber: 'PO-1199',
    counterparty: 'Shenzhen Apex Semiconductors',
    updatedDate: '20 Oct 2026, 11:30',
    amount: 31500.00,
    currency: 'USD',
    status: 'Pending Approval',
    ownerId: 'usr-minh',
    ownerName: 'Minh Le',
    version: '1.0',
    fileHash: 'sha256: 5519fe7710294a0149921bc89001',
    isTampered: false,
    description: 'Purchase Order PO-1199 for semiconductor wafers consignment.',
    lineItems: [
      {
        id: 'li-po004-1',
        itemCode: 'WFR-SILICON-300MM',
        description: 'Prime Grade 300mm Silicon Wafers',
        poQuantity: 500,
        unitPrice: 63.00,
        currency: 'USD',
        unit: 'wafers',
        lineTotal: 31500.00,
        varianceStatus: 'matched'
      }
    ],
    events: [
      {
        id: 'ev-po004-1',
        timestamp: '20 Oct 2026, 11:30:00',
        actor: 'Minh Le',
        role: 'Procurement Specialist',
        event: 'Purchase order issued',
        details: 'PO forwarded to supplier.',
        tone: 'blue'
      }
    ],
    metadata: {
      paymentTerms: 'T/T 50/50',
      incoterms: 'DAP Dinh Vu'
    }
  },
  {
    id: 'DOC-INV-004',
    name: 'Commercial_Invoice_INV-APEX-004.pdf',
    type: 'Commercial Invoice',
    fileExt: 'PDF',
    referenceNumber: 'INV-APEX-004',
    counterparty: 'Shenzhen Apex Semiconductors',
    updatedDate: '21 Oct 2026, 08:30',
    amount: 31500.00,
    currency: 'USD',
    status: 'Pending Approval',
    ownerId: 'usr-minh',
    ownerName: 'Minh Le',
    version: '1.0',
    fileHash: 'sha256: 77192ba014fe7721098492014acb',
    isTampered: false,
    description: 'Supplier advance commercial invoice for wafers run.',
    lineItems: [
      {
        id: 'li-inv004-1',
        itemCode: 'WFR-SILICON-300MM',
        description: 'Prime Grade 300mm Silicon Wafers',
        poQuantity: 500,
        invoiceQuantity: 500,
        unitPrice: 63.00,
        currency: 'USD',
        unit: 'wafers',
        lineTotal: 31500.00,
        varianceStatus: 'matched'
      }
    ],
    events: [
      {
        id: 'ev-inv004-1',
        timestamp: '21 Oct 2026, 08:30:00',
        actor: 'Shenzhen Apex Accounting',
        role: 'Supplier',
        event: 'Invoice transmitted',
        details: 'Proforma commercial invoice lodged.',
        tone: 'blue'
      }
    ],
    metadata: {
      incoterms: 'DAP Dinh Vu',
      paymentTerms: 'T/T 50/50'
    }
  },
  {
    id: 'DOC-PL-004',
    name: 'Packing_List_PL-APEX-004.pdf',
    type: 'Packing List',
    fileExt: 'PDF',
    referenceNumber: 'PL-APEX-004',
    counterparty: 'Shenzhen Apex Semiconductors',
    updatedDate: '22 Oct 2026, 11:00',
    amount: null,
    currency: 'USD',
    status: 'Validation Passed',
    ownerId: 'usr-minh',
    ownerName: 'Minh Le',
    version: '1.0',
    fileHash: 'sha256: b10948ec7712a0149921bc8901aa',
    isTampered: false,
    description: 'Apex cleanroom cassette packing list: 20 FOUP cassettes x 25 wafers = 500 wafers total.',
    lineItems: [
      {
        id: 'li-pl004-1',
        itemCode: 'WFR-SILICON-300MM',
        description: 'Cleanroom Cassettes (01-20)',
        poQuantity: 500,
        invoiceQuantity: 500,
        unitPrice: 0,
        currency: 'USD',
        unit: 'wafers',
        lineTotal: 0,
        varianceStatus: 'matched'
      }
    ],
    events: [
      {
        id: 'ev-pl004-1',
        timestamp: '22 Oct 2026, 11:00:00',
        actor: 'Shenzhen Cleanroom Dispatch',
        role: 'Supplier',
        event: 'Cleanroom inspection passed',
        details: 'Sealed FOUP containers certified.',
        tone: 'green'
      }
    ],
    metadata: {
      packagesCount: '20 FOUPs',
      specialHandling: 'Cleanroom Class 1'
    }
  },
  {
    id: 'DOC-BL-004',
    name: 'Bill_of_Lading_BL-APEX-004.pdf',
    type: 'Bill of Lading',
    fileExt: 'PDF',
    referenceNumber: 'BL-APEX-004',
    counterparty: 'BlueWave Shipping Ltd.',
    updatedDate: '22 Oct 2026, 11:05',
    amount: null,
    currency: 'USD',
    status: 'Validation Passed',
    ownerId: 'usr-minh',
    ownerName: 'Minh Le',
    version: '1.0',
    fileHash: 'sha256: cc41098fe7712a0149921bc89001',
    isTampered: false,
    description: 'Express shipping waybill from Shenzhen Shekou to Hai Phong Port.',
    lineItems: [
      {
        id: 'li-bl004-1',
        itemCode: 'CONTAINER-20RF',
        description: '1 x 20ft Temperature Controlled Container',
        poQuantity: 1,
        unitPrice: 0,
        currency: 'USD',
        unit: 'cntr',
        lineTotal: 0,
        varianceStatus: 'matched'
      }
    ],
    events: [
      {
        id: 'ev-bl004-1',
        timestamp: '22 Oct 2026, 11:05:00',
        actor: 'BlueWave Shipping Ltd.',
        role: 'Carrier',
        event: 'Express waybill generated',
        details: 'Temperature controlled logistics confirmed.',
        tone: 'green'
      }
    ],
    metadata: {
      portOfLoading: 'Shekou Port, China',
      portOfDischarge: 'Hai Phong, Vietnam'
    }
  },
  {
    id: 'DOC-CO-004',
    name: 'Certificate_of_Origin_CO-CN-004.pdf',
    type: 'Certificate of Origin',
    fileExt: 'PDF',
    referenceNumber: 'CO-CN-004',
    counterparty: 'Shenzhen Apex Semiconductors',
    updatedDate: '22 Oct 2026, 11:10',
    amount: null,
    currency: 'USD',
    status: 'Validation Passed',
    ownerId: 'usr-minh',
    ownerName: 'Minh Le',
    version: '1.0',
    fileHash: 'sha256: dd910948ec7712a0149921bc8901',
    isTampered: false,
    description: 'Certificate of Origin Form E (ASEAN-China Free Trade Area) issued by CCPIT.',
    lineItems: [
      {
        id: 'li-co004-1',
        itemCode: 'HS-3818.00.00',
        description: 'Chemical elements doped for use in electronics: Silicon wafers',
        poQuantity: 500,
        unitPrice: 0,
        currency: 'USD',
        unit: 'wafers',
        lineTotal: 0,
        varianceStatus: 'matched'
      }
    ],
    events: [
      {
        id: 'ev-co004-1',
        timestamp: '22 Oct 2026, 11:10:00',
        actor: 'CCPIT Shenzhen',
        role: 'Authority',
        event: 'Form E Certified',
        details: 'ACFTA preferential treatment verified.',
        tone: 'green'
      }
    ],
    metadata: {
      originCountry: 'China',
      destinationCountry: 'Vietnam',
      agreement: 'ACFTA Form E'
    }
  }
];

export const INITIAL_APPROVALS: ApprovalRecord[] = [
  {
    id: 'APR-1042',
    docId: 'DOC-2408',
    title: 'Commercial Invoice INV-2408',
    counterparty: 'Nippon Components Ltd.',
    amount: 18420.00,
    currency: 'USD',
    kind: 'Invoice exception',
    submittedDate: '22 Oct 2026, 09:43',
    requesterId: 'usr-minh',
    requesterName: 'Minh Le',
    requiredApprovals: 2,
    receivedApprovals: 0,
    approvers: [],
    reason: 'Invoice quantity is 240 units (+20 variance over approved PO-1182 of 220 units). Requires exception sign-off and CFO confirmation before payment release.',
    status: 'Pending'
  },
  {
    id: 'APR-1041',
    docId: 'DOC-2406',
    title: 'Sales Contract SC-092',
    counterparty: 'Meridian Trade GmbH',
    amount: 42000.00,
    currency: 'USD',
    kind: 'Contract signature',
    submittedDate: '21 Oct 2026, 11:15',
    requesterId: 'usr-minh',
    requesterName: 'Minh Le',
    requiredApprovals: 2,
    receivedApprovals: 1,
    approvers: [
      {
        userId: 'usr-sarah',
        userName: 'Sarah Chen',
        role: 'Operations Manager',
        timestamp: '21 Oct 2026, 14:12',
        note: 'Operational schedule confirmed; factory line ready for 600 units.'
      }
    ],
    reason: 'High-value European sales contract ($42,000.00). Awaiting second independent review from Treasury/Finance (David Nguyen).',
    status: 'Pending'
  }
];

export const INITIAL_POLICIES: PolicyRule[] = [
  {
    id: 'pol-signing',
    title: 'High-Value Dual Control',
    subtitle: 'Quorum protection above $10,000',
    iconName: 'ShieldCheck',
    description: 'Mandates two independent approvers across different departments before any invoice or contract over $10,000 can be released for protected signing.',
    ruleStatement: 'IF document.value >= $10,000 THEN required_approvers = 2 (Department A != Department B)',
    enabled: true,
    category: 'authorization'
  },
  {
    id: 'pol-separation',
    title: 'Separation of Duties (Maker-Checker)',
    subtitle: 'Prevent self-approval conflict of interest',
    iconName: 'Users',
    description: 'Strictly blocks the user who created or uploaded a request from acting as an approver or signer on that same document.',
    ruleStatement: 'approver.id != requester.id AND approver.id != document.owner_id',
    enabled: true,
    category: 'authorization'
  },
  {
    id: 'pol-integrity',
    title: 'Version Cryptographic Locking',
    subtitle: 'Revoke approvals upon document tampering',
    iconName: 'Lock',
    description: 'Binds every approval to the exact SHA-256 fingerprint of the current version. Any post-approval edit immediately revokes all prior signatures and resets the workflow to Draft.',
    ruleStatement: 'current_hash == approved_hash ELSE invalidate_approvals() AND alert_audit_log()',
    enabled: true,
    category: 'integrity'
  },
  {
    id: 'pol-ai-limits',
    title: 'AI Agent Boundary Enforcement',
    subtitle: 'Human-in-the-loop governance',
    iconName: 'Bot',
    description: 'AI models can extract data, run 3-way reconciliation, and propose actions, but are architecturally barred from approving, signing, or executing monetary disbursements.',
    ruleStatement: 'actor.type == AI_AGENT CANNOT execute [APPROVE, SIGN, DISBURSE]',
    enabled: true,
    category: 'ai_guardrails'
  },
  {
    id: 'pol-tolerance',
    title: 'Zero Quantity Tolerance on High-Precision Components',
    subtitle: 'Strict 3-Way line item parity',
    iconName: 'Scale',
    description: 'Requires exact parity between Purchase Order, Physical Receipt Note (GRN), and Supplier Invoice. Any quantity discrepancy >= 1 unit halts the execution pipeline.',
    ruleStatement: 'invoice.qty <= min(po.qty, grn.qty) ELSE flag_exception(SEVERITY_HIGH)',
    enabled: true,
    category: 'integrity'
  }
];

export const INITIAL_AUDIT_LOG: AuditLogEntry[] = [
  {
    id: 'aud-109',
    timestamp: '22 Oct 2026, 09:43:18',
    actor: 'CargoTrust AI Engine',
    role: 'AI Agent',
    event: '3-Way Discrepancy Flagged',
    detail: 'INV-2408 compared against PO-1182 & GRN-8841. Quantity mismatch detected: billed 240 units vs PO 220 units (+20 variance).',
    result: 'Exception flagged',
    tone: 'red',
    docId: 'DOC-2408',
    proofHash: '0x88f2a1…9c01'
  },
  {
    id: 'aud-108',
    timestamp: '22 Oct 2026, 09:42:15',
    actor: 'Minh Le',
    role: 'Procurement Specialist',
    event: 'Document uploaded',
    detail: 'Commercial_Invoice_INV-2408.pdf uploaded to Atlas Components workspace.',
    result: 'Success',
    tone: 'green',
    docId: 'DOC-2408',
    proofHash: '0x33b1e4…12fa'
  },
  {
    id: 'aud-107',
    timestamp: '21 Oct 2026, 15:46:20',
    actor: 'Sarah Chen',
    role: 'Operations Manager',
    event: 'Purchase Order Approved',
    detail: 'PO-1182 approved. Baseline cryptographic hash registered on distributed ledger.',
    result: 'Success',
    tone: 'green',
    docId: 'DOC-2407',
    proofHash: '0x22c198…472a'
  },
  {
    id: 'aud-106',
    timestamp: '20 Oct 2026, 09:03:10',
    actor: 'David Nguyen',
    role: 'Finance Approver',
    event: 'Protected Signing Executed',
    detail: 'Bill of Lading BL-5531 signed under Tide authorization token #TD-88194.',
    result: 'Signed',
    tone: 'green',
    docId: 'DOC-2404',
    proofHash: '0x45bf89…8109'
  },
  {
    id: 'aud-105',
    timestamp: '19 Oct 2026, 14:00:22',
    actor: 'Security Policy Engine',
    role: 'System Gate',
    event: 'Self-Approval Blocked',
    detail: 'Requester attempt to approve own submission was blocked under Separation of Duties policy.',
    result: 'Blocked by policy',
    tone: 'amber',
    proofHash: '0x99a0cb…5541'
  }
];
