import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
    private formBuilder: FormBuilder
  ) {}

  public entryForm = this.formBuilder.group({
    title: this.data.entry.fields['title'],
    description: this.data.entry.fields['description'],
    image: this.data.entry.fields['image'],
  });

  private imageField = <Entry>this.data.entry.fields['image'];
  private imageFile = <AssetFile>(<unknown>this.imageField?.fields['file']);

  public imageUrl: string | null = this.imageFile?.url;
  public uploadImageFile: File | null = null;

  public async onSaveEntryClick(isPublish: boolean): Promise<void> {
    // TODO: remove hard-coded method name of contentfulService and field names

    this.data.entry.fields['title'] = this.entryForm.get('title')!.value;
    this.data.entry.fields['description'] =
      this.entryForm.get('description')!.value;

    if (this.uploadImageFile) {
      const asset = await this.contentfulService.createAsset(
        this.uploadImageFile
      );

      // TODO: properly update image
      // mind the case when image is not modified during editing

      // this.data.entry.fields['image'] = {
      //   sys: {
      //     id: asset.sys.id,
      //     type: 'Link',
      //     linkType: 'Asset',
      //   },
      // };
    }

    await this.contentfulService.updateCategoryEntry(
      this.data.entry.sys.id,
      this.data.entry.fields,
      isPublish
    );
    this.dialogRef.close();
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
