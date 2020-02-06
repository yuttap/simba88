import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import {Router} from "@angular/router";
import {SettingsService} from "./settings.service";
import {Http} from "@angular/http";

@Injectable()
export class AuthenticationService {
    public token: string;

    constructor(private http: Http,public settings: SettingsService, private router: Router,) {
        // set token if saved in local storage
        const currentUser = JSON.parse(localStorage.getItem('userInfo'));
        this.token = currentUser && currentUser.token;
    }

    login(username: string, password: string, otp?:string): Observable<boolean> {
        return this.http.post(`${this.settings.getAppSetting('url') }/employee/login`, { username: username, password: password, otp: otp })
            .map((response) => {
                console.log(response.json());
                if (response.json().result) {

                    console.log(response.json());
                    let result = response.json().result;
                    this.token = result.token;
                    localStorage.setItem('token', this.token);
                    localStorage.setItem('profile', JSON.stringify(result.profile));

                    let headers = {
                        'authorization': `Bearer ${result.token}`,
                        'group': result.profile.position,
                        'Content-Type': 'application/json'
                    };

                    localStorage.setItem('UserStore', JSON.stringify(headers));

                    return true;
                } else if(response.json().code === 2){
                    return {code: 2, message: response.json().message};
                } else if(response.json().code === 3){
                    return {code: 3, message: response.json().message};
                } else {
                    return response.json().message;
                }
            });
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('profile');
        localStorage.removeItem('UserStore');
        // this.router.navigate(['/login']);

    }
}
