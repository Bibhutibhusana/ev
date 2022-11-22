import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {finalize, Observable} from "rxjs";
import {LoaderService} from "./loader.service";
import { MatSnackBar } from '@angular/material/snack-bar';
const TOKEN_HEADER_KEY = 'Authorization';
@Injectable({
  providedIn: 'root'
})

export class IntercepterService implements HttpInterceptor{
  // @ts-ignore

  constructor(private loaderService: LoaderService,private snackbar: MatSnackBar) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
 ////////////////////////////////  Interceptor for Authorization token addition ???????????????????????
 const token = sessionStorage.getItem('token') || "";
 //let  token = `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJVc2VyMiIsImV4cCI6MTY0OTQyOTQ1NCwiaWF0IjoxNjQ5NDExNDU0fQ.-jaYLY8DbSbm321oL8XeYhYBl39IYjuEevrzCcoQBE8MKVkIdc-kcL7vhKL1AwQtFs0V0NlHQTEA1SubsmRiZg`; // your auth token
  if (token != null) { // your authorized  logic
   req = req.clone({
   headers: req.headers.set(TOKEN_HEADER_KEY,
                 token)
   // setHeaders: {
   //   authorization: `${token}`,
   // },
   //req = req.clone({headers: req.headers.set('Authorization',token)
 });
}
else{
 this.snackbar.open("You don't have permission to access this data.")
}

     ////////////////////////////// Interceptor part for loading purpose ////////////////////////////
    this.loaderService.isLoading.next(true);

    return next.handle(req).pipe(
      finalize(
        ()=> this.loaderService.isLoading.next(false)
      )
    );
  }

}
