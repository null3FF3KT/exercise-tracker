import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExerciseService, Exercise } from '../exercise.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-exercise-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './exercise-list.component.html'
})
export class ExerciseListComponent implements OnInit, OnDestroy {
  exercises$ = this.exerciseService.exercises$;
  private unsubscribe$ = new Subject<void>();

  constructor(private exerciseService: ExerciseService) {}

  ngOnInit(): void {
    this.loadExercises();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadExercises(): void {
    this.exerciseService.loadExercises()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        error: error => console.error('Error fetching exercises:', error)
      });
  }

  editExercise(id: number): void {
    // TODO: Implement edit functionality
    console.log('Edit exercise:', id);
  }

  deleteExercise(id: number): void {
    if (confirm('Are you sure you want to delete this exercise?')) {
      this.exerciseService.deleteExercise(id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: () => console.log('Exercise deleted successfully'),
          error: error => console.error('Error deleting exercise:', error)
        });
    }
  }

  addExercise(): void {
    // TODO: Implement navigation to add exercise form
    console.log('Navigate to add exercise form');
  }
}