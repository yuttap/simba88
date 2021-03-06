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
    selector: 'register',
    styleUrls: ['./register.style.scss'],
    templateUrl: './register.template.html',
    host: {
        class: 'home-page app'
    }
})
export class Register implements OnInit {

    private banks : any = [];
    private agentType : any = [];
    private userDetail: any = {
        firstName: '',
        lastName: '',
        accountNumber: '',
        bankName: '',
        recommend: '',
        recommendOther: '',
        isAutoTopup: true,
        isBonus: '',
        agentType: 1
    };

    private message : string = '';

    isClick = false;

    @ViewChild('userModal') public userModal:ModalDirective;

    constructor(fb: FormBuilder,
                public settings: SettingsService,
                private http: HttpClient,
                private router: Router,
                private userService: UserService,
                private _clipboardService: ClipboardService,
                private authenticationService: AuthenticationService) {


    }

    ngOnInit() {
        this.getMaster();
    }

    init(){
        this.userDetail = {
            firstName: '',
            lastName: '',
            accountNumber: '',
            bankName: '',
            recommend: '',
            recommendOther: '',
            tel: '',
            isAutoTopup: true,
            isBonus: '',
            agentType: 1
        }
    }

    public getMaster(){
        this.http.get(`${this.settings.getAppSetting('url')}/bank/master`)
            .map((data: any) => (data.data || data))
            .subscribe((data) => {
                    if (data.code == 0) {

                        this.banks = data.result;
                    } else {
                        if(data.code === 1005 || data.code === 1003){
                            alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                            this.router.navigate(['/login']);
                        }

                    }
                },
                error=>{
                    if(error.status == 500){
                        alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                        this.router.navigate(['/login']);
                    }
                })

        this.http.get(`${this.settings.getAppSetting('url')}/home/agentType`)
            .map((data: any) => (data.data || data))
            .subscribe((data) => {
                    if (data.code == 0) {

                        this.agentType = data.result;
                    } else {
                        if(data.code === 1005 || data.code === 1003){
                            alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                            this.router.navigate(['/login']);
                        }

                    }
                },
                error=>{
                    if(error.status == 500){
                        alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                        this.router.navigate(['/login']);
                    }
                })
    }

    clearData(){
        if(confirm('คุณต้องการล้างข้อมูลในการสมัครใช่หรือไม่')){
            this.init();
        }
    }

    register(){

        if(!this.userDetail.firstName){
            alert('กรุณากรอกชื่อจริง');
            return;
        }

        if(!this.userDetail.lastName){
            alert('กรุณากรอกนามสกุล');
            return;
        }

        if(!this.userDetail.accountNumber){
            alert('กรุณากรอกเลขบัญชีธนาคาร');
            return;
        }

        if(!this.userDetail.bankName){
            alert('กรุณาเลือกบัญชีธนาคาร');
            return;
        }

        if(confirm('คุณต้องการทำการสมัครใช่หรือไม่')){

            this.isClick = true;
            if(this.userDetail.agentType == 1){
                this.http.post(`${this.settings.getAppSetting('url')}/customer/register`, this.userDetail)
                    .map((data: any) => (data.data || data))
                    .subscribe((data) => {
                            if (data.code == 0) {

                                this.message = `User: ${data.result.username} \n Pass: ${data.result.password}`;

                                this._clipboardService.copyFromContent(this.message);
                                alert(`ทำรายการสำเร็จ \n User: ${data.result.username} \n Pass: ${data.result.password} \n คุณสามารถนำไปวางได้เลย เราได้ทำการคัดลอกให้คุณแล้ว`);
                                this.init();
                            } else {
                                if(data.code === 1005 || data.code === 1003){
                                    alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                                    this.router.navigate(['/login']);
                                } else {
                                    alert(data.message)
                                }

                            }

                            this.isClick = false;
                        },
                        error=>{
                            if(error.status == 500){
                                alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                                this.router.navigate(['/login']);
                            }
                        })
            } else if(this.userDetail.agentType > 1){
                this.http.post(`${this.settings.getAppSetting('url')}/customer/registerAgent${this.userDetail.agentType}`, this.userDetail)
                    .map((data: any) => (data.data || data))
                    .subscribe((data) => {
                            if (data.code == 0) {

                                this.message = `User: ${data.result.username} \n Pass: ${data.result.password}`;

                                this._clipboardService.copyFromContent(this.message);
                                alert(`ทำรายการสำเร็จ \n User: ${data.result.username} \n Pass: ${data.result.password} \n คุณสามารถนำไปวางได้เลย เราได้ทำการคัดลอกให้คุณแล้ว`);
                                this.init();
                            } else {
                                if(data.code === 1005 || data.code === 1003){
                                    alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                                    this.router.navigate(['/login']);
                                } else {
                                    alert(data.message)
                                }

                            }

                            this.isClick = false;
                        },
                        error=>{
                            if(error.status == 500){
                                alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                                this.router.navigate(['/login']);
                            }
                        })
            }
        }
    }
}
