package com.bankapp.api.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bankapp.api.dto.DepositRequest;
import com.bankapp.api.dto.TransactionResponse;
import com.bankapp.api.dto.TransferRequest;
import com.bankapp.api.dto.WithdrawRequest;
import com.bankapp.api.service.TransactionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService service;

    @PostMapping("/deposit")
    public TransactionResponse deposit(
            @Valid @RequestBody DepositRequest req) {

        return service.deposit(req);
    }

    @PostMapping("/withdraw")
    public TransactionResponse withdraw(
            @Valid @RequestBody WithdrawRequest req) {

        return service.withdraw(req);
    }

    @GetMapping("/{accNo}")
    public List<TransactionResponse> history(
            @PathVariable String accNo) {

        return service.history(accNo);
    }
    @PostMapping("/transfer")
    public TransactionResponse transfer(
            @Valid @RequestBody TransferRequest req) {

        return service.transfer(req);
    }
    
    @PostMapping("/approve/{id}")
    public TransactionResponse approve(
            @PathVariable Long id) {

        return service.approve(id);
    }
    
    @PostMapping("/reject/{id}")
    public TransactionResponse reject(
            @PathVariable Long id) {

        return service.reject(id);
    }
    
    @GetMapping("/pending")
    public List<TransactionResponse> pending() {

        return service.getPending();
    }
}