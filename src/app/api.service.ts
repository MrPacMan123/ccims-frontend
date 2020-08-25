import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Store, Action } from '@ngrx/store';
import { State, ComponentInterface, IssueType, IssueRelationType, IssueRelation } from './reducers/state';
import gql from 'graphql-tag';
import { ProjectPartial, addProject, setProjectList, removeProject, updateProject, addComponentToProject } from './reducers/projects.actions';
import { ComponentPartial, addComponent, updateComponent, removeComponent, addIssueToComponent, addInterfaceToComponent, removeInterfaceFromComponent, addRelationToComponent, removeRelationFromComponent } from './reducers/components.actions';
import { IssuePartial, updateIssue, addIssue, removeIssue, addIssueRelationToIssue, removeIssueRelationFromIssue } from './reducers/issue-namespace.actions';

interface GqUser {
    id: string;
    userName: string;
    components?: GqComponent[];
    projects?: GqProject[];
    ims?: GqIMS[];
}

enum GqImsType {
    GitHub
}

interface GqIMS {
    id: string;
    type: GqImsType;
}

interface GqComment {
    id: string;
    author?: GqUser;
    text?: string;
    textRendered?: string;
}

enum GqIssueType {
    UNCLASSIFIED = "UNCLASSIFIED",
    BUG = "BUG",
    FEATURE_REQUEST = "FEATURE_REQUEST",
}
const GqIssueTypeToIssueType = {
    [GqIssueType.UNCLASSIFIED]: IssueType.UNCLASSIFIED,
    [GqIssueType.BUG]: IssueType.BUG,
    [GqIssueType.FEATURE_REQUEST]: IssueType.FEATURE_REQUEST,
};

enum GqRelationType {
    RELATED_TO = "RELATED_TO",
    DUPLICATES = "DUPLICATES",
    DEPENDS = "DEPENDS",
}
const GqRelationTypeToIssueRelationType = {
    [GqRelationType.RELATED_TO]: IssueRelationType.RELATED_TO,
    [GqRelationType.DEPENDS]: IssueRelationType.DEPENDS,
    [GqRelationType.DUPLICATES]: IssueRelationType.DUPLICATES,
};

interface GqIssueRelation {
    sourceIssue?: GqIssue;
    destIssue: GqIssue;
    relationType: GqRelationType;
}

interface GqIssue {
    id: string;
    title: string;
    body?: string;
    bodyRendered?: string;
    comments?: GqComment[];
    opened: boolean;
    issueType: GqIssueType;
    relatedIssues?: GqIssueRelation[];
    creationDate?: string;
}

interface GqInterface {
    id: string;
    name: string;
    hostComponent?: GqComponent;
    usingComponents?: GqComponent[];
}

interface GqComponent {
    id: string;
    name: string;
    description?: string;
    issues?: GqIssue[];
    projects?: GqProject[];
    ims?: GqIMS;
    interfaces?: GqInterface[];
    usedInterfaces?: GqInterface[];
}

interface GqProject {
    id: string;
    name: string;
    description?: string;
    ownerUsername?: string;
    components?: GqComponent[];
}

interface GqRoot {
    projects?: GqProject[];
}

const projectListQuery = gql`
    query projectList {
        projects {
            id
            name
            description
            ownerUsername
            components {
                id
            }
        }
    }
`;

const fullProjectQuery = gql`
    query fullProject($projectId: ID!) {
        project(id: $projectId) {
            id
            name
            description
            ownerUsername
            components {
                id
                name
                description
                issues {
                    id
                    title
                    body
                    bodyRendered
                    opened
                    creationDate
                    issueType
                    comments {
                        id
                    }
                    relatedIssues {
                        destIssue {
                            id
                        }
                        relationType
                    }
                }
                ims {
                    id
                    type
                }
                interfaces {
                    id
                    name
                }
                usedInterfaces {
                    id
                }
            }
        }
    }
`;

const addProjectMutation = gql`
    mutation addProject($name: String!, $description: String, $projectOwnerName: String!,) {
        createProject(data: {
            name: $name
            description: $description
            ownerUsername: $projectOwnerName
        }) {
            id
            name
            description
            ownerUsername
        }
    }
`;

