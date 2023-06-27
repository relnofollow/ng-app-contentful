import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ContentTypesListComponent } from './pages/home-page/components/content-types-list/content-types-list.component';
import { EntriesListComponent } from './pages/home-page/components/entries-list/entries-list.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    children: [
      {
        path: 'content-types',
        component: ContentTypesListComponent,
      },
      {
        path: 'entries',
        component: EntriesListComponent,
      },
      {
        path: '**',
        redirectTo: 'content-types',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
