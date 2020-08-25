import { State, ProjectsState, ComponentsState, IssuesState } from './state';
import { selectProjects } from './projects.selector';
import { createSelector } from '@ngrx/store';
import { selectComponents } from './components.selector';

export const selectIssueGraphs = (state: State) => state.issueGraphs;

const idenititySelector = (state: State) => state;

export const selectIssueGraphData = createSelector(
    idenititySelector,
    (state: State, props: {projectId: string}) => {
        const projectId = props.projectId;
        const issueGraphId = projectId;
        const proj = state.projects[projectId];
        if (proj == null) {
            return {
                components: [],
                issues: {},
                graph: {},
            };
        }

        const issuesToInclude = new Set<string>();

        const componentsList = [];
        const componentIds: string[] = proj.components ?? [];
        componentIds.forEach((componentId) => {
            const component = state.components[componentId];
            if (component != null) {
                componentsList.push(component);
                component.issues.forEach(issueId => issuesToInclude.add(issueId));
                Object.keys(component.interfaces).forEach(interfaceId => {
                    component.interfaces[interfaceId].issues?.forEach(issueId => issuesToInclude.add(issueId));
                });
            }
        });

        const issues: IssuesState = {};
        issuesToInclude.forEach(issueId => {
            const issue = state.issues[issueId];
            if (issue == null) {
                return; // No issue with that id
            }
            // TODO filter relevant issues
            issues[issue.id] = issue;
        });

        return {
            components: componentsList,
            issues: issues,
            graph: state.issueGraphs[issueGraphId] ?? {},
        };
    }
);
