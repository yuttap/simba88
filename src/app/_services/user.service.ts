import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import {AuthenticationService} from "./authentication.service";
import {JwtHelper} from "angular2-jwt";

@Injectable()
export class UserService {

    jwtHelper: JwtHelper = new JwtHelper();

    constructor( private authenticationService: AuthenticationService) {
    }

    getUserInfo(): any {
        // add authorization header with jwt token
        if(localStorage.getItem('token')) {
            return this.jwtHelper.decodeToken(this.getToken()).data;
        }
        return null;
    }

    isTokenExpired():boolean {
        if(this.getToken()) {
            return this.jwtHelper.isTokenExpired(this.getToken());
        }
        return true;
    }

    hasRole(role): boolean {
        return role.includes('ALL') || role.includes(this.getUserInfo().type);
    }

    getToken() {
        return localStorage.getItem('token');
    }

    cleanUserInfo(){
        localStorage.removeItem('token');
    }
}
