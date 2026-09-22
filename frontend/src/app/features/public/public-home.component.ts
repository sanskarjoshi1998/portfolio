import { Component, OnInit, OnDestroy, signal, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { AnimateOnScrollDirective } from '../../shared/directives/animate-on-scroll.directive';
import { PublicDataService } from '../../core/services/public-data.service';
import { Profile } from '../../core/models/profile.model';
import { Education } from '../../core/models/education.model';
import { Experience } from '../../core/models/experience.model';
import { Certification } from '../../core/models/certification.model';
import { Skill } from '../../core/models/skill.model';
import { SocialLink } from '../../core/models/social-link.model';
import { ContactMessage } from '../../core/models/contact-message.model';

interface Particle { x:number; y:number; vx:number; vy:number; r:number; a:number; }

@Component({
  selector: 'app-public-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, AnimateOnScrollDirective],
  templateUrl: './public-home.component.html',
  styleUrl: './public-home.component.css'
})
export class PublicHomeComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('particleCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  profile    = signal<Profile | null>(null);
  education  = signal<Education[]>([]);
  experience = signal<Experience[]>([]);
  certifications = signal<Certification[]>([]);
  skills     = signal<Skill[]>([]);
  socialLinks = signal<SocialLink[]>([]);

  contactForm: ContactMessage = { senderName:'', senderEmail:'', message:'' };
  contactStatus = signal<'idle'|'sending'|'sent'|'error'>('idle');

  typedText  = signal('');
  currentYear = new Date().getFullYear();

  private readonly TITLES = ['Full Stack Developer','Spring Boot Expert','Angular Enthusiast','Cloud Builder'];
  private titleIdx = 0;
  private charIdx = 0;
  private deleting = false;
  private typeInterval: any;
  private rafId: any;
  private particles: Particle[] = [];
  private resizeHandler: any;

  private readonly CAT_COLORS: Record<string,string> = {
    Backend:'#5b8cff', Frontend:'#a78bfa', Database:'#34d399',
    DevOps:'#fb923c', Tools:'#f472b6', Other:'#9aa3b2'
  };

  constructor(private dataService: PublicDataService) {}

  ngOnInit(): void {
    this.dataService.getProfile().subscribe({ next: p => this.profile.set(p), error: () => {} });

    this.dataService.getExperience().subscribe(data =>
      this.experience.set([...data].sort((a,b) => {
        if (a.currentlyWorking && !b.currentlyWorking) return -1;
        if (!a.currentlyWorking && b.currentlyWorking) return 1;
        return (b.startDate||'').localeCompare(a.startDate||'');
      })));

    this.dataService.getEducation().subscribe(data =>
      this.education.set([...data].sort((a,b) => (b.endDate||'').localeCompare(a.endDate||''))));

    this.dataService.getCertifications().subscribe(data =>
      this.certifications.set([...data].sort((a,b) => (b.issueDate||'').localeCompare(a.issueDate||''))));

    this.dataService.getSkills().subscribe(data => this.skills.set(data));
    this.dataService.getSocialLinks().subscribe(data => this.socialLinks.set(data));

    this.startTypewriter();
  }

  ngAfterViewInit(): void {
    this.initParticles();
  }

  ngOnDestroy(): void {
    clearInterval(this.typeInterval);
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.resizeHandler);
  }

  private startTypewriter(): void {
    this.typeInterval = setInterval(() => {
      const title = this.TITLES[this.titleIdx];
      if (!this.deleting) {
        this.typedText.set(title.slice(0, ++this.charIdx));
        if (this.charIdx === title.length) setTimeout(() => this.deleting = true, 1800);
      } else {
        this.typedText.set(title.slice(0, --this.charIdx));
        if (this.charIdx === 0) {
          this.deleting = false;
          this.titleIdx = (this.titleIdx + 1) % this.TITLES.length;
        }
      }
    }, 80);
  }

  private initParticles(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    this.resizeHandler = resize;
    window.addEventListener('resize', this.resizeHandler);

    this.particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.4 + 0.4, a: Math.random() * 0.6 + 0.1
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(91,140,255,${p.a})`; ctx.fill();
      });
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const dx = this.particles[i].x - this.particles[j].x;
          const dy = this.particles[i].y - this.particles[j].y;
          const d = Math.sqrt(dx*dx + dy*dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(this.particles[i].x, this.particles[i].y);
            ctx.lineTo(this.particles[j].x, this.particles[j].y);
            ctx.strokeStyle = `rgba(91,140,255,${0.06*(1-d/120)})`;
            ctx.stroke();
          }
        }
      }
      this.rafId = requestAnimationFrame(draw);
    };
    draw();
  }

  getCategoryColor(category: string): string {
    return this.CAT_COLORS[category] || '#9aa3b2';
  }

  formatDate(d?: string): string {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { month:'short', year:'numeric' });
  }

  formatDateRange(start?: string, end?: string): string {
    return `${this.formatDate(start)} — ${this.formatDate(end) || 'Present'}`;
  }

  submitContact(): void {
    if (!this.contactForm.senderName || !this.contactForm.senderEmail || !this.contactForm.message) return;
    this.contactStatus.set('sending');
    this.dataService.submitContactMessage(this.contactForm).subscribe({
      next: () => { this.contactStatus.set('sent'); this.contactForm = { senderName:'', senderEmail:'', message:'' }; },
      error: () => this.contactStatus.set('error')
    });
  }
}
