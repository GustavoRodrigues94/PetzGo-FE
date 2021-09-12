import { MaterialModule } from './../../material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnboardingRoutingModule } from './onboarding-routing.module';
import { OnboardingComponent } from './onboarding.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { ConfigurarServicosComponent } from './components/configurar-servicos/configurar-servicos.component';


@NgModule({
  declarations: [OnboardingComponent, ConfigurarServicosComponent],
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    MaterialModule,
    NgxMaskModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
})
export class OnboardingModule { }
