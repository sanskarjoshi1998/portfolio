import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ProfileEditorComponent } from '../profile-editor/profile-editor.component';
import { EducationEditorComponent } from '../education-editor/education-editor.component';
import { ExperienceEditorComponent } from '../experience-editor/experience-editor.component';
import { SkillsEditorComponent } from '../skills-editor/skills-editor.component';
import { CertificationsEditorComponent } from '../certifications-editor/certifications-editor.component';
import { SocialLinksEditorComponent } from '../social-links-editor/social-links-editor.component';
import { MessagesComponent } from '../messages/messages.component';

type Tab = 'profile' | 'experience' | 'education' | 'skills' | 'certifications' | 'social' | 'messages';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ProfileEditorComponent,
    EducationEditorComponent,
    ExperienceEditorComponent,
    SkillsEditorComponent,
    CertificationsEditorComponent,
    SocialLinksEditorComponent,
    MessagesComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  activeTab = signal<Tab>('profile');

  tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'profile', label: 'Profile', icon: 'fa-id-card' },
    { id: 'experience', label: 'Experience', icon: 'fa-briefcase' },
    { id: 'education', label: 'Education', icon: 'fa-graduation-cap' },
    { id: 'skills', label: 'Skills', icon: 'fa-code' },
    { id: 'certifications', label: 'Certifications', icon: 'fa-certificate' },
    { id: 'social', label: 'Social Links', icon: 'fa-share-nodes' },
    { id: 'messages', label: 'Messages', icon: 'fa-envelope' }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  selectTab(tab: Tab): void {
    this.activeTab.set(tab);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }

  viewSite(): void {
    this.router.navigate(['/']);
  }
}
