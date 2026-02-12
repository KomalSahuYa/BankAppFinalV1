export interface AccountResponse {
  id: number;
  accountNumber: string;
  balance: number;
  holderName: string;
}

export interface AccountCreateRequest {
  holderName: string;
  initialBalance: number;
}

export interface AccountUpdateRequest {
  holderName: string;
}

export interface AccountFullResponse extends AccountResponse {
  transactions: Array<{
    id: number;
    accountNumber: string;
    type: 'DEPOSIT' | 'WITHDRAW';
    amount: number;
    status: 'APPROVED' | 'REJECTED' | 'PENDING_APPROVAL';
    timestamp: string;
  }>;
}

export interface EmployeeResponse {
  id: number;
  username: string;
  role: 'CLERK' | 'MANAGER';
  fullName: string;
}

export interface EmployeeCreateRequest {
  username: string;
  password: string;
  role: 'CLERK' | 'MANAGER';
  fullName: string;
}
