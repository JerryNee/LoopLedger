import { blankState, demoState } from './data';
import type { LedgerState } from './types';

const STORAGE_KEY = 'loopledger-state-v1';

export function loadLedgerState(): LedgerState {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return demoState;

  try {
    return JSON.parse(raw) as LedgerState;
  } catch {
    return demoState;
  }
}

export function saveLedgerState(state: LedgerState): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearLedgerState(): LedgerState {
  window.localStorage.removeItem(STORAGE_KEY);
  return blankState;
}

export function restoreDemoState(): LedgerState {
  saveLedgerState(demoState);
  return demoState;
}
