import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {PeriodicElement} from "../../models/periodic-element.model";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-edit-element-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatDialogActions,
    MatInput,
    MatButton,
    MatDialogContent,
    MatDialogTitle, MatLabel
  ],
  templateUrl: './edit-element-dialog.component.html',
  styleUrl: './edit-element-dialog.component.scss'
})
export class EditElementDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditElementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PeriodicElement,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      position: [data.position, Validators.required],
      name: [data.name, Validators.required],
      weight: [data.weight, Validators.required],
      symbol: [data.symbol, Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}

