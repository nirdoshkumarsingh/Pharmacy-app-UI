import { Component, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../shared/material.module';
import { Medicine } from '../../models/medicine.model';
import { MedicineService } from '../../services/medicine-service';

@Component({
  selector: 'app-add-medicine',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MaterialModule
  ],
  templateUrl: './add-medicine.html',
  styleUrls: ['./add-medicine.scss']
})
export class AddMedicineComponent implements OnInit {
  medicine: Medicine = {
    medicineName: '',
    notes: '',
    expiryDate: new Date(),
    quantity: 0,
    price: 0,
    brand: ''
  };
  minExpiryDate: Date = new Date();
  isSubmitting = false;

  constructor(
    private medicineService: MedicineService,
    private router: Router,
    private snackBar: MatSnackBar,
    @Optional() private dialogRef: MatDialogRef<AddMedicineComponent>
  ) { }

  ngOnInit(): void {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    this.minExpiryDate = new Date();
    this.minExpiryDate.setHours(0, 0, 0, 0);
    this.medicine.expiryDate = futureDate;
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    if (!this.validateForm()) {
      return;
    }
    this.isSubmitting = true;
    this.medicineService
      .addMedicine(this.medicine)
      .subscribe({
        next: () => {
          this.snackBar.open(
            'Medicine added successfully',
            'Close',
            {
              duration: 3000
            }
          );
          this.isSubmitting = false;
          if (this.dialogRef) {
            this.dialogRef.close(true);
            return;
          }
          setTimeout(() => {
            this.router.navigate(['/medicines']);
          }, 1000);
        },
        error: (error) => {
          console.error(error);
          this.snackBar.open(
            'Failed to add medicine',
            'Close',
            {
              duration: 4000
            }
          );
          this.isSubmitting = false;
        }
      });
  }

  validateForm(): boolean {
    if (!this.medicine.medicineName?.trim()) {
      this.showValidation('Medicine name is required');
      return false;
    }
    if (!this.medicine.brand?.trim()) {
      this.showValidation('Brand is required');
      return false;
    }
    if (!this.medicine.expiryDate) {
      this.showValidation('Expiry date is required');
      return false;
    }
    if (new Date(this.medicine.expiryDate) <= new Date()) {
      this.showValidation('Expiry date must be in future');
      return false;
    }
    if (this.medicine.quantity < 0) {
      this.showValidation('Quantity cannot be negative');
      return false;
    }
    if (this.medicine.price < 0) {
      this.showValidation('Price cannot be negative');
      return false;
    }
    return true;
  }

  private showValidation(message: string): void {
    this.snackBar.open(
      message,
      'Close',
      {
        duration: 3000
      }
    );
  }

  onCancel(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
      return;
    }
    this.router.navigate(['/medicines']);
  }

  resetForm(): void {
    const futureDate = new Date();
    futureDate.setFullYear(
      futureDate.getFullYear() + 1
    );
    this.medicine = {
      medicineName: '',
      notes: '',
      expiryDate: futureDate,
      quantity: 0,
      price: 0,
      brand: ''
    };
  }
}