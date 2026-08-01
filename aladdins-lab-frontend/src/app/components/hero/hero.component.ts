import { Component, signal, inject, computed, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '@google/model-viewer';
import { SupabaseService } from '../../services/supabase.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  private supabaseService = inject(SupabaseService);
  protected supabase = this.supabaseService;

  @ViewChild('heroSection') private heroSection!: ElementRef<HTMLElement>;

  authLoading = signal(false);
  speechText = signal('');
  isScreenCracked = signal(false);
  isRepairing = signal(false);
  crackX = signal(0);
  crackY = signal(0);

  private viewer: any = null;
  private rafId: number | null = null;
  private lastMouseMove = 0;
  private targetOrbit = { theta: 0, phi: 72 };

  private speechTimer: any = null;
  private rageTimer: any = null;
  private timeline: gsap.core.Timeline | null = null;
  private scrollTriggers: ScrollTrigger[] = [];
  private cleanupFns: (() => void)[] = [];
  private audioCtx: AudioContext | null = null;
  private clickTimes: number[] = [];

  private reactionMessages = [
    "Hey! Don't push me! 🤖",
    "Stop spinning me, I get dizzy! 😵‍💫",
    "Ready to build something awesome today? 🛠️"
  ];

  private sectionMessages: Record<string, string> = {
    hero: "Welcome to Aladdin's Lab! Explore 3D Printing & Robotics 🚀",
    videos: 'Looking to learn? Watch our hands-on tutorials! 🎥',
    deals: 'Save money! Use code ALADDIN10 on 3D printers & IoT boards 💸'
  };

  currentUser = computed(() => this.supabase.currentUser());
  profile = computed(() => this.supabase.profile());

  displayName = computed(() => {
    const p = this.profile();
    if (p?.full_name) return p.full_name;
    const u = this.currentUser();
    return u?.user_metadata?.['full_name'] ?? u?.user_metadata?.['name'] ?? u?.email ?? 'Member';
  });

  avatarUrl = computed(() => {
    return this.supabase.profile()?.avatar_url
      ?? this.supabase.currentUser()?.user_metadata?.['picture']
      ?? '';
  });

  async loginWithGoogle(): Promise<void> {
    this.authLoading.set(true);
    await this.supabase.signInWithGoogle();
    this.authLoading.set(false);
  }

  ngAfterViewInit(): void {
    this.initModelViewerTracking();
    this.initRobotInteractions();
    this.initScrollCinematics();
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
    clearTimeout(this.speechTimer);
    window.clearTimeout(this.rageTimer);
    void this.audioCtx?.close();
    this.audioCtx = null;
    this.killScrollTimeline();
    this.scrollTriggers.forEach(st => st.kill());
    this.scrollTriggers = [];
    this.cleanupFns.forEach(fn => fn());
    this.cleanupFns = [];
    this.viewer = null;
  }

  private showSpeech(text: string, duration = 3500): void {
    this.speechText.set(text);
    clearTimeout(this.speechTimer);
    this.speechTimer = setTimeout(() => this.speechText.set(''), duration);
  }

  private initModelViewerTracking(): void {
    const viewer = this.heroSection.nativeElement.querySelector('model-viewer') as any;
    if (!viewer) return;
    this.viewer = viewer;

    const onMove = (e: MouseEvent): void => {
      this.lastMouseMove = Date.now();
      const rect = this.heroSection.nativeElement.getBoundingClientRect();
      const nx = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      const ny = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
      this.targetOrbit.theta = -20 + nx * 40;
      this.targetOrbit.phi = 57 + (1 - ny) * 30;
    };
    this.heroSection.nativeElement.addEventListener('mousemove', onMove);
    this.cleanupFns.push(() => this.heroSection.nativeElement.removeEventListener('mousemove', onMove));

    const tick = (): void => {
      if (this.viewer && this.viewer.userAction === null) {
        if (Date.now() - this.lastMouseMove > 2000) {
          this.targetOrbit.theta = Math.sin(Date.now() / 2200) * 8;
          this.targetOrbit.phi = 72 + Math.sin(Date.now() / 1600) * 5;
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
  }

  private initRobotInteractions(): void {
    const container = this.heroSection.nativeElement.querySelector('.hero-3d-container') as HTMLElement;
    const stage = container?.querySelector('.robot-stage') as HTMLElement | null;
    if (!container) return;

    const onInteract = (e: MouseEvent): void => {
      if (stage) {
        stage.classList.remove('wobble');
        void stage.offsetWidth;
        stage.classList.add('wobble');
        setTimeout(() => stage.classList.remove('wobble'), 600);
      }

      const now = Date.now();
      this.clickTimes = this.clickTimes.filter(t => now - t < 1500);
      this.clickTimes.push(now);

      if (this.clickTimes.length >= 3) {
        this.clickTimes = [];
        this.triggerScreenCrack(e.clientX, e.clientY);
        return;
      }

      this.playBeep();
      const msg = this.reactionMessages[Math.floor(Math.random() * this.reactionMessages.length)];
      this.showSpeech(msg);
    };
    container.addEventListener('click', onInteract);
    this.cleanupFns.push(() => container.removeEventListener('click', onInteract));
  }

  private ensureAudio(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const win = window as any;
    const Ctor: typeof AudioContext | undefined = win.AudioContext || win.webkitAudioContext;
    if (!Ctor) return null;
    if (!this.audioCtx) {
      this.audioCtx = new Ctor();
    }
    if (this.audioCtx.state === 'suspended') {
      void this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  private playBeep(): void {
    const ctx = this.ensureAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(1320, now + 0.06);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.22, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  private playShatter(): void {
    const ctx = this.ensureAudio();
    if (!ctx) return;
    const now = ctx.currentTime;

    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.7), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(6000, now);
    bandpass.frequency.exponentialRampToValueAtTime(700, now + 0.5);
    bandpass.Q.value = 0.8;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    src.connect(bandpass).connect(gain).connect(ctx.destination);
    src.start(now);
    src.stop(now + 0.65);
  }

  private triggerScreenCrack(x: number, y: number): void {
    this.playShatter();
    this.crackX.set(x);
    this.crackY.set(y);
    this.isRepairing.set(false);
    this.isScreenCracked.set(true);
    this.showSpeech('HEY! YOU BROKE MY SCREEN! 🔨💥', 3500);

    window.clearTimeout(this.rageTimer);
    this.rageTimer = window.setTimeout(() => {
      this.isRepairing.set(true);
      window.setTimeout(() => {
        this.isScreenCracked.set(false);
        this.isRepairing.set(false);
      }, 600);
    }, 3000);
  }

  private resizeTimer: any = null;

  private initScrollCinematics(): void {
    const retry = (): void => {
      const videos = document.getElementById('videos');
      const deals = document.getElementById('deals');
      if (!videos || !deals) {
        const t = window.setTimeout(retry, 100);
        this.cleanupFns.push(() => clearTimeout(t));
        return;
      }
      this.buildScrollTimeline();
      this.buildScrollMilestones();
    };

    const t = window.setTimeout(retry, 100);
    this.cleanupFns.push(() => clearTimeout(t));

    const onResize = (): void => {
      window.clearTimeout(this.resizeTimer);
      this.resizeTimer = window.setTimeout(() => {
        const videos = document.getElementById('videos');
        const deals = document.getElementById('deals');
        if (videos && deals) {
          this.buildScrollTimeline();
          ScrollTrigger.refresh();
        }
      }, 150);
    };
    window.addEventListener('resize', onResize);
    this.cleanupFns.push(() => window.removeEventListener('resize', onResize));
  }

  private killScrollTimeline(): void {
    if (this.timeline) {
      this.timeline.scrollTrigger?.kill();
      this.timeline.kill();
      this.timeline = null;
    }
  }

  private buildScrollTimeline(): void {
    const el = this.heroSection.nativeElement.querySelector('.hero-3d-container') as HTMLElement | null;
    const videos = document.getElementById('videos');
    const deals = document.getElementById('deals');
    if (!el || !videos || !deals) return;

    this.killScrollTimeline();

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    gsap.set(el, { x: 0, y: 0, scale: 1, rotation: 0 });
    const base = el.getBoundingClientRect();
    const baseW = base.width;
    const baseH = base.height;
    const baseCenterX = base.left + baseW / 2;
    const baseCenterY = base.top + baseH / 2;

    const scrollRange = document.documentElement.scrollHeight - vh;
    if (scrollRange <= 0) return;

    const pageTop = (target: HTMLElement): number => target.getBoundingClientRect().top + window.scrollY;

    const anchorPose = (
      anchor: HTMLElement,
      viewY: number,
      maxScale: number
    ): { x: number; y: number; scale: number; at: number } => {
      const r = anchor.getBoundingClientRect();
      const docTop = r.top + window.scrollY;
      const scale = Math.max(0.4, Math.min(r.width / baseW, r.height / baseH, maxScale));
      return {
        x: r.left + r.width / 2 - baseCenterX,
        y: viewY + r.height / 2 - baseCenterY,
        scale,
        at: Math.max(1, Math.min(docTop - viewY, scrollRange))
      };
    };

    const videosTarget = document.getElementById('robot-target-videos');
    const dealsTarget = document.getElementById('robot-target-deals');
    const useAnchors = vw >= 1200 && !!videosTarget && !!dealsTarget;

    let phase1: { x: number; y: number; scale: number };
    let zig: { x: number; y: number; scale: number };
    let phase2: { x: number; y: number; scale: number };
    let phase3: { x: number; y: number; scale: number };
    let S1: number;
    let S2: number;
    let SZ: number;

    if (useAnchors) {
      const vPose = anchorPose(videosTarget as HTMLElement, vh * 0.3, 0.85);
      const dPose = anchorPose(dealsTarget as HTMLElement, vh * 0.3, 0.85);
      S1 = vPose.at;
      S2 = Math.max(S1 + 300, dPose.at);
      SZ = S1 + (S2 - S1) * 0.5;
      phase1 = { x: vPose.x, y: vPose.y, scale: vPose.scale };
      phase2 = { x: dPose.x, y: dPose.y, scale: dPose.scale };
      zig = {
        x: (vPose.x + dPose.x) / 2,
        y: (vPose.y + dPose.y) / 2 + vh * 0.16,
        scale: (vPose.scale + dPose.scale) / 2
      };
      phase3 = {
        x: vw - (baseW * 0.65) / 2 - 20 - baseCenterX,
        y: vh * 0.8 - baseCenterY,
        scale: 0.65
      };
    } else {
      const vTop = Math.min(pageTop(videos), scrollRange);
      const dTop = Math.min(pageTop(deals), scrollRange);
      S1 = Math.max(1, vTop);
      S2 = Math.max(S1 + 300, dTop);
      SZ = S1 + (S2 - S1) * 0.5;
      phase1 = { x: 0, y: vh * 0.55 - baseCenterY, scale: 0.5 };
      zig = { x: 0, y: vh * 0.65 - baseCenterY, scale: 0.5 };
      phase2 = { x: 0, y: vh * 0.72 - baseCenterY, scale: 0.5 };
      phase3 = { x: 0, y: vh * 0.8 - baseCenterY, scale: 0.5 };
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2
      }
    });

    tl.to(el, { ...phase1, rotation: -8, duration: Math.max(1, S1), ease: 'power1.inOut' }, 0)
      .to(el, { ...zig, rotation: 8, duration: Math.max(1, SZ - S1), ease: 'power1.inOut' }, S1)
      .to(el, { ...phase2, rotation: -6, duration: Math.max(1, S2 - SZ), ease: 'power1.inOut' }, SZ)
      .to(el, { ...phase3, rotation: 0, duration: Math.max(1, scrollRange - S2), ease: 'power1.inOut' }, S2);

    this.timeline = tl;
  }

  private buildScrollMilestones(): void {
    const show = (key: string): void => this.showSpeech(this.sectionMessages[key]);

    const videos = document.getElementById('videos')!;
    const deals = document.getElementById('deals')!;

    this.scrollTriggers.push(
      ScrollTrigger.create({
        trigger: videos,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => show('videos'),
        onEnterBack: () => show('hero')
      })
    );

    this.scrollTriggers.push(
      ScrollTrigger.create({
        trigger: deals,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => show('deals'),
        onEnterBack: () => show('videos')
      })
    );

    show('hero');
  }
}
