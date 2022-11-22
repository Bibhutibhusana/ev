import { ChangeDetectionStrategy, Component } from '@angular/core';
import {LoaderService} from "./loaderService/loader.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'ev1';

  constructor(public loaderService: LoaderService) {
  }
}
