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

  it('should allow account operations for both manager and clerk', () => {
    expect(createService(true, false).canCreateAccount()).toBeTrue();
    expect(createService(false, true).canCreateAccount()).toBeTrue();
    expect(createService(false, false).canCreateAccount()).toBeFalse();
  });

  it('should allow employee management only to manager role', () => {
    expect(createService(true, false).canCreateUser()).toBeTrue();
    expect(createService(false, true).canCreateUser()).toBeFalse();
  });
});
