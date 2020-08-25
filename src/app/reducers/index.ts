import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';

import { State } from './state';

import { reducer as projectsReducer } from './projects.reducer';
import { reducer as componentsReducer } from './components.reducer';
import { reducer as issueNamespacesReducer } from './issue-namespaces.reducer';
import { reducer as issueGraphsReducer } from './issue-graphs.reducer';



export const reducers: ActionReducerMap<State> = {
    projects: projectsReducer,
    components: componentsReducer,
    issues: issueNamespacesReducer,
    issueGraphs: issueGraphsReducer,
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
