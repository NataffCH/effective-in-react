import React, { Component } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import TiPencil from 'react-icons/lib/ti/pencil';
import './TaskStatus.css';


const VALID_STATUSES = [
  'New',
  'Started',
  'WorkingOn',
  'HelpWanted',
  'ReadyForReview',
  'Reviewing',
  'Done'
];

class TaskStatus extends Component {

  displayStatus = (status) => {
    return status.replace(/([a-z])([A-Z])/g, "$1 $2");
  }

  getCurrentStatus = () => {
    return this.displayStatus(this.props.status);
  }

  getDropDownItems = () => {
    return VALID_STATUSES.map((statusName, i) => {
      if (statusName !== this.props.status) {
        return (
          <MenuItem eventKey={i} key={statusName}
            onClick={() => this.selectStatus(statusName)}>
            {this.displayStatus(statusName)}
          </MenuItem>
        );
      }
    });
  }

  selectStatus = (status) => {
    const { gid, patchTask } = this.props;
    patchTask({ gid, status });
  }

  render() {
    const { status } = this.props;
    return (
      <div className={"task-status-ctn task-status-" + status}>
        <DropdownButton
          id="task-status-dropdown"
          title={this.getCurrentStatus()}
          noCaret>
          {this.getDropDownItems()}
        </DropdownButton>
        <div className="edit-icon-ctn">
          <TiPencil id="task-edit-icon" size={18} />
        </div>
      </div>
    )
  }
}

export default TaskStatus;
