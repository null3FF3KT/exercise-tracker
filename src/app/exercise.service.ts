import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map, catchError } from 'rxjs';

export interface Exercise {
  id: number;
  date: string;
  duration: string;
  exerciseTypeId: number;
  exerciseType?: { id: number; typeName: string };
  distance?: number;
}

export interface ExerciseStats {
  daysSinceBeginning: number;
  totalDuration: string;
  averageDuration: string;
  totalExercises: number;
  numberOfDays: number;
  totalDistance: number;
  averageMph: number;
}

export interface FastestExercise {
  distanceGroup: number;
  fastestTime: string;
  dateAchieved: string;
  actualDistance: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private apiUrl = 'http://localhost:5189/api';
  
  private exercisesSubject = new BehaviorSubject<Exercise[]>([]);
  exercises$ = this.exercisesSubject.asObservable();
  
  private statsSubject = new BehaviorSubject<ExerciseStats | null>(null);
  stats$ = this.statsSubject.asObservable();
  
  private fastestExercisesSubject = new BehaviorSubject<FastestExercise[]>([]);
  fastestExercises$ = this.fastestExercisesSubject.asObservable();

  constructor(private http: HttpClient) { }

  loadExercises(): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.apiUrl}/exercises`).pipe(
      tap(exercises => this.exercisesSubject.next(exercises)),
      catchError(this.handleError<Exercise[]>('loadExercises', []))
    );
  }

  getExercise(id: number): Observable<Exercise | undefined> {
    return this.exercises$.pipe(
      map(exercises => exercises.find(e => e.id === id))
    );
  }

  addExercise(exercise: Exercise): Observable<Exercise> {
    return this.http.post<Exercise>(`${this.apiUrl}/exercises`, exercise).pipe(
      tap(newExercise => {
        const currentExercises = this.exercisesSubject.value;
        this.exercisesSubject.next([...currentExercises, newExercise]);
      }),
      catchError(this.handleError<Exercise>('addExercise'))
    );
  }

  updateExercise(id: number, exercise: Exercise): Observable<any> {
    return this.http.put(`${this.apiUrl}/exercises/${id}`, exercise).pipe(
      tap(() => {
        const currentExercises = this.exercisesSubject.value;
        const updatedExercises = currentExercises.map(e => e.id === id ? { ...e, ...exercise } : e);
        this.exercisesSubject.next(updatedExercises);
      }),
      catchError(this.handleError<any>('updateExercise'))
    );
  }

  deleteExercise(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/exercises/${id}`).pipe(
      tap(() => {
        const currentExercises = this.exercisesSubject.value;
        this.exercisesSubject.next(currentExercises.filter(e => e.id !== id));
      }),
      catchError(this.handleError<any>('deleteExercise'))
    );
  }

  loadExerciseStats(): Observable<ExerciseStats> {
    return this.http.get<ExerciseStats>(`${this.apiUrl}/exercises/stats`).pipe(
      tap(stats => this.statsSubject.next(stats)),
      catchError(this.handleError<ExerciseStats>('loadExerciseStats', {} as ExerciseStats))
    );
  }

  loadFastestExercises(): Observable<FastestExercise[]> {
    return this.http.get<FastestExercise[]>(`${this.apiUrl}/exercises/fastest`).pipe(
      tap(fastest => this.fastestExercisesSubject.next(fastest)),
      catchError(this.handleError<FastestExercise[]>('loadFastestExercises', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // You might want to send the error to a remote logging infrastructure
      return new Observable(subscriber => subscriber.next(result as T));
    };
  }
}