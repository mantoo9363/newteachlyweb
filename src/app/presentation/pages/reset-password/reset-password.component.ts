import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { ApiService } from '../../../core/services/api-service';

function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password && confirmPassword && password !== confirmPassword
    ? { passwordMismatch: true }
    : null;
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  token: string | null = null;
  email: string | null = null;

  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  errorMessage = '';
  isSuccess = false;
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);

    // Extract token from route parameter or query parameter
    this.token = this.route.snapshot.paramMap.get('token') || this.route.snapshot.queryParams['token'] || null;
    this.email = this.route.snapshot.queryParams['email'] || null;

    this.initForm();

    if (!this.token) {
      this.errorMessage = 'Invalid or missing password reset token. Please request a new password reset link.';
    }
  }

  private initForm(): void {
    this.resetForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: passwordsMatchValidator }
    );

    this.resetForm.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (!this.token) {
      this.errorMessage = 'No valid reset token found. Please check your reset link or request a new one.';
      return;
    }

    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const newPassword = this.resetForm.value.password;
    const confirmPassword = this.resetForm.value.confirmPassword;
    const payload = {
      token: this.token,
      email: this.email || '',
      password: newPassword,
      new_password: newPassword,
      confirm_password: confirmPassword
    };

    this.apiService.resetPassword(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.isSuccess = true;
        this.successMessage = res?.message || 'Your password has been successfully reset! You can now log in with your new password.';
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Password reset error:', err);

        const errorDetail = err?.error?.detail || err?.error?.message || err?.message;
        this.errorMessage = typeof errorDetail === 'string' ? errorDetail : 'Failed to reset password. The link may be expired or invalid.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/']);
  }
}
