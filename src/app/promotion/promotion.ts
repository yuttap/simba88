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
    selector: 'promotion',
    styleUrls: ['./promotion.style.scss'],
    templateUrl: './promotion.template.html',
    host: {
        class: 'home-page app'
    }
})
export class Promotion implements OnInit {

    private startDate: Date;
    private endDate: Date;
    private prefix : any = 'ALL';
    private updateId: any = null;
    private textstate = 'เพิ่มโปรโมชั่น'
    private cancel = false
    private active: any;
    private result : any = [];
    private promotionName = null

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
        this.http.get(`${this.settings.getAppSetting('url')}/promotion`)
            .map((data: any) => (data.data || data))
            .subscribe((data) => {
                    if (data.code == 0) {
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

    onSubmit(){
        const body = {
            "promotionName": this.promotionName,
            "active": this.active,
            "isDelete": false
        }

        if(this.updateId)
        {

            this.http.put(`${this.settings.getAppSetting('url')}/promotion/update/${this.updateId}`, body)
                .map((data: any) => (data.data || data))
                .subscribe((data) => {
                        if (data.code == 0) {
                            this.onCancel();
                            this.onLoad();

                        } else {
                            alert(data.message);
                        }
                    },
                    error=>{
                        if(error.status == 500){
                            alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                            this.router.navigate(['/login']);
                        }
                    })

        }else{

            const body = {
                promotionName : this.promotionName
            }

            this.http.post(`${this.settings.getAppSetting('url')}/promotion/add`, body)
                .subscribe(response => {
                    if (response.code == 0) {
                        this.onLoad()

                    } else {
                        alert(response.message);
                    }
                });


        }
    }

    onEdit(data){
        this.textstate = 'อับเดต'
        this.cancel = true
        this.updateId = data._id
        this.active = data.active
        this.promotionName = data.promotionName
    }

    onCancel(){
        this.textstate = 'เพิ่มโปรโมชั่น';
        this.cancel = false;
        this.updateId = null;
        this.active = null;
        this.promotionName = null;
    }

    onDelete(data){

        if(data._id && data._id != undefined) {
            if(confirm("ต้องการหยุดใช้งานโปรโมชั่นนี้")) {
                const body = {
                    "promotionName": data.promotionName,
                    "active": false,
                    "isDelete": true
                }

                this.http.put(`${this.settings.getAppSetting('url')}/promotion/update/${data._id}`, body)
                    .map((data: any) => (data.data || data))
                    .subscribe((data) => {
                            if (data.code == 0) {
                                this.onCancel();
                                this.onLoad();

                            } else {
                                alert(data.message);
                            }
                        },
                        error=>{
                            if(error.status == 500){
                                alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                                this.router.navigate(['/login']);
                            }
                        })

            }else{
                return false;
            }

        }
    }

}
