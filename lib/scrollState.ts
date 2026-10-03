'use client';

import { clamp } from './motion';

/**
 * The page's single scroll/pointer tracker. Values live outside React so
 * scrolling never re-renders anything by itself; consumers either read them in
 * their own frame loops or subscribe with `onScrollStateChange`.
 */
export const scrollState = {
  scrollY: 0,
  /** 0 at the top of the page, 1 at the bottom. */
  page: 0,
  /** 0 at top of page, 1 once the hero has fully scrolled away. */
  hero: 0,
  /** 0 until the contact section enters, 1 once it fills the viewport. */
  contact: 0,
  /** Pointer position normalised to -1..1. */
  pointerX: 0,
  pointerY: 0,
};

let subscribers = 0;
let frame = 0;
const listeners = new Set<() => void>();

function measure() {
  frame = 0;
  const vh = window.innerHeight || 1;
  const max = document.documentElement.scrollHeight - vh;
  scrollState.scrollY = window.scrollY;
  scrollState.page = max > 0 ? clamp(window.scrollY / max) : 0;

  const hero = document.getElementById('home');
  scrollState.hero = hero ? clamp(window.scrollY / Math.max(hero.offsetHeight, 1)) : 0;
  const contact = document.getElementById('contact');
  if (contact) scrollState.contact = clamp((vh - contact.getBoundingClientRect().top) / vh);

  listeners.forEach((listener) => listener());
}

const schedule = () => {
  if (!frame) frame = requestAnimationFrame(measure);
};

const onPointer = (e: PointerEvent) => {
  scrollState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
  scrollState.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
};

function start() {
  if (subscribers++ > 0) return;
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('pointermove', onPointer, { passive: true });
  measure();
}

function stop() {
  if (--subscribers > 0) return;
  window.removeEventListener('scroll', schedule);
  window.removeEventListener('resize', schedule);
  window.removeEventListener('pointermove', onPointer);
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
}

/**
 * Keeps the tracker running for as long as the caller needs it and, if given a
 * listener, calls it after every measurement (and once immediately).
 * Returns an unsubscribe function.
 */
export function onScrollStateChange(listener?: () => void): () => void {
  start();
  if (listener) {
    listeners.add(listener);
    listener();
  }
  return () => {
    if (listener) listeners.delete(listener);
    stop();
  };
}
