import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { UiService } from 'src/app/shared/ui.service';
import { AuthData } from '../auth-data.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  public readonly loginForm: FormGroup;

  constructor(
    private readonly authService: AuthService,
    private readonly uiService: UiService,
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', { validators: [Validators.required] }),
    });
  }

  public onSubmit(): void {
    const authData: AuthData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.authService.login(authData);
    console.log("LoginComponent.onSubmit()", authData);
  }

  public get loadingState$(): Observable<boolean> {
    return this.uiService.loadingState$;
  }
}
