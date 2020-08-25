import { Action, createReducer, on } from '@ngrx/store';
import { ComponentsState, Component, ComponentInterface, ComponentRelation } from './state';
import { DEMO_INITIAL_STATE } from './demo-state';
import {
    ComponentPartial,
    addComponent,
    removeComponent,
    updateComponent,
    addInterfaceToComponent,
    removeInterfaceFromComponent,
    updateInterfaceOfComponent,
    addRelationToComponent,
    removeRelationFromComponent,
    addIssueToComponent,
    removeIssueFromComponent,
} from './components.actions';


function newComponentBase(): Component {
    return {
        id: null,

        name: null,
        description: '',

        issues: [],
        imsId: null,
        imsRepository: null,
        imsOwner: null,

        interfaces: {},

        componentRelations: [],
    };
}

function updateComponentWithPartial(newValues: ComponentPartial, componentBase?: Component): Component {
    let newComponent: Component;
    if (componentBase == null) {
        newComponent = newComponentBase();
    } else {
        newComponent = Object.assign({}, componentBase);
    }
    newComponent = Object.assign(newComponent, newValues);
    // TODO normalization and error correction
    return newComponent;
}

function addComponentReducer(oldComponents: ComponentsState, props: {componentId: string, component: ComponentPartial}): ComponentsState {
    if (oldComponents[props.componentId] != null) {
        return oldComponents;
    }

    const component = props.component;
    const newComponent = updateComponentWithPartial(component);
    newComponent.id = props.componentId;
    if (newComponent.id == null) {
        return oldComponents; // cannot add component without id!
    }
    return {
        ...oldComponents,
        [newComponent.id]: newComponent,
    };
}

function removeComponentReducer(oldComponents: ComponentsState, props: {componentId: string}): ComponentsState {
    if (oldComponents[props.componentId] == null) {
        return oldComponents;
    }

    const newComponents = Object.assign({}, oldComponents);
    delete newComponents[props.componentId];
    return newComponents;
}

function updateComponentReducer(oldComponents: ComponentsState, props: {componentId: string, component: ComponentPartial}): ComponentsState {
    if (oldComponents[props.componentId] == null) {
        return addComponentReducer(oldComponents, props); // TODO keep this?
    }

    const newComponent = updateComponentWithPartial(props.component, oldComponents[props.componentId]);
    newComponent.id = props.componentId;
    return {
        ...oldComponents,
        [newComponent.id]: newComponent,
    };
}

function addInterfaceToComponentReducer(oldComponents: ComponentsState, props: {componentId: string, interface: ComponentInterface}): ComponentsState {
    if (oldComponents[props.componentId] == null) {
        return oldComponents;
    }

    const oldComponent = oldComponents[props.componentId];
    const oldInterfaces = oldComponent.interfaces;
    if (oldInterfaces[props.interface.id] != null) {
        return oldComponents;
    }

    return {
        ...oldComponents,
        [oldComponent.id]: {
            ...oldComponent,
            interfaces: {
                ...oldInterfaces,
                [props.interface.id]: props.interface,
            },
        },
    };
}

function removeInterfaceFromComponentReducer(oldComponents: ComponentsState, props: {componentId: string, interfaceId: string}): ComponentsState {
    const oldComponent = oldComponents[props.componentId];
    if (oldComponent == null) {
        return oldComponents;
    }
    if (oldComponent.interfaces[props.interfaceId] == null) {
        return oldComponents;
    }

    const newInterfaces = {
        ...oldComponent.interfaces,
    };

    delete newInterfaces[props.interfaceId];

    return {
        ...oldComponents,
        [oldComponent.id]: {
            ...oldComponent,
            interfaces: newInterfaces,
        },
    };
}

function updateInterfaceOfComponentReducer(oldComponents: ComponentsState, props: {componentId: string, interface: ComponentInterface}): ComponentsState {
    const oldComponent = oldComponents[props.componentId];
    if (oldComponent == null) {
        return oldComponents;
    }
    if (oldComponent.interfaces[props.interface.id] == null) {
        return addInterfaceToComponentReducer(oldComponents, props); // TODO keep this?
    }

    return {
        ...oldComponents,
        [oldComponent.id]: {
            ...oldComponent,
            interfaces: {
                ...oldComponent.interfaces,
                [props.interface.id]: props.interface,
            },
        },
    };
}


function addRelationToComponentReducer(oldComponents: ComponentsState, props: {componentId: string, relation: ComponentRelation}): ComponentsState {
    const oldComponent = oldComponents[props.componentId];
    if (oldComponent == null) {
        return oldComponents;
    }
    if (oldComponent.componentRelations.some(rel => {
        return rel.targetType === props.relation.targetType && rel.targetId === props.relation.targetId;
    })) {
        return oldComponents;
    }

    return {
        ...oldComponents,
        [oldComponent.id]: {
            ...oldComponent,
            componentRelations: [
                ...oldComponent.componentRelations,
                props.relation,
            ],
        },
    };
}

function removeRelationFromComponentReducer(oldComponents: ComponentsState, props: {componentId: string, relation: ComponentRelation}): ComponentsState {
    const oldComponent = oldComponents[props.componentId];
    if (oldComponent == null) {
        return oldComponents;
    }
    if (!oldComponent.componentRelations.some(rel => {
        return rel.targetType === props.relation.targetType && rel.targetId === props.relation.targetId;
    })) {
        return oldComponents;
    }

    return {
        ...oldComponents,
        [oldComponent.id]: {
            ...oldComponent,
            componentRelations: oldComponent.componentRelations.filter(rel => {
                return rel.targetType !== props.relation.targetType || rel.targetId !== props.relation.targetId;
            }),
        },
    };
}


function addIssueToComponentReducer(oldComponents: ComponentsState, props: {componentId: string, issueId: string}): ComponentsState {
    const oldComponent = oldComponents[props.componentId];
    if (oldComponent == null) {
        return oldComponents;
    }
    if (oldComponent.issues.some(issueId => {
        return issueId === props.issueId;
    })) {
        return oldComponents;
    }

    return {
        ...oldComponents,
        [oldComponent.id]: {
            ...oldComponent,
            issues: [
                ...oldComponent.issues,
                props.issueId,
            ],
        },
    };
}

function removeIssueFromComponentReducer(oldComponents: ComponentsState, props: {componentId: string, issueId: string}): ComponentsState {
    const oldComponent = oldComponents[props.componentId];
    if (oldComponent == null) {
        return oldComponents;
    }
    if (!oldComponent.issues.some(issueId => {
        return issueId === props.issueId;
    })) {
        return oldComponents;
    }

    return {
        ...oldComponents,
        [oldComponent.id]: {
            ...oldComponent,
            issues: oldComponent.issues.filter(issueId => {
                return issueId !== props.issueId;
            }),
        },
    };
}


const componentsReducer = createReducer(
    DEMO_INITIAL_STATE.components,
    on(addComponent, addComponentReducer),
    on(removeComponent, removeComponentReducer),
    on(updateComponent, updateComponentReducer),

    on(addInterfaceToComponent, addInterfaceToComponentReducer),
    on(removeInterfaceFromComponent, removeInterfaceFromComponentReducer),
    on(updateInterfaceOfComponent, updateInterfaceOfComponentReducer),

    on(addRelationToComponent, addRelationToComponentReducer),
    on(removeRelationFromComponent, removeRelationFromComponentReducer),

    on(addIssueToComponent, addIssueToComponentReducer),
    on(removeIssueFromComponent, removeIssueFromComponentReducer),
);

export function reducer(state: ComponentsState | undefined, action: Action) {
    return componentsReducer(state, action);
}
