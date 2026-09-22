import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-oauth2-redirect',
  standalone: true,
  template: `
    <div class="redirect-page">
      <p>Signing you in...</p>
    </div>
  `,
  styles: [`
    .redirect-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-secondary);
    }
  `]
})
export class Oauth2RedirectComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    const error = this.route.snapshot.queryParamMap.get('error');

    if (token) {
      this.authService.setTokenFromOAuth2(token);
      this.router.navigate(['/admin']);
    } else {
      // error param covers both Google-side failures and "not_authorized"
      // (a Google account that logged in successfully but isn't on the admin allow-list)
      this.router.navigate(['/admin/login'], { queryParams: { oauthError: error || 'unknown' } });
    }
  }
}
