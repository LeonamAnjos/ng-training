import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Exercise } from '../training.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrainingComponent implements OnInit {
  ongoingTraining: boolean = false

  constructor(
    private readonly trainingService: TrainingService,
  ) { }

  public ngOnInit(): void {
    this.trainingService.runningExercise$.subscribe((exercise: Exercise | null) => {
      this.ongoingTraining = !!exercise;
    });
  }

  public onTrainingStart(trainingId: string): void {
    this.trainingService.startExercise(trainingId);
  }
}
