import { PermissionService } from './permission.service';
import { AuthService } from './auth.service';

describe('PermissionService', () => {
  const createService = (isManager: boolean, isClerk: boolean): PermissionService => {
    const authServiceStub = {
      isManager: () => isManager,
      isClerk: () => isClerk
    } as AuthService;

    return new PermissionService(authServiceStub);
  };

  it('should allow manager-only operations only for manager role', () => {
    expect(createService(true, false).canCreateAccount()).toBeTrue();
    expect(createService(false, true).canCreateAccount()).toBeFalse();
  });

  it('should allow transactional operations for both manager and clerk', () => {
    expect(createService(true, false).canProcessDeposit()).toBeTrue();
    expect(createService(false, true).canProcessDeposit()).toBeTrue();
    expect(createService(false, false).canProcessDeposit()).toBeFalse();
  });
});
