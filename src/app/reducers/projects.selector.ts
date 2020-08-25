import { State, ProjectsState } from './state';
import { createSelector } from '@ngrx/store';

export const selectProjects = (state: State) => state.projects;

export const selectProjectList = createSelector(
    selectProjects,
    (projects: ProjectsState) => {
        const projectList = [];
        // tslint:disable-next-line: forin
        for (const projectId in projects) {
            projectList.push(projects[projectId]);
        }
        return projectList;
    }
);

export const selectProject = createSelector(
    selectProjects,
    (projects: ProjectsState, props: string) => {
        if (projects[props] != null) {
            return projects[props];
        }
        // tslint:disable-next-line: forin
        for (const projId in projects) {
            const proj = projects[projId];
            if (proj.name === props) {
                return proj;
            }
        }
        return null;
    }
)
