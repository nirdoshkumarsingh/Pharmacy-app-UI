import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../shared/material.module';
import { MedicineSale } from '../../models/sale.model';
import { Medicine } from '../../models/medicine.model';
import { SaleService } from '../../services/sale-service';
import { MedicineService } from '../../services/medicine-service';

@Component({
  selector: 'app-sale-records',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MaterialModule
  ],
  templateUrl: './sale-records.html',
  styleUrls: ['./sale-records.scss']
})
export class SaleRecordsComponent implements OnInit {

  sales: MedicineSale[] = [];
  medicines: Medicine[] = [];

  isLoading = false;
  isRecording = false;

  totalRevenue = 0;

  errorMessage = '';

  showSaleForm = false;

  displayedColumns: string[] = [
    'medicineName',
    'customerName',
    'quantitySold',
    'totalPrice',
    'saleDate',
    'actions'
  ];

  newSale: MedicineSale = {
    medicineId: 0,
    medicineName: '',
    quantitySold: 0,
    totalPrice: 0,
    customerName: ''
  };

  constructor(
    private saleService: SaleService,
    private medicineService: MedicineService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadSales();
    this.loadMedicines();
    this.loadRevenue();
  }

  loadSales(): void {

    this.isLoading = true;

    this.saleService.getAllSales().subscribe({
      next: (data) => {
        this.sales = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage =
          'Unable to load sales records';
        this.isLoading = false;
      }
    });
  }

  loadMedicines(): void {

    this.medicineService
      .getAllMedicines()
      .subscribe({
        next: (data) => {
          this.medicines = data;
        }
      });
  }

  loadRevenue(): void {

    this.saleService
      .getTotalRevenue()
      .subscribe({
        next: (data) => {
          this.totalRevenue =
            data.totalRevenue;
        }
      });
  }

  toggleSaleForm(): void {

    this.showSaleForm =
      !this.showSaleForm;

    if (!this.showSaleForm) {
      this.resetSaleForm();
    }
  }

  onMedicineChange(): void {

    const medicine =
      this.medicines.find(
        x => x.id === this.newSale.medicineId
      );

    if (medicine) {
      this.newSale.medicineName =
        medicine.medicineName;
    }
  }

  recordSale(): void {

    if (!this.validateSaleForm()) {
      return;
    }

    this.isRecording = true;

    this.saleService
      .recordSale(this.newSale)
      .subscribe({
        next: () => {

          this.snackBar.open(
            'Sale recorded successfully',
            'Close',
            {
              duration: 3000
            }
          );

          this.isRecording = false;

          this.showSaleForm = false;

          this.resetSaleForm();

          this.loadSales();
          this.loadRevenue();
        },
        error: () => {

          this.snackBar.open(
            'Failed to record sale',
            'Close',
            {
              duration: 3000
            }
          );

          this.isRecording = false;
        }
      });
  }

  validateSaleForm(): boolean {

    if (this.newSale.medicineId === 0) {

      this.snackBar.open(
        'Select a medicine',
        'Close',
        { duration: 3000 }
      );

      return false;
    }

    if (!this.newSale.customerName?.trim()) {

      this.snackBar.open(
        'Customer name required',
        'Close',
        { duration: 3000 }
      );

      return false;
    }

    if (this.newSale.quantitySold <= 0) {

      this.snackBar.open(
        'Quantity must be greater than 0',
        'Close',
        { duration: 3000 }
      );

      return false;
    }

    const medicine =
      this.medicines.find(
        x => x.id === this.newSale.medicineId
      );

    if (
      medicine &&
      medicine.quantity <
      this.newSale.quantitySold
    ) {

      this.snackBar.open(
        `Only ${medicine.quantity} units available`,
        'Close',
        { duration: 3000 }
      );

      return false;
    }

    return true;
  }

  deleteSale(id?: number): void {

    if (!id) {
      return;
    }

    if (!confirm(
      'Delete this sale record?'
    )) {
      return;
    }

    this.saleService
      .deleteSale(id)
      .subscribe({
        next: () => {

          this.snackBar.open(
            'Sale deleted',
            'Close',
            {
              duration: 3000
            }
          );

          this.loadSales();
          this.loadRevenue();
        }
      });
  }

  resetSaleForm(): void {

    this.newSale = {
      medicineId: 0,
      medicineName: '',
      quantitySold: 0,
      totalPrice: 0,
      customerName: ''
    };
  }

  formatPrice(price: number): string {
    return price.toFixed(2);
  }

  formatDate(date: Date): string {
    return new Date(date)
      .toLocaleString('en-IN');
  }

  getSelectedMedicineDetails() {

    return this.medicines.find(
      x => x.id === this.newSale.medicineId
    );
  }
}