import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { LoginRequest } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  credentials: LoginRequest = { username: '', password: '' };
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const oauthError = this.route.snapshot.queryParamMap.get('oauthError');
    if (oauthError === 'not_authorized') {
      this.errorMessage.set('That Google account is not authorized for admin access.');
    } else if (oauthError) {
      this.errorMessage.set('Google sign-in failed. Please try again.');
    }
  }

  submit(): void {
    if (!this.credentials.username || !this.credentials.password) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/admin']);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Invalid username or password.');
      }
    });
  }

  loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }
}
