package com.bankapp.api.service;

import java.util.List;

import com.bankapp.api.dto.AccountCreateRequest;
import com.bankapp.api.dto.AccountFullResponse;
import com.bankapp.api.dto.AccountResponse;
import com.bankapp.api.dto.AccountUpdateRequest;

public interface AccountService {

	AccountResponse create(AccountCreateRequest req);

	AccountResponse getByNumber(String accNo);

	List<AccountResponse> getAll();

	void deactivate(String accNo);
	AccountResponse update(String accNo,
            AccountUpdateRequest req);
	
	AccountFullResponse findFullAccount(String accNo);
	
}