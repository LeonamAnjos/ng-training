import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface StopTrainingDialogData {
  progress: number;
}

@Component({
  templateUrl: './stop-training.component.html',
  styleUrls: ['./stop-training.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StopTrainingComponent {

  public constructor(@Inject(MAT_DIALOG_DATA) private _passedData: StopTrainingDialogData) { }

  public get progress(): any {
    return this._passedData.progress;
  }
}
