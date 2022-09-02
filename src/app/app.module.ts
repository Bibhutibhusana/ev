import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {MatGridListModule} from "@angular/material/grid-list";
import {ServiceInfoComponent} from './main-contained/service-info/service-info.component';
import { StatusComponent } from './main-contained/status/status.component';
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {RegistrationComponent} from "./main-contained/service-info/registration/registration.component";
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import {MatRadioModule} from "@angular/material/radio";
import {FormsModule} from "@angular/forms";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDialogModule} from '@angular/material/dialog';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {MatTooltipModule} from '@angular/material/tooltip';
import { LoginComponent } from './login/login.component';
import { VerifyComponent } from './login/verify/verify.component';
import { ApproveComponent } from './login/approve/approve.component';
import {DashboardModule} from "./dashboard/dashboard.module";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {IntercepterService} from "./loaderService/intercepter.service";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {STEPPER_GLOBAL_OPTIONS} from "@angular/cdk/stepper";
import {MatListModule} from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {NgxPrintModule} from 'ngx-print';
import { DatePipe } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    VerifyComponent,
    ApproveComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
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
    DashboardModule,
    FontAwesomeModule,
    NgxSkeletonLoaderModule,
    MatSnackBarModule,
    MatListModule,
    MatPaginatorModule,
    MatTableModule,
    MatTabsModule,
    NgxPrintModule

  ],
  providers: [HttpClient, DatePipe,{
    provide: HTTP_INTERCEPTORS,

    useClass: IntercepterService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
