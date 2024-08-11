import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav>
      <ul>
        <li><a routerLink="/exercises">Exercise List</a></li>
        <li><a routerLink="/add-exercise">Add Exercise</a></li>
        <li><a routerLink="/stats">Exercise Stats</a></li>
      </ul>
    </nav>

    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  title = 'exercise-tracker';
}