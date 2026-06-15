import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MaterialModule } from './shared/material.module';

@Component({
  selector: 'app-root',
  imports: [RouterModule, RouterOutlet, MaterialModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('pharmacyUI');
}
