import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService } from '../../../../core/services/admin-data.service';
import { Certification } from '../../../../core/models/certification.model';

const EMPTY: Certification = { name: '', issuingOrganization: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '' };

@Component({
  selector: 'app-certifications-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './certifications-editor.component.html'
})
export class CertificationsEditorComponent implements OnInit {
  items = signal<Certification[]>([]);
  form: Certification = { ...EMPTY };
  editingId: number | null = null;
  isSaving = signal(false);

  constructor(private adminData: AdminDataService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.adminData.getCertifications().subscribe((data) => this.items.set(data));
  }

  edit(item: Certification): void {
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
      ? this.adminData.updateCertification(this.editingId, this.form)
      : this.adminData.createCertification(this.form);

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
    if (!confirm('Delete this certification?')) return;
    this.adminData.deleteCertification(id).subscribe(() => this.load());
  }
}
