import { State, ProjectsState, ComponentsState } from './state';
import { selectProjects } from './projects.selector';
import { createSelector } from '@ngrx/store';

export const selectComponents = (state: State) => state.components;

export const selectProjectComponentList = createSelector(
    selectComponents,
    selectProjects,
    (components: ComponentsState, projects: ProjectsState, props: string) => {
        const componentsList = [];
        const proj = projects[props];
        const componentIds: string[] = proj?.components ?? [];
        componentIds.forEach((componentId) => {
            if (components[componentId] != null) {
                componentsList.push(components[componentId]);
            }
        });
        return componentsList;
    }
);
