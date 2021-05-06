import { Component, OnInit } from '@angular/core';
import { EnvConfigLoaderService } from './services/env-config-loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'env-agnostic-builds';
  constructor(private envConfigLoaderService: EnvConfigLoaderService) {}
  ngOnInit() {
    const html: string | undefined = this.envConfigLoaderService.getEnvConfig()
      ?.apiUrl;
    const rootElement = document.querySelector('app-root');
    if (rootElement) {
      rootElement.insertAdjacentHTML(
        'afterend',
        `<!-- apiUrl: ${html} -->` ?? 'bla'
      );
    }
  }
}
