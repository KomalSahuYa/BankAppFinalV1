package com.bankapp.api.exceptions;

public class DuplicateUsernameException extends BusinessException {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public DuplicateUsernameException(String username) {
        super("Username already exists: " + username);
    }
}