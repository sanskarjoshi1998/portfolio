import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDataService } from '../../../../core/services/admin-data.service';
import { ContactMessage } from '../../../../core/models/contact-message.model';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messages.component.html'
})
export class MessagesComponent implements OnInit {
  messages = signal<ContactMessage[]>([]);

  constructor(private adminData: AdminDataService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.adminData.getContactMessages().subscribe((data) => {
      // Most recent first
      const sorted = [...data].sort((a, b) =>
        (b.submittedAt || '').localeCompare(a.submittedAt || '')
      );
      this.messages.set(sorted);
    });
  }

  markRead(msg: ContactMessage): void {
    if (!msg.id || msg.read) return;
    this.adminData.markMessageRead(msg.id).subscribe(() => this.load());
  }

  remove(id: number | undefined): void {
    if (!id) return;
    if (!confirm('Delete this message?')) return;
    this.adminData.deleteMessage(id).subscribe(() => this.load());
  }
}
