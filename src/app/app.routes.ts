import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/exercises', pathMatch: 'full' },
  {
    path: 'exercises',
    loadComponent: () => import('./exercise-list/exercise-list.component').then(m => m.ExerciseListComponent)
  },
  {
    path: 'exercises/add',
    loadComponent: () => import('./exercise-form/exercise-form.component').then(m => m.ExerciseFormComponent)
  },
  {
    path: 'exercises/edit/:id',
    loadComponent: () => import('./exercise-form/exercise-form.component').then(m => m.ExerciseFormComponent)
  },
  {
    path: 'exercises/stats',
    loadComponent: () => import('./exercise-stats/exercise-stats.component').then(m => m.ExerciseStatsComponent)
  },
];