import { Component, OnInit } from '@angular/core';
import { LoginService } from '../providers/login.service';
import { Router } from '@angular/router';
import { AuthService } from '../providers/auth-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
loginForm!: FormGroup;
submnitList: any[]= [];
errorMessage = '';
  constructor(private authService: AuthService, 
    private formBuilder: FormBuilder,
    private router: Router) { 
    this.loginForm = this.formBuilder.group({
      username: ["", [Validators.required, Validators.minLength(5)]],
      password: ["", [ Validators.required, Validators.minLength(8)]]
    })
  }
  login( ) {
    const credentials = {
      'username': 'emilys',
      'password': 'emilyspass',
      'expiresInMins': 30, // optional, defaults to 60
    }
    this.authService.login(credentials).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => this.errorMessage = 'Invalid credentials'
    });
    this.router.navigate(['/dashboard']);
  }
  logout() {
    this.authService.logout();
  }
  ngOnInit(): void {
    
  }
  submitLoginForm() {
    let username = this.loginForm.get('username')?.value;
    let password = this.loginForm.get('password')?.value;
    console.log(username , password);
    this.submnitList.push(this.loginForm.value);
    const credentials = {
      'username': 'emilys',
      'password': 'emilyspass',
      'expiresInMins': 30, // optional, defaults to 60
    }
    this.authService.login(credentials).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => this.errorMessage = 'Invalid credentials'
    });
    this.router.navigate(['/dashboard']);
  }
}
