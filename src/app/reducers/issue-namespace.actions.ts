import { createAction, props } from '@ngrx/store';
import { Issue, IssueType, IssueRelation, IssueLabel, IssueLocation, IssueComment } from './state';

export interface IssuePartial {

    id?: string;

    title?: string;
    textBody?: string;
    htmlBody?: string;
    type?: IssueType;
    isOpen?: boolean;
    relatedIssues?: IssueRelation[];
    labels?: IssueLabel[];
    comments?: IssueComment[];
}

export const setIssues = createAction('[Issues] Set Issue List', props<{issues: Issue[]}>());
export const addIssue = createAction('[Issues] Add Issue', props<{issueId: string, issue: IssuePartial}>());
export const removeIssue = createAction('[Issues] Remove Issue', props<{issueId: string}>());
export const updateIssue = createAction('[Issues] Update Issue', props<{issueId: string, issue: IssuePartial}>());

export const addIssueRelationToIssue = createAction('[Issues] Add Issue Relation To Issue', props<{issueId: string, issueRelation: IssueRelation}>());
export const removeIssueRelationFromIssue = createAction('[Issues] Remove Issue Relation From Issue', props<{issueId: string, issueRelation: IssueRelation}>());

