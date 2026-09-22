import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService } from '../../../../core/services/admin-data.service';
import { Profile } from '../../../../core/models/profile.model';

@Component({
  selector: 'app-profile-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-editor.component.html'
})
export class ProfileEditorComponent implements OnInit {

  // Separate loading state so the template can show a spinner while the HTTP call is in-flight.
  isLoading = signal(true);

  // The form model — starts as an empty-but-valid object.
  // Populated from the API response if a profile already exists.
  profile: Profile = {
    fullName: '',
    title: '',
    summary: '',
    city: '',
    country: '',
    email: '',
    phone: '',
    profileImageUrl: '',
    resumeFileUrl: ''
  };

  isSaving = signal(false);
  savedRecently = signal(false);
  loadError = signal(false);

  constructor(private adminData: AdminDataService) {}

  ngOnInit(): void {
    this.adminData.getProfile().subscribe({
      next: (p) => {
        // p is null  → backend returned 204 (no profile saved yet); leave blank form as-is.
        // p is Profile → populate every form field with existing data.
        if (p !== null) {
          this.profile = { ...p };
        }
        this.isLoading.set(false);
      },
      error: () => {
        // Network error or unexpected server error — show a message but still allow saving.
        this.isLoading.set(false);
        this.loadError.set(true);
      }
    });
  }

  save(): void {
    if (!this.profile.fullName?.trim()) return;

    this.isSaving.set(true);
    this.savedRecently.set(false);

    this.adminData.saveProfile(this.profile).subscribe({
      next: (saved) => {
        this.profile = { ...saved };
        this.isSaving.set(false);
        this.savedRecently.set(true);
        setTimeout(() => this.savedRecently.set(false), 2500);
      },
      error: () => this.isSaving.set(false)
    });
  }
}
