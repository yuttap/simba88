import {Injectable, Component} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {UserService} from "./user.service";

@Injectable()
export class HttpClient {

    constructor(private http: Http,private userService:UserService) {}

    createAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', 'Bearer '+this.userService.getToken());
    }

    get(url:string) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.get(url, {
            headers: headers
        }).map((res) => res.json());
    }
    getWithOptions(url:string,options:any){
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        options.headers = headers;
        return this.http.get(url,options).map((res) => res.json());
    }

    post(url:string, data:any) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.post(url, data, {
            headers: headers
        }).map((res) => res.json());
    }

    put(url:string, data:any) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.put(url, data, {
            headers: headers
        }).map((res) => res.json());
    }

    delete(url:string, data:any) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.delete(url, {
            headers: headers
        }).map((res) => res.json());
    }
}
