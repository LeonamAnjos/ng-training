import { Injectable, OnDestroy } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, PartialObserver, Subject } from "rxjs";
import { distinctUntilChanged, takeUntil } from "rxjs/operators";
import { UiService } from "../shared/ui.service";
import { AuthData } from "./auth-data.model";
import { User } from "./user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private _isAuthenticated$ = new BehaviorSubject<boolean>(false);
  private _destroyer$ = new Subject<void>();
  private _user: User | null = null;

  constructor(
    private readonly router: Router,
    private readonly auth: AngularFireAuth,
    private readonly uiService: UiService,
  ) {
    this.auth.authState.pipe(takeUntil(this._destroyer$)).subscribe((user) => {
      this._user = null;
      if (user != null) {
        this._user = {
          id: user.uid,
          email: user.email ?? "",
        }
      }
      this._isAuthenticated$.next(user != null);
    });
  }

  public ngOnDestroy(): void {
    this._destroyer$.next();
    this._destroyer$.complete();
  }

  public registerUser(authData: AuthData) {
    this.uiService.startLoading();
    this.auth.createUserWithEmailAndPassword(authData.email, authData.password)
      .then(_ => this.uiService.stopLoading())
      .then(_ => this.navigateToTraining())
      .catch(error => {
        this.uiService.stopLoading();
        this.uiService.showSnackBar(error.message);
      });
  }

  public login(authData: AuthData) {
    this.uiService.startLoading();
    this.auth.signInWithEmailAndPassword(authData.email, authData.password)
      .then(_ => this.uiService.stopLoading())
      .then(_ => this._isAuthenticated$.next(true))
      .then(_ => this.navigateToTraining())
      .catch(error => {
        this.uiService.stopLoading();
        this.uiService.showSnackBar(error.message);
      });
  }

  public logout() {
    this.auth.signOut();
    this.navigateToHome();
  }

  public get user(): User | null {
    return this._user;
  }

  public get isAuth(): boolean {
    return this._isAuthenticated$.getValue();
  }

  public get authChangeObservable(): Observable<boolean> {
    return this._isAuthenticated$.pipe(distinctUntilChanged());
  }

  private navigateToTraining() {
    console.log("navigateToTraining()");
    this.router.navigate(["/", "training"]);
  }

  private navigateToHome() {
    this.router.navigate(["/"]);
  }
}
