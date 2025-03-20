import { LOCALE_ID, NgModule } from "@angular/core";
import { CommonModule, HashLocationStrategy } from '@angular/common';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NotfoundComponent } from './presentation/shared/notfound/notfound.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ProgressBarModule } from 'primeng/progressbar';
import { CoreModule } from './core/core.module';
import { PresentationModule } from './presentation/presentation.module';

import { ServiceModule } from './service/service.module';

import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PrimeNGConfig } from 'primeng/api';

import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';

registerLocaleData(localeTr);

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        NotfoundComponent,
    ],
    bootstrap: [AppComponent], imports: [AppRoutingModule,
        CommonModule,
        PresentationModule,
        ProgressBarModule,
        CoreModule,
        ServiceModule,
        ToastModule,
        ConfirmDialogModule,

        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
    ],
    providers: [
        { provide: LOCALE_ID, useValue: "tr-TR" },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        provideHttpClient(withInterceptorsFromDi())
    ],
})

export class AppModule {
    constructor(
        translate: TranslateService,
        private config: PrimeNGConfig
    ) {

        let currentLang = localStorage.getItem('CurrentLang');

        if (!currentLang) {
            currentLang = "tr";
            localStorage.setItem("CurrentLang", currentLang);
        }
        translate.setDefaultLang(currentLang);
        translate.use(currentLang);
        translate.get("primeng").subscribe((res) => {
            this.config.setTranslation(res);
        });
    }
}