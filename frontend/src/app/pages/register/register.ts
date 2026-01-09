import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true, 
  imports: [
    CommonModule, 
    FormsModule   
  ],
  templateUrl: './register.html', 
  styleUrls: ['./register.css']  
})
export class RegisterComponent {
  registerData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '' 
  };

  successMessage: string | null = null;
  errorMessage: string | null = null;
  passwordErrorMessage: string | null = null;

  private backendUrl = 'http://localhost:8080/api/auth/register';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.successMessage = null;
    this.errorMessage = null;
    this.passwordErrorMessage = null;

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.passwordErrorMessage = 'Passwords do not match!';
      return; 
    }
    const dataToSend = {
      firstName: this.registerData.firstName,
      lastName: this.registerData.lastName,
      email: this.registerData.email,
      password: this.registerData.password
    };

    this.http.post(this.backendUrl, dataToSend, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          this.successMessage = 'User registered successfully!'; 
          
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 409) {
            this.errorMessage = 'Email address is already in use!'; 
          } else {
            this.errorMessage = 'An error occurred during registration. Please try again.';
          }
          console.error('Error during registration:', err);
        }
      });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}