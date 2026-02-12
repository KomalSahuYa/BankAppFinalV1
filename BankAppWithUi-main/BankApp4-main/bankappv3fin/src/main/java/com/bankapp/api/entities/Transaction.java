package com.bankapp.api.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.bankapp.api.entities.enums.ApprovalStatus;
import com.bankapp.api.entities.enums.TransactionType;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "transactions")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // OLD FIELD — keep for now
    private String accountNumber;

    // ✅ NEW RELATION
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    private BigDecimal amount;

    private LocalDateTime timestamp;

    private String performedBy;

    @Enumerated(EnumType.STRING)
    private ApprovalStatus status;

    private String approvedBy;

    public Transaction(String accountNumber,
                       Account account,
                       TransactionType type,
                       BigDecimal amount,
                       String performedBy,
                       ApprovalStatus status) {

        this.accountNumber = accountNumber;
        this.account = account;
        this.type = type;
        this.amount = amount;
        this.timestamp = LocalDateTime.now();
        this.performedBy = performedBy;
        this.status = status;
    }

    public void setStatus(ApprovalStatus status) {
        this.status = status;
    }
}