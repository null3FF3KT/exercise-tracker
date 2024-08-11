import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ExerciseService, Exercise } from '../exercise.service';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-exercise-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exercise-form.component.html'
})
export class ExerciseFormComponent implements OnInit, OnDestroy {
  exercise: Partial<Exercise> = {
    date: new Date().toISOString().split('T')[0],
    duration: '00:30:00'
  };
  exerciseTypes$: Observable<{ id: number; typeName: string }[]>;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private exerciseService: ExerciseService,
    private router: Router
  ) {
    this.exerciseTypes$ = this.exerciseService.getExerciseTypes();
  }

  ngOnInit(): void {
    // If you need to perform any initialization, do it here
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSubmit(form: NgForm): void {
    if (form.valid && this.isValidDuration(this.exercise.duration)) {
      this.exerciseService.addExercise(this.exercise as Exercise)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: () => {
            console.log('Exercise added successfully');
            this.router.navigate(['/exercises']);
          },
          error: error => console.error('Error adding exercise:', error)
        });
    } else {
      console.error('Form is invalid');
    }
  }

  isValidDuration(duration: string | undefined): boolean {
    if (!duration) return false;
    const [hours, minutes, seconds] = duration.split(':').map(Number);
    return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60 && seconds >= 0 && seconds < 60;
  }

  viewList() {
    this.router.navigate(['/exercises']);
  }

  viewStats(): void {
    this.router.navigate(['/exercises/stats']);
  }
}