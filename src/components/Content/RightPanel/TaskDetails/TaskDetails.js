import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getPursuancesByIds, getTasks } from '../../../../actions';
import ReactMarkdown from 'react-markdown';
import FaCircleO from 'react-icons/lib/fa/circle-o';
import TaskDetailsTopbar from './TaskDetailsTopbar';
import TaskIcons from './TaskIcons/TaskIcons';

import './TaskDetails.css';

class TaskDetails extends Component {

  componentWillMount() {
    const {
      currentPursuanceId,
      tasks,
      getTasks,
      rightPanel
    } = this.props;

    if (rightPanel.taskGid && !tasks.taskMap[rightPanel.taskGid]) {
      const thisTasksPursuanceId = rightPanel.taskGid.split(/_/)[0];
      getTasks(thisTasksPursuanceId);

      // If this task was assigned to this pursuance from another
      // pursuance, grab the current pursuance's tasks, too
      if (currentPursuanceId &&
          thisTasksPursuanceId !== currentPursuanceId.toString()) {
        getTasks(currentPursuanceId);
      }
    }
  }

  render() {
    const { pursuances, tasks, rightPanel: { taskGid } } = this.props;
    const task = tasks.taskMap[taskGid];
    if (!task) {
      if (taskGid) {
        return <div className="no-task">Ain't nobody got task fo' that.</div>;
      }
      return null;
    }
    const subtaskGids = task.subtask_gids;

    return (
      <div className="discuss-ctn">
        <div className="task-details-ctn">
          <TaskDetailsTopbar
            taskGid={taskGid}
          />
          <div className="pursuance-discuss-ctn">
            <div className="pursuance-task-title-ctn">
              <div className="discuss-task-title-ctn">
                <span className="discuss-task-title">{task.title}</span>
              </div>
              <div className="pursuance-title-ctn">
                <span className="pursuance-title">
                  Created in {pursuances[task.pursuance_id] && <em>{pursuances[task.pursuance_id].name}</em>}
                </span>
              </div>
            </div>
            <TaskIcons
              gid={task.gid}
              subtaskGids={task.subtask_gids}
            />
            <div className="task-deliverables-ctn">
              <h4><strong>Description / Deliverables</strong></h4>
              <span>
                <ReactMarkdown
                  source={task.deliverables}
                  render={{Link: props => {
                    if (props.href.startsWith('/')) {
                      return <a href={props.href}>{props.children}</a>;
                    }
                    // If link to external site, open in new tab
                    return <a href={props.href} target="_blank">{props.children}</a>;
                  }}} />
              </span>
            </div>
            <div className="subtasks-ctn">
              <h4><strong>Subtasks</strong></h4>
              <ul className="subtasks-list">
                {subtaskGids.map((gid, i)=> {
                  return <li key={i} className="subtask-item">
                    <FaCircleO size={8} className="fa-circle-o" />{tasks.taskMap[gid].title}
                  </li>
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };
}

export default withRouter(connect(({currentPursuanceId, pursuances, tasks, rightPanel}) => ({currentPursuanceId, pursuances, tasks, rightPanel}),
  { getPursuancesByIds, getTasks })(TaskDetails));
