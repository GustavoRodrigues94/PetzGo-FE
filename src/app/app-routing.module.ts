import { RotasPaginas } from './compartilhado/enums/rotas.enum';
import { AutenticacaoGuard } from './services/guards/autenticacao.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: RotasPaginas.Onboarding, loadChildren: () => import('./modulos/onboarding/onboarding.module').then(m => m.OnboardingModule) },
  { path: RotasPaginas.Login, loadChildren: () => import('./modulos/autenticacao/autenticacao.module').then(m => m.AutenticacaoModule) },
  {
    path: RotasPaginas.Principal,
    canActivate: [AutenticacaoGuard],
    loadChildren: () => import('./modulos/principal/principal.module').then(m => m.PrincipalModule)
  },
  {
    path: RotasPaginas.Root,
    canActivate: [AutenticacaoGuard],
    loadChildren: () => import('./modulos/principal/principal.module').then(m => m.PrincipalModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