const updateProjectMutation = gql`
    mutation updateProject($projectId: ID!, $name: String!, $description: String, $projectOwnerName: String!,) {
        modifyProject(
            projectId: $projectId
            data: {
                name: $name
                description: $description
                ownerUsername: $projectOwnerName
            }
        ) {
            id
            name
            description
            ownerUsername
        }
    }
`;

const removeProjectMutation = gql`
    mutation removeProject($projectId: ID!,) {
        removeProject(projectId: $projectId)
    }
`;

const addComponentToProjectMutation = gql`
    mutation addComponentToProject($componentId: ID!, $projectId: ID!) {
        addComponentToProject(projectId: $projectId, componentId: $componentId) { id }
    }
`;

const removeComponentFromProjectMutation = gql`
    mutation removeComponentFromProject($componentId: ID!, $projectId: ID!) {
        removeComponentFromProject(projectId: $projectId, componentId: $componentId) { id }
    }
`;




const addComponentMutation = gql`
    mutation addComponent($name: String!, $description: String, $ownerName: String!, $imsId: ID!, $repository: String!, $repositoryOwner: String!) {
        createComponent(data: {
            name: $name
            description: $description
            ownerUsername: $ownerName
            imsId: $imsId
            imsData: {
                repository: $repository
                owner: $repositoryOwner
            }
        }) {
            id
            name
            description
            # ownerUsername
            ims {
                id
                type
            }
        }
    }
`;

const removeComponentMutation = gql`
    mutation removeComponent($componentId: ID!) {
        removeComponent(componentId: $componentId)
    }
`;

const addUsedInterfaceToComponentMutation = gql`
    mutation addUsedInterface($componentId: ID!, $interfaceId: ID!) {
        addUsedInterface(componentId: $componentId, interfaceId: $interfaceId) { id }
    }
`;

const removeUsedInterfaceFromComponentMutation = gql`
    mutation removeUsedInterface($componentId: ID!, $interfaceId: ID!) {
        removeUsedInterface(componentId: $componentId, interfaceId: $interfaceId) { id }
    }
`;



const addInterfaceMutation = gql`
    mutation createInterface($componentId: ID!, $name: String!) {
        createInterface(data: {
            name: $name
            hostComponentId: $componentId
        }) {
            id
            name
        }
    }
`;

const removeInterfaceMutation = gql`
    mutation removeInterface($interfaceId: ID!) {
        removeInterface(interfaceId: $interfaceId) # FIXME typo in backend api!
    }
`;



const addIssueMutation = gql`
    mutation createIssue($componentId: ID!, $title: String!, $body: String, $issueType: IssueType) {
        createIssue(data: {
            title: $title
            body: $body
            opened: true
            componentId: $componentId
            issueType: $issueType
        }) {
            id
            title
            body
            bodyRendered
            opened
            creationDate
            issueType
            comments {
                id
            }
            relatedIssues {
                destIssue {
                    id
                }
                relationType
            }
        }
    }
`;

const removeIssueMutation = gql`
    mutation removeIssue($componentId: ID!, $issueId: ID!) {
        removeIssue(issueId: $issueId, componentId: $componentId)
    }
`;

const updateIssueMutation = gql`
    mutation updateIssue($issueId: ID!, $componentId: ID!, $title: String!, $body: String, $issueType: IssueType) {
        updateIssue(
            issueId: $issueId
            componentId: $componentId
            data: {
                title: $title
                body: $body
                opened: true
                componentId: $componentId
                issueType: $issueType
            }
        ) {
            id
            title
            body
            bodyRendered
            opened
            creationDate
            issueType
            comments {
                id
            }
            relatedIssues {
                destIssue {
                    id
                }
                relationType
            }
        }
    }
`;



const addIssueRelationMutation = gql`
    mutation addIssueRelation($sourceIssueId: ID!, $sourceComponentId: ID!, $targetIssueId: ID!, $targetComponentId: ID!, $relationType: RelationType,) {
        addIssueRelation(
            data: {
                fromId: $sourceIssueId,
                fromComponentId: $sourceComponentId,
                toId: $targetIssueId,
                toComponentId: $targetComponentId,
                type: $relationType
            }
        ) {
            sourceIssue {
                id
            }
            destIssue {
                id
            }
            relationType
        }
    }
`;

