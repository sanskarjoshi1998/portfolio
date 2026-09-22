import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService } from '../../../../core/services/admin-data.service';
import { Skill } from '../../../../core/models/skill.model';

const EMPTY: Skill = { name: '', category: '', proficiencyLevel: 80 };

@Component({
  selector: 'app-skills-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './skills-editor.component.html'
})
export class SkillsEditorComponent implements OnInit {
  items = signal<Skill[]>([]);
  form: Skill = { ...EMPTY };
  editingId: number | null = null;
  isSaving = signal(false);

  constructor(private adminData: AdminDataService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.adminData.getSkills().subscribe((data) => this.items.set(data));
  }

  edit(item: Skill): void {
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
      ? this.adminData.updateSkill(this.editingId, this.form)
      : this.adminData.createSkill(this.form);

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
    if (!confirm('Delete this skill?')) return;
    this.adminData.deleteSkill(id).subscribe(() => this.load());
  }
}
