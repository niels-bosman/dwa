import * as Redux from 'redux';

// dummy data, needed because this version does not do AJAX yet.
import initialFrontPageData from './frontPageData';
import initialItemStatuses from './itemStatuses';

//=====================================================================
//    State management for HN Items and their read/seen-statuses
//---------------------------------------------------------------------

// Action Creators:

export function markAsSeenAction(listSize) {
  return { type: 'markAsSeenAction', listSize };
}

export function toggleItemAction(item) {
  return { type: 'toggleItemAction', item };
}

// Reducer:

const initialHNItemsState = {
  items:        initialFrontPageData,
  selectedItem: null,
  statuses:     initialItemStatuses,
};

function hnItemsReducer(state = initialHNItemsState, action) {
  // Note how all branches of the switch-statement always return
  // (a new version of) the state. Reducers must always return a (new) state.
  switch (action.type) {
    case 'toggleItemAction':
      if (state.selectedItem) {
        if (action.item.id === state.selectedItem.id) {
          return { ...state, selectedItem: null };
        }
      }
      let newStatuses = { ...state.statuses, [action.item.id]: 'read' };
      return { ...state, selectedItem: action.item, statuses: newStatuses };
    // break; not needed: this branch always returns from function

    case 'markAsSeenAction':
      newStatuses = { ...state.statuses };
      state.items.forEach((itm, idx) => {
        if (idx < action.listSize && state.statuses[itm.id] === undefined) {
          newStatuses[itm.id] = 'seen';
        }
      });
      return { ...state, statuses: newStatuses };
    // break; not needed: this branch always returns from function

    default:
      return state;
  }
}

// ==============================================================
//
// using immer.js
//

// function hnItemsReducer(state = initialHNItemsState, action) {
//   const reducers = {
//     toggleItemAction: (draft, action) => {
//       if (
//         draft.item &&
//         draft.selectedItem &&
//         draft.item.id === draft.selectedItem.id
//       ) {
//         draft.selectedItem = null;
//       } else {
//         draft.statuses[action.item.id] = "read";
//         draft.selectedItem = action.item;
//       }
//     },

//     markAsSeenAction: (draft, action) => {
//       draft.items.forEach((itm, idx) => {
//         if (idx < action.listSize && draft.statuses[itm.id] === undefined) {
//           draft.statuses[itm.id] = "seen";
//         }
//       });
//     },
//   };

//   return produce(state, (draft) =>
//     reducers[action.type] ? reducers[action.type](draft, action) : draft
//   );
// }

//=====================================================================
//    State management for the Preferences
//---------------------------------------------------------------------

// Action Creators:

export function showPrefsAction() {
  return { type: 'showPrefsAction' };
}

export function doEditListSizeAction(listSize) {
  return { type: 'editListSizeAction', payload: listSize };
}

export function doEditColorAction(color) {
  return { type: 'editColorAction', payload: color };
}

export function doCloseAndApplyPrefsAction() {
  return { type: 'closeAndApplyPrefsAction' };
}

export function doCancelPrefsAction() {
  return { type: 'cancelPrefsAction' };
}

const initialPreferencesState = {
  showingPrefs:    false,
  editingColor:    null,
  editingListSize: null,
  currentColor:    'orange',
  currentListSize: 42,
};

function preferencesReducer(state = initialPreferencesState, { type, payload }) {
  // Note how all branches of the switch-statement always return
  // (a new version of) the state. Reducers must always return a (new) state.
  switch (type) {
    case 'showPrefsAction':
      return {
        ...state, ...{
          showingPrefs:    true,
          editingColor:    state.currentColor,
          editingListSize: state.currentListSize,
        }
      };

    case 'editListSizeAction':
      return { ...state, ...{ editingListSize: payload } };

    case 'editColorAction':
      return { ...state, ...{ editingColor: payload } };

    case 'closeAndApplyPrefsAction':
      return {
        ...state, ...{
          currentColor:    state.editingColor,
          currentListSize: state.editingListSize,
          showingPrefs:    false
        }
      };

    case 'cancelPrefsAction':
      return { ...state, showingPrefs: false };

    default:
      return state;
  }
}

//===========================================================================
//  Combining the reducers and their state into a single reducer managing
//  a single state
//---------------------------------------------------------------------------

export const mainReducer = Redux.combineReducers({
  hnItems: hnItemsReducer,
  prefs:   preferencesReducer,
});
