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

import com.bankapp.api.dto.EmployeeCreateRequest;
import com.bankapp.api.dto.EmployeeResponse;
import com.bankapp.api.dto.EmployeeUpdateRequest;
import com.bankapp.api.service.EmployeeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService service;

    // CREATE
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EmployeeResponse create(
            @Valid @RequestBody EmployeeCreateRequest req) {

        return service.create(req);
    }

    // UPDATE
    @PutMapping("/{id}")
    public EmployeeResponse update(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeUpdateRequest req) {

        return service.update(id, req);
    }

    // READ ONE
    @GetMapping("/{id}")
    public EmployeeResponse getById(@PathVariable Long id) {

        return service.getById(id);
    }

    // READ ALL
    @GetMapping
    public List<EmployeeResponse> getAll() {

        return service.getAll();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {

        service.delete(id);
    }
}