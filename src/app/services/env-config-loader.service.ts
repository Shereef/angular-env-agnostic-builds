import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { shareReplay, tap, timeout, catchError } from 'rxjs/operators';
import { EnvConfigInterface } from '../interfaces/env-config.interface';
import { environment } from 'src/environments/environment.prod';

// If the config file did not come back in 3 secs serve the default config
const ENV_CONFIG_LOAD_TIMEOUT = 3 * 1000;

@Injectable({ providedIn: 'root' })
export class EnvConfigLoaderService {
  private readonly CONFIG_URL = 'assets/config/config.json';
  private configuration$: Observable<EnvConfigInterface> | undefined;
  private environmentConfig: EnvConfigInterface | undefined;

  constructor(private http: HttpClient) {}

  /** Load the environment config when app initializes */
  public loadEnvConfig(): Observable<EnvConfigInterface> {
    if (!this.configuration$) {
      this.configuration$ = this.fetchRemoteConfig().pipe(
        // Storing it so other parts of the code can access it synchronously
        tap((envConfig) => {
          this.environmentConfig = envConfig;
        })
      );
    }
    return this.configuration$;
  }

  /** Observable will complete itself, don't have to worry about unsubscribing */
  public getEnvConfig(): EnvConfigInterface | undefined {
    return this.environmentConfig;
  }

  /** For jenkins production build. Fetch config.{x}.json at runtime from assets folder as environment config */
  private fetchRemoteConfig(): Observable<EnvConfigInterface> {
    return this.http.get<EnvConfigInterface>(this.CONFIG_URL).pipe(
      // Set a timeout to serve a default config file never comes back from the server
      // Will go into catchError and return the default environment config
      timeout(ENV_CONFIG_LOAD_TIMEOUT),
      // Allows us to do a single fetch on the config.json file, and all the subsequent requests uses the cached version
      shareReplay(1),
      // If any error occurs when fetching config.json, default to the environment file imported
      catchError(() => {
        return of(environment); //this will always return prod config
      })
    );
  }
}
