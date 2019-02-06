import React, {Component} from 'react';
import {connect} from 'react-redux';
import {EditorState, convertToRaw, convertFromRaw} from 'draft-js';
import { Editor } from 'draft-js';
import {getDefaultKeyBinding, KeyBindingUtil} from 'draft-js';
import createAutoListPlugin from 'draft-js-autolist-plugin'
import createMarkdownPlugin from 'draft-js-markdown-plugin';
import {markdownToDraft, draftToMarkdown} from 'markdown-draft-js';
import ReactMarkdown from 'react-markdown';
import './Wysiwyg.css';

const {hasCommandModifier} = KeyBindingUtil;

function myKeyBindingFn(e) {
  if (e.keyCode === 13 /* `enter` key */ && hasCommandModifier(e)) {
    return 'myeditor-save';
  }
  return getDefaultKeyBinding(e);
}

const autoListPlugin = createAutoListPlugin();

const plugins = [
  autoListPlugin,
  createMarkdownPlugin()
];

class Wysiwyg extends Component {
  constructor(props) {
    super(props);
    const content = this.calculateContent();

    this.state = {
      editMode: false,
      editorState: EditorState.createWithContent(convertFromRaw(content))
    };
  }

  calculateContent = () => {
    const {tasks: { taskMap }, taskGid, attributeName} = this.props,
      attributeValue = taskMap[taskGid][attributeName],
      content = attributeValue ? markdownToDraft(attributeValue, {
        remarkableOptions: {
          html: false,
          preserveNewlines: true
        }
      }) : markdownToDraft('');

    return content;
  }

  editModeEnable = () => {
    const content = this.calculateContent();

    this.setState({
      editMode: true,
      editorState: EditorState.moveFocusToEnd(
        EditorState.createWithContent(convertFromRaw(content))
      )
    });
  };

  onChange = (editorState) => {
    this.setState({
      editorState
    });
  };

  save = () => {
    const {patchTask} = this.props,
      markdown = draftToMarkdown(convertToRaw(this.state.editorState.getCurrentContent())),
      payload = {gid: this.props.taskGid};

    payload[this.props.attributeName] = markdown;

    patchTask(payload);

    this.setState({
      editMode: false
    });
  }

  editModeFalse = () => {
    this.setState({
      editMode: false
    });
  }

  handleKeyCommand = (command) => {
    if (command === 'myeditor-save') {
      this.save();
      return 'handled';
    }
    return 'not-handled';
  }

  render() {
    const {tasks: {taskMap}} = this.props,
      attributeValue = taskMap[this.props.taskGid][this.props.attributeName];

    return (
      <div>
        <h4>
          <strong>Description / Deliverables</strong>&nbsp;&nbsp;
          {this.state.editMode && <button className='wysiwyg-save' onClick={this.save}>Save</button>}
          {!this.state.editMode && <button className='wysiwyg-edit' onClick={this.editModeEnable}>Edit</button>}
        </h4>
        {
          this.state.editMode && (
            <div className='wysiwyg'>
              <Editor
                editorState={this.state.editorState}
                onChange={this.onChange}
                onEscape={this.editModeFalse}
                plugins={plugins}
                handleKeyCommand={this.handleKeyCommand}
                keyBindingFn={myKeyBindingFn}
              />
            </div>
          )
        }
        {
          !this.state.editMode && (
            <div>
              <ReactMarkdown
                source={attributeValue}
                render={{Link: props => {
                  if (props.href.startsWith('/')) {
                    return <a href={props.href}>{props.children}</a>;
                  }
                  // If link to external site, open in new tab
                  return <a href={props.href} target="_blank">{props.children}</a>;
                }}} />
            </div>
          )
        }
      </div>
    );
  }
}

export default connect(({tasks}) => ({tasks}), null)(Wysiwyg);
