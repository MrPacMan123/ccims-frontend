import { State, ProjectsState, IssuesState } from './state';
import { selectProjects } from './projects.selector';
import { createSelector } from '@ngrx/store';

export const selectIssues = (state: State) => state.issues;

export const selectIssuesState = createSelector(
    selectIssues,
    (issues: IssuesState) => {
        return issues;
    }
);

export const selectSingleIssue = createSelector(
    selectIssues,
    (issues: IssuesState, props: string) => {
        if (issues[props] != null) {
            return issues[props];
        }
        return null;
    }
);
