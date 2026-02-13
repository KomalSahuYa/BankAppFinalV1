package com.bankapp.api.exceptions;

public class DuplicateAccountFieldException extends BusinessException {

    private static final long serialVersionUID = 1L;

    public DuplicateAccountFieldException(String fieldName, String value) {
        super("An account with " + fieldName + " '" + value + "' already exists");
    }
}

