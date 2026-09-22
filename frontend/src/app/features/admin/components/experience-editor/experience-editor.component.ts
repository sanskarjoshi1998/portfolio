import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService } from '../../../../core/services/admin-data.service';
import { Experience } from '../../../../core/models/experience.model';

const EMPTY: Experience = { companyName: '', jobTitle: '', location: '', startDate: '', endDate: '', description: '', currentlyWorking: false };

@Component({
  selector: 'app-experience-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './experience-editor.component.html'
})
export class ExperienceEditorComponent implements OnInit {
  items = signal<Experience[]>([]);
  form: Experience = { ...EMPTY };
  editingId: number | null = null;
  isSaving = signal(false);

  constructor(private adminData: AdminDataService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.adminData.getExperience().subscribe((data) => this.items.set(data));
  }

  edit(item: Experience): void {
    this.form = { ...item };
    this.editingId = item.id ?? null;
  }

  resetForm(): void {
    this.form = { ...EMPTY };
    this.editingId = null;
  }

  save(): void {
    if (this.form.currentlyWorking) {
      this.form.endDate = undefined;
    }

    this.isSaving.set(true);
    const request = this.editingId
      ? this.adminData.updateExperience(this.editingId, this.form)
      : this.adminData.createExperience(this.form);

    request.subscribe({
      next: () => {
        this.isSaving.set(false);
        this.resetForm();
        this.load();
      },
      error: () => this.isSaving.set(false)
    });
  }

  remove(id: number | undefined): void {
    if (!id) return;
    if (!confirm('Delete this experience entry?')) return;
    this.adminData.deleteExperience(id).subscribe(() => this.load());
  }
}
