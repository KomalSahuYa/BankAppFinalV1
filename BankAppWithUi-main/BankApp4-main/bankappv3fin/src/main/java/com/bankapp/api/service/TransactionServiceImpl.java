package com.bankapp.api.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bankapp.api.dto.DepositRequest;
import com.bankapp.api.dto.TransactionResponse;
import com.bankapp.api.dto.TransferRequest;
import com.bankapp.api.dto.WithdrawRequest;
import com.bankapp.api.entities.Account;
import com.bankapp.api.entities.Transaction;
import com.bankapp.api.entities.enums.ApprovalStatus;
import com.bankapp.api.entities.enums.TransactionType;
import com.bankapp.api.exceptions.AccountNotFoundException;
import com.bankapp.api.exceptions.InsufficientBalanceException;
import com.bankapp.api.exceptions.TransactionNotFoundException;
import com.bankapp.api.mappers.TransactionMapper;
import com.bankapp.api.repositories.AccountRepository;
import com.bankapp.api.repositories.TransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class TransactionServiceImpl implements TransactionService {

    private final AccountRepository accountRepo;
    private final TransactionRepository txnRepo;
    private final TransactionMapper mapper;

    private static final BigDecimal LIMIT =
            new BigDecimal("200000");

    // =========================
    // Deposit
    // =========================
    @Override
    public TransactionResponse deposit(DepositRequest req) {

        Account acc = accountRepo
                .findByAccountNumberAndActiveTrue(req.accountNumber())
                .orElseThrow(() ->
                        new AccountNotFoundException(req.accountNumber()));

        acc.setBalance(acc.getBalance().add(req.amount()));

        Transaction txn = new Transaction(
                acc.getAccountNumber(),
                acc,
                TransactionType.DEPOSIT,
                req.amount(),
                null,
                ApprovalStatus.APPROVED
        );

        txnRepo.save(txn);

        return mapper.toResponse(txn);
    }

    // =========================
    // Withdraw
    // =========================
    @Override
    public TransactionResponse withdraw(WithdrawRequest req) {

        Account acc = accountRepo
                .findByAccountNumberAndActiveTrue(req.accountNumber())
                .orElseThrow(() ->
                        new AccountNotFoundException(req.accountNumber()));

        if (req.amount().compareTo(acc.getBalance()) > 0)
            throw new InsufficientBalanceException();

        ApprovalStatus status;

        if (req.amount().compareTo(LIMIT) > 0) {

            status = ApprovalStatus.PENDING_APPROVAL;

        } else {

            acc.setBalance(acc.getBalance().subtract(req.amount()));
            status = ApprovalStatus.APPROVED;
        }

        Transaction txn = new Transaction(
                acc.getAccountNumber(),
                acc,
                TransactionType.WITHDRAW,
                req.amount(),
                null,
                status
        );

        txnRepo.save(txn);

        return mapper.toResponse(txn);
    }

    // =========================
    // Transfer
    // =========================
    @Override
    @PreAuthorize("hasRole('MANAGER') or (hasRole('CLERK') and #req.amount().compareTo(T(java.math.BigDecimal).valueOf(200000)) < 0)")
    public TransactionResponse transfer(TransferRequest req) {

        Account from = accountRepo
                .findByAccountNumberAndActiveTrue(req.fromAccount())
                .orElseThrow(() ->
                        new AccountNotFoundException(req.fromAccount()));

        Account to = accountRepo
                .findByAccountNumberAndActiveTrue(req.toAccount())
                .orElseThrow(() ->
                        new AccountNotFoundException(req.toAccount()));

        if (from.getBalance().compareTo(req.amount()) < 0)
            throw new InsufficientBalanceException();

        from.setBalance(from.getBalance().subtract(req.amount()));
        to.setBalance(to.getBalance().add(req.amount()));

        Transaction debit = new Transaction(
                from.getAccountNumber(),
                from,
                TransactionType.WITHDRAW,
                req.amount(),
                null,
                ApprovalStatus.APPROVED
        );

        Transaction credit = new Transaction(
                to.getAccountNumber(),
                to,
                TransactionType.DEPOSIT,
                req.amount(),
                null,
                ApprovalStatus.APPROVED
        );

        txnRepo.save(debit);
        txnRepo.save(credit);

        return mapper.toResponse(debit);
    }

    // =========================
    // Approve Pending Txn
    // =========================
    @Override
    @PreAuthorize("hasRole('MANAGER')")
    public TransactionResponse approve(Long txnId) {

        Transaction txn = txnRepo.findById(txnId)
                .orElseThrow(() ->
                        new TransactionNotFoundException(txnId));

        if (!ApprovalStatus.PENDING_APPROVAL.equals(txn.getStatus()))
            return mapper.toResponse(txn);

        Account acc = txn.getAccount();

        if (acc.getBalance().compareTo(txn.getAmount()) < 0)
            throw new InsufficientBalanceException();

        acc.setBalance(acc.getBalance().subtract(txn.getAmount()));

        txn.setStatus(ApprovalStatus.APPROVED);

        txnRepo.save(txn);

        return mapper.toResponse(txn);
    }

    // =========================
    // Reject Pending Txn
    // =========================
    @Override
    @PreAuthorize("hasRole('MANAGER')")
    public TransactionResponse reject(Long txnId) {

        Transaction txn = txnRepo.findById(txnId)
                .orElseThrow(() ->
                        new TransactionNotFoundException(txnId));

        if (!ApprovalStatus.PENDING_APPROVAL.equals(txn.getStatus()))
            return mapper.toResponse(txn);

        txn.setStatus(ApprovalStatus.REJECTED);

        txnRepo.save(txn);

        return mapper.toResponse(txn);
    }

    // =========================
    // History
    // =========================
    @Override
    public List<TransactionResponse> history(String accNo) {

        return txnRepo.findByAccountNumber(accNo)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    // =========================
    // Pending
    // =========================
    @Override
    public List<TransactionResponse> getPending() {

        return txnRepo.findByStatus(
                ApprovalStatus.PENDING_APPROVAL)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }
}