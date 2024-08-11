import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExerciseService, Exercise } from '../exercise.service';

@Component({
  selector: 'app-exercise-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Add New Exercise</h2>
    <form (ngSubmit)="onSubmit()">
      <div>
        <label for="date">Date:</label>
        <input type="date" id="date" name="date" [(ngModel)]="exercise.date" required>
      </div>
      <div>
        <label for="exerciseType">Type:</label>
        <select id="exerciseType" name="exerciseType" [(ngModel)]="exercise.exerciseTypeId" required>
          <option *ngFor="let type of exerciseTypes" [value]="type.id">{{ type.typeName }}</option>
        </select>
      </div>
      <div>
        <label for="duration">Duration (HH:MM:SS):</label>
        <input type="text" id="duration" name="duration" [(ngModel)]="exercise.duration" required pattern="\\d{2}:\\d{2}:\\d{2}">
      </div>
      <div>
        <label for="distance">Distance (km):</label>
        <input type="number" id="distance" name="distance" [(ngModel)]="exercise.distance" step="0.01">
      </div>
      <button type="submit">Add Exercise</button>
    </form>
  `,
  styles: [`
    form {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 300px;
    }
    label {
      font-weight: bold;
    }
  `]
})
export class ExerciseFormComponent implements OnInit {
  exercise: Partial<Exercise> = {
    date: new Date().toISOString().split('T')[0],
    duration: '00:30:00'
  };
  exerciseTypes: { id: number; typeName: string }[] = [];

  constructor(
    private exerciseService: ExerciseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadExerciseTypes();
  }

  loadExerciseTypes(): void {
    // TODO: Implement API call to get exercise types
    this.exerciseTypes = [
      { id: 1, typeName: 'Walking' },
      { id: 2, typeName: 'Running' },
      { id: 3, typeName: 'Cycling' },
      // ... add more types as needed
    ];
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      this.exerciseService.addExercise(this.exercise as Exercise).subscribe(
        () => {
          console.log('Exercise added successfully');
          this.router.navigate(['/exercises']);
        },
        error => console.error('Error adding exercise:', error)
      );
    } else {
      console.error('Form is invalid');
    }
  }

  isFormValid(): boolean {
    return !!(this.exercise.date && this.exercise.exerciseTypeId && this.exercise.duration);
  }
}