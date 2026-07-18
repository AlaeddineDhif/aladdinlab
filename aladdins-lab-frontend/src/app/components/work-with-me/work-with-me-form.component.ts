import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass, NgFor } from '@angular/common';
import { InquiryService } from '../../services/inquiry.service';
import { INQUIRY_TYPES } from '../../models/contact-inquiry.model';

@Component({
  selector: 'app-work-with-me-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgFor],
  template: `
    <div class="form-wrapper">
      <div class="form-card">
        <div class="form-header">
          <h2>Let's Build Something</h2>
          <p>Tell me about your project, sponsorship, or collaboration idea.</p>
        </div>

        @if (submitted()) {
          <div class="success-state">
            <div class="success-icon">&#10003;</div>
            <h3>Inquiry Submitted</h3>
            <p>Thank you {{ submittedName }}. I'll get back to you within 48 hours.</p>
            <button class="btn btn-outline" (click)="resetForm()">Send Another</button>
          </div>
        } @else {
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-body" novalidate>
            <div class="field">
              <label for="name" class="label">Full Name</label>
              <input
                id="name"
                type="text"
                formControlName="name"
                class="input"
                placeholder="Your full name"
                [ngClass]="{ 'input-error': nameCtrl.invalid && nameCtrl.touched }"
              />
              @if (nameCtrl.invalid && nameCtrl.touched) {
                <span class="field-error">
                  {{ nameCtrl.errors?.['required'] ? 'Name is required' : 'Name must be 2–100 characters' }}
                </span>
              }
            </div>

            <div class="field">
              <label class="label">Email Address</label>
              <input
                type="email"
                formControlName="email"
                class="input"
                placeholder="you@example.com"
                [class.input-error]="emailCtrl.invalid && emailCtrl.touched"
              />
              @if (emailCtrl.invalid && emailCtrl.touched) {
                <span class="field-error">
                  {{ emailCtrl.hasError('required') ? 'Email is required' : 'Enter a valid email address' }}
                </span>
              }
            </div>

            <div class="field">
              <label class="label">Inquiry Type</label>
              <select formControlName="inquiryType" class="input" [class.input-error]="typeCtrl.invalid && typeCtrl.touched">
                <option value="" disabled>Select a category</option>
                <option *ngFor="let t of inquiryTypes" [value]="t">{{ t }}</option>
              </select>
              @if (typeCtrl.invalid && typeCtrl.touched) {
                <span class="field-error">Please select an inquiry type</span>
              }
            </div>

            <div class="field">
              <label class="label">Message</label>
              <textarea
                formControlName="message"
                class="input textarea"
                rows="5"
                placeholder="Describe your project, goals, timeline..."
                [class.input-error]="msgCtrl.invalid && msgCtrl.touched"
              ></textarea>
              @if (msgCtrl.invalid && msgCtrl.touched) {
                <span class="field-error">
                  {{ msgCtrl.hasError('required') ? 'Message is required' : 'Message must be 10–2000 characters' }}
                </span>
              }
            </div>

            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || submitting()">
              @if (submitting()) {
                <span class="spinner"></span> Sending...
              } @else {
                Submit Inquiry
              }
            </button>

            @if (error()) {
              <div class="error-banner">Something went wrong. Please try again.</div>
            }
          </form>
        }
      </div>
    </div>
  `,
  styles: [`
    .form-wrapper {
      display: flex;
      justify-content: center;
      padding: clamp(24px, 5vw, 64px) 0;
    }

    .form-card {
      width: 100%;
      max-width: min(560px, 90vw);
      background: var(--surface);
      border-radius: var(--radius);
      box-shadow: var(--shadow-lg);
      padding: clamp(24px, 4vw, 48px);
    }

    .form-header {
      margin-bottom: clamp(20px, 3vw, 36px);
    }

    .form-header h2 {
      font-size: clamp(1.35rem, 3vw, 2rem);
      font-weight: 700;
      margin-bottom: 8px;
    }

    .form-header p {
      color: var(--text-secondary);
      font-size: clamp(0.85rem, 1.4vw, 1rem);
    }

    .form-body {
      display: flex;
      flex-direction: column;
      gap: clamp(14px, 2vw, 24px);
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .label {
      font-weight: 600;
      font-size: clamp(0.8rem, 1.2vw, 0.9rem);
      color: var(--text);
    }

    .input {
      width: 100%;
      padding: clamp(10px, 1.5vw, 14px) clamp(12px, 1.5vw, 16px);
      border: 1.5px solid var(--border);
      border-radius: var(--radius-sm);
      font-family: inherit;
      font-size: clamp(0.85rem, 1.3vw, 1rem);
      background: var(--surface);
      color: var(--text);
      transition: border-color var(--transition), box-shadow var(--transition);
      outline: none;
    }

    .input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-glow);
    }

    .input-error {
      border-color: var(--danger) !important;
    }

    .input-error:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2) !important;
    }

    .select {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 36px;
    }

    .textarea {
      resize: vertical;
      min-height: 120px;
    }

    .field-error {
      font-size: clamp(0.75rem, 1vw, 0.85rem);
      color: var(--danger);
      font-weight: 500;
    }

    .btn {
      padding: clamp(10px, 1.5vw, 14px) clamp(18px, 3vw, 28px);
      border: none;
      border-radius: var(--radius-sm);
      font-family: inherit;
      font-size: clamp(0.85rem, 1.3vw, 1rem);
      font-weight: 600;
      cursor: pointer;
      transition: all var(--transition);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background: var(--accent);
      color: #fff;
    }

    .btn-primary:not(:disabled):hover {
      background: var(--accent-hover);
    }

    .btn-outline {
      background: transparent;
      border: 1.5px solid var(--border);
      color: var(--text);
    }

    .btn-outline:hover {
      border-color: var(--accent);
      color: var(--accent);
    }

    .spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-banner {
      padding: 12px 16px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: var(--radius-sm);
      color: var(--danger);
      font-size: clamp(0.85rem, 1.2vw, 0.95rem);
      font-weight: 500;
      text-align: center;
    }

    .success-state {
      text-align: center;
      padding: clamp(16px, 3vw, 32px) 0;
    }

    .success-icon {
      width: clamp(48px, 6vw, 64px);
      height: clamp(48px, 6vw, 64px);
      border-radius: 50%;
      background: rgba(34, 197, 94, 0.12);
      color: var(--success);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: clamp(1.4rem, 2.5vw, 2rem);
      font-weight: 700;
      margin-bottom: 16px;
    }

    .success-state h3 {
      font-size: clamp(1.2rem, 2.5vw, 1.6rem);
      margin-bottom: 8px;
    }

    .success-state p {
      color: var(--text-secondary);
      font-size: clamp(0.85rem, 1.3vw, 1rem);
      margin-bottom: 24px;
    }

    @media (max-width: 480px) {
      .form-card {
        max-width: 100%;
        border-radius: var(--radius-sm);
        box-shadow: var(--shadow);
        padding: 20px;
      }

      .textarea {
        min-height: 100px;
      }
    }

    @media (min-width: 1600px) {
      .form-card {
        max-width: 640px;
        padding: 56px;
      }
    }
  `]
})
export class WorkWithMeFormComponent {
  private fb = inject(FormBuilder);
  private service = inject(InquiryService);

  inquiryTypes = [...INQUIRY_TYPES];
  submitted = signal(false);
  submitting = signal(false);
  error = signal(false);
  submittedName = '';

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    inquiryType: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]]
  });

  get nameCtrl() { return this.form.controls.name; }
  get emailCtrl() { return this.form.controls.email; }
  get typeCtrl() { return this.form.controls.inquiryType; }
  get msgCtrl() { return this.form.controls.message; }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.error.set(false);

    this.service.submitInquiry(this.form.getRawValue()).subscribe({
      next: () => {
        this.submittedName = this.form.value.name ?? '';
        this.submitted.set(true);
        this.submitting.set(false);
      },
      error: () => {
        this.error.set(true);
        this.submitting.set(false);
      }
    });
  }

  resetForm() {
    this.form.reset({ inquiryType: '' });
    this.submitted.set(false);
    this.error.set(false);
  }
}