const removeIssueRelationMutation = gql`
    mutation removeIssueRelation($sourceIssueId: ID!, $sourceComponentId: ID!, $targetIssueId: ID!) {
        removeIssueRelation(fromId: $sourceIssueId, fromComponentId: $sourceComponentId, toId: $targetIssueId)
    }
`;


@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(private apollo: Apollo, private store: Store<State>) { }

    /**
     *  Operation to check whether the user is authenticated or not.
     */
    public isAuthenticated(): boolean {
        const token = localStorage.getItem('token');
        /*          // Check whether the token is expired and return
                // true or false
                return !this.jwtHelper.isTokenExpired(token); */
        return token === 'test-token';
    }

    private gqProjectToProjectPartial(project: GqProject): ProjectPartial {
        const proj: ProjectPartial = {
            id: project.id,
            name: project.name,
            description: project.description,
            projectOwnerName: project.ownerUsername,
            components: [],
        };
        project.components?.forEach(comp => {
            proj.components.push(comp.id);
        });
        return proj;
    }

    private gqComponentToComponentPartial(component: GqComponent): ComponentPartial {
        const comp: ComponentPartial = {
            id: component.id,
            name: component.name,
            description: component.description,
            issues: [],
            imsId: component.ims?.id,
            imsRepository: null, // component.ims?.repository
            imsOwner: null, // component.ims?.ownerUsername
            interfaces: {},
            componentRelations: [],
        };
        component.issues?.filter(issue => issue != null).forEach(issue => {
            comp.issues.push(issue.id);
        });
        component.interfaces?.forEach(inter => {
            comp.interfaces[inter.id] = this.gqInterfaceToComponentInterface(inter);
        });
        component.usedInterfaces?.forEach(inter => {
            comp.componentRelations.push({
                targetId: inter.id,
                targetType: 'interface',
            });
        });
        return comp;
    }

    private gqInterfaceToComponentInterface(componentInterface: GqInterface): ComponentInterface {
        const inter = {
            id: componentInterface.id,
            interfaceName: componentInterface.name,
            issues: [],
        };
        return inter;
    }

    private gqIssueToIssuePartial(issue: GqIssue): IssuePartial {
        const iss: IssuePartial = {
            id: issue.id,
            title: issue.title,
            isOpen: issue.opened,
            type: GqIssueTypeToIssueType[issue.issueType],
            textBody: issue.body,
            htmlBody: issue.bodyRendered,
            relatedIssues: [],
            comments: [], // TODO
            labels: [], // TODO
        };
        issue.relatedIssues?.forEach(rel => {
            iss.relatedIssues.push({
                relatedIssueId: rel.destIssue.id,
                relationType: GqRelationTypeToIssueRelationType[rel.relationType],
            });
        });
        // TODO populate other list fields
        return iss;
    }

    public loadProjectList() {
        this.apollo.query<GqRoot>({
            query: projectListQuery,
        }).subscribe(result => {
            const projectList = [];
            console.log(result)
            result.data.projects?.forEach(proj => {
                const project: ProjectPartial = this.gqProjectToProjectPartial(proj);
                projectList.push(project);
            });
            if (projectList.length > 0) {
                // only remove demo projects if database has projects
                this.store.dispatch(setProjectList({
                    projects: projectList,
                }));
            }
        });
    }

    public loadFullProject(projectId: string) {
        this.apollo.query<{ project: GqProject }>({
            query: fullProjectQuery,
            variables: {
                projectId: projectId,
            }
        }).subscribe(result => {
            console.log(result, projectId)
            const storeActions: Action[] = [];

            const proj = result.data.project;

            if (proj == null) {
                return;
            }

            const project = this.gqProjectToProjectPartial(proj);
            storeActions.push(updateProject({ projectId: project.id, project: project }));

            proj.components.forEach(comp => {
                const component = this.gqComponentToComponentPartial(comp);
                storeActions.push(updateComponent({ componentId: component.id, component: component }));
                comp.issues?.filter(issue => issue != null).forEach(iss => {
                    const issue = this.gqIssueToIssuePartial(iss);
                    storeActions.push(updateIssue({ issueId: issue.id, issue: issue }));
                });
            });

            storeActions.forEach(action => this.store.dispatch(action));
        });
    }

    public addProject(project: ProjectPartial) {
        this.apollo.mutate<{ createProject: GqProject }>({
            mutation: addProjectMutation,
            variables: project,
        }).subscribe(result => {
            const proj: ProjectPartial = this.gqProjectToProjectPartial(result.data.createProject);
            this.store.dispatch(addProject({
                projectId: proj.id,
                project: proj,
            }));
        });
    }

    public removeProject(projectId: string) {
        this.apollo.mutate({
            mutation: removeProjectMutation,
            variables: {
                projectId: projectId,
            },
        }).subscribe(result => {
            if (result.errors == null || result.errors.length === 0) {
                this.store.dispatch(removeProject({
                    projectId: projectId
                }));
            }
        });
    }



    public addComponent(projectId: string, ownerUsername: string, component: ComponentPartial) {
        this.apollo.mutate<{ createComponent: GqComponent }>({
            mutation: addComponentMutation,
            variables: {
                name: component.name,
                description: component.description,
                ownerName: ownerUsername,
                imsId: 1, // FIXME remove hardcoded value!
                repository: component.imsRepository,
                repositoryOwner: component.imsOwner,
            },
        }).subscribe(result => {
            if (result.errors == null || result.errors.length === 0) {
                console.log(result);
                const component = this.gqComponentToComponentPartial(result.data.createComponent);
                this.store.dispatch(addComponent({
                    componentId: result.data.createComponent.id,
                    component: component,
                }));
                this.apollo.mutate({
                    mutation: addComponentToProjectMutation,
                    variables: {
                        componentId: component.id,
                        projectId: projectId,
                    }
                }).subscribe(innerResult => {
                    console.log(innerResult);
                    this.store.dispatch(addComponentToProject({ projectId: projectId, componentId: component.id }));
                });
            }
        });
    }

    public removeComponent(componentId: string) {
        this.apollo.mutate({
            mutation: removeComponentMutation,
            variables: {
                componentId: componentId,
            },
        }).subscribe(result => {
            if (result.errors == null || result.errors.length === 0) {
                this.store.dispatch(removeComponent({
                    componentId: componentId,
                }));
            }
        });
    }

    public addComponentInterface(componentId: string, name: string) {
        this.apollo.mutate<{ createInterface: GqInterface }>({
            mutation: addInterfaceMutation,
            variables: {
                componentId: componentId,
                name: name,
            },
        }).subscribe(result => {
            if (result.errors == null || result.errors.length === 0) {
                console.log(result);
                const inter = {
                    id: result.data.createInterface.id,
                    interfaceName: result.data.createInterface.name,
                    issues: [],
                };
                this.store.dispatch(addInterfaceToComponent({
                    componentId: componentId,
                    interface: inter,
                }));
            }
        });
    }

    public removeComponentInterface(componentId: string, interfaceId: string) {
        this.apollo.mutate({
            mutation: removeInterfaceMutation,
            variables: {
                componentId: componentId,
                interfaceId: interfaceId,
            },
        }).subscribe(result => {
            if (result.errors == null || result.errors.length === 0) {
                this.store.dispatch(removeInterfaceFromComponent({
                    componentId: componentId,
                    interfaceId: interfaceId,
                }));
            }
        });
    }

    public addComponentToInterfaceRelation(componentId: string, interfaceId: string) {
        this.apollo.mutate({
            mutation: addUsedInterfaceToComponentMutation,
            variables: {
                componentId: componentId,
                interfaceId: interfaceId,
            },
        }).subscribe(result => {
            if (result.errors == null || result.errors.length === 0) {
                this.store.dispatch(addRelationToComponent({
                    componentId: componentId,
                    relation: {
                        targetId: interfaceId,
                        targetType: 'interface',
                    },
                }));
            }
        });
    }

    public removeComponentToInterfaceRelation(componentId: string, interfaceId) {
        this.apollo.mutate({
            mutation: removeUsedInterfaceFromComponentMutation,
            variables: {
                componentId: componentId,
                interfaceId: interfaceId,
            },
        }).subscribe(result => {
            if (result.errors == null || result.errors.length === 0) {
                this.store.dispatch(removeRelationFromComponent({
                    componentId: componentId,
                    relation: {
                        targetId: interfaceId,
                        targetType: 'interface',
                    },
                }));
            }
        });
    }

    public addIssue(componentId: string, issue: IssuePartial) {
        let gqIssueType = GqIssueType.UNCLASSIFIED;
        if (issue.type === IssueType.BUG) {
            gqIssueType = GqIssueType.BUG;
        }
        if (issue.type === IssueType.FEATURE_REQUEST) {
            gqIssueType = GqIssueType.FEATURE_REQUEST;
        }
        this.apollo.mutate<{ createIssue: GqIssue }>({
            mutation: addIssueMutation,
            variables: {
                componentId: componentId,
                title: issue.title,
                body: issue.textBody,
                issueType: gqIssueType,
            },
        }).subscribe(result => {
            if (result.errors == null || result.errors.length === 0) {
                console.log(result);
                const issue = this.gqIssueToIssuePartial(result.data.createIssue);
                this.store.dispatch(addIssue({
                    issueId: result.data.createIssue.id,
                    issue: issue,
                }));
                this.store.dispatch(addIssueToComponent({ componentId: componentId, issueId: issue.id }));
            }
        });
    }

    public removeIssue(componentId: string, issueId: string) {
        this.apollo.mutate({
            mutation: removeIssueMutation,
            variables: {
                componentId: componentId,
                issueId: issueId,
            },
        }).subscribe(result => {
            if (result.errors == null || result.errors.length === 0) {
                this.store.dispatch(removeIssue({
                    issueId: issueId,
                }));
            }
        });
    }

    public updateIssue(componentId: string, issueId: string, issue: IssuePartial) {
        let gqIssueType = GqIssueType.UNCLASSIFIED;
        if (issue.type === IssueType.BUG) {
            gqIssueType = GqIssueType.BUG;
        }
        if (issue.type === IssueType.FEATURE_REQUEST) {
            gqIssueType = GqIssueType.FEATURE_REQUEST;
        }
        this.apollo.mutate<{ updateIssue: GqIssue }>({
            mutation: updateIssueMutation,
            variables: {
                componentId: componentId,
                issueId: issueId,
                title: issue.title,
                body: issue.textBody,
                issueType: gqIssueType,
            },
        }).subscribe(result => {
            if (result.errors == null || result.errors.length === 0) {
                console.log(result);
                const issue = this.gqIssueToIssuePartial(result.data.updateIssue);
                this.store.dispatch(updateIssue({
                    issueId: result.data.updateIssue.id,
                    issue: issue,
                }));
            }
        });
    }

    public addIssueRelation(sourceComponentId: string, sourceIssueId: string, targetComponentId: string, targetIssueId: string, relationType: IssueRelationType) {
        let gqRelationType = GqRelationType.RELATED_TO;
        if (relationType === IssueRelationType.DEPENDS) {
            gqRelationType = GqRelationType.DEPENDS;
        }
        if (relationType === IssueRelationType.DUPLICATES) {
            gqRelationType = GqRelationType.DUPLICATES;
        }
        this.apollo.mutate({
            mutation: addIssueRelationMutation,
            variables: {
                sourceIssueId: sourceIssueId,
                sourceComponentId: sourceComponentId,
                targetIssueId: targetIssueId,
                targetComponentId: targetComponentId,
                relationType: gqRelationType,
            },
        }).subscribe(result => {
            if (result.errors == null || result.errors.length === 0) {
                this.store.dispatch(addIssueRelationToIssue({
                    issueId: sourceIssueId,
                    issueRelation: {
                        relatedIssueId: targetIssueId,
                        relationType: relationType,
                    }
                }));
            }
        });
    }

    public removeIssueRelation(sourceComponentId: string, sourceIssueId: string, relation: IssueRelation) {
        this.apollo.mutate({
            mutation: removeIssueRelationMutation,
            variables: {
                sourceIssueId: sourceIssueId,
                sourceComponentId: sourceComponentId,
                targetIssueId: relation.relatedIssueId,
            },
        }).subscribe(result => {
            if (result.errors == null || result.errors.length === 0) {
                this.store.dispatch(removeIssueRelationFromIssue({
                    issueId: sourceIssueId,
                    issueRelation: {
                        relatedIssueId: relation.relatedIssueId,
                        relationType: relation.relationType,
                    }
                }));
            }
        });
    }
}
