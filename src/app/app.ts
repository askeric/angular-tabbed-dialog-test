import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DialogComponent } from "./dialog/dialog";

@Component({
  selector: 'app-root',
  imports: [DialogComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'angular-tabbed-dialog-test';
}
