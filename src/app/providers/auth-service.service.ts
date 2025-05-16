import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
// import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  tokenKey: any = 'accessToken';
  private refreshTokenKey = 'refreshToken';
  private userKey = 'currentUser';
  private userSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  public currentUser$ = this.userSubject.asObservable(); // Observable for user updates
  constructor(private http: HttpClient) { }
  isAuthenticated: boolean = false;

  // login() {
  //   this.isAuthenticated = true;
  // }
  // refreshToken(): Observable<string> {
  //   return this.http.post<string>('/api/auth/refresh-token', {});
  // }
  saveToken(token: string): void {
    localStorage.setItem('jwtToken', token);
  }

  removeToken(): void {
    localStorage.removeItem('jwtToken');
  }
  // logout() {
  //   this.isAuthenticated = false;
  // }

  // isLoggedIn() {
  //   return this.isAuthenticated;
  // }

  login(credentials?: any): Observable<any> {
    credentials = {
      'username': 'emilys',
      'password': 'emilyspass',
      'expiresInMins': 30, // optional, defaults to 60
    }
    return this.http.post<{ token: string }>('https://dummyjson.com/auth/login', credentials, 
      { headers: { 'Content-Type': 'application/json', credentials: 'include' } }
     ).pipe(
      //Side effect without modifying data such as Saves token after login
      tap((response: any) => {
        localStorage.setItem(this.tokenKey, response.accessToken);
        this.storeAuthData(response.accessToken, response.refreshToken, response.username);
      })
    );
  }
   /** Store token and user info */
   private storeAuthData(token: string, refreshToken: string, username: any) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    localStorage.setItem(this.userKey, JSON.stringify(username));
    this.userSubject.next(username);
  }
  /** Get stored refresh token */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }
    /** Refresh token API call */
    refreshToken(): Observable<{ token: string; refreshToken: string }> {
      return this.http.post<{ token: string; refreshToken: string }>('https://dummyjson.com/auth/refresh', {
        refreshToken: this.getRefreshToken(),
        expiresInMins: 30,
      },  { headers: { 'Content-Type': 'application/json', credentials: 'include' } }).pipe(
        tap(response => {
          if (response.token && response.refreshToken) {
            this.storeAuthData(response.token, response.refreshToken, this.getCurrentUser());
          } else {
            this.logout();
          }
        })
      );
    }
  /** Get the current user */
  getCurrentUser(): any {
    return JSON.parse(localStorage.getItem(this.userKey) || 'null');
  }
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.clear();
    this.userSubject.next(false);
    // this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    console.log(localStorage.getItem(this.tokenKey) )
    if(localStorage.getItem(this.tokenKey) === null) {
      return false;
    } else {
      return true
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
