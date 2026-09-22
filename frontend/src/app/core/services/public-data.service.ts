import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Profile } from '../models/profile.model';
import { Education } from '../models/education.model';
import { Experience } from '../models/experience.model';
import { Certification } from '../models/certification.model';
import { Skill } from '../models/skill.model';
import { SocialLink } from '../models/social-link.model';
import { ContactMessage } from '../models/contact-message.model';

@Injectable({ providedIn: 'root' })
export class PublicDataService {
  private base = `${environment.apiUrl}/public`;

  constructor(private http: HttpClient) {}

  // Returns null when backend sends 204 No Content (no profile saved yet),
  // so the public homepage can gracefully show placeholder text instead of crashing.
  getProfile(): Observable<Profile | null> {
    return this.http.get<Profile>(`${this.base}/profile`, { observe: 'response' }).pipe(
      map(res => (res.status === 204 || res.body === null) ? null : res.body)
    );
  }

  getEducation(): Observable<Education[]> {
    return this.http.get<Education[]>(`${this.base}/education`);
  }

  getExperience(): Observable<Experience[]> {
    return this.http.get<Experience[]>(`${this.base}/experience`);
  }

  getCertifications(): Observable<Certification[]> {
    return this.http.get<Certification[]>(`${this.base}/certifications`);
  }

  getSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.base}/skills`);
  }

  getSocialLinks(): Observable<SocialLink[]> {
    return this.http.get<SocialLink[]>(`${this.base}/social-links`);
  }

  submitContactMessage(message: ContactMessage): Observable<void> {
    return this.http.post<void>(`${this.base}/contact`, message);
  }
}
