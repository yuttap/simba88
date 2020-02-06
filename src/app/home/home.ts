import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService, UserService} from "../_services";
import {Router} from "@angular/router";
import {HttpClient} from "../_services/httpclient";
import {SettingsService} from "../_services/settings.service";
import {ModalDirective} from "ngx-bootstrap";
declare let jQuery: any;
import {ClipboardService} from 'ngx-clipboard';

@Component({
    selector: 'home',
    styleUrls: ['./home.style.scss'],
    templateUrl: './home.template.html',
    host: {
        class: 'home-page app'
    }
})
export class Home implements OnInit {

    public banks: any = [];
    public result: any = [];
    public trans: any = [];
    public total: any = 0;

    public isClick: boolean = false;
    public payment: any = {};
    public position: any = [];

    @ViewChild('topupModal') public topupModal:ModalDirective;

    constructor(fb: FormBuilder,
                public settings: SettingsService,
                private http: HttpClient,
                private router: Router,
                private userService: UserService,
                private authenticationService: AuthenticationService,
                private _clipboardService: ClipboardService) {


    }

    ngOnInit() {
        this.onLoad();
    }

    onLoad(){
        console.log('---- 1 ----');

        this.position = this.settings.getPosition();
        this.http.post(`${this.settings.getAppSetting('url')}/home`, {})
            .map((data: any) => (data.data || data))
            .subscribe((data) => {
                    if (data.code == 0) {
                        for (let i = 0; i < data.result.length; i++) {


                            let startTime = new Date(data.result[i].createDate);
                            let endTime = new Date();
                            let difference = endTime.getTime() - startTime.getTime();
                            let resultInMinutes = Math.round(difference / 60000);


                            data.result[i].lminute = resultInMinutes;
                        }

                        this.result = data['result'];
                        this.banks = data['bank'];
                        this.trans = data['trans'];
                        this.total = 0;
                        for (let i = 0; i < data.bank.length; i++) {
                            this.total += data.bank[i].amount
                        }
                        
                    } else {
                        if(data.code === 1005 || data.code === 1003){
                            alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                            this.router.navigate(['/login']);
                        }
                    }

                    this.interval();
                },
                error=>{
                    if(error.status == 500){
                        alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                        this.router.navigate(['/login']);
                    }
                })
    }

    copy(text){
        this._clipboardService.copyFromContent(text);
    }

    private isNumber(value){
        if ((undefined === value) || (null === value)) {
            return false;
        }
        if (typeof value == 'number') {
            return true;
        }
        return !isNaN(value - 0);
    }

    topup(i){
        this.payment.amt = i.value;

        if(!this.payment.user){
            return alert("กรุณากรอกรหัสผู้ใช้");
        }

        if(!this.isNumber(this.payment.amt)){
            return alert("ยอดเงินไม่ใช่ตัวเลข");
        }

        let r = confirm("กรุณาตรวจสอบข้อมูลให้ถูกต้อง ถ้าถูกต้องแล้วให้กด ตกลง");
        if (r == true) {
            this.isClick = true;

            this.http.put(`${this.settings.getAppSetting('url')}/home/payment`, {transactionId: i._id, username: i.user})
                .map((data: any) => (data.data || data))
                .subscribe((data) => {

                        this.isClick = false;
                        if (data.code == 0) {
                            alert(data.message)
                            jQuery('#topupModal').modal("hide");
                            this.init();
                        } else {
                            if(data.message.error){
                                alert(data.message.error);
                            } else {
                                alert(data.message)
                            }
                        }
                    },
                    error=>{
                        this.isClick = false;
                        alert(error);
                    })
        }
    }

    delete(i){
        let r = prompt("กรุณาใส่หมายเหตุในการซ่อน");
        if(r){
            this.http.put(`${this.settings.getAppSetting('url')}/home/hide`, {transactionId: i._id, remark: r})
                .map((data: any) => (data.data || data))
                .subscribe((data) => {
                        if (data.code == 0) {
                            alert("ทำรายการสำเร็จ");
                            this.init();
                        } else {
                            alert(data.message);
                        }
                    },
                    error=>{
                        alert(error);
                    })
        }
    }

    openModal(i){
        this.payment = i;
        this.payment.user = i.username;
        this.isClick = false;

        jQuery('#topupModal').modal({backdrop: 'static', keyboard: false});
    }

    interval(){
        setTimeout(()=>{
            if(this.router.url === '/app/home'){
                this.onLoad();
            }
        }, 10000)
    }

    init() {
        this.http.post(`${this.settings.getAppSetting('url')}/home`, {})
            .map((data: any) => (data.data || data))
            .subscribe((data) => {
                    if (data.code == 0) {
                        for (let i = 0; i < data.result.length; i++) {


                            let startTime = new Date(data.result[i].createDate);
                            let endTime = new Date();
                            let difference = endTime.getTime() - startTime.getTime();
                            let resultInMinutes = Math.round(difference / 60000);


                            data.result[i].lminute = resultInMinutes;
                        }

                        this.result = data['result'];
                        this.banks = data['bank'];
                        this.trans = data['trans'];
                        this.total = 0;
                        for (let i = 0; i < data.bank.length; i++) {
                            this.total += data.bank[i].amount
                        }
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

    pendingTran(){
        this.http.get(`${this.settings.getAppSetting('url')}/backoffice/pending-deposit`)
            .map((data: any) => (data.data || data))
            .subscribe((data) => {

                    if (data.code == 0) {
                        alert("ทำรายการสำเร็จ")
                        this.init();
                    } else {
                        if(data.message.error){
                            alert(data.message.error);
                        } else {
                            alert(data.message)
                        }
                    }
                },
                error=>{
                    alert(error);
                })
    }

    changeStatusTopup(i){
        if(confirm(`รายการของ Username : ${i.username} ได้มีการเติมแล้วใช่หรือไม่`)){
            this.http.put(`${this.settings.getAppSetting('url')}/home/change-status`, {transactionId: i._id})
                .map((data: any) => (data.data || data))
                .subscribe((data) => {

                        if (data.code == 0) {
                            alert(data.message)
                            this.init();
                        } else {
                            if(data.message.error){
                                alert(data.message.error);
                            } else {
                                alert(data.message)
                            }
                        }
                    },
                    error=>{
                        alert(error);
                    })
        }
    }

    reset(i){
        if(confirm(`คุณต้องการให้ระบบทำรายการใหม่ของ Username : ${i.username} ใช่หรือไม่`)){
            this.http.put(`${this.settings.getAppSetting('url')}/home/retry`, {transactionId: i._id})
                .map((data: any) => (data.data || data))
                .subscribe((data) => {

                        if (data.code == 0) {
                            alert(data.message)
                            this.init();
                        } else {
                            if(data.message.error){
                                alert(data.message.error);
                            } else {
                                alert(data.message)
                            }
                        }
                    },
                    error=>{
                        alert(error);
                    })
        }
    }
}
