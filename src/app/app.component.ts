import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { AppConfig, LayoutService } from './presentation/layout/service/app.layout.service';
import { LoadingHelper } from './core/helpers/loading/loading.helper';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
    isLoading!: Observable<boolean>;

    items: MenuItem[] | undefined;

    constructor(private primengConfig: PrimeNGConfig, private layoutService: LayoutService, private loadingHelper: LoadingHelper) { }

    ngOnInit() {
        this.isLoading = this.loadingHelper.isLoading$;
        this.primengConfig.ripple = true;

        const config: AppConfig = {
            ripple: true,
            inputStyle: 'outlined',
            menuMode: 'static',
            colorScheme: 'light',
            theme: 'tailwind-light',
            scale: 14
        };
        this.layoutService.config.set(config);

        this.items = [{ icon: 'pi pi-home', route: '/installation' }, { label: 'Components' }, { label: 'Form' }, { label: 'InputText', route: '/inputtext' }];
    }
}
