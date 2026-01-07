export interface Expense {
  id: string;
  source: string;
  amount: number;
  date: string;
  userId: string;
}

export interface Income {
  id: string;
  source: string;
  amount: number;
  date: string;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface SummaryData {
  todayExpense: number;
  availableMoney: number;
  thisMonthExpense: number;
  graphData: any[];
}

export interface EPaper {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: string;
  hotspots?: Hotspot[];
}

export interface Hotspot {
  id: string;
  ePaperId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  content: string;
}
