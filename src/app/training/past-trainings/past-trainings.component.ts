import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Exercise } from '../training.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PastTrainingsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public readonly displayedColumns = ["date", "name", "duration", "calories", "state"];
  public readonly dataSource = new MatTableDataSource<Exercise>();
  private readonly _destroyer$: Subject<true> = new Subject<true>();

  constructor(
    private readonly trainingService: TrainingService,
  ) { }

  public ngOnInit(): void {
    this.trainingService.finishedExercises$
      .pipe(takeUntil(this._destroyer$))
      .subscribe((exercises: Exercise[]) => {
        this.dataSource.data = exercises;
      });
  }

  public ngOnDestroy(): void {
    this._destroyer$.next(true);
    this._destroyer$.complete();
  }

  public ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter(event: any) {
    try {
      const filterValue = event.target.value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    } catch (error) {
      console.error("PastTrainingComponent.doFilter: ", error, [event]);
    }
  }
}
