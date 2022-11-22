import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {VerifyComponent} from "./login/verify/verify.component";
import {ApproveComponent} from "./login/approve/approve.component";
import { AdminComponent } from './login/admin/admin.component';
import { DdoComponent } from './login/ddo/ddo.component';

const routes: Routes = [
  {path:'',redirectTo:'dashboard', pathMatch: 'full' },
  {path:'dashboard', loadChildren : () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule)},

  {path: 'login', component: LoginComponent},
  {path: 'verify/:username', component: VerifyComponent},
  {path: 'approve/:username', component: ApproveComponent},
  {path: 'admin/:username', component: AdminComponent},
  {path: 'ddo/:username', component: DdoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
