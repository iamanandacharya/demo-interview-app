import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthService } from './providers/auth-service.service';

import { of } from 'rxjs';
import { AuthGuard } from './auth-guard.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  // let authServiceSpy: jasmine.SpyObj<AuthService>;: 
  // This declares a variable authServiceSpy. We're using jasmine.SpyObj to create a mock object (a "spy") for the AuthService.
  //  This allows us to control the behavior and return values of the AuthService's methods in our tests without relying on the actual implementation of AuthService.
  let authServiceSpy: jasmine.SpyObj<AuthService>;0
  // let routerSpy: jasmine.SpyObj<Router>;: Similarly, 
  // this declares routerSpy as a mock object for the Angular Router. We'll use this to track if the guard attempts to navigate to a different route.
  let routerSpy: jasmine.SpyObj<Router>;

  // beforeEach(() => { ... });: This is a Jasmine lifecycle hook that runs before each individual test (it block) within the describe block. 
  // It's used to set up the necessary environment for each test.
  beforeEach(() => {
    // authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);: This creates the mock AuthService object. The first argument 'AuthService' is a descriptive name, and the second argument ['isLoggedIn'] is an array specifying the names of the methods we want to mock (in this case, just isLoggedIn). 
    // The jasmine.SpyObj automatically creates spy functions for these methods.
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    //routerSpy = jasmine.createSpyObj('Router', ['navigate']);: This creates a mock Router object, spying on its navigate method.
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // TestBed.configureTestingModule({ ... });: This configures the testing module for our component (in this case, indirectly for the guard).
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true if the user is logged in', async () => {
    authServiceSpy.isLoggedIn.and.returnValue(true); // Mock to return boolean directly
    const canActivate = await guard.canActivate();
    expect(canActivate).toBeTrue(); // Now we don't need to await
    expect(routerSpy.navigate).not.toHaveBeenCalled(); // expect(routerSpy.navigate).not.toHaveBeenCalled();: We also assert that the navigate method of our mock routerSpy has not been called. This is because if the user is logged in, the guard should not redirect them.
  });

  it('should return false and navigate to /login if the user is not logged in', async () => {
    authServiceSpy.isLoggedIn.and.returnValue(false); // Mock to return boolean directly
    const canActivate = await guard.canActivate();
    expect(canActivate).toBeFalse(); // Now we don't need to await
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle the case where the user is not logged in (synchronously)', async () => {
    authServiceSpy.isLoggedIn.and.returnValue(false); // Mock to return boolean directly
    const canActivate = await guard.canActivate();
    expect(canActivate).toBeFalse(); // Now we don't need to await
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});