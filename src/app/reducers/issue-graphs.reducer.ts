import { Action, createReducer, on } from '@ngrx/store';
import { IssueGraphsState } from './state';
import { DEMO_INITIAL_STATE } from './demo-state';

const issueGraphsReducer = createReducer(
    DEMO_INITIAL_STATE.issueGraphs,
);

export function reducer(state: IssueGraphsState | undefined, action: Action) {
    return issueGraphsReducer(state, action);
}
