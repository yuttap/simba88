import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService, UserService} from "../_services";
import {Router} from "@angular/router";
import {HttpClient} from "../_services/httpclient";
import {SettingsService} from "../_services/settings.service";
import {ModalDirective} from "ngx-bootstrap";
declare let jQuery: any;

@Component({
    selector: 'withdraw',
    styleUrls: ['./withdraw.style.scss'],
    templateUrl: './withdraw.template.html',
    host: {
        class: 'home-page app'
    }
})
export class Withdraw implements OnInit {

    private banks : any = [];
    private userDetail: any = {
        firstName: '',
        lastName: '',
        accountNumber: '',
        bankName: '',
        recommend: '',
        recommendOther: '',
        trans: []
    };

    private username : any = '';

    btnWithdraw = false;

    @ViewChild('userModal') public userModal:ModalDirective;

    constructor(fb: FormBuilder,
                public settings: SettingsService,
                private http: HttpClient,
                private router: Router,
                private userService: UserService,
                private authenticationService: AuthenticationService) {


    }

    ngOnInit() {

    }

    init(){
        this.userDetail = {
            firstName: '',
            lastName: '',
            accountNumber: '',
            bankName: '',
        }

        this.username = '';
        this.btnWithdraw = false;
    }

    public findCustomer(){
        if(!this.username){
            alert('กรุณากรอก Username');
            return;
        }

        this.http.get(`${this.settings.getAppSetting('url')}/customer/${this.username}`)
            .map((data: any) => (data.data || data))
            .subscribe((data) => {
                    if (data.code == 0) {

                        this.userDetail = data.result;
                        this.btnWithdraw = true;
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

    withdraw(){
        if(!this.userDetail.value || this.userDetail.value <= 0){
            this.userDetail.value = 0;
            alert('กรุณากรอกจำนวนเงินที่ต้องการถอนให้ถูกต้อง');
            return;
        }

        if(confirm(`คุณต้องการทำการถอนให้กับ Username : ${this.userDetail.username} \n จำนวนเงิน : ${this.userDetail.value} บาท ใข่หรือไม่`)){
            this.http.post(`${this.settings.getAppSetting('url')}/withdraw`, {username: this.userDetail.username, value: this.userDetail.value})
                .map((data: any) => (data.data || data))
                .subscribe((data) => {
                        if (data.code == 0) {

                            alert('ทำรายการสำเร็จ \nกรุณารอระบบทำรายการ \n สามารถเช็คได้ที่หน้ารายงานการถอน')
                            this.init();
                        } else {
                            if(data.code === 1005 || data.code === 1003){
                                alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                                this.router.navigate(['/login']);
                            } else {
                                alert(data.message);
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
    }

}
