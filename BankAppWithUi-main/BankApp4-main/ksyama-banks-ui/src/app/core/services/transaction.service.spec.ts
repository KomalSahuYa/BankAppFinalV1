import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(TransactionService);
  });

  it('should require approval for withdrawals strictly greater than ₹2,00,000', () => {
    expect(service.needsApproval(200000)).toBeFalse();
    expect(service.needsApproval(200000.01)).toBeTrue();
  });

  it('should not require approval for small positive amounts', () => {
    expect(service.needsApproval(1)).toBeFalse();
  });
});
