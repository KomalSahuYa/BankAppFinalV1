export interface AccountResponse {
  id: number;
  accountNumber: string;
  balance: number;
  holderName: string;
  panNumber: string;
  email: string;
  mobileNumber: string;
}

export interface AccountCreateRequest {
  holderName: string;
  panNumber: string;
  email: string;
  mobileNumber: string;
  initialBalance: number;
}

export interface AccountUpdateRequest {
  email: string;
  mobileNumber: string;
}

export interface AccountFullResponse extends AccountResponse {
  transactions: Array<{
    id: number;
    accountNumber: string;
    type: 'DEPOSIT' | 'WITHDRAW';
    amount: number;
    status: 'APPROVED' | 'REJECTED' | 'PENDING_APPROVAL';
    timestamp: string;
    performedBy: string;
  }>;
}

export interface EmployeeResponse {
  id: number;
  username: string;
  role: 'CLERK' | 'MANAGER';
  fullName: string;
  emailId: string;
  phoneNumber: string;
  aadhaarNumber: string;
}

export interface EmployeeCreateRequest {
  username: string;
  password: string;
  role: 'CLERK' | 'MANAGER';
  fullName: string;
  emailId: string;
  phoneNumber: string;
  aadhaarNumber: string;
}

export interface EmployeeUpdateRequest {
  emailId: string;
  phoneNumber: string;
}
