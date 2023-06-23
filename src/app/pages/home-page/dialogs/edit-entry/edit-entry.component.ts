import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssetFile, Entry } from 'contentful';
import { ContentfulService } from 'src/app/services/contentful/contentful.service';

@Component({
  selector: 'app-edit-entry',
  templateUrl: './edit-entry.component.html',
  styleUrls: ['./edit-entry.component.scss'],
})
export class EditEntryComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { entry: Entry },
    public dialogRef: MatDialogRef<EditEntryComponent>,
    public contentfulService: ContentfulService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  public entryForm = this.formBuilder.group({
    title: [this.data.entry?.fields['title'], Validators.required],
    description: this.data.entry?.fields['description'],
    image: this.data.entry?.fields['image'],
  });

  public title = this.data.entry ? 'Edit category' : 'Add new category';

  private imageField = <Entry>this.data.entry?.fields['image'];
  private imageFile = <AssetFile>(<unknown>this.imageField?.fields?.['file']);

  public imageUrl: string | null = this.imageFile?.url;
  public uploadImageFile: File | null = null;
  public isLoading = false;

  public async onSaveEntryClick(isPublish: boolean): Promise<void> {
    // TODO: remove hard-coded method name of contentfulService and field names
    const entryFields: Record<string, any> = {};

    entryFields['title'] = this.entryForm.get('title')!.value;
    entryFields['description'] = this.entryForm.get('description')!.value;

    try {
      this.isLoading = true;

      if (this.uploadImageFile) {
        const asset = await this.contentfulService.createAsset(
          this.uploadImageFile
        );

        entryFields['image'] = {
          sys: {
            id: asset.sys.id,
            type: 'Link',
            linkType: 'Asset',
          },
        };
      }

      if (this.data.entry) {
        await this.contentfulService.updateCategoryEntry(
          this.data.entry.sys.id,
          entryFields,
          isPublish
        );
      } else {
        await this.contentfulService.addCategoryEntry(entryFields, isPublish);
      }

      // TODO: update initial entry fields
      this.dialogRef.close(/*isUpdated=*/ true);
    } catch (e) {
      this.snackBar.open(String(e), 'Dismiss');
      this.isLoading = false;
    }
  }

  public onFileSelected(event: Event): void {
    const file = ((<HTMLInputElement>event.target).files || [])[0];

    if (file) {
      this.imageUrl = URL.createObjectURL(file);
      this.uploadImageFile = file;
    } else {
      this.clearImageFields();
    }
  }

  public onChangeImageClick(): void {
    this.clearImageFields();
  }

  private clearImageFields(): void {
    this.imageUrl = null;
    this.uploadImageFile = null;
  }
}
