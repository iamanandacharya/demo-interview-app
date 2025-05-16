import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [provideHttpClient()]
    }).compileComponents();
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the form with 2 controls', () => {
    // check if the form is created
    expect(component).toBeTruthy();
    expect(component.loginForm).toBeTruthy();
  })

  // Test Case: Form Should be Invalid when empty
  it('it should be show error while empty form', () => {
    expect(component.loginForm.valid).toBeFalse();
  })
  // validate username field
  it('it should be validate username field', () => {
    let username = component.loginForm.controls['username'];
    username.setValue('asdas');
    expect(username.valid).toBeFalse(); // min length should be 5
  });

  // password field
  it('It should be validate password field', () => {
    let password = component.loginForm.controls['password'];
    password.setValue('asdasdas');
    expect(password.valid).toBeFalse();
  })

  // submit form
  it('it should be create submit form', () => {
    component.loginForm.setValue({ username: 'asd', password: 'asdasdas'});
    component.submitLoginForm();
    expect(component.submnitList.length).toBe(1);
    expect(component.submnitList[0]).toEqual({ username: 'asd', password: 'asdasdas'})
  })
});
