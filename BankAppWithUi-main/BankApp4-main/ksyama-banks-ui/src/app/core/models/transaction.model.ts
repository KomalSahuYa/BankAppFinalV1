export interface DepositRequest {
  accountNumber: string;
  amount: number;
}

export interface WithdrawRequest {
  accountNumber: string;
  amount: number;
}

export interface TransferRequest {
  fromAccount: string;
  toAccount: string;
  amount: number;
}

export interface TransactionResponse {
  id: number;
  accountNumber: string;
  type: 'DEPOSIT' | 'WITHDRAW';
  amount: number;
  status: 'APPROVED' | 'REJECTED' | 'PENDING_APPROVAL';
  timestamp: string;
}
