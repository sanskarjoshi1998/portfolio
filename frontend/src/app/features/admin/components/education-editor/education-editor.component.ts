import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService } from '../../../../core/services/admin-data.service';
import { Education } from '../../../../core/models/education.model';

const EMPTY: Education = { institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', description: '', grade: '' };

@Component({
  selector: 'app-education-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './education-editor.component.html'
})
export class EducationEditorComponent implements OnInit {
  items = signal<Education[]>([]);
  form: Education = { ...EMPTY };
  editingId: number | null = null;
  isSaving = signal(false);

  constructor(private adminData: AdminDataService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.adminData.getEducation().subscribe((data) => this.items.set(data));
  }

  edit(item: Education): void {
    this.form = { ...item };
    this.editingId = item.id ?? null;
  }

  resetForm(): void {
    this.form = { ...EMPTY };
    this.editingId = null;
  }

  save(): void {
    this.isSaving.set(true);
    const request = this.editingId
      ? this.adminData.updateEducation(this.editingId, this.form)
      : this.adminData.createEducation(this.form);

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
    if (!confirm('Delete this education entry?')) return;
    this.adminData.deleteEducation(id).subscribe(() => this.load());
  }
}
