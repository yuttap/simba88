import {Component, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "../_services/httpclient";
import {SettingsService} from "../_services/settings.service";
import {ModalDirective} from "ngx-bootstrap";
declare let jQuery: any;

@Component({
    selector: '[banks]',
    templateUrl: './banks.html',
    styleUrls: [ './banks.style.scss' ],
    encapsulation: ViewEncapsulation.None
})

export class Banks implements OnInit{

    public banks : any = [];
    @ViewChild('bankModal') public bankModal:ModalDirective;
    public bankDetail : any = {};
    private type : string = '';

    constructor( private router: Router,
                 private route: ActivatedRoute,
                 private http: HttpClient,
                 private setting: SettingsService) {

        if(this.setting.getPosition() !== 'SUPER_ADMIN'){
            alert('คุณไม่มีสิทธิ์ในเมนูนี้');
            this.router.navigate(['/app/home']);

        }
    }

    ngOnInit() {
        this.onLoad();
    }


    onLoad(){

        this.http.get(`${this.setting.getAppSetting('url')}/bank/bank-config`)
            .subscribe(response => {
                if (response.code == 0) {
                    this.banks = response.result;
                } else {
                    if(response.code === 1005 || response.code === 1003){
                        alert("มีการเข้าระบบซ้ำซ้อนกรุณาเข้าระบบใหม่อีกครั้ง");
                        this.router.navigate(['/login']);
                    }
                }
            });
    }

    openModal(type, obj){
        this.type = type;

        if(type === 'EDIT'){
            this.bankDetail = obj;
        } else {
            this.bankDetail = {};

        }

        jQuery('#bankModal').modal({backdrop: 'static', keyboard: false});
    }

    onSubmit(){
        if(this.type === 'EDIT'){
            this.update(this.bankDetail);
        } else {
            this.save(this.bankDetail);
        }
    }

    update(obj){
        this.http.put(`${this.setting.getAppSetting('url')}/bank/bank-config`, obj)
            .subscribe(response => {
                if (response.code == 0) {
                    alert(response.message);

                    this.onLoad();
                    jQuery('#bankModal').modal("hide");
                } else {
                    alert(response.message);
                }
            });
    }

    save(obj){
        this.http.post(`${this.setting.getAppSetting('url')}/bank/bank-config`, obj)
            .subscribe(response => {
                if (response.code == 0) {
                    alert(response.message);

                    this.onLoad();
                    jQuery('#bankModal').modal("hide");
                } else {
                    alert(response.message);
                }
            });
    }

    start(bankId){

        let obj = {
            bankId: bankId
        };

        if(confirm('คุณต้องการเปิดใช้งานธนาคารใช่หรือไม่')){
            this.http.put(`${this.setting.getAppSetting('url')}/bank/start`, obj)
                .subscribe(response => {
                    if (response.code == 0) {
                        alert(response.message);

                        this.onLoad();
                    } else {
                        alert(response.message);
                    }
                });
        }
    }

    stop(bankId){

        let obj = {
            bankId: bankId
        };

       if(confirm('คุณต้องการหยุดการใช้งานธนาคารใช่หรือไม่')){
           this.http.put(`${this.setting.getAppSetting('url')}/bank/stop`, obj)
               .subscribe(response => {
                   if (response.code == 0) {
                       alert(response.message);

                       this.onLoad();
                   } else {
                       alert(response.message);
                   }
               });
       }
    }

    restart(bankId){

        let obj = {
            bankId: bankId
        };

       if(confirm('คุณต้องการรีธนาคารใช่หรือไม่')){
           this.http.put(`${this.setting.getAppSetting('url')}/bank/restart`, obj)
               .subscribe(response => {
                   if (response.code == 0) {
                       alert(response.message);

                       this.onLoad();
                   } else {
                       alert(response.message);
                   }
               });
       }
    }
}