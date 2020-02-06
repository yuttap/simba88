import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService, UserService} from "../_services";
import {Router} from "@angular/router";
import {HttpClient} from "../_services/httpclient";
import {SettingsService} from "../_services/settings.service";
import {ModalDirective} from "ngx-bootstrap";
declare let jQuery: any;
import { ClipboardService } from 'ngx-clipboard'

@Component({
    selector: 'registbyagent',
    styleUrls: ['./registbyagent.scss'],
    templateUrl: './registbyagent.html',
    host: {
        class: 'home-page app'
    }
})
export class Registbyagent implements OnInit {


    private result : any = [];


    constructor(fb: FormBuilder,
                public settings: SettingsService,
                private http: HttpClient,
                private router: Router,
                private userService: UserService,
                private _clipboardService: ClipboardService,
                private authenticationService: AuthenticationService) {

    }

    ngOnInit() {
        this.onLoad();
    }

    onLoad(){
        this.http.get(`${this.settings.getAppSetting('url')}/home/agentType`)
            .map((data: any) => (data.data || data))
            .subscribe((data) => {
                    if (data.code == 0) {
                        console.log(data.result)
                        this.result = data.result;
                    } else {
                        if(data.code === 1005 || data.code === 1003){
                            alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                            this.router.navigate(['/login']);
                        }

                    }
                },
                error=>{
                    if(error.stูatus == 500){
                        alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                        this.router.navigate(['/login']);
                    }
                })
    }



}
