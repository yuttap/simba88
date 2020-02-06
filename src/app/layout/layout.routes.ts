import {Routes, RouterModule} from '@angular/router';
import {Layout} from './layout.component';
import {Login} from "../login/login.component";
import { AccountReportModule } from '../account-report/account-report.module';
import { AccountWlReportModule } from '../account-wl-report/account-wl-report.module';
// noinspection TypeScriptValidateTypes
const routes: Routes = [
    {
        path: '', component: Layout, children: [
        {path: '', redirectTo: 'home', pathMatch: 'full'},
        {path: 'home', loadChildren: '../home/home.module#HomeModule'},
        {path: 'register', loadChildren: '../register/register.module#RegisterModule' },
        {path: 'register-transfer', loadChildren: '../register-transfer/register.module#RegisterModule'},
        {path: 'customer-report', loadChildren: '../customer-report/customer-report.module#CustomerReportModule'},
        {path: 'deposit-report', loadChildren: '../deposit-report/deposit-report.module#DepositReportModule'},
        {path: 'report-hide', loadChildren: '../report-hide/report-hide.module#ReportHideModule'},
        {path: 'employee', loadChildren: '../employee/employee.module#EmployeeModule'},
        {path: 'bank', loadChildren: '../banks/banks.module#BanksModule'},
        {path: 'profile', loadChildren: '../profile/profile.module#ProfileModule'},
        {path: 'withdraw', loadChildren: '../withdraw/withdraw.module#WithdrawModule'},
        {path: 'withdraw-report', loadChildren: '../withdraw-report/withdraw-report.module#WithdrawReportModule'},
        {path: 'balance-report', loadChildren: '../balance-report/balance-report.module#BalanceReportModule'},
        {path: 'manual-action', loadChildren: '../manual-action/manual-action.module#ManualActionModule'},
        {path: 'account-report', loadChildren: '../account-report/account-report.module#AccountReportModule'},
        {path: 'account-wl-report', loadChildren: '../account-wl-report/account-wl-report.module#AccountWlReportModule'},
        {path: 'agent-report', loadChildren: '../agent-report/agent-report.module#AgentReportModule'},
        {path: 'promotion', loadChildren: '../promotion/promotion.module#PromotionModule'},
        {path: 'registbyagent', loadChildren: '../registbyagent/registbyagent.module#RegistbyagentModule'},
        {path: 'campaign', loadChildren: '../campaign/campaign.module#CampaignModule'},
        {path: 'manual-point', loadChildren: '../manual-point/manual-point.module#ManualPointModule'},
        {path: 'point-report', loadChildren: '../point-report/point-report.module#PointReportModule'},

        {path: 'dashboard', loadChildren: '../dashboard/dashboard.module#DashboardModule'},
        {path: 'form', loadChildren: '../form/form.module#FormModule'},
        {path: 'statistics', loadChildren: '../statistics/statistics.module#StatisticsModule'},
        {path: 'ui', loadChildren: '../ui/ui.module#UiModule'},
        {path: 'components', loadChildren: '../components/components.module#ComponentsModule'},
        {path: 'tables', loadChildren: '../tables/tables.module#TablesModule'},
        {path: 'widgets', loadChildren: '../widgets/widgets.module#WidgetsModule'},
        {path: 'special', loadChildren: '../special/special.module#SpecialModule'}
    ]
    }
];

export const ROUTES = RouterModule.forChild(routes);
