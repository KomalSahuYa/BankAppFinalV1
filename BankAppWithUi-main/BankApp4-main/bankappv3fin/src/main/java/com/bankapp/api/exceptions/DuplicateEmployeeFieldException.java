package com.bankapp.api.exceptions;

public class DuplicateEmployeeFieldException extends BusinessException {
    public DuplicateEmployeeFieldException(String fieldName, String value) {
        super(fieldName + " already exists: " + value);
    }
}
