export default function (state = {}, action) {

  switch (action.type) {
    case 'TASK_FIELD_UPDATE':
      const { formId, fieldId, value } = action;
      return Object.assign({}, state, {
        [formId]: Object.assign({}, state[formId], {
          [fieldId]: value
        })
      });

    case 'TASK_FORM_CLEAR_FIELDS': {
      // ...except parent_task_gid
      const { formId } = action;
      console.log('action', action);
      console.log('formId', formId);
      return Object.assign({}, state, {
        [formId]: {
          parent_task_gid: state[formId]['parent_task_gid']
        }
      });
    }

    case 'START_SUGGESTIONS':
      return Object.assign({}, state, {
        suggestions :  action.suggestions,
        highlightedSuggestion: 0,
        suggestionForm: action.formId || state.suggestionForm
      });

    case 'SHOW_USERS':
      return Object.assign({}, state, {
        suggestions: action.users,
        suggestionForm: action.suggestionForm
      });

    case 'STOP_SUGGESTIONS':
      return Object.assign({}, state, {
        suggestions: null,
        suggestionForm: null
      });

    case 'ADD_SUGGESTION':
      const suggestionForm = state.suggestionForm;
      return Object.assign({}, state, {
        [suggestionForm] : Object.assign({}, state[suggestionForm], {
          assigned_to : action.username
        }),
        suggestions: null
      });

    case 'DOWN_SUGGESTION':
      return Object.assign({}, state, {
        highlightedSuggestion: state.suggestions[state.highlightedSuggestion + 1]
        ? ++state.highlightedSuggestion
        : 0
      });

    case 'UP_SUGGESTION':
      return Object.assign({}, state, {
        highlightedSuggestion: state.suggestions[state.highlightedSuggestion - 1]
        ? --state.highlightedSuggestion
        : state.suggestions.length - 1
      });

    default:
      return state;
  }
}
