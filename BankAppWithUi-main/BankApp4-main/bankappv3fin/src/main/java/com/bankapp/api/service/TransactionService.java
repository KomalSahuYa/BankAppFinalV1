package com.bankapp.api.service;

import java.util.List;
import java.util.Map;
import java.time.LocalDate;

import com.bankapp.api.dto.DepositRequest;
import com.bankapp.api.dto.TransactionResponse;
import com.bankapp.api.dto.TransferRequest;
import com.bankapp.api.dto.WithdrawRequest;

public interface TransactionService {

    TransactionResponse deposit(DepositRequest req);

    TransactionResponse withdraw(WithdrawRequest req);

    List<TransactionResponse> history(String accNo);
    
    TransactionResponse transfer(TransferRequest req);

    TransactionResponse approve(Long txnId);

    TransactionResponse reject(Long txnId);
    List<TransactionResponse> getPending();
    List<TransactionResponse> getRecent(int limit);
    List<TransactionResponse> getByDate(LocalDate date);
    List<Map<String, Object>> getDailyCounts(LocalDate from, LocalDate to);
}
