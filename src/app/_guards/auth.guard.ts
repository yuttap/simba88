import { Injectable } from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {UserService} from "../_services/user.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router,private userService: UserService) { }

    canActivate( route: ActivatedRouteSnapshot,state: RouterStateSnapshot) {
        if (this.userService.getUserInfo()) {

            if(this.userService.isTokenExpired()){
                localStorage.removeItem('token');
                this.router.navigate(['/login']);
                return false;
            }

            let roles = route.data.roles || [];
            if (roles.length == 0 || this.userService.hasRole(roles)) {
                // return super.activate(nextInstruction);
                console.log('okkkkkkk')
            }else {
                this.router.navigate(['/extra/permission-denied']);
            }
            return true;
        }

        // not logged in so redirect to login page
        this.router.navigate(['/login']);
        return false;
    }
}
