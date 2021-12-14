import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavListComponent {
  @Output() closeSidenav = new EventEmitter<void>();

  public readonly isAuth$: Observable<boolean>;

  constructor(private readonly authService: AuthService) {
    this.isAuth$ = this.authService.authChangeObservable;
   }

  public onCloseSidenav(): void {
    this.closeSidenav.emit();
  }

  public logout(): void {
    this.authService.logout();
    this.onCloseSidenav();
  }

}
