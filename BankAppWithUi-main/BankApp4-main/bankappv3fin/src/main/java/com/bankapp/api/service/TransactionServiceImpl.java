package com.bankapp.api.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
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
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class TransactionServiceImpl implements TransactionService {

    private final AccountRepository accountRepo;
    private final TransactionRepository txnRepo;
    private final TransactionMapper mapper;
    private final AuditLogService auditLogService;

    private static final BigDecimal LIMIT =
            new BigDecimal("200000");

    // =========================
    // Deposit
    // =========================
    @Override
    public TransactionResponse deposit(DepositRequest req) {
        log.info("Deposit requested for account={} amount={}", req.accountNumber(), req.amount());

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
                currentActor(),
                ApprovalStatus.APPROVED
        );

        txnRepo.save(txn);
        auditLogService.log(currentActor(), "DEPOSIT", req.accountNumber(), "amount=" + req.amount());
        log.info("Deposit successful for account={} txnId={}", req.accountNumber(), txn.getId());

        return mapper.toResponse(txn);
    }

    // =========================
    // Withdraw
    // =========================
    @Override
    public TransactionResponse withdraw(WithdrawRequest req) {
        log.info("Withdraw requested for account={} amount={}", req.accountNumber(), req.amount());

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
                currentActor(),
                status
        );

        txnRepo.save(txn);
        auditLogService.log(currentActor(), "WITHDRAW", req.accountNumber(), "amount=" + req.amount() + ",status=" + status);
        log.info("Withdraw created for account={} txnId={} status={}", req.accountNumber(), txn.getId(), txn.getStatus());

        return mapper.toResponse(txn);
    }

    // =========================
    // Transfer
    // =========================
    @Override
    @PreAuthorize("hasRole('MANAGER') or (hasRole('CLERK') and #req.amount().compareTo(T(java.math.BigDecimal).valueOf(200000)) < 0)")
    public TransactionResponse transfer(TransferRequest req) {
        log.info("Transfer requested from={} to={} amount={}", req.fromAccount(), req.toAccount(), req.amount());

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
                currentActor(),
                ApprovalStatus.APPROVED
        );

        Transaction credit = new Transaction(
                to.getAccountNumber(),
                to,
                TransactionType.DEPOSIT,
                req.amount(),
                currentActor(),
                ApprovalStatus.APPROVED
        );

        txnRepo.save(debit);
        txnRepo.save(credit);
        auditLogService.log(currentActor(), "TRANSFER", req.fromAccount(), "to=" + req.toAccount() + ",amount=" + req.amount());
        log.info("Transfer completed from={} to={} debitTxnId={} creditTxnId={}", req.fromAccount(), req.toAccount(), debit.getId(), credit.getId());

        return mapper.toResponse(debit);
    }

    // =========================
    // Approve Pending Txn
    // =========================
    @Override
    @PreAuthorize("hasRole('MANAGER')")
    public TransactionResponse approve(Long txnId) {
        log.info("Approval requested for txnId={}", txnId);

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
        auditLogService.log(currentActor(), "APPROVE", txn.getAccountNumber(), "txnId=" + txnId);
        log.info("Transaction approved txnId={}", txnId);

        return mapper.toResponse(txn);
    }

    // =========================
    // Reject Pending Txn
    // =========================
    @Override
    @PreAuthorize("hasRole('MANAGER')")
    public TransactionResponse reject(Long txnId) {
        log.info("Rejection requested for txnId={}", txnId);

        Transaction txn = txnRepo.findById(txnId)
                .orElseThrow(() ->
                        new TransactionNotFoundException(txnId));

        if (!ApprovalStatus.PENDING_APPROVAL.equals(txn.getStatus()))
            return mapper.toResponse(txn);

        txn.setStatus(ApprovalStatus.REJECTED);

        txnRepo.save(txn);
        auditLogService.log(currentActor(), "REJECT", txn.getAccountNumber(), "txnId=" + txnId);
        log.info("Transaction rejected txnId={}", txnId);

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

    @Override
    public List<TransactionResponse> getRecent(int limit) {
        return txnRepo.findAll().stream()
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .limit(Math.max(1, limit))
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public List<TransactionResponse> getByDate(LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.plusDays(1).atStartOfDay();

        return txnRepo.findByTimestampBetween(start, end).stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public List<Map<String, Object>> getDailyCounts(LocalDate from, LocalDate to) {
        LocalDate startDate = from != null ? from : LocalDate.now().minusDays(29);
        LocalDate endDate = to != null ? to : LocalDate.now();

        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.plusDays(1).atStartOfDay();

        Map<LocalDate, Long> dateToCount = new LinkedHashMap<>();
        txnRepo.findByTimestampBetween(start, end).forEach(transaction -> {
            LocalDate key = transaction.getTimestamp().toLocalDate();
            dateToCount.put(key, dateToCount.getOrDefault(key, 0L) + 1);
        });

        return dateToCount.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> Map.<String, Object>of(
                        "date", entry.getKey().toString(),
                        "count", entry.getValue()
                ))
                .toList();
    }

    private String currentActor() {
        return SecurityContextHolder.getContext().getAuthentication() != null
                ? SecurityContextHolder.getContext().getAuthentication().getName()
                : "SYSTEM";
    }
}
