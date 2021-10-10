import { combineReducers } from 'redux';
// import { produce } from 'immer'

//=====================================================================
//    State management for HN Items and their read/seen-statuses
//---------------------------------------------------------------------

// Action Creators:

export function markAsSeenAction(listSize) {
  return { type: 'markAsSeenAction', listSize };
}

export function toggleItemAction(item) {
  return { type: 'toggleItemAction', payload: item };
}

export const fetchHNItems = () => async (dispatch) => {
  dispatch({ type: 'hnitems/loading' });
  try {
    const response = await fetch('http://localhost:3000/hn/topstories');
    if (!response.ok) throw new Error();
    const HNItems = await response.json();
    return dispatch({ type: 'hnitems/loaded', payload: HNItems });
  } catch (err) {
    return dispatch({ type: 'hnitems/error', payload: 'error loading items!' });
  }
};

export const fetchStatuses = () => async (dispatch) => {
  dispatch({ type: 'fetchStatuses/loading' });
  try {
    const response = await fetch('http://localhost:3000/itemStatuses');
    if (!response.ok) throw new Error();
    const statuses = await response.json();
    return dispatch({ type: 'fetchStatuses/loaded', payload: statuses });
  } catch (err) {
    return dispatch({
      type:    'fetchStatuses/error',
      payload: 'error loading statuses!',
    });
  }
};

export const markAsSeen = (listSize) => async (dispatch, getState) => {
  dispatch({ type: 'updateStatuses/loading' });
  try {
    const state = getState().hnItems;
    const urls  = [];

    state.items.slice(0, listSize).forEach(item => {
      if (state.statuses[item.id] === undefined) {
        urls.push(`http://localhost:3000/itemStatuses/${item.id}`);
      }
    });

    await Promise.all(
      urls.map((url) =>
        fetch(url, {
          method:  'PUT',
          headers: {
            'Content-Type': 'text/plain',
          },
          body:    'seen',
        })
          .then((response) => {
            if (!response.ok) throw new Error();
          })
          .then(() => console.log(url))
      )
    );
    dispatch({ type: 'updateStatuses/success', payload: listSize });
  } catch (err) {
    dispatch({
      type:    'updateStatuses/error',
      payload: 'Error updating statuses!',
    });
  }
};

export const toggleItemStatus = (item) => async (dispatch, getState) => {
  dispatch({ type: 'toggleStatus/loading' });
  try {
    const response = await fetch(
      `http://localhost:3000/itemStatuses/${item.id}`,
      {
        method:  'PUT',
        headers: {
          'Content-Type': 'text/plain',
        },
        body:    'read',
      }
    );
    if (!response.ok) throw new Error();

    dispatch({ type: 'toggleStatus/success', payload: item });
  } catch (err) {
    dispatch({ type: 'toggleStatus/error', payload: err.message });
  }
};

// Reducer:

const initialHNItemsState = {
  items:           [],
  itemsLoading:    false,
  error:           null,
  selectedItem:    null,
  statuses:        [],
  statusesLoading: false,
};

function hnItemsReducer(state = initialHNItemsState, action) {
  // Note how all branches of the switch-statement always return
  // (a new version of) the state. Reducers must always return a (new) state.
  switch (action.type) {
    case 'hnitems/loaded':
      return { ...state, items: action.payload, itemsLoading: false };
    case 'hnitems/loading':
      return { ...state, itemsLoading: true };
    case 'hnitems/error':
      return { ...state, itemsLoading: false, error: action.payload };
    case 'fetchStatuses/loaded':
      return { ...state, statuses: action.payload, statusesLoading: false };
    case 'fetchStatuses/loading':
      return { ...state, statusesLoading: true };
    case 'fetchStatuses/error':
      return { ...state, statusesLoading: false, error: action.payload };
    case 'updateStatus/loading':
      return { ...state, statusesLoading: true };
    case 'updateStatus/error':
      return { ...state, statusesLoading: false, error: action.payload };
    case 'toggleStatus/loading':
      return { ...state, statusesLoading: true };
    case 'toggleStatus/success':
      if (state.selectedItem) {
        if (action.payload.id === state.selectedItem.id) {
          return { ...state, selectedItem: null };
        }
      }
      let newStatuses = { ...state.statuses, [action.payload.id]: 'read' };
      return {
        ...state,
        selectedItem:    action.payload,
        statuses:        newStatuses,
        statusesLoading: false,
      };
    case 'toggleStatus/error':
      return { ...state, error: action.payload, statusesLoading: false };
    case 'updateStatuses/success':
      newStatuses = { ...state.statuses };
      state.items.forEach((itm, idx) => {
        if (idx < action.payload && state.statuses[itm.id] === undefined) {
          newStatuses[itm.id] = 'seen';
        }
      });
      return { ...state, statuses: newStatuses, statusesLoading: false };
    case 'updateStatuses/loading':
      return { ...state, statusesLoading: true };
    case 'updateStatuses/error':
      return { ...state, error: action.payload };

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

export function editListSizeAction(listSize) {
  return { type: 'editListSizeAction', payload: listSize };
}

export function editColorAction(color) {
  return { type: 'editColorAction', payload: color };
}

export function closePrefsAction() {
  return { type: 'closePrefsAction' };
}

export function closeAndApplyPrefsAction() {
  return { type: 'closeAndApplyPrefsAction' };
}

// TODO: Add action creators for other redux-actions such as Cancel and OK, but also for editing controlled inputs for color and listSize.

// Reducer:

const initialPreferencesState = {
  showingPrefs:    false,
  editingColor:    null,
  editingListSize: null,
  currentColor:    'orange',
  currentListSize: 42,
};

function preferencesReducer(state = initialPreferencesState, action) {
  // Note how all branches of the switch-statement always return
  // (a new version of) the state. Reducers must always return a (new) state.
  let changes;
  switch (action.type) {
    case 'showPrefsAction':
      changes = {
        showingPrefs:    true,
        editingColor:    state.currentColor,
        editingListSize: state.currentListSize,
      };
      return { ...state, ...changes };
    // break; not needed: this branch always returns from function
    case 'editListSizeAction':
      changes = {
        editingListSize: action.payload,
      };
      return { ...state, ...changes };
    case 'editColorAction':
      changes = {
        editingColor: action.payload,
      };
      return { ...state, ...changes };
    case 'closePrefsAction':
      changes = {
        showingPrefs:    false,
        editingColor:    null,
        editingListSize: null,
      };
      return { ...state, ...changes };
    case 'closeAndApplyPrefsAction':
      changes = {
        showingPrefs:    false,
        editingColor:    null,
        editingListSize: null,
        currentColor:    state.editingColor,
        currentListSize: state.editingListSize,
      };
      return { ...state, ...changes };
    default:
      return state;
  }
}

//===========================================================================
//  Combining the reducers and their state into a single reducer managing
//  a single state
//---------------------------------------------------------------------------

export const mainReducer = combineReducers({
  hnItems: hnItemsReducer,
  prefs:   preferencesReducer,
});
