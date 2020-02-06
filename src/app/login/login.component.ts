import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService, UserService} from "../_services";
import {Router} from "@angular/router";
import {HttpClient} from "../_services/httpclient";
import {SettingsService} from "../_services/settings.service";

@Component({
    selector: 'login',
    styleUrls: ['./login.style.scss'],
    templateUrl: './login.template.html',
    host: {
        class: 'login-page app'
    }
})
export class Login implements OnInit {

    loginForm: FormGroup;
    inValid:boolean;
    private errorMsg: any;
    isTwoFactory: boolean = false;

    constructor(fb: FormBuilder,
                public settings: SettingsService,
                private http: HttpClient,
                private router: Router,
                private userService: UserService,
                private authenticationService: AuthenticationService) {

        this.loginForm = fb.group(
            {
                'username': [null, Validators.required],
                'password': [null, Validators.required],
                'otp': [null, null]
            })

    }

    ngOnInit() {
        this.userService.cleanUserInfo();
    }

    submitForm($ev, value: any) {
        $ev.preventDefault();
        for (let c in this.loginForm.controls) {
            this.loginForm.controls[c].markAsTouched();
        }

        if (this.loginForm.valid) {
            this.authenticationService.login(value.username, value.password, value.otp)
                .subscribe(result => {

                    if (result === true) {
                        if(this.settings.getPosition() === 'SECURITY'){
                            this.router.navigate(['/app/employee']);
                        } else if(this.settings.getPosition() === 'REGISTER_ONLY'){
                            this.router.navigate(['/app/register']);
                        } else if(this.settings.getPosition() === 'J_14') {
                            this.router.navigate(['/app/agent-report']);
                        } else {
                            this.router.navigate(['/app/home']);
                        }
                    } else if(result['code'] === 2){
                        this.errorMsg = result['message'];
                        this.inValid = true;
                        this.isTwoFactory = true;
                    } else if(result['code'] === 3){
                        this.errorMsg = result['message'];
                        this.inValid = true;
                        this.isTwoFactory = true;
                    } else {
                        this.inValid = true;
                        this.errorMsg = result;
                    }
                });
        }else {

            return;
        }
    }
}
