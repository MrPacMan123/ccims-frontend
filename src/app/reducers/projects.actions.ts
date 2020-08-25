import { createAction, props } from '@ngrx/store';

export interface ProjectPartial {

    id?: string;

    name?: string;
    description?: string;
    projectOwnerName?: string;
    components?: string[];
}

export const setProjectList = createAction('[Projects] Set Project List', props<{projects: ProjectPartial[]}>());
export const addProject = createAction('[Projects] Add Project', props<{projectId: string, project: ProjectPartial}>());
export const removeProject = createAction('[Projects] Remove Project', props<{projectId: string}>());
export const updateProject = createAction('[Projects] Update Project', props<{projectId: string, project: ProjectPartial}>());

export const addComponentToProject = createAction('[Projects] Add Component To Project', props<{projectId: string, componentId: string}>());
export const removeComponentFromProject = createAction('[Projects] Remove ComponentFrom Project', props<{projectId: string, componentId: string}>());
