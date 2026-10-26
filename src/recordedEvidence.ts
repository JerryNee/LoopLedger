import data from './recordedCase.json';
import { latestChecks, readSnapshots } from './prEvidence';

export const recordedHistory = readSnapshots({ getItem: () => JSON.stringify(data.snapshots) })
  .map(snapshot => ({ ...snapshot, checks: latestChecks(snapshot.checks) }));
export const recordedDescription = data.description;
