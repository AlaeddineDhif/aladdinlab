import { Component, output, signal, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="modal-backdrop" (click)="close.emit()"></div>
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">Edit Profile</h3>
        <button class="modal-close" (click)="close.emit()" aria-label="Close">&times;</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label" for="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            [(ngModel)]="fullName"
            placeholder="Enter your full name"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input
            type="text"
            [value]="supabase.currentUser()?.email ?? ''"
            class="form-input form-input--disabled"
            disabled
          />
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn--cancel" (click)="close.emit()">Cancel</button>
        <button class="btn btn--save" (click)="save()" [disabled]="saving() || !fullName.trim()">
          @if (saving()) {
            Saving...
          } @else {
            Save Changes
          }
        </button>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 900;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 901;
      width: 90%;
      max-width: 420px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow-lg);
      overflow: hidden;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--border);
    }

    .modal-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text);
    }

    .modal-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: none;
      background: none;
      color: var(--text-secondary);
      font-size: 1.25rem;
      cursor: pointer;
      border-radius: 6px;
      transition: all var(--transition);
    }

    .modal-close:hover {
      background: var(--surface-alt);
      color: var(--text);
    }

    .modal-body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-label {
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .form-input {
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: var(--primary);
      color: var(--text);
      font-size: 0.875rem;
      font-family: inherit;
      outline: none;
      transition: border-color var(--transition);
    }

    .form-input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-glow);
    }

    .form-input--disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 16px 20px;
      border-top: 1px solid var(--border);
    }

    .btn {
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all var(--transition);
    }

    .btn--cancel {
      background: var(--surface-alt);
      color: var(--text);
      border: 1px solid var(--border);
    }

    .btn--cancel:hover {
      background: var(--border);
    }

    .btn--save {
      background: var(--accent);
      color: #fff;
    }

    .btn--save:hover {
      background: var(--accent-hover);
    }

    .btn--save:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class ProfileEditComponent implements OnInit {
  close = output();

  protected supabase = inject(SupabaseService);

  fullName = '';
  saving = signal(false);

  ngOnInit(): void {
    const profile = this.supabase.profile();
    this.fullName = profile?.full_name ?? '';
  }

  async save(): Promise<void> {
    if (!this.fullName.trim()) return;
    this.saving.set(true);
    try {
      await this.supabase.updateProfile({ full_name: this.fullName.trim() });
      this.close.emit();
    } catch {
      // error logged by service
    } finally {
      this.saving.set(false);
    }
  }
}
