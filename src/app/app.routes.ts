import { Routes } from '@angular/router';
import { MedicineListComponent } from './components/medicine-list/medicine-list';
import { SaleRecordsComponent } from './components/sale-records/sale-records';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'medicines',
    pathMatch: 'full'
  },

  {
    path: 'medicines',
    component: MedicineListComponent
  },

  {
    path: 'sales',
    component: SaleRecordsComponent
  }
];