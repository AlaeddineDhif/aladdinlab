import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit, signal } from '@angular/core';
import { WorkWithMeFormComponent } from '../../components/work-with-me/work-with-me-form.component';
import '@google/model-viewer';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-work-with-me-page',
  standalone: true,
  imports: [WorkWithMeFormComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="page" id="work-with-me">
      <div class="container page-header">
        <h1>Work With Me</h1>
        <p>Looking for sponsorship, a collaboration partner, or a custom engineering project? Let's talk.</p>
      </div>
      <div class="work-layout">
        <div class="form-area">
          <app-work-with-me-form />
        </div>
        <div class="robot-float">
          <div class="robot-stage">
            <model-viewer
              src="assets/models/robot.gltf"
              alt="Aladdin's Lab 3D Robot"
              disable-zoom
              camera-orbit="0deg 75deg 105%"
              camera-controls
              shadow-intensity="1.5"
              shadow-softness="1"
              exposure="1.2"
              environment-image="neutral"
              stage-light-intensity="2"
              interaction-prompt="auto"
              ar
              style="width: 100%; height: 420px; background: transparent;"
            ></model-viewer>
          </div>
          <div class="speech-bubble" [class.show]="bubbleVisible()">
            <p>{{ currentBubble() }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page {
      padding: clamp(24px, 4vw, 56px) 0;
    }

    .page-header {
      text-align: center;
      max-width: min(640px, 90vw);
      margin: 0 auto;
    }

    .page-header h1 {
      font-size: clamp(1.5rem, 3vw, 2.5rem);
      font-weight: 700;
      margin-bottom: clamp(6px, 1vw, 12px);
    }

    .page-header p {
      color: var(--text-secondary);
      font-size: clamp(0.9rem, 1.4vw, 1.1rem);
    }

    .work-layout {
      display: flex;
      gap: clamp(24px, 4vw, 48px);
      align-items: flex-start;
      max-width: min(1100px, 95vw);
      margin: 0 auto;
    }

    .form-area {
      flex: 1;
      min-width: 0;
    }

    .robot-float {
      flex-shrink: 0;
      width: clamp(280px, 35vw, 400px);
      position: sticky;
      top: clamp(80px, 10vh, 120px);
      align-self: flex-start;
    }

    .robot-stage {
      background: radial-gradient(ellipse at center, rgba(59,130,246,0.06) 0%, transparent 70%);
      border-radius: 24px;
      padding: clamp(16px, 2vw, 28px);
      position: relative;
    }

    model-viewer {
      display: block;
      width: 100%;
      height: 420px;
      --poster-color: transparent;
      cursor: pointer;
    }

    .speech-bubble {
      position: absolute;
      bottom: -14px;
      left: 50%;
      transform: translateX(-50%) translateY(8px);
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 12px 18px;
      max-width: 94%;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      text-align: center;
      z-index: 2;
      opacity: 0;
      transition: opacity 0.4s ease, transform 0.4s ease;
      pointer-events: none;
    }

    .speech-bubble.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    .speech-bubble::after {
      content: '';
      position: absolute;
      top: -8px;
      left: 50%;
      transform: translateX(-50%);
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-bottom: 8px solid #ffffff;
    }

    .speech-bubble p {
      margin: 0;
      font-size: clamp(0.78rem, 1.1vw, 0.88rem);
      color: var(--text);
      line-height: 1.5;
    }

    @media (max-width: 900px) {
      .work-layout {
        flex-direction: column;
        align-items: center;
      }

      .robot-float {
        width: clamp(240px, 50vw, 340px);
        position: relative;
        top: auto;
        order: -1;
      }

      model-viewer {
        height: 340px;
      }

      .speech-bubble {
        bottom: -10px;
      }
    }

    @media (max-width: 480px) {
      .page {
        padding: 16px 0;
      }

      model-viewer {
        height: 280px;
      }

      .robot-stage {
        padding: 12px;
      }

      .speech-bubble {
        padding: 8px 12px;
      }
    }

    @media (min-width: 1600px) {
      .page-header {
        max-width: 800px;
      }
    }
  `]
})
export class WorkWithMePageComponent implements OnInit, OnDestroy {
  private rafId: number | null = null;
  private bubbleInterval: any = null;
  private bubbleTimer: any = null;
  private targetOrbit = { theta: 0, phi: 72 };
  private lastMouseMove = 0;
  private viewer: any = null;
  private mouseMoveHandler: ((e: MouseEvent) => void) | null = null;
  bubbleIndex = 0;
  bubbleVisible = signal(false);
  currentBubble = signal('');

  bubbles: string[] = [
    "Looking for custom IoT hardware, 3D printing design, or embedded engineering? I've got you covered! 🛠️",
    "Fill out the fields below and your message will land straight into Aladdin's inbox! ✉️🚀",
    "Need rapid prototyping with Bambu Lab or STM32/ESP32 firmware? Let's build it! ⚡"
  ];

  ngOnInit(): void {
    this.currentBubble.set(this.bubbles[0]);
    this.initBubbleCycle();
    this.initRobotInteraction();
    this.initScrollAnimation();
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
    if (this.bubbleInterval) {
      clearInterval(this.bubbleInterval);
    }
    if (this.bubbleTimer) {
      clearTimeout(this.bubbleTimer);
    }
    if (this.mouseMoveHandler) {
      window.removeEventListener('mousemove', this.mouseMoveHandler);
    }
    ScrollTrigger.getAll().forEach(st => st.kill());
  }

  private initBubbleCycle(): void {
    this.bubbleInterval = setInterval(() => {
      this.bubbleIndex = (this.bubbleIndex + 1) % this.bubbles.length;
      this.currentBubble.set(this.bubbles[this.bubbleIndex]);
      this.showBubble();
    }, 6000);
  }

  private showBubble(): void {
    this.bubbleVisible.set(true);
    if (this.bubbleTimer) {
      clearTimeout(this.bubbleTimer);
    }
    this.bubbleTimer = setTimeout(() => {
      this.bubbleVisible.set(false);
    }, 5000);
  }

  private triggerBubble(): void {
    this.bubbleIndex = (this.bubbleIndex + 1) % this.bubbles.length;
    this.currentBubble.set(this.bubbles[this.bubbleIndex]);
    this.showBubble();
  }

  private initRobotInteraction(): void {
    const el = document.querySelector('.robot-float');
    if (!el) return;

    const onMove = (e: MouseEvent): void => {
      this.lastMouseMove = Date.now();
      const rect = el.getBoundingClientRect();
      const nx = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      const ny = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
      this.targetOrbit.theta = -15 + nx * 30;
      this.targetOrbit.phi = 65 + (1 - ny) * 25;
    };
    this.mouseMoveHandler = onMove;
    window.addEventListener('mousemove', onMove);

    const tick = (): void => {
      if (this.viewer && this.viewer.userAction === null) {
        if (Date.now() - this.lastMouseMove > 2000) {
          this.targetOrbit.theta = Math.sin(Date.now() / 2500) * 10;
          this.targetOrbit.phi = 72 + Math.sin(Date.now() / 1800) * 6;
        }
        let theta = this.targetOrbit.theta;
        let phi = this.targetOrbit.phi;
        try {
          const orbit = this.viewer.getCameraOrbit?.();
          if (orbit) {
            theta = orbit.theta * (180 / Math.PI);
            phi = orbit.phi * (180 / Math.PI);
          }
        } catch {}
        theta += (this.targetOrbit.theta - theta) * 0.06;
        phi += (this.targetOrbit.phi - phi) * 0.06;
        this.viewer.cameraOrbit = `${theta}deg ${phi}deg 105%`;
      }
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);

    const modelViewer = el.querySelector('model-viewer');
    if (modelViewer) {
      this.viewer = modelViewer;
    }

    el.addEventListener('click', () => this.triggerBubble());

    const formArea = document.querySelector('.form-area');
    if (formArea) {
      const onFocus = (): void => this.triggerBubble();
      formArea.addEventListener('focusin', onFocus);
    }
  }

  private initScrollAnimation(): void {
    const robotEl = document.querySelector('.robot-float');
    if (!robotEl) return;

    ScrollTrigger.create({
      trigger: robotEl,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => this.animateRobot('enter'),
      onLeaveBack: () => this.animateRobot('back'),
    });

    ScrollTrigger.create({
      trigger: '.form-area',
      start: 'top center',
      end: 'bottom center',
      onEnter: () => this.animateRobot('form-enter'),
      onLeaveBack: () => this.animateRobot('form-back'),
    });

    gsap.fromTo(robotEl,
      { opacity: 0, y: 60, rotation: -8 },
      {
        opacity: 1, y: 0, rotation: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: robotEl,
          start: 'top 85%',
          end: 'top 50%',
          scrub: 1.5
        }
      }
    );
  }

  private animateRobot(type: string): void {
    const el = document.querySelector('.robot-stage');
    if (!el) return;

    switch (type) {
      case 'enter':
        gsap.to(el, { rotationY: 12, duration: 0.6, ease: 'power2.out' });
        break;
      case 'back':
        gsap.to(el, { rotationY: 0, duration: 0.6, ease: 'power2.out' });
        break;
      case 'form-enter':
        gsap.to(el, { y: -20, rotationY: -8, duration: 0.5, ease: 'power2.out' });
        break;
      case 'form-back':
        gsap.to(el, { y: 0, rotationY: 0, duration: 0.5, ease: 'power2.out' });
        break;
    }
  }
}