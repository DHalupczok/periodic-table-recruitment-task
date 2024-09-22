import {Component, inject, OnInit} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {rxState} from "@rx-angular/state";
import {PeriodicElement} from "../../models/periodic-element.model";
import {PeriodicElementsService} from "../../services/periodic-elements.service";
import {debounceTime, map} from "rxjs";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable, MatTableModule
} from "@angular/material/table";
import {MatButton} from "@angular/material/button";
import {AsyncPipe} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {EditElementDialogComponent} from "../edit-element-dialog/edit-element-dialog.component";

@Component({
  selector: 'app-periodic-table',
  standalone: true,
  imports: [MatTableModule, FormsModule, MatFormField, MatInput, MatTable, MatColumnDef, MatHeaderCell, MatCell, MatButton, MatHeaderRow, MatRow, MatHeaderCellDef, MatCellDef, MatHeaderRowDef, MatRowDef, AsyncPipe, ReactiveFormsModule, MatLabel],
  templateUrl: './periodic-table.component.html',
  styleUrl: './periodic-table.component.scss',
})
export class PeriodicTableComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  periodicElementsService = inject(PeriodicElementsService)
  filterControl = new FormControl('', {nonNullable: true});
  filterValue$ = this.filterControl.valueChanges.pipe(debounceTime(2000))
  private state = rxState<{ elements: PeriodicElement[], filterValue: string }>(
    ({set, connect}) => {
      set({elements: [], filterValue: ''});
      connect('elements', this.periodicElementsService.getElements());

    });
  elements$ = this.state.select(map((state) => {
    return state.elements.filter(element =>
      element.name.toLowerCase().includes(state.filterValue.toLowerCase()) ||
      element.symbol.toLowerCase().includes(state.filterValue.toLowerCase()) ||
      element.position.toString().includes(state.filterValue) ||
      element.weight.toString().includes(state.filterValue)).sort((a, b) => a.position - b.position)
  }))
  private dialog = inject(MatDialog)

  constructor() {
  }

  ngOnInit(): void {
    this.state.connect('filterValue', this.filterValue$)
  }

  openEditModal(row: PeriodicElement): void {
    const dialogRef = this.dialog.open(EditElementDialogComponent, {
      width: '250px',
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.state.set({
          elements: this.state.get().elements.map(el => el.id
          === row.id ? result : el)
        });
      }
    });
  }


}
