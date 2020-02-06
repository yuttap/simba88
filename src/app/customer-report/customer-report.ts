import {Component, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "../_services/httpclient";
import {SettingsService} from "../_services/settings.service";
import {ModalDirective} from "ngx-bootstrap";
declare let jQuery: any;
import * as moment from 'moment';

@Component({
    selector: '[customer]',
    templateUrl: './customer-report.html',
    styleUrls: [ './customer-report.style.scss' ],
    encapsulation: ViewEncapsulation.None
})

export class CustomerReport implements OnInit{

    public users : any = [];
    startDate: Date = null;
    endDate: Date = null;
    datepickerOpts: any = {
        format: 'dd/mm/yyyy',
        autoclose: true,
    };

    agType : any = [];
    agentType : number = 0;
    private username : string = '';
    public paginationConfig  = { itemsPerPage: 50, currentPage: 1, totalItems: 0,id: 'page' };
    @ViewChild('topupModal') public topupModal:ModalDirective;
    @ViewChild('withdrawModal') public withdrawModal:ModalDirective;
    @ViewChild('customerModal') public customerModal:ModalDirective;

    private topUpReports : any = [];
    private withdrawReports : any = [];
    private userDetail : any = {};

    private banks : any = [];
    private position : string = '';

    constructor( private router: Router,
                 private route: ActivatedRoute,
                 private http: HttpClient,
                 private setting: SettingsService) {

        this.position = this.setting.getPosition();

        let date = new Date();

        if(parseInt(moment().format("HH")) >= 12){
            this.startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
            this.endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()+1, 11, 59, 59);
        } else {
            this.startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() -1, 12, 0, 0);
            this.endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 11, 59, 59);
        }
    }

    ngOnInit() {
        this.onLoad();
        this.getMaster();
        this.getAgentType();
    }

    pageChange(e:any){
        console.log('Event next page ====> ', e);
        this.paginationConfig.currentPage = e;
        this.onLoad();
    }

    onLoad(){

        let obj = {
            startDate: this.startDate ,
            endDate: this.endDate,
            username: this.username,
            agentType: parseInt(this.agentType),
            page: this.paginationConfig.currentPage,
            limit: this.paginationConfig.itemsPerPage
        };

        this.http.post(`${this.setting.getAppSetting('url')}/customer`, obj)
            .subscribe(response => {
                if (response.code == 0) {
                    this.users = response.result.list;
                    this.paginationConfig.totalItems = response.result.total;
                } else {
                    if(response.code === 1005 || response.code === 1003){
                        alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                        this.router.navigate(['/login']);
                    }
                }
            });
    }

    yesterday(){
        let date = new Date();

        if(parseInt(moment().format("HH")) >= 12){
            this.startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()-1, 12, 0, 0);
            this.endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 11, 59, 59);
        } else {
            this.startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()-2, 12, 0, 0);
            this.endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()-1, 11, 59, 59);
        }

        this.paginationConfig.currentPage = 1;

        this.onLoad();
    }

    today(){
        let date = new Date();

        if(parseInt(moment().format("HH")) >= 12){
            this.startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
            this.endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()+1, 11, 59, 59);
        } else {
            this.startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() -1, 12, 0, 0);
            this.endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 11, 59, 59);
        }

        this.paginationConfig.currentPage = 1;

        this.onLoad();
    }

    topUpReport(username){
        this.http.post(`${this.setting.getAppSetting('url')}/customer/deposit`, {username: username})
            .subscribe(response => {
                console.log(response)
                if (response.code == 0) {
                    this.topUpReports = response.result;
                    jQuery('#topupModal').modal({backdrop: 'static', keyboard: false});
                } else {

                }
            });
    }

    getAgentType(){

        this.http.get(`${this.setting.getAppSetting('url')}/home/agentType`)
            .subscribe(response => {
                if (response.code == 0) {
                    this.agType = response.result;

                } else {
                    if(response.code === 1005 || response.code === 1003){
                        alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                        this.router.navigate(['/login']);
                    }
                }
            });

    }

    withdrawReport(username){
        this.http.post(`${this.setting.getAppSetting('url')}/customer/withdraw`, {username: username})
            .subscribe(response => {
                console.log(response)
                if (response.code == 0) {
                    this.withdrawReports = response.result;
                    jQuery('#withdrawModal').modal();
                } else {

                }
            });
    }

    openCustomer(username){
        this.http.post(`${this.setting.getAppSetting('url')}/customer/detail`, {username: username})
            .subscribe(response => {
                if (response.code == 0) {
                    if(response.result.walletPoint === undefined){
                        response.result.walletPoint = 0
                    }
                    this.userDetail = response.result;
                    jQuery('#customerModal').modal({backdrop: 'static', keyboard: false});
                } else {

                }
            });
    }

    update(obj){

        if( obj.isBonus == undefined || obj.isBonus == null ){
            obj.isBonus = false;
        }
        this.http.put(`${this.setting.getAppSetting('url')}/customer/update/${obj._id}`, obj)
            .subscribe(response => {
                if (response.code == 0) {
                    alert(response.message);

                    this.onLoad();
                    jQuery('#customerModal').modal("hide");
                } else {
                    alert(response.message);
                }
            });
    }

    public getMaster(){
        this.http.get(`${this.setting.getAppSetting('url')}/bank/master`)
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
    }


    copyLink(val: string){
        let selBox = document.createElement('input');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = val;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        alert('คัดลอกสำเร็จ');
    }
}