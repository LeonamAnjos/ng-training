import { Injectable, OnDestroy } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import { LoggerService } from "../shared/logger.service";
import { Exercise } from "./training.model";

@Injectable({
  providedIn: 'root',
})
export class TrainingService implements OnDestroy {
  private readonly _database: AngularFirestore;
  private readonly _runningExercise$    = new BehaviorSubject<Exercise | null>(null);
  private readonly _finishedExercises$  = new BehaviorSubject<Exercise[]>([]);
  private readonly _availableExercises$ = new BehaviorSubject<Exercise[]>([]);

  private readonly _destroyer$ = new Subject<true>();

  constructor(
    firestore: AngularFirestore,
    private readonly loggerService: LoggerService,
  ) {
    this._database = firestore;
    this._database
      .collection<Exercise>("availableExercises")
      .valueChanges({ idField: "id" })
      .pipe(
        catchError((error) => {
          this.loggerService.error("TrainingService.availableExercises: failed to load. ", error);
          throw error;
        }),
        takeUntil(this._destroyer$),
      )
      .subscribe((exercises: Exercise[]) => this._availableExercises$.next(exercises));

    this._database
      .collection<Exercise>("finishedExercises")
      .valueChanges()
      .pipe(
        catchError((error) => {
          this.loggerService.error("TrainingService.finishedExercises: failed to load. ", error);
          throw error;
        }),
        takeUntil(this._destroyer$),
      )
      .subscribe((exercises: Exercise[]) => this._finishedExercises$.next(exercises));
  }

  public ngOnDestroy(): void {
    this._destroyer$.next(true);
    this._destroyer$.complete();
  }

  public get finishedExercises$(): Observable<Exercise[]> {
    return this._finishedExercises$;
  }

  public get availableExercises$(): Observable<Exercise[]> {
    return this._availableExercises$.asObservable();
  }

  public get availableExercises(): Exercise[] {
    return this._availableExercises$.getValue();
  }

  public get runningExercise$(): Observable<Exercise | null> {
    return this._runningExercise$.asObservable();
  }

  public get runningExercise(): Exercise | null {
    return this._runningExercise$.getValue();
  }

  public startExercise(selectedId: string) {
    const exercise = this.availableExercises.find((exercise: Exercise) => exercise.id === selectedId);
    if (!exercise) {
      throw new Error(`Exercise not found: ${selectedId}.`)
    }

    this._runningExercise$.next({ ...exercise });
  }

  public stopExercise(progress: number): void {
    if (this.runningExercise === null) {
      return;
    }

    const progressProportion = progress / 100;
    this.addExerciseToDatabase({
      ...this.runningExercise,
      calories: this.runningExercise.calories * progressProportion,
      duration: this.runningExercise.duration * progressProportion,
      date: new Date(),
      state: "cancelled"
    });
    this._runningExercise$.next(null);
  }

  public completeExercise(): void {
    if (this.runningExercise === null) {
      return;
    }

    this.addExerciseToDatabase({...this.runningExercise, date: new Date(), state: "completed"});
    this._runningExercise$.next(null);
  }

  private addExerciseToDatabase(exercise: Exercise): void {
    this._database.collection("finishedExercises")
    .add(exercise)
    .catch((error) => {
      this.loggerService.error("TrainingService.addExerciseToDatabase: failed to add exercise.", error);
    });
  }
}
