package com.bankapp.api.mappers;

import com.bankapp.api.dto.TransactionResponse;
import com.bankapp.api.entities.Transaction;
import org.springframework.stereotype.Component;

@Component
public class TransactionMapper {

    public TransactionResponse toResponse(Transaction t) {

        return new TransactionResponse(
                t.getId(),
                t.getAccountNumber(),
                t.getType().name(),
                t.getAmount(),
                t.getStatus().name(),
                t.getTimestamp()
        );
    }
}