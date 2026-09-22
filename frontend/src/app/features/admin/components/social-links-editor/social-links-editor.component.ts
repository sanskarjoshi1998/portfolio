import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService } from '../../../../core/services/admin-data.service';
import { SocialLink } from '../../../../core/models/social-link.model';

const EMPTY: SocialLink = { platform: '', url: '', iconName: '' };

@Component({
  selector: 'app-social-links-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './social-links-editor.component.html'
})
export class SocialLinksEditorComponent implements OnInit {
  items = signal<SocialLink[]>([]);
  form: SocialLink = { ...EMPTY };
  editingId: number | null = null;
  isSaving = signal(false);

  constructor(private adminData: AdminDataService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.adminData.getSocialLinks().subscribe((data) => this.items.set(data));
  }

  edit(item: SocialLink): void {
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
      ? this.adminData.updateSocialLink(this.editingId, this.form)
      : this.adminData.createSocialLink(this.form);

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
    if (!confirm('Delete this social link?')) return;
    this.adminData.deleteSocialLink(id).subscribe(() => this.load());
  }
}
