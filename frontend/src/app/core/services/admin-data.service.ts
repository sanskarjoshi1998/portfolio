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
export class AdminDataService {
  private base = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  // Profile
  // observe:'response' lets us detect 204 No Content (no profile saved yet) vs 200 with data.
  // Returns null when the backend sends 204 so the form correctly starts blank.
  getProfile(): Observable<Profile | null> {
    return this.http.get<Profile>(`${this.base}/profile`, { observe: 'response' }).pipe(
      map(res => (res.status === 204 || res.body === null) ? null : res.body)
    );
  }
  saveProfile(profile: Profile): Observable<Profile> {
    return this.http.put<Profile>(`${this.base}/profile`, profile);
  }

  // Education
  getEducation(): Observable<Education[]> {
    return this.http.get<Education[]>(`${this.base}/education`);
  }
  createEducation(item: Education): Observable<Education> {
    return this.http.post<Education>(`${this.base}/education`, item);
  }
  updateEducation(id: number, item: Education): Observable<Education> {
    return this.http.put<Education>(`${this.base}/education/${id}`, item);
  }
  deleteEducation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/education/${id}`);
  }

  // Experience
  getExperience(): Observable<Experience[]> {
    return this.http.get<Experience[]>(`${this.base}/experience`);
  }
  createExperience(item: Experience): Observable<Experience> {
    return this.http.post<Experience>(`${this.base}/experience`, item);
  }
  updateExperience(id: number, item: Experience): Observable<Experience> {
    return this.http.put<Experience>(`${this.base}/experience/${id}`, item);
  }
  deleteExperience(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/experience/${id}`);
  }

  // Certifications
  getCertifications(): Observable<Certification[]> {
    return this.http.get<Certification[]>(`${this.base}/certifications`);
  }
  createCertification(item: Certification): Observable<Certification> {
    return this.http.post<Certification>(`${this.base}/certifications`, item);
  }
  updateCertification(id: number, item: Certification): Observable<Certification> {
    return this.http.put<Certification>(`${this.base}/certifications/${id}`, item);
  }
  deleteCertification(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/certifications/${id}`);
  }

  // Skills
  getSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.base}/skills`);
  }
  createSkill(item: Skill): Observable<Skill> {
    return this.http.post<Skill>(`${this.base}/skills`, item);
  }
  updateSkill(id: number, item: Skill): Observable<Skill> {
    return this.http.put<Skill>(`${this.base}/skills/${id}`, item);
  }
  deleteSkill(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/skills/${id}`);
  }

  // Social Links
  getSocialLinks(): Observable<SocialLink[]> {
    return this.http.get<SocialLink[]>(`${this.base}/social-links`);
  }
  createSocialLink(item: SocialLink): Observable<SocialLink> {
    return this.http.post<SocialLink>(`${this.base}/social-links`, item);
  }
  updateSocialLink(id: number, item: SocialLink): Observable<SocialLink> {
    return this.http.put<SocialLink>(`${this.base}/social-links/${id}`, item);
  }
  deleteSocialLink(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/social-links/${id}`);
  }

  // Contact messages
  getContactMessages(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(`${this.base}/contact-messages`);
  }
  markMessageRead(id: number): Observable<ContactMessage> {
    return this.http.patch<ContactMessage>(`${this.base}/contact-messages/${id}/read`, {});
  }
  deleteMessage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/contact-messages/${id}`);
  }
}
