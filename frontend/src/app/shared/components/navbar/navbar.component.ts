import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar" [class.scrolled]="scrolled()">
      <div class="nav-inner">
        <a href="#home" class="logo">
          <span class="logo-bracket">&lt;</span>Portfolio<span class="logo-bracket">&gt;</span>
        </a>
        <div class="nav-links">
          @for (link of links; track link) {
            <a [href]="'#' + link" [class.active]="activeLink() === link"
               (click)="setActive(link)">{{ link }}</a>
          }
        </div>
        <button class="hamburger" (click)="mobileOpen.set(!mobileOpen())">
          <span></span><span></span><span></span>
        </button>
      </div>
      @if (mobileOpen()) {
        <div class="mobile-menu">
          @for (link of links; track link) {
            <a [href]="'#' + link" (click)="mobileOpen.set(false); setActive(link)">{{ link }}</a>
          }
        </div>
      }
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      padding: 0 32px;
      transition: background 0.4s ease, backdrop-filter 0.4s ease, border-bottom 0.4s ease;
    }
    .navbar.scrolled {
      background: rgba(11,14,20,0.88);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid #1f2530;
    }
    .nav-inner {
      max-width: 1100px; margin: 0 auto; height: 68px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .logo {
      font-weight: 800; font-size: 1.2rem; letter-spacing: -0.03em;
      color: #e8eaed; text-decoration: none;
    }
    .logo-bracket { color: #5b8cff; }
    .nav-links { display: flex; gap: 4px; }
    .nav-links a {
      padding: 8px 14px; border-radius: 8px; font-size: 13px; font-weight: 500;
      text-decoration: none; color: #9aa3b2; text-transform: capitalize;
      border: 1px solid transparent;
      transition: all 0.2s ease;
    }
    .nav-links a:hover { color: #e8eaed; background: #ffffff08; }
    .nav-links a.active {
      color: #5b8cff; background: #5b8cff15; border-color: #5b8cff30;
    }
    .hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 8px; }
    .hamburger span { display: block; width: 22px; height: 2px; background: #9aa3b2; border-radius: 2px; }
    .mobile-menu { display: flex; flex-direction: column; gap: 4px; padding: 12px 0 20px; }
    .mobile-menu a {
      padding: 12px 16px; color: #9aa3b2; text-decoration: none;
      font-size: 15px; font-weight: 500; text-transform: capitalize;
      border-radius: 8px; transition: all 0.2s;
    }
    .mobile-menu a:hover { color: #e8eaed; background: #ffffff08; }
    @media (max-width: 720px) {
      .nav-links { display: none; }
      .hamburger { display: flex; }
    }
  `]
})
export class NavbarComponent implements OnInit {
  links = ['home','experience','education','skills','certifications','contact'];
  scrolled = signal(false);
  activeLink = signal('home');
  mobileOpen = signal(false);

  ngOnInit() {
    window.addEventListener('scroll', () => {
      this.scrolled.set(window.scrollY > 20);
      this.updateActiveLink();
    });
  }

  setActive(link: string) { this.activeLink.set(link); }

  updateActiveLink() {
    for (const link of [...this.links].reverse()) {
      const el = document.getElementById(link);
      if (el && el.getBoundingClientRect().top <= 120) {
        this.activeLink.set(link); return;
      }
    }
    this.activeLink.set('home');
  }
}
