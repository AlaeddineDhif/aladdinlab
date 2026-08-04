import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InquiryService } from '../../services/inquiry.service';

@Component({
  selector: 'app-work-with-me-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
            <h3>Message Sent!</h3>
            <p>Thanks for reaching out! Your message was sent successfully to contact&#64;aladdinlab.net. We'll respond shortly!</p>
            <a href="mailto:contact&#64;aladdinlab.net" class="btn btn-primary">Email Us Directly</a>
            <button class="btn btn-outline" (click)="resetForm()">Send Another</button>
          </div>
        } @else {
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-body" novalidate>
            <div class="field">
              <label class="label">I am contacting as:</label>
              <select formControlName="userType" class="input" [class.input-error]="userTypeCtrl.invalid && userTypeCtrl.touched" (change)="onUserTypeChange()">
                <option value="" disabled selected>Select your type</option>
                <option value="individual">Individual</option>
                <option value="company">Company / Brand</option>
              </select>
              @if (userTypeCtrl.invalid && userTypeCtrl.touched) {
                <span class="field-error">Please select your user type</span>
              }
            </div>

            <div class="field">
              <label class="label">Inquiry Category:</label>
              <select formControlName="inquiryType" class="input" [class.input-error]="typeCtrl.invalid && typeCtrl.touched">
                <option value="" disabled selected>Select a category</option>
                <option value="Sponsorship & Brand Collaboration">Sponsorship & Brand Collaboration</option>
                <option value="Custom IoT / Embedded Project">Custom IoT / Embedded Project</option>
                <option value="3D Printing & Prototyping">3D Printing & Prototyping</option>
                <option value="General Inquiry / Feedback">General Inquiry / Feedback</option>
              </select>
              @if (typeCtrl.invalid && typeCtrl.touched) {
                <span class="field-error">Please select an inquiry category</span>
              }
            </div>

            @if (isCompany()) {
              <div class="field">
                <label for="companyName" class="label">Company Name</label>
                <input
                  id="companyName"
                  type="text"
                  formControlName="companyName"
                  class="input"
                  placeholder="Your company name"
                  [class.input-error]="companyNameCtrl.invalid && companyNameCtrl.touched"
                />
                @if (companyNameCtrl.invalid && companyNameCtrl.touched) {
                  <span class="field-error">Company name is required</span>
                }
              </div>
            }

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
              <div class="error-banner">
                <p>Something went wrong. Please try again or email us directly:</p>
                <a href="mailto:contact&#64;aladdinlab.net" class="retry-link">contact&#64;aladdinlab.net</a>
              </div>
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
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--card-shadow);
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
      text-decoration: none;
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

    .retry-link {
      display: inline-block;
      margin-top: 8px;
      color: var(--accent);
      font-weight: 600;
      text-decoration: underline;
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
      margin-bottom: 20px;
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

  submitted = signal(false);
  submitting = signal(false);
  error = signal(false);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    inquiryType: ['', Validators.required],
    userType: ['', Validators.required],
    companyName: [''],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]]
  });

  get nameCtrl() { return this.form.controls.name; }
  get emailCtrl() { return this.form.controls.email; }
  get typeCtrl() { return this.form.controls.inquiryType; }
  get userTypeCtrl() { return this.form.controls.userType; }
  get companyNameCtrl() { return this.form.controls.companyName; }
  get msgCtrl() { return this.form.controls.message; }

  isCompany = signal(false);

  onUserTypeChange(): void {
    this.updateCompanyField();
    this.form.get('companyName')?.reset();
  }

  private updateCompanyField(): void {
    const userType = this.form.get('userType')?.value;
    this.isCompany.set(userType === 'company');
    const companyNameCtrl = this.form.get('companyName');
    if (userType === 'company') {
      companyNameCtrl?.setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(100)]);
    } else {
      companyNameCtrl?.clearValidators();
    }
    companyNameCtrl?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.error.set(false);

    const raw = this.form.getRawValue();
    const inquiry = {
      ...raw,
      userType: raw.userType as 'individual' | 'company'
    };

    this.service.submitInquiry(inquiry).subscribe({
      next: () => {
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
    this.form.reset({
      inquiryType: '',
      userType: '',
      companyName: '',
      name: '',
      email: '',
      message: ''
    });
    this.isCompany.set(false);
    this.submitted.set(false);
    this.error.set(false);
  }
}