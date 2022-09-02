import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ServiceInfoComponent} from "./main-contained/service-info/service-info.component";
import {StatusComponent} from "./main-contained/status/status.component";
import {RegistrationComponent} from "./main-contained/service-info/registration/registration.component";
import {LoginComponent} from "./login/login.component";
import {VerifyComponent} from "./login/verify/verify.component";
import {ApproveComponent} from "./login/approve/approve.component";

const routes: Routes = [
  {path:'',redirectTo:'dashboard', pathMatch: 'full' },
  {path:'dashboard', loadChildren : () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule)},

  {path: 'login', component: LoginComponent},
  {path: 'verify/:username', component: VerifyComponent},
  {path: 'approve/:username', component: ApproveComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
