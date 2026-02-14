package com.bankapp.api.repositories;

import java.util.List;
import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bankapp.api.entities.Transaction;
import com.bankapp.api.entities.enums.ApprovalStatus;

public interface TransactionRepository
        extends JpaRepository<Transaction, Long> {

	List<Transaction> findByAccountNumber(String accNo);
	List<Transaction> findByStatus(ApprovalStatus status);
	List<Transaction> findByTimestampBetween(LocalDateTime start, LocalDateTime end);
	List<Transaction> findByTimestampBetweenAndStatus(LocalDateTime start, LocalDateTime end, ApprovalStatus status);
}
