import { blankState, demoState, starterState } from './data';
import type { LedgerState } from './types';

const STORAGE_KEY = 'loopledger-state-v2';

function cloneState(state: LedgerState): LedgerState {
  return JSON.parse(JSON.stringify(state)) as LedgerState;
}

function normalizeState(state: LedgerState): LedgerState {
  return {
    project: {
      ...starterState.project,
      ...state.project,
    },
    requirements: Array.isArray(state.requirements) ? state.requirements : [],
    runs: Array.isArray(state.runs) ? state.runs : [],
    entries: Array.isArray(state.entries) ? state.entries : [],
  };
}

export function loadLedgerState(): LedgerState {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return cloneState(starterState);

  try {
    return normalizeState(JSON.parse(raw) as LedgerState);
  } catch {
    return cloneState(starterState);
  }
}

export function saveLedgerState(state: LedgerState): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearLedgerState(): LedgerState {
  window.localStorage.removeItem(STORAGE_KEY);
  return cloneState(blankState);
}

export function restoreDemoState(): LedgerState {
  saveLedgerState(demoState);
  return cloneState(demoState);
}
