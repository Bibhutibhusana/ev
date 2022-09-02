import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./dashboard.component";
import {ServiceInfoComponent} from "../main-contained/service-info/service-info.component";
import {StatusComponent} from "../main-contained/status/status.component";
import {RegistrationComponent} from "../main-contained/service-info/registration/registration.component";

const routes: Routes = [
  {path: '', component: DashboardComponent,children:[
      {path: '', redirectTo:'service-info', pathMatch: 'full'},
      {path: "service-info",component: ServiceInfoComponent},
      {path: "status", component: StatusComponent},
      {path:"register",component: RegistrationComponent}
    ]}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
