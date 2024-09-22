import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { PeriodicElement } from '../models/periodic-element.model';

@Injectable({
  providedIn: 'root'
})
export class PeriodicElementsService {
  private mockDataUrl = 'assets/mocks/elements.json';
  constructor(private http: HttpClient) { }

  getElements() {
    return this.http.get<PeriodicElement[]>(this.mockDataUrl);
  }
}
