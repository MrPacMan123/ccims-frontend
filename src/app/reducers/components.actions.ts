import { createAction, props } from '@ngrx/store';
import { ComponentInterfaces, ComponentRelation, ComponentInterface } from './state';

export interface ComponentPartial {

    id?: string;

    name?: string;
    description?: string;

    issues?: string[];

    imsId?: string;
    imsRepository?: string;
    imsOwner?: string;

    interfaces?: ComponentInterfaces;

    componentRelations?: ComponentRelation[];
}

export const addComponent = createAction('[Components] Add Component', props<{componentId: string, component: ComponentPartial}>());
export const removeComponent = createAction('[Components] Remove Component', props<{componentId: string}>());
export const updateComponent = createAction('[Components] Update Component', props<{componentId: string, component: ComponentPartial}>());

// tslint:disable-next-line: max-line-length
export const addInterfaceToComponent = createAction('[Components] Add Interface To Component', props<{componentId: string, interface: ComponentInterface}>());
// tslint:disable-next-line: max-line-length
export const removeInterfaceFromComponent = createAction('[Components] Remove Interface From Component', props<{componentId: string, interfaceId: string}>());
// tslint:disable-next-line: max-line-length
export const updateInterfaceOfComponent = createAction('[Components] Update Interface of a Component', props<{componentId: string, interface: ComponentInterface}>());

// tslint:disable-next-line: max-line-length
export const addRelationToComponent = createAction('[Components] Add Relation To Component', props<{componentId: string, relation: ComponentRelation}>());
// tslint:disable-next-line: max-line-length
export const removeRelationFromComponent = createAction('[Components] Remove Relation From Component', props<{componentId: string, relation: ComponentRelation}>());

// tslint:disable-next-line: max-line-length
export const addIssueToComponent = createAction('[Components] Add Issue To Component', props<{componentId: string, issueId: string}>());
// tslint:disable-next-line: max-line-length
export const removeIssueFromComponent = createAction('[Components] Remove Issue From Component', props<{componentId: string, issueId: string}>());
