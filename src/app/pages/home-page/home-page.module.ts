import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomePageComponent } from './home-page.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ContentTypesListComponent } from './components/content-types-list/content-types-list.component';
import { EntriesListComponent } from './components/entries-list/entries-list.component';
import { ContentTypeJsonComponent } from './components/content-type-json/content-type-json.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    HomePageComponent,
    ContentTypesListComponent,
    EntriesListComponent,
    ContentTypeJsonComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatTableModule,
    MatTabsModule,
    RouterModule.forChild([]),
  ],
})
export class HomePageModule {}
