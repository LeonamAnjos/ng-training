import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { UiService } from 'src/app/shared/ui.service';
import { AuthData } from '../auth-data.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent {
  public readonly maxDate: Date = new Date();

  constructor(
    private readonly authService: AuthService,
    private readonly uiService: UiService,
  ) {
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  public onSubmit(form: NgForm): void {
    const authData: AuthData = {
      email: form.value.email,
      password: form.value.password,
    };

    this.authService.registerUser(authData);
    console.log("SignupComponent.onSubmit()", authData);
  }

  public get loadingState$(): Observable<boolean> {
    return this.uiService.loadingState$;
  }
}
