import { Action, createReducer, on } from '@ngrx/store';
import { ProjectsState, Project } from './state';
import { DEMO_INITIAL_STATE } from './demo-state';
import {
    ProjectPartial,
    setProjectList,
    addProject,
    removeProject,
    updateProject,
    addComponentToProject,
    removeComponentFromProject
} from './projects.actions';


function newProjectBase(): Project {
    return {
        id: null,
        name: null,
        description: null,
        projectOwnerName: null,
        components: [],
    };
}

function updateProjectWithPartial(newValues: ProjectPartial, projectBase?: Project): Project {
    let newProject: Project;
    if (projectBase == null) {
        newProject = newProjectBase();
    } else {
        newProject = Object.assign({}, projectBase);
    }
    newProject = Object.assign(newProject, newValues);
    // TODO normalization and error correction
    return newProject;
}

function setProjectListReducer(oldProjects: ProjectsState, props: {projects: ProjectPartial[]}): ProjectsState {
    const projects: ProjectsState = {};
    props.projects.forEach(project => {
        const newProject = updateProjectWithPartial(project);
        if (newProject.id == null || newProject.name == null) {
            return;
        }
        projects[newProject.id] = newProject;
    });
    return projects;
}

function addProjectReducer(oldProjects: ProjectsState, props: {projectId: string, project: ProjectPartial}): ProjectsState {
    if (oldProjects[props.projectId] != null) {
        // Project already added!
        return oldProjects;
    }
    const project = props.project;
    const newProject = updateProjectWithPartial(project);
    newProject.id = props.projectId;
    if (newProject.id == null || newProject.name == null) {
        return oldProjects; // cannot add project without id!
    }
    return {
        ...oldProjects,
        [newProject.id]: newProject,
    };
}

function removeProjectReducer(oldProjects: ProjectsState, props: {projectId: string}): ProjectsState {
    if (oldProjects[props.projectId] == null) {
        return oldProjects; // nothing to do
    }
    const newProjects = Object.assign({}, oldProjects);
    delete newProjects[props.projectId];
    return newProjects;
}

function updateProjectReducer(oldProjects: ProjectsState, props: {projectId: string, project: ProjectPartial}): ProjectsState {
    if (oldProjects[props.projectId] == null) {
        return addProjectReducer(oldProjects, props); // TODO keep this?
    }
    const newProject = updateProjectWithPartial(props.project, oldProjects[props.projectId]);
    newProject.id = props.projectId;
    return {
        ...oldProjects,
        [props.projectId]: newProject,
    };
}

function addComponentToProjectReducer(oldProjects: ProjectsState, props: {projectId: string, componentId: string}): ProjectsState {
    if (oldProjects[props.projectId] == null) {
        return oldProjects;
    }
    const oldProject = oldProjects[props.projectId];
    const projComponents = new Set(oldProject.components);
    if (projComponents.has(props.componentId)) {
        return oldProjects;
    }
    projComponents.add(props.componentId);
    const newProject = {
        ...oldProject,
        components: [...projComponents],
    };
    return {
        ...oldProjects,
        [props.projectId]: newProject,
    };
}

function removeComponentFromProjectReducer(oldProjects: ProjectsState, props: {projectId: string, componentId: string}): ProjectsState {
    if (oldProjects[props.projectId] == null) {
        return oldProjects;
    }
    const oldProject = oldProjects[props.projectId];
    const projComponents = new Set(oldProject.components);
    if (!projComponents.has(props.componentId)) {
        return oldProjects;
    }
    projComponents.delete(props.componentId);
    const newProject = {
        ...oldProject,
        components: [...projComponents],
    };
    return {
        ...oldProjects,
        [props.projectId]: newProject,
    };
}

const projectsReducer = createReducer(
    DEMO_INITIAL_STATE.projects,
    on(setProjectList, setProjectListReducer),
    on(addProject, addProjectReducer),
    on(removeProject, removeProjectReducer),
    on(updateProject, updateProjectReducer),

    on(addComponentToProject, addComponentToProjectReducer),
    on(removeComponentFromProject, removeComponentFromProjectReducer),
);

export function reducer(state: ProjectsState | undefined, action: Action) {
    return projectsReducer(state, action);
}
