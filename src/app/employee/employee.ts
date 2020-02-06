import {Component, Inject, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "../_services/httpclient";
import {SettingsService} from "../_services/settings.service";
import {ModalDirective} from "ngx-bootstrap";
declare let jQuery: any;
import { DOCUMENT } from '@angular/platform-browser';

@Component({
    selector: '[employee]',
    templateUrl: './employee.html',
    styleUrls: [ './employee.style.scss' ],
    encapsulation: ViewEncapsulation.None
})

export class Employee implements OnInit{

    public employees : any = [];
    @ViewChild('employeeModal') public employeeModal:ModalDirective;
    @ViewChild('twoFactoryModal') public twoFactoryModal:ModalDirective;
    public employeeDetail : any = {};
    private type : string = '';
    private twoFactoryObj : any = {};
    private isJAdmin : boolean = false;

    constructor( private router: Router,
                 private route: ActivatedRoute,
                 private http: HttpClient,
                 @Inject(DOCUMENT) private document: any,
                 private setting: SettingsService) {

        if(this.document.location.hostname.includes('890') || this.document.location.hostname.includes('ufrr41')){
            this.isJAdmin = true;
        }

        if(this.setting.getPosition() !== 'SUPER_ADMIN' && this.setting.getPosition() !== 'SECURITY'){
            alert('คุณไม่มีสิทธิ์ในเมนูนี้');
            this.router.navigate(['/app/home']);

        }
    }

    ngOnInit() {
        this.onLoad();
    }


    onLoad(){

        this.http.post(`${this.setting.getAppSetting('url')}/employee`, {})
            .subscribe(response => {
                console.log(response)
                if (response.code == 0) {
                    this.employees = response.result;
                } else {
                    if(response.code === 1005 || response.code === 1003){
                        alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                        this.router.navigate(['/login']);
                    }
                }
            });
    }

    openModal(type, id){
        this.type = type;

        if(type === 'EDIT'){
            this.loadDetail(id);
        } else {
            this.employeeDetail = {};
            jQuery('#employeeModal').modal({backdrop: 'static', keyboard: false});
        }
    }

    openTwoFactoryModal(username){
        this.http.post(`${this.setting.getAppSetting('url')}/employee/generateOtp`, {username: username})
            .subscribe(response => {

                if (response.code == 0) {
                    this.twoFactoryObj = response.result;
                    this.twoFactoryObj.username = username;
                    jQuery('#twoFactoryModal').modal({backdrop: 'static', keyboard: false});
                } else {

                }
            });
    }

    loadDetail(id){
        this.http.get(`${this.setting.getAppSetting('url')}/employee/${id}`)
            .subscribe(response => {
                if (response.code == 0) {
                    this.employeeDetail = response.result;
                    jQuery('#employeeModal').modal({backdrop: 'static', keyboard: false});
                } else {

                }
            });
    }

    confirmOtp(){
        this.http.post(`${this.setting.getAppSetting('url')}/employee/checkOtp`, {username: this.twoFactoryObj.username, otp: this.twoFactoryObj.otp})
            .subscribe(response => {

                if (response.code == 0) {
                    alert(response.message)
                    jQuery('#twoFactoryModal').modal("hide");
                } else {
                    alert(response.message)
                }
            });
    }

    onSubmit(){
        if(this.type === 'EDIT'){
            this.update(this.employeeDetail);
        } else {
            this.register(this.employeeDetail);
        }
    }

    update(obj){
        this.http.post(`${this.setting.getAppSetting('url')}/employee/update`, obj)
            .subscribe(response => {
                if (response.code == 0) {
                    alert(response.message);

                    this.onLoad();
                    jQuery('#employeeModal').modal("hide");
                } else {
                    alert(response.message);
                }
            });
    }

    register(obj){
        this.http.post(`${this.setting.getAppSetting('url')}/employee/register`, obj)
            .subscribe(response => {
                if (response.code == 0) {
                    alert(response.message);

                    this.onLoad();
                    jQuery('#employeeModal').modal("hide");
                } else {
                    alert(response.message);
                }
            });
    }
}