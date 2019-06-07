import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { VistoriasComponent } from './pages/vistorias/vistorias.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'vistorias',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: './pages/login/login.module#LoginModule'
  },
  {
    path: 'vistorias',
    component: VistoriasComponent
  },
  {
    path: 'laudo',
    loadChildren: './pages/laudo/laudo.module#LaudoModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
