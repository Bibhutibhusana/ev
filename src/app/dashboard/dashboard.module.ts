import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import {DashboardComponent} from "./dashboard.component";
import {HeaderComponent} from "../header/header.component";
import {MatButtonModule} from "@angular/material/button";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatRadioModule} from "@angular/material/radio";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDialogModule} from "@angular/material/dialog";
import {HttpClientModule} from "@angular/common/http";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ServiceInfoComponent} from "../main-contained/service-info/service-info.component";
import {StatusComponent} from "../main-contained/status/status.component";
import {RegistrationComponent} from "../main-contained/service-info/registration/registration.component";
import {MatTableModule} from "@angular/material/table";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {MatStepperModule} from "@angular/material/stepper";


@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent,
    ServiceInfoComponent,
    StatusComponent,
    RegistrationComponent
  ],
  exports: [
    HeaderComponent
  ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        MatButtonModule,
        MatGridListModule,
        MatButtonToggleModule,
        MatIconModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatRadioModule,
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatCheckboxModule,
        MatDialogModule,
        HttpClientModule,
        MatTooltipModule,
        MatTableModule,
        MatProgressSpinnerModule,
        NgxSkeletonLoaderModule,
        MatStepperModule,
    ]
})
export class DashboardModule { }
