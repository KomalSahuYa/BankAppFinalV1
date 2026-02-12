package com.bankapp.api.exceptions;

public class TransactionNotFoundException extends BusinessException {

    
	private static final long serialVersionUID = 1L;

	public TransactionNotFoundException(Long id) {
        super("Transaction not found: " + id);
    }
}