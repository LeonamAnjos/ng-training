import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, interval, Observable, Subject, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Exercise } from '../training.model';
import { TrainingService } from '../training.service';
import { StopTrainingComponent, StopTrainingDialogData } from './stop-training/stop-training.component';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentTrainingComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  private progress$ = new BehaviorSubject<number>(0);
  private timer$: undefined | Subscription = undefined;

  constructor(
    private readonly dialog: MatDialog,
    private readonly trainingService: TrainingService,
  ) { }

  public ngOnInit(): void {
    this.startOrResumeTraining();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public get runningExercise$(): Observable<Exercise | null> {
    return this.trainingService.runningExercise$;
  }

  public get runningExercise(): Exercise | null {
    return this.trainingService.runningExercise;
  }

  public onStop(): void {
    this.timer$?.unsubscribe();
    const dialogRef = this.dialog.open<StopTrainingComponent, StopTrainingDialogData>(StopTrainingComponent, {
      data: {
        progress: this.currentProgress,
      }
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (!result) {
        this.startOrResumeTraining();
      } else {
        this.trainingService.stopExercise(this.currentProgress);
      }
    });
  }

  public get progress(): Observable<number> {
    return this.progress$.asObservable();
  }

  public get currentProgress(): number {
    return this.progress$.getValue();
  }

  private startOrResumeTraining() {
    if (this.runningExercise === null) {
      return;
    }

    const exercise = this.runningExercise;
    const step = exercise.duration / 100 * 1000;

    this.timer$ = interval(step).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.progress$.next(this.currentProgress + 1);
      if (this.currentProgress >= 100)
      {
        this.timer$?.unsubscribe();
        this.trainingService.completeExercise();
      }
    });
  }
}
