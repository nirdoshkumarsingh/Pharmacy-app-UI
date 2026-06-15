import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medicine } from '../models/medicine.model';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  // API base URL
  private apiUrl = 'https://localhost:7249/api/medicines';

  constructor(private http: HttpClient) { }

  getAllMedicines(): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(this.apiUrl);
  }

  getMedicineById(id: number): Observable<Medicine> {
    return this.http.get<Medicine>(`${this.apiUrl}/${id}`);
  }

  searchMedicineByName(name: string): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(`${this.apiUrl}/search/${name}`);
  }

  addMedicine(medicine: Medicine): Observable<Medicine> {
    return this.http.post<Medicine>(this.apiUrl, medicine);
  }

  updateMedicine(id: number, medicine: Medicine): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, medicine);
  }

  deleteMedicine(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}