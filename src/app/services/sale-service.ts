import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedicineSale } from '../models/sale.model';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  // API base URL
  private apiUrl = 'https://localhost:7249/api/sales';

  constructor(private http: HttpClient) { }

  getAllSales(): Observable<MedicineSale[]> {
    return this.http.get<MedicineSale[]>(this.apiUrl);
  }

  getSaleById(id: number): Observable<MedicineSale> {
    return this.http.get<MedicineSale>(`${this.apiUrl}/${id}`);
  }

  getSalesByMedicine(medicineId: number): Observable<MedicineSale[]> {
    return this.http.get<MedicineSale[]>(`${this.apiUrl}/medicine/${medicineId}`);
  }

  recordSale(sale: MedicineSale): Observable<MedicineSale> {
    return this.http.post<MedicineSale>(this.apiUrl, sale);
  }

  getTodaySales(): Observable<MedicineSale[]> {
    return this.http.get<MedicineSale[]>(`${this.apiUrl}/today/daily`);
  }

  getTotalRevenue(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/revenue/total`);
  }

  getBestSellingMedicine(): Observable<MedicineSale> {
    return this.http.get<MedicineSale>(`${this.apiUrl}/bestselling/medicine`);
  }

  deleteSale(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}