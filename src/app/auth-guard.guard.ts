import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, GuardResult, MaybeAsync } from '@angular/router';
import { Observable } from "rxjs";
import { AuthService } from "./providers/auth-service.service";

@Injectable(
{    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,   private router: Router) {
        }
        //CanActivate: The CanActivate route guard is used to determine whether a user is allowed to activate a particular route or not. It's often used for authentication and authorization purposes. If the CanActivate guard returns true, the route is activated, and the user can navigate to it. If it returns false or a UrlTree (which can be a redirection), the route activation is prevented.
        // CanLoad: The CanLoad route guard is used to determine whether a user is allowed to load a feature module that is lazily loaded. This is helpful when you have feature modules that should only be loaded for authorized users. If the CanLoad guard returns true, the module is loaded. If it returns false, the module won't be loaded, and the user is prevented from accessing the corresponding routes.CanLoad: The CanLoad route guard is used to determine whether a user is allowed to load a feature module that is lazily loaded. This is helpful when you have feature modules that should only be loaded for authorized users. If the CanLoad guard returns true, the module is loaded. If it returns false, the module won't be loaded, and the user is prevented from accessing the corresponding routes.
        // Resolve: The Resolve route guard is used to pre-fetch data before a route is activated. It's often used to ensure that required data is available before a component is displayed. This can help in avoiding empty or uninitialized components when navigating to a route. The Resolve guard fetches the data and provides it to the component as a resolved data object.
     async canActivate(): Promise<boolean> {
    const token = await this.authService.isLoggedIn();
    if (token) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}