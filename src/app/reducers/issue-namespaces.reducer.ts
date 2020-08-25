import { Action, createReducer, on } from '@ngrx/store';
import { Issue, IssueType, IssueRelation, IssueLocation, IssuesState } from './state';
import { DEMO_INITIAL_STATE } from './demo-state';
import { IssuePartial, addIssue, removeIssue, updateIssue, addIssueRelationToIssue, removeIssueRelationFromIssue } from './issue-namespace.actions';

function newIssueBase(): Issue {
    return {
        id: null,
        title: null,
        type: IssueType.UNCLASSIFIED,
        textBody: '',
        htmlBody: '',
        isOpen: true,
        relatedIssues: [],
        labels: [],
        comments: [],
    };
}

function updateIssueWithPartial(newValues: IssuePartial, issueBase?: Issue): Issue {
    let newIssue: Issue;
    if (issueBase == null) {
        newIssue = newIssueBase();
    } else {
        newIssue = Object.assign({}, issueBase);
    }
    newIssue = Object.assign(newIssue, newValues);
    // TODO normalization and error correction
    return newIssue;
}

function addIssueReducer(oldIssues: IssuesState, props: {issueId: string, issue: IssuePartial}): IssuesState {
    if (oldIssues[props.issueId] != null) {
        return oldIssues;
    }
    const newIssue = updateIssueWithPartial(props.issue);
    newIssue.id = props.issueId;
    return {
        ...oldIssues,
        [props.issueId]: newIssue,
    };
}

function removeIssueReducer(oldIssues: IssuesState, props: {issueId: string}): IssuesState {
    if (oldIssues[props.issueId] == null) {
        return oldIssues;
    }
    const newIssues = {
        ...oldIssues,
    };
    delete newIssues[props.issueId];
    return newIssues;
}

function updateIssueReducer(oldIssues: IssuesState, props: {issueId: string, issue: IssuePartial}): IssuesState {
    if (oldIssues[props.issueId] == null) {
        return addIssueReducer(oldIssues, props); // TODO keep this?
    }
    const newIssue = updateIssueWithPartial(props.issue, oldIssues[props.issueId]);
    newIssue.id = props.issueId;
    return {
        ...oldIssues,
        [props.issueId]: newIssue,
    };
}

function addIssueRelationToIssueReducer(oldIssues: IssuesState, props: {issueId: string, issueRelation: IssueRelation}): IssuesState {
    const oldIssue = oldIssues[props.issueId];
    if (oldIssue.relatedIssues.some(rel => {
        return rel.relatedIssueId === props.issueRelation.relatedIssueId && rel.relationType === props.issueRelation.relationType;
    })) {
        return oldIssues;
    }

    const newIssue = {
        ...oldIssue,
        relatedIssues: [
            ...oldIssue.relatedIssues,
            props.issueRelation,
        ],
    };
    return {
        ...oldIssues,
        [props.issueId]: newIssue,
    };
}

function removeIssueRelationFromIssueReducer(oldIssues: IssuesState, props: {issueId: string, issueRelation: IssueRelation}): IssuesState {
    const oldIssue = oldIssues[props.issueId];
    if (!oldIssue.relatedIssues.some(rel => {
        return rel.relatedIssueId === props.issueRelation.relatedIssueId && rel.relationType === props.issueRelation.relationType;
    })) {
        return oldIssues;
    }

    const newIssue = {
        ...oldIssue,
        relatedIssues: oldIssue.relatedIssues.filter(rel => {
            return rel.relatedIssueId !== props.issueRelation.relatedIssueId || rel.relationType !== props.issueRelation.relationType;
        }),
    };
    return {
        ...oldIssues,
        [props.issueId]: newIssue,
    };
}




const issueNamespacesReducer = createReducer(
    DEMO_INITIAL_STATE.issues,
    on(addIssue, addIssueReducer),
    on(removeIssue, removeIssueReducer),
    on(updateIssue, updateIssueReducer),

    on(addIssueRelationToIssue, addIssueRelationToIssueReducer),
    on(removeIssueRelationFromIssue, removeIssueRelationFromIssueReducer),
);

export function reducer(state: IssuesState | undefined, action: Action) {
    return issueNamespacesReducer(state, action);
}
