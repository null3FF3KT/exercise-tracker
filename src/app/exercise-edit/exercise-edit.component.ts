
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExerciseService, Exercise } from '../exercise.service';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-exercise-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './exercise-edit.component.html',
  styleUrl: './exercise-edit.component.scss'
})

export class ExerciseEditComponent implements OnInit, OnDestroy {
  exerciseForm: FormGroup;
  exercise: Exercise | undefined;
  exerciseTypes: { id: number; typeName: string }[] = [];
  private unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private exerciseService: ExerciseService
  ) {
    this.exerciseForm = this.fb.group({
      date: ['', Validators.required],
      exerciseTypeId: ['', Validators.required],
      duration: ['', Validators.required],
      distance: [null]
    });
  }

  ngOnInit(): void {
    // Get exercise types
    this.exerciseService.getExerciseTypes()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(types => this.exerciseTypes = types);

    // Get the exercise ID from the route
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.exerciseService.getExercise(id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(exercise => {
          if (exercise) {
            this.exercise = exercise;
            const dateObj = new Date(exercise.date);
            const formattedDate = dateObj.toISOString().split('T')[0];
            this.exerciseForm.patchValue({
              date: formattedDate,
              exerciseTypeId: exercise.exerciseTypeId,
              duration: exercise.duration,
              distance: exercise.distance
            });
          }
        });
    }
  }

  onSubmit(): void {
    if (this.exerciseForm.valid && this.exercise) {
      const updatedExercise: Exercise = {
        ...this.exercise,
        ...this.exerciseForm.value
      };

      this.exerciseService.updateExercise(this.exercise.id, updatedExercise)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: () => {
            console.log('Exercise updated successfully');
            this.router.navigate(['/exercises']);
          },
          error: error => console.error('Error updating exercise:', error)
        });
    }
  }

  cancel(): void {
    this.router.navigate(['/exercises']);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
