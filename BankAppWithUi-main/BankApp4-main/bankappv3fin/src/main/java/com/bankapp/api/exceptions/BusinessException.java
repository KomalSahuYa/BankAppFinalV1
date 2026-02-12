package com.bankapp.api.exceptions;

public abstract class BusinessException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public BusinessException(String message) {
        super(message);
    }
}