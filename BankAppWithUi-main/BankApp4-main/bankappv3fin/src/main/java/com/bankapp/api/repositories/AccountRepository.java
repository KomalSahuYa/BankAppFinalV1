package com.bankapp.api.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bankapp.api.entities.Account;

public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByAccountNumberAndActiveTrue(String accNo);

    List<Account> findAllByActiveTrue();

   
    @Query("""
           SELECT a FROM Account a
           LEFT JOIN FETCH a.transactions
           WHERE a.accountNumber = :accNo
           """)
    Optional<Account> findFullByAccountNumber(@Param("accNo") String accNo);
    
    @Query("""
    	       SELECT DISTINCT a FROM Account a
    	       LEFT JOIN FETCH a.transactions
    	       WHERE a.active = true
    	       """)
    	List<Account> findAllActiveWithTransactions();
}