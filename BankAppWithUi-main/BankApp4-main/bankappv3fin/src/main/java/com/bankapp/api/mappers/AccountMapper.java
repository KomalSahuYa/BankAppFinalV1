package com.bankapp.api.mappers;

import com.bankapp.api.dto.*;
import com.bankapp.api.entities.Account;
import org.springframework.stereotype.Component;

@Component
public class AccountMapper {

    public AccountResponse toResponse(Account acc) {

        return new AccountResponse(
                acc.getId(),
                acc.getAccountNumber(),
                acc.getBalance(),
                acc.getHolderName()
        );
    }

    // update helper (record → entity)
    public void update(Account acc, AccountUpdateRequest req) {
        acc.setHolderName(req.holderName());
    }
}