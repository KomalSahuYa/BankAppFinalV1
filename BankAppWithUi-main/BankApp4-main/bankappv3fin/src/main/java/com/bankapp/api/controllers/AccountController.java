package com.bankapp.api.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.bankapp.api.dto.AccountCreateRequest;
import com.bankapp.api.dto.AccountFullResponse;
import com.bankapp.api.dto.AccountResponse;
import com.bankapp.api.dto.AccountUpdateRequest;
import com.bankapp.api.service.AccountService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AccountResponse create(
            @Valid @RequestBody AccountCreateRequest req) {

        return service.create(req);
    }

    @GetMapping("/{accNo}")
    public AccountResponse get(
            @PathVariable String accNo) {

        return service.getByNumber(accNo);
    }

    @GetMapping
    public List<AccountResponse> getAll() {

        return service.getAll();
    }

    @DeleteMapping("/{accNo}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deactivate(
            @PathVariable String accNo) {

        service.deactivate(accNo);
    }
    @PutMapping("/{accNo}")
    public AccountResponse update(
            @PathVariable String accNo,
            @Valid @RequestBody AccountUpdateRequest req) {

        return service.update(accNo, req);
    }
    @GetMapping("/{accNo}/full")
    public AccountFullResponse getFullAccount(
            @PathVariable String accNo) {

        return service.findFullAccount(accNo);
    }
}