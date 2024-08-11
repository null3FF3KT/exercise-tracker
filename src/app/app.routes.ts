import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/exercises', pathMatch: 'full' },
  {
    path: 'exercises',
    loadComponent: () => import('./exercise-list/exercise-list.component').then(m => m.ExerciseListComponent)
  },
  {
    path: 'add-exercise',
    loadComponent: () => import('./exercise-form/exercise-form.component').then(m => m.ExerciseFormComponent)
  },
  {
    path: 'stats',
    loadComponent: () => import('./exercise-stats/exercise-stats.component').then(m => m.ExerciseStatsComponent)
  },
];