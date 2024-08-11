import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseService } from '../exercise.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exercise-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exercise-stats.component.html'
})
export class ExerciseStatsComponent implements OnInit, OnDestroy {
  stats$ = this.exerciseService.stats$;
  fastestExercises$ = this.exerciseService.fastestExercises$;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private exerciseService: ExerciseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadFastestExercises();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadStats(): void {
    this.exerciseService.loadExerciseStats()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        error: error => console.error('Error fetching exercise stats:', error)
      });
  }

  loadFastestExercises(): void {
    this.exerciseService.loadFastestExercises()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        error: error => console.error('Error fetching fastest exercises:', error)
      });
  }

  viewList() {
    this.router.navigate(['/exercises']);
  }
  
  addExercise() {
    this.router.navigate(['/exercises/add']);
  }
}