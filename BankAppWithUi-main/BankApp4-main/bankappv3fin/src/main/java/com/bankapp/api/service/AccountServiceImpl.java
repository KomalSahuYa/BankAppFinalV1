package com.bankapp.api.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bankapp.api.dto.AccountCreateRequest;
import com.bankapp.api.dto.AccountFullResponse;
import com.bankapp.api.dto.AccountResponse;
import com.bankapp.api.dto.AccountUpdateRequest;
import com.bankapp.api.dto.TransactionResponse;
import com.bankapp.api.entities.Account;
import com.bankapp.api.exceptions.AccountNotFoundException;
import com.bankapp.api.exceptions.DuplicateAccountFieldException;
import com.bankapp.api.mappers.AccountMapper;
import com.bankapp.api.repositories.AccountRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AccountServiceImpl implements AccountService {

    private final AccountRepository repository;
    private final AccountMapper mapper;

    @Override
    public AccountResponse create(AccountCreateRequest req) {
        validateUniqueCreateFields(req);

        String accNo = "ACC-" +
                UUID.randomUUID().toString().substring(0, 8);

        Account acc = new Account(
                accNo,
                req.initialBalance(),
                req.holderName(),
                req.panNumber(),
                req.email(),
                req.mobileNumber()
        );

        repository.save(acc);

        return mapper.toResponse(acc);
    }

    @Override
    public AccountResponse getByNumber(String accNo) {

        return mapper.toResponse(getAccount(accNo));
    }

    @Override
    public List<AccountResponse> getAll() {

        return repository.findAllActiveWithTransactions()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public void deactivate(String accNo) {

        Account acc = getAccount(accNo);
        acc.setActive(false);
    }

    @Override
    public AccountResponse update(String accNo,
                                  AccountUpdateRequest req) {

        Account acc = getAccount(accNo);
        validateUniqueUpdateFields(accNo, req);

        mapper.update(acc, req);

        return mapper.toResponse(acc);
    }

    private Account getAccount(String accNo) {

        return repository
                .findByAccountNumberAndActiveTrue(accNo)
                .orElseThrow(() ->
                        new AccountNotFoundException(accNo));
    }

    private void validateUniqueCreateFields(AccountCreateRequest req) {
        if (repository.existsByPanNumber(req.panNumber())) {
            throw new DuplicateAccountFieldException("PAN number", req.panNumber());
        }

        if (repository.existsByEmail(req.email())) {
            throw new DuplicateAccountFieldException("email", req.email());
        }

        if (repository.existsByMobileNumber(req.mobileNumber())) {
            throw new DuplicateAccountFieldException("mobile number", req.mobileNumber());
        }
    }

    private void validateUniqueUpdateFields(String accNo, AccountUpdateRequest req) {
        if (repository.existsByEmailAndAccountNumberNot(req.email(), accNo)) {
            throw new DuplicateAccountFieldException("email", req.email());
        }

        if (repository.existsByMobileNumberAndAccountNumberNot(req.mobileNumber(), accNo)) {
            throw new DuplicateAccountFieldException("mobile number", req.mobileNumber());
        }
    }
    
    @Override
    public AccountFullResponse findFullAccount(String accNo) {

        
        Account acc = repository.findFullByAccountNumber(accNo)
                .orElseThrow(() -> new AccountNotFoundException(accNo));

        
        List<TransactionResponse> txns =
                acc.getTransactions()
                   .stream()
                   .map(txn -> new TransactionResponse(
                           txn.getId(),
                           txn.getAccountNumber(),
                           txn.getType().name(),
                           txn.getAmount(),
                           txn.getStatus().name(),
                           txn.getTimestamp(),
                           txn.getPerformedBy()
                   ))
                   .toList();

        
        return new AccountFullResponse(
                acc.getAccountNumber(),
                acc.getHolderName(),
                acc.getBalance(),
                txns
        );
    }

    @Override
    public boolean mobileExists(String mobileNumber) {
        return repository.existsByMobileNumber(mobileNumber);
    }
}
