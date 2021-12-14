import { Injectable, OnDestroy } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService implements OnDestroy {
  private readonly _loadingState$ = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly snackBar: MatSnackBar,
  ) {}

  public startLoading(): void {
    this._loadingState$.next(true);
  }

  public stopLoading(): void {
    this._loadingState$.next(false);
  }

  public get loadingState$(): Observable<boolean> {
    return this._loadingState$.asObservable();
  }

  public ngOnDestroy(): void {
    this._loadingState$.complete();
  }

  public showSnackBar(message: string, action?: string, duration?: number): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackBar.open(message, action, {
      duration: duration ?? 5000,
    });
  }
}
