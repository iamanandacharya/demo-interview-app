import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  tokenKey: any = 'accessToken';
  private refreshTokenKey: any = 'refreshToken';
  private userKey = 'currntUser';
  // We want to keep track of the login status or current user across the whole app, and we want other parts of the app (like components) to be able to react to changes — for example:If a user logs in ✅
  // BehaviorSubject- To hold and broadcast the current login status or user info.
  // BehaviorSubject- Always remembers the latest value
  // Can send out that value to anyone who’s interested (like your components).
  // You can also update that value anytime using .next().
  //  This creates a container holding the login state (true/false), and it can be updated whenever login/logout happens.
  private userSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  // currentUser To expose that information as an Observable
  // This line turns userSubject into an observable that other parts of your app can subscribe to, but they cannot change the value.
  public currentUser$ = this.userSubject.asObservable(); // Observable for user updates

  isAuthenticated: boolean = false;
  constructor(
    private http: HttpClient,
    private storage: Storage
  ) { }
  login(creds: any): Observable<any> {
    creds = {
      'username': 'emilys',
      'password': 'emilyspass',
      'expiresInMins': 30, // optional, defaults to 60
    }
    return this.http.post<{ token: string }>
      ('https://dummyjson.com/auth/login',
        creds,
        {
          headers:
            { 'Content-Type': 'application/json', credentials: 'include' }
        }
      ).pipe(
        // tap oprator doing is side effect of rxjs observable means 
        // it will simply  triggering external actions
        tap((response: any) => {
          this.saveToken(this.tokenKey, response.accessToken)
          this.storeAuthData(response.accessToken, response.refreshToken, response.username);
        })
      )
  }
  saveToken(token: string, accessToken: string) {
    this.storage.set(token, accessToken);
  }
   /** Store token and user info */
   private storeAuthData(token: string, refreshToken: string, username: any) {
    this.storage.set(this.tokenKey, token);
    this.storage.set(this.refreshTokenKey, refreshToken);
    this.storage.set(this.userKey, JSON.stringify(username));
    // This line updates the BehaviorSubject, which means:
    // Anyone listening to currentUser$ immediately gets the new username.
    this.userSubject.next(username);
  }
  removerToken(token: string) {
    this.storage.remove('token');
  }

    /** Get stored refresh token */
  async getRefreshToken(): Promise<string | null> {
     return await this.storage.get(this.tokenKey);
  }
      /** Refresh token API call */
    refreshTokens(): Observable<
    { token: string; refreshToken: string }> 
    {
      return this.http.post<
      { token: string; refreshToken: string }>
      ('https://dummyjson.com/auth/refresh', {
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
    logout(): void {
    this.storage.remove(this.tokenKey);
    this.storage.clear();
    this.userSubject.next(false);
    // this.router.navigate(['/login']);
  }
    /** Get the current user */
  getCurrentUser(): any {
    this.storage.get(this.tokenKey).then((data) => {
      this.userKey = data;
    })
    console.log(this.userKey )

    return JSON.parse(this.userKey || 'null');
  }
 async getToken(): Promise<string | null> {
    return this.storage.get(this.tokenKey); // Or your actual auth logic
  }
     isLoggedIn(): boolean {
    console.log(this.storage.get(this.tokenKey) )
    if(this.storage.get(this.tokenKey) === null) {
      return false;
    } else {
      return true
    }
  }
}
