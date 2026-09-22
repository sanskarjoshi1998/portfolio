import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

/**
 * Usage: <section appAnimateOnScroll> or <div appAnimateOnScroll animDelay="200">
 * Adds the CSS class "is-visible" once the element enters the viewport.
 * The actual animation is defined in styles.css via the [data-anim] + .is-visible selectors.
 */
@Directive({
  selector: '[appAnimateOnScroll]',
  standalone: true
})
export class AnimateOnScrollDirective implements OnInit, OnDestroy {

  /** Optional delay in ms before the animation fires (for staggered children) */
  @Input() animDelay = 0;

  /** Animation variant: 'fade-up' | 'fade-left' | 'fade-right' | 'scale-in' */
  @Input() animType: 'fade-up' | 'fade-left' | 'fade-right' | 'scale-in' = 'fade-up';

  private observer!: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const el = this.el.nativeElement;
    el.setAttribute('data-anim', this.animType);

    if (this.animDelay > 0) {
      el.style.animationDelay = `${this.animDelay}ms`;
      el.style.transitionDelay = `${this.animDelay}ms`;
    }

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          // Once visible, stop observing — no need to re-animate
          this.observer.unobserve(el);
        }
      },
      { threshold: 0.12 }   // trigger when 12% of the element is in view
    );

    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
