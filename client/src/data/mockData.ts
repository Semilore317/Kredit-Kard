export type DebtStatus = "PENDING" | "PAID" | "PART PAID" | "OVERDUE";
export type TxnChannel = "TRANSFER" | "USSD" | "QR" | "CARD";
export type TxnStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface Debt {
  id: string;
  customer: string;
  phone: string;
  amount: number;
  status: DebtStatus;
  created: string;
  due: string;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  riskScore: number;
  outstanding: number;
  lastPayment: string | null;
}

export interface Transaction {
  id: string;
  reference: string;
  customer: string;
  amount: number;
  channel: TxnChannel;
  status: TxnStatus;
  date: string;
}

export interface Message {
  id: string;
  to: string;
  phone: string;
  message: string;
  status: "SENT" | "FAILED";
  date: string;
}

export const debts: Debt[] = [
  { id: "1", customer: "Adebayo Ogundimu", phone: "08023456781", amount: 25000, status: "PENDING", created: "1 Feb 2026", due: "20 Feb 2026" },
  { id: "2", customer: "Adebayo Ogundimu", phone: "08023456781", amount: 20000, status: "PAID", created: "15 Jan 2026", due: "1 Feb 2026" },
  { id: "3", customer: "Chidinma Okafor", phone: "08034567892", amount: 120000, status: "PART PAID", created: "20 Jan 2026", due: "25 Feb 2026" },
  { id: "4", customer: "Oluwaseun Bakare", phone: "08045678903", amount: 8000, status: "PAID", created: "5 Feb 2026", due: "15 Feb 2026" },
  { id: "5", customer: "Funmilayo Adeniyi", phone: "08056789014", amount: 35000, status: "OVERDUE", created: "10 Jan 2026", due: "1 Feb 2026" },
  { id: "6", customer: "Emeka Nwankwo", phone: "08067890125", amount: 45000, status: "PENDING", created: "18 Jan 2026", due: "28 Feb 2026" },
  { id: "7", customer: "Aisha Mohammed", phone: "08078901236", amount: 12000, status: "PAID", created: "2 Feb 2026", due: "14 Feb 2026" },
  { id: "8", customer: "Tunde Fashola", phone: "08089012347", amount: 67000, status: "OVERDUE", created: "5 Jan 2026", due: "20 Jan 2026" },
  { id: "9", customer: "Ngozi Eze", phone: "08090123458", amount: 18000, status: "PENDING", created: "22 Jan 2026", due: "22 Mar 2026" },
  { id: "10", customer: "Chukwudi Obi", phone: "08001234569", amount: 50000, status: "PART PAID", created: "30 Jan 2026", due: "15 Mar 2026" },
  { id: "11", customer: "Yetunde Adeyemo", phone: "08012345670", amount: 30000, status: "OVERDUE", created: "3 Jan 2026", due: "3 Feb 2026" },
];

export const customers: Customer[] = [
  { id: "1", name: "Adebayo Ogundimu", phone: "08023456781", riskScore: 82, outstanding: 45000, lastPayment: "10 Feb 2026" },
  { id: "2", name: "Chidinma Okafor", phone: "08034567892", riskScore: 65, outstanding: 120000, lastPayment: "28 Jan 2026" },
  { id: "3", name: "Oluwaseun Bakare", phone: "08045678903", riskScore: 91, outstanding: 8000, lastPayment: "14 Feb 2026" },
  { id: "4", name: "Funmilayo Adeniyi", phone: "08056789014", riskScore: 50, outstanding: 35000, lastPayment: null },
  { id: "5", name: "Emeka Nwankwo", phone: "08067890125", riskScore: 73, outstanding: 67000, lastPayment: "5 Feb 2026" },
  { id: "6", name: "Aisha Mohammed", phone: "08078901236", riskScore: 88, outstanding: 12000, lastPayment: "12 Feb 2026" },
  { id: "7", name: "Tunde Fashola", phone: "08089012347", riskScore: 42, outstanding: 97000, lastPayment: "10 Jan 2026" },
  { id: "8", name: "Ngozi Eze", phone: "08090123458", riskScore: 77, outstanding: 18000, lastPayment: "8 Feb 2026" },
  { id: "9", name: "Chukwudi Obi", phone: "08001234569", riskScore: 60, outstanding: 50000, lastPayment: "20 Jan 2026" },
  { id: "10", name: "Yetunde Adeyemo", phone: "08012345670", riskScore: 35, outstanding: 30000, lastPayment: null },
  { id: "11", name: "Babatunde Alabi", phone: "08023451111", riskScore: 95, outstanding: 5000, lastPayment: "15 Feb 2026" },
];

