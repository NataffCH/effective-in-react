import React, { Component } from 'react';
import Task from './Task/Task';
import TaskForm from '../TaskManager/TaskForm/TaskForm';
import { connect } from 'react-redux';
import * as postgrest from '../../../api/postgrest';
import './TaskHierarchy.css';
import '../Content.css';
import {
  getUsers,
  getTasks,
  addPostedRootTaskToHierarchy,
  addPostedSubTaskToHierarchy
} from '../../../actions';

class TaskHierarchy extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayLi: true,
    };
  }

  componentWillMount() {
    const { getUsers, getTasks, currentPursuanceId } = this.props;
    getUsers();
    getTasks(currentPursuanceId);
  }

  componentWillReceiveProps(nextProps) {
    const { recentlyAddedTask } = this.props.tasks;
    let newTask = nextProps.tasks.recentlyAddedTask;
    if (newTask !== recentlyAddedTask) {
      this.updateTaskHierarchy(newTask);
    }
  }

  updateTaskHierarchy = (task) => {
    const { addPostedRootTaskToHierarchy, addPostedSubTaskToHierarchy } = this.props;
    task.subtask_gids = task.subtask_gids || [];

    const parentTaskGid = task.parent_task_gid;
    if (parentTaskGid) {
      addPostedSubTaskToHierarchy(task);
    }
    else {
      addPostedRootTaskToHierarchy(task);
    }
  }

  toggleRow = () => {
    this.setState({
      ...this.state,
      displayLi: !this.state.displayLi
    });
  }

  styleLi = () => {
    if (this.state.displayLi) {
      return { display: 'block' }
    } else {
      return { display: 'none' }
    }
  }

  renderHierarchy = () => {
    const { rootTaskGids, taskMap } = this.props.tasks;
    return (
        <ul className="ul-ctn">
          {rootTaskGids.map((gid) => {
            return <Task
                     key={gid}
                     taskData={taskMap[gid]}
                     taskMap={taskMap} />
          })}
        </ul>
    )
  }

  render() {
    return (
      <div className="content-ctn">
        {this.renderHierarchy()}
        <TaskForm />
      </div>
    );
  }
}

export default connect(({ currentPursuanceId, tasks }) =>
  ({ currentPursuanceId, tasks }), {
     getUsers,
     getTasks,
     addPostedRootTaskToHierarchy,
     addPostedSubTaskToHierarchy
})(TaskHierarchy);
