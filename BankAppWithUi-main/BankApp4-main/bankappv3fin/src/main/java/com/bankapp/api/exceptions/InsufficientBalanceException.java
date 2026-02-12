package com.bankapp.api.exceptions;

public class InsufficientBalanceException
        extends BusinessException {

    
	    private static final long serialVersionUID = 1L;

	public InsufficientBalanceException() {
        super("Insufficient balance");
    }
}