export const transactions: Transaction[] = [
  { id: "1", reference: "TXN-025", customer: "Tunde Fashola", amount: 30000, channel: "TRANSFER", status: "PENDING", date: "16 Feb 2026" },
  { id: "2", reference: "TXN-024", customer: "Tunde Fashola", amount: 3500, channel: "USSD", status: "PENDING", date: "16 Feb 2026" },
  { id: "3", reference: "TXN-023", customer: "Oluwaseun Bakare", amount: 6500, channel: "QR", status: "PENDING", date: "16 Feb 2026" },
  { id: "4", reference: "TXN-022", customer: "Ngozi Eze", amount: 7000, channel: "TRANSFER", status: "PENDING", date: "16 Feb 2026" },
  { id: "5", reference: "TXN-018", customer: "Chukwudi Obi", amount: 10000, channel: "USSD", status: "PENDING", date: "16 Feb 2026" },
  { id: "6", reference: "TXN-011", customer: "Adebayo Ogundimu", amount: 25000, channel: "TRANSFER", status: "PENDING", date: "16 Feb 2026" },
  { id: "7", reference: "TXN-010", customer: "Chidinma Okafor", amount: 40000, channel: "CARD", status: "SUCCESS", date: "10 Feb 2026" },
  { id: "8", reference: "TXN-009", customer: "Aisha Mohammed", amount: 12000, channel: "QR", status: "SUCCESS", date: "9 Feb 2026" },
  { id: "9", reference: "TXN-008", customer: "Emeka Nwankwo", amount: 20000, channel: "TRANSFER", status: "SUCCESS", date: "5 Feb 2026" },
  { id: "10", reference: "TXN-007", customer: "Adebayo Ogundimu", amount: 20000, channel: "USSD", status: "SUCCESS", date: "1 Feb 2026" },
];

export const messages: Message[] = [
  { id: "1", to: "Adebayo Ogundimu", phone: "08023456781", message: "Hi Adebayo, you owe ₦25,000 for Electronics order. Pay via USSD: *737*25000# or transfer to GTB 0123456789.", status: "SENT", date: "1 Feb 2026" },
  { id: "2", to: "Chidinma Okafor", phone: "08034567892", message: "Hi Chidinma, you owe ₦120,000 for Bulk phone purchase. Transfer to Access Bank 1234567890. Ref: CHI001.", status: "SENT", date: "20 Jan 2026" },
  { id: "3", to: "Funmilayo Adeniyi", phone: "08056789014", message: "Hi Funmilayo, your debt of ₦35,000 is overdue. Please pay immediately to avoid penalty.", status: "SENT", date: "2 Feb 2026" },
  { id: "4", to: "Emeka Nwankwo", phone: "08067890125", message: "Hi Emeka, you owe ₦45,000 for Speaker systems. Pay via USSD: *737*45000# or QR code attached.", status: "SENT", date: "25 Jan 2026" },
  { id: "5", to: "Tunde Fashola", phone: "08089012347", message: "Hi Tunde, your payment of ₦67,000 is 27 days overdue. Call us at 08031234567.", status: "SENT", date: "16 Feb 2026" },
];

export const collectionsOverTime = [
  { date: "Jan 1", amount: 14000 },
  { date: "Jan 8", amount: 19500 },
  { date: "Jan 15", amount: 19500 },
  { date: "Jan 22", amount: 25500 },
  { date: "Jan 29", amount: 19000 },
  { date: "Feb 5", amount: 14000 },
  { date: "Feb 8", amount: 17000 },
  { date: "Feb 10", amount: 14000 },
  { date: "Feb 12", amount: 14000 },
  { date: "Feb 14", amount: 8000 },
  { date: "Feb 16", amount: 5500 },
];

export const debtStatusData = [
  { name: "PENDING", value: 4, color: "#f97316" },
  { name: "OVERDUE", value: 3, color: "#ef4444" },
  { name: "PART PAID", value: 2, color: "#fb923c" },
  { name: "PAID", value: 3, color: "#22c55e" },
];
