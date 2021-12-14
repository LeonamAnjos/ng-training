import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Output() toggleSidenav = new EventEmitter<void>();

  public readonly isAuth$: Observable<boolean>;

  constructor(private readonly authService: AuthService) {
    this.isAuth$ = this.authService.authChangeObservable;
  }

  public logout(): void {
    this.authService.logout();
  }

  public onToggleSidenav(): void {
    this.toggleSidenav.emit();
  }
}
