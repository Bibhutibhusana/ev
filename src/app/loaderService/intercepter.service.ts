import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {finalize, Observable} from "rxjs";
import {LoaderService} from "./loader.service";

@Injectable({
  providedIn: 'root'
})

export class IntercepterService implements HttpInterceptor{
  // @ts-ignore

  constructor(private loaderService: LoaderService) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.isLoading.next(true);

    return next.handle(req).pipe(
      finalize(
        ()=> this.loaderService.isLoading.next(false)
      )
    );
  }

}
