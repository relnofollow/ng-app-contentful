import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomePageComponent } from './home-page.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ContentTypesListComponent } from './components/content-types-list/content-types-list.component';
import { EntriesListComponent } from './components/entries-list/entries-list.component';
import { ContentTypeJsonComponent } from './dialogs/content-type-json/content-type-json.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EditEntryComponent } from './dialogs/edit-entry/edit-entry.component';
import { ViewEntryComponent } from './dialogs/view-entry/view-entry.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ContentfulFieldComponent } from './components/contentful-field/contentful-field.component';

@NgModule({
  declarations: [
    HomePageComponent,
    ContentTypesListComponent,
    EntriesListComponent,
    ContentTypeJsonComponent,
    EditEntryComponent,
    ViewEntryComponent,
    ContentfulFieldComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    ReactiveFormsModule,
    RouterModule.forChild([]),
    SharedModule,
  ],
})
export class HomePageModule {}
