import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EnvConfigLoaderService } from './services/env-config-loader.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule],
  providers: [
    EnvConfigLoaderService,
    {
      provide: APP_INITIALIZER,
      useFactory: (configService: EnvConfigLoaderService) => () =>
        configService.loadEnvConfig().toPromise(),
      deps: [EnvConfigLoaderService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
