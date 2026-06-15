import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../shared/material.module';
import { Medicine, MedicineUtil } from '../../models/medicine.model';
import { STATUS_COLORS, StatusType } from '../../models/status.constants';
import { MedicineService } from '../../services/medicine-service';
import { AddMedicineComponent } from '../add-medicine/add-medicine';

@Component({
  selector: 'app-medicine-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MaterialModule
  ],
  templateUrl: './medicine-list.html',
  styleUrls: ['./medicine-list.scss']
})
export class MedicineListComponent implements OnInit, AfterViewInit {

  medicines: Medicine[] = [];
  dataSource = new MatTableDataSource<Medicine>();
  searchQuery = '';
  isLoading = false;
  errorMessage = '';
  displayedColumns: string[] = [
    'medicineName',
    'brand',
    'expiryDate',
    'quantity',
    'price',
    'status',
    'actions'
  ];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageSize = 10;

  constructor(
    private medicineService: MedicineService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    // Configure sorting
    this.dataSource.sortingDataAccessor = (item: Medicine, property: string) => {
      switch (property) {
        case 'medicineName':
          return item.medicineName;
        case 'brand':
          return item.brand;
        case 'expiryDate':
          return new Date(item.expiryDate).getTime();
        case 'quantity':
          return item.quantity;
        case 'price':
          return item.price;
        case 'status':
          return MedicineUtil.isExpired(item) ? 'Expired' :
            MedicineUtil.getDaysUntilExpiry(item) < 30 ? 'Expiring' :
              item.quantity < 10 ? 'Low Stock' : 'In Stock';
        default:
          return '';
      }
    };
  }

  ngOnInit(): void {
    this.loadMedicines();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      if (this.paginator) {
        this.paginator.pageSize = this.pageSize;
      }
    }, 100);
  }

  loadMedicines(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.medicineService.getAllMedicines().subscribe({
      next: (data) => {
        this.medicines = data;
        this.dataSource.data = [...data];
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Error loading medicines';
        this.isLoading = false;
      }
    });
  }

  openAddMedicineDialog(): void {
    this.dialog.open(AddMedicineComponent, {
      width: '600px',
      maxHeight: '85vh',
      disableClose: false,
      autoFocus: false,
    }).afterClosed().subscribe((result) => {
      if (result) {
        this.loadMedicines();
      }
    });
  }

  searchMedicines(): void {
    if (!this.searchQuery.trim()) {
      this.dataSource.data = [...this.medicines];
      return;
    }
    this.isLoading = true;
    this.medicineService
      .searchMedicineByName(this.searchQuery)
      .subscribe({
        next: (data) => {
          this.dataSource.data = [...data];
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = 'Error searching medicines';
          this.isLoading = false;
        }
      });
  }

  deleteMedicine(id?: number): void {
    if (!id) {
      return;
    }
    if (!confirm(
      'Are you sure you want to delete this medicine?'
    )) {
      return;
    }
    this.medicineService
      .deleteMedicine(id)
      .subscribe({
        next: () => {
          this.snackBar.open(
            'Medicine deleted successfully',
            'Close',
            {
              duration: 3000
            }
          );
          this.loadMedicines();
        },
        error: (error) => {
          console.error(error);
          this.snackBar.open(
            'Error deleting medicine',
            'Close',
            {
              duration: 3000
            }
          );
        }
      });
  }

  getStatusColor(medicine: Medicine): 'primary' | 'accent' | 'warn' {
    if (MedicineUtil.isExpired(medicine)) {
      return 'warn';
    }
    const days = MedicineUtil.getDaysUntilExpiry(medicine);
    if (days < 30) {
      return 'warn';
    }
    if (medicine.quantity < 10) {
      return 'accent';
    }
    return 'primary';
  }

  getStatusType(medicine: Medicine): StatusType {
    if (MedicineUtil.isExpired(medicine)) {
      return StatusType.EXPIRING;
    }
    const days = MedicineUtil.getDaysUntilExpiry(medicine);
    if (days < 30) {
      return StatusType.EXPIRING;
    }
    if (medicine.quantity < 10) {
      return StatusType.LOW_STOCK;
    }
    return StatusType.IN_STOCK;
  }

  getStatusStyle(medicine: Medicine): { [key: string]: string } {
    const statusType = this.getStatusType(medicine);
    const colors = STATUS_COLORS[statusType];
    return {
      'background-color': colors.backgroundColor,
      'color': colors.color
    };
  }

  getStatus(medicine: Medicine): string {
    if (MedicineUtil.isExpired(medicine)) {
      return 'Expired';
    }

    const days = MedicineUtil.getDaysUntilExpiry(medicine);
    if (days < 30) {
      return `Expiring Soon (${days} days)`;
    }
    if (medicine.quantity < 10) {
      return `Low Stock (${medicine.quantity})`;
    }
    return 'In Stock';
  }

  formatPrice(price: number): string {
    return price.toFixed(2);
  }

  formatDate(date: Date): string {
    return new Date(date)
      .toLocaleDateString('en-IN');
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.dataSource.data = [...this.medicines];
  }
}

