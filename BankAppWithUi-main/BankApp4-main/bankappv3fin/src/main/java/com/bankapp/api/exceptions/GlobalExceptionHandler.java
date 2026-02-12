package com.bankapp.api.exceptions;



import java.net.URI;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ======================
    // Business Exceptions
    // ======================

    @ExceptionHandler(AccountNotFoundException.class)
    public ProblemDetail handleAccount(AccountNotFoundException ex) {
        return buildProblem(
                HttpStatus.NOT_FOUND,
                "account-not-found",
                "Account Error",
                ex.getMessage());
    }

    @ExceptionHandler(EmployeeNotFoundException.class)
    public ProblemDetail handleEmployee(EmployeeNotFoundException ex) {
        return buildProblem(
                HttpStatus.NOT_FOUND,
                "employee-not-found",
                "Employee Error",
                ex.getMessage());
    }

    @ExceptionHandler(DuplicateUsernameException.class)
    public ProblemDetail handleDuplicate(DuplicateUsernameException ex) {
        return buildProblem(
                HttpStatus.CONFLICT,
                "duplicate-username",
                "Duplicate Resource",
                ex.getMessage());
    }

    @ExceptionHandler(InsufficientBalanceException.class)
    public ProblemDetail handleBalance(InsufficientBalanceException ex) {
        return buildProblem(
                HttpStatus.BAD_REQUEST,
                "insufficient-balance",
                "Transaction Error",
                ex.getMessage());
    }

    @ExceptionHandler(BusinessException.class)
    public ProblemDetail handleBusiness(BusinessException ex) {
        return buildProblem(
                HttpStatus.BAD_REQUEST,
                "business-error",
                "Business Error",
                ex.getMessage());
    }

    // ======================
    // Validation
    // ======================

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult()
          .getFieldErrors()
          .forEach(e -> errors.put(
                  e.getField(),
                  e.getDefaultMessage()));

        ProblemDetail pd = buildProblem(
                HttpStatus.BAD_REQUEST,
                "validation-failed",
                "Validation Error",
                "Invalid request data");

        pd.setProperty("errors", errors);
        return pd;
    }

    // ======================
    // HTTP Errors
    // ======================

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ProblemDetail handleMethod(HttpRequestMethodNotSupportedException ex) {

        ProblemDetail pd = buildProblem(
                HttpStatus.METHOD_NOT_ALLOWED,
                "method-not-allowed",
                "HTTP Error",
                "Method not allowed");

        pd.setProperty("allowedMethods", ex.getSupportedHttpMethods());
        return pd;
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ProblemDetail handleBadRequest(HttpMessageNotReadableException ex) {

        return buildProblem(
                HttpStatus.BAD_REQUEST,
                "invalid-json",
                "Malformed Request",
                "Invalid request body");
    }

    // ======================
    // Catch-all
    // ======================

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleUnknown(Exception ex) {

        return buildProblem(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "internal-error",
                "Server Error",
                "Unexpected error occurred");
    }

    // ======================
    // Builder
    // ======================

    private ProblemDetail buildProblem(
            HttpStatus status,
            String code,
            String title,
            String detail) {

        ProblemDetail pd = ProblemDetail.forStatus(status);

        pd.setType(URI.create("/errors/" + code));
        pd.setTitle(title);
        pd.setDetail(detail);
        pd.setProperty("timestamp", Instant.now());

        return pd;
    }
}