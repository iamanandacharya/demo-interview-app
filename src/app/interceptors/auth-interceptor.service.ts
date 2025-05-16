import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';

import { Router } from '@angular/router';
import { AuthService } from '../providers/auth-service.service';
@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this.authService.getToken();

    if (token) {
      authReq = this.addToken(req, token);
    }

    return next.handle(authReq).pipe(
      // Handles errors in HTTP requests such as Detects token expiration & logs out user
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !authReq.url.includes('/refresh')) {
          return this.handle401Error(authReq, next);
        }
        return throwError(() => error);
      })
    );
  }
  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        // Cancels previous observable & switches to a new one such as Refreshes token and retries request
        switchMap(({ token }) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token);
          return next.handle(this.addToken(request, token));
        }),
        catchError(err => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        // Filters values based on a condition such as Ensures token is not null before retrying
        filter(token => token !== null),
        // Completes after receiving the first value such as ensures a single retry for requests
        take(1),
        switchMap(token => next.handle(this.addToken(request, token!)))
      );
    }
  }
}
