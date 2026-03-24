import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent }     from './app.component';
import { CoreModule }       from './core/core.module';
import { LayoutModule }     from './layout/layout.module';
import { SharedModule }     from './shared/shared.module';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    LayoutModule,
    SharedModule,
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
