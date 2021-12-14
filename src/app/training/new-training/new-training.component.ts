import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Exercise } from '../training.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewTrainingComponent {
  @Output() trainingStart = new EventEmitter<string>();

  private _selectedExercise$ = new BehaviorSubject<string | undefined>(undefined);

  constructor(private readonly trainingService: TrainingService) {}

  public onStartTraining(): void {
    this.trainingStart.emit(this.selectedExercise);
  }

  public get exercises$(): Observable<Exercise[]> {
    return this.trainingService.availableExercises$;
  }

  public get selectedExercise(): string | undefined {
    return this._selectedExercise$.getValue();
  }

  public set selectedExercise(exercise: string | undefined) {
    this._selectedExercise$.next(exercise);
  }

  public get selectedExercise$(): Observable<string | undefined> {
    return this._selectedExercise$.asObservable();
  }

}
