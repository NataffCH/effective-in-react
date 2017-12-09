export default function(state = {}, action) {
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
      return Object.assign({}, state, {
        [formId]: {
          parent_task_gid: state[formId]['parent_task_gid']
        }
      });
    }

    case 'TASK_FORM_SET_PARENT_GID': {
      const { formId, newParentGid } = action;
      return Object.assign({}, state, {
        [formId]: Object.assign(
          {},
          {
            parent_task_gid: newParentGid
          }
        )
      });
    }

    default:
      return state;
  }
}
