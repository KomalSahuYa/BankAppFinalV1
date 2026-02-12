package com.bankapp.api.entities;


import java.math.BigDecimal;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "accounts")
@Data
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String accountNumber;

    @Column(nullable = false)
    private BigDecimal balance;

    @Column(nullable = false)
    private boolean active = true;

    private String holderName;

    @OneToMany(mappedBy = "account",
               fetch = FetchType.LAZY)
    private List<Transaction> transactions;

    public Account() {}

    public Account(String accountNumber,
                   BigDecimal balance,
                   String holderName) {

        this.accountNumber = accountNumber;
        this.balance = balance;
        this.holderName = holderName;
    }
}