package com.bankapp.api.exceptions;

public class EmployeeNotFoundException extends BusinessException {

	private static final long serialVersionUID = 1L;

	public EmployeeNotFoundException(Long id) {
        super("Employee not found with id: " + id);
    }
}