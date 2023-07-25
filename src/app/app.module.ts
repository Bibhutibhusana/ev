import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule} from "@angular/forms";
import {ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import { LoginComponent } from './login/login.component';
import { VerifyComponent } from './login/verify/verify.component';
import { ApproveComponent } from './login/approve/approve.component';
import {DashboardModule} from "./dashboard/dashboard.module";
import {IntercepterService} from "./loaderService/intercepter.service";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {NgxPrintModule} from 'ngx-print';
import { DatePipe } from '@angular/common';
import { AdminComponent } from './login/admin/admin.component';
import { AmountToWordPipe } from './login/amount-to-word.pipe';
import { DdoComponent } from './login/ddo/ddo.component';
import { MaterialModule } from './material.module';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    VerifyComponent,
    ApproveComponent,
    AdminComponent,
    AmountToWordPipe,
    DdoComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DashboardModule,
    NgxSkeletonLoaderModule,
    NgxPrintModule,
    MaterialModule

  ],
  exports: [AmountToWordPipe],
  providers: [HttpClient, DatePipe,{
    provide: HTTP_INTERCEPTORS,

    useClass: IntercepterService,
    multi: true
  },AmountToWordPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
