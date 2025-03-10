import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            {
                path: 'dashboard',
                loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule)
            },
            {
                path: 'listas-edd/:idTipoLista',
                loadChildren: () => import('./estructuras-lineales/listas-edd.module').then((m) => m.ListasEddModule)
            }
            ,
            {
                path: 'ordenamientos/:idOrdenamiento',
                loadChildren: () => import('./ordenamientos/ordenamientos.module').then((m) => m.OrdenamientosModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
