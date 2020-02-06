import {Component, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "../_services/httpclient";
import {SettingsService} from "../_services/settings.service";
import {ModalDirective} from "ngx-bootstrap";
declare let jQuery: any;

@Component({
    selector: '[profile]',
    templateUrl: './profile.html',
    styleUrls: [ './profile.style.scss' ],
    encapsulation: ViewEncapsulation.None
})

export class Profile implements OnInit{

    public employeeDetail : any = {};

    constructor( private router: Router,
                 private route: ActivatedRoute,
                 private http: HttpClient,
                 private setting: SettingsService) {
    }

    ngOnInit() {
        this.onLoad();
    }


    onLoad(){
        this.employeeDetail = JSON.parse(localStorage.getItem('profile'))
    }


    update(){

        if(!this.employeeDetail.password){
            alert('กรุณากรอกรหัสผ่าน')
            return
        }
        if(confirm('คุณต้องการแก้ไขข้อมูลใช่หรือไม่')){
            this.http.post(`${this.setting.getAppSetting('url')}/employee/update`, this.employeeDetail)
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
}