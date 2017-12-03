import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import {Affix, Button, Badge, Input} from 'antd';
// import jquery from 'jquery';
// window.$ = jquery
class NodeView extends Component {
  constructor(props) {
    super(props);
    
    // console.log('NodeView props', props)

  }
  componentWillReceiveProps(props) {
    if (props){
      this.props = props;
      const {focusId, id} = props
      if (id && focusId &&id == focusId){
        // console.log('will focus self:', id, focusId, this);
        // let input_id = `input_of_${id}`;
        // let element = document.getElementById(input_id);
        // console.log('getElementById', input_id, element, jquery(`${input_id}`));
        // jquery(`${input_id}`).focus();
        // setTimeout(()=>{
        //   element.focus();
        // }, 200)
        // jquery(input_id);
        
        // element.focus();
        // ReactDOM.findDOMNode(input_id).focus();

        // this.refs.input.auto
        // this.refs.input.refs.input.focus(true);
        // this.refs.input.focus(true);
        
        
      }

    }
  }
  onChange = (e) => {
    const {root, children,onTextChange, id} = this.props
    const text = e.target.value
    const target = e.target
    // console.log(`${id} onChange`, text, e, target)
    if (onTextChange) {
      onTextChange(id, text)
    }
  }
  onKeyDown = (e)=> {
    const {root, children,onTextChange,onTabChange, id, onDelete, onDirectionChange} = this.props
    const text = e.target.text
    const target = e.target
    const {key, keyCode, shiftKey,ctrlKey, altKey} = e
    // console.log(`${id} onKeyDown`,e, target, key, keyCode, shiftKey, ctrlKey, altKey)    
    if (keyCode == 9 && shiftKey){
      // console.log("shift +  Tab clicked!")
      if (onTabChange) {
        onTabChange(id, true)
        e.preventDefault();
      }
    }
    if (keyCode == 9 && !shiftKey){
      // console.log("Tab clicked!")
      if (onTabChange) {
        onTabChange(id, false)
        e.preventDefault();
      }
    }
    if (keyCode == 8 && _.isEmpty(this.props.text)){
      // console.log("Backspace clicked");
      if (onDelete) {
        onDelete(id)
        e.preventDefault();
      }
    }
    if (keyCode >= 37 && keyCode <= 40 && onDirectionChange ) {
      const temp ={
        '37': 'left',
        '38': 'up',
        '39': 'right',
        '40': 'down'
      }
      onDirectionChange(id, temp[keyCode.toString()])
    }
  }
  onBlur = (e)=>{
    // console.log('onBlur',e)
    const {onFocusChanged,id} = this.props
    if(onFocusChanged)onFocusChanged(id, false)
  }
  onFocus = (e)=>{
    const {onFocusChanged,id} = this.props    
    // console.log('onFocus',e)
    if(onFocusChanged)onFocusChanged(id, true)
  }
  onPressEnter = (e)=>{
    const {onPressEnter,id} = this.props    
    // console.log('onPressEnter',e)
    if(onPressEnter)onPressEnter(id)
    
  }
  renderContent = () => {
    const {root, text, children,focusId,onFocusChanged,id} = this.props
    
    return (
      <div style={{
        marginLeft: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
        
        
      }}>

    <div style={{
             width: 30,
             height: 30,
             '-webkit-border-radius': 9,
             '-moz-border-radius': 9,
             '-ms-border-radius': 9,
             borderRadius: 30,
             border: '6px solid transparent',
             backgroundClip: 'content-box',
             cursor: 'pointer',
             transition: 'border 0.2s',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             }}>
        <div style={{
              border: '3px solid #666',
    '-webkit-border-radius': 3,
    '-moz-border-radius': 3,
    '-ms-border-radius':3,
    borderRadius: 3,}}></div></div>
        {/* <Badge status="default"/> */}
        <Input
          id={`input_of_${id}`}
          ref='input' 
          style={{
            borderWidth: 0,
          }}
          placeholder="" 
          value={text} 
          defaultValue={text} 
          onChange={this.onChange} 
          onKeyDown={this.onKeyDown}
          autoFocus={id == focusId} 
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onPressEnter={this.onPressEnter}
          />
        </div>

    )
  }
  render() {
    const {root, text, children, onTextChange, onTabChange,focusId,onFocusChanged, onDirectionChange,onPressEnter, id, onDelete} = this.props
    const borderLeft = root ? '0px solid #e5e5e5' : '1px solid #e5e5e5'
    const borderColor = focusId == id ? '#c8c8c8' : '#e5e5e5'
    
    
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        // height: 50,
        width: '100%',
        fontSize: 14
      }}>
        {root
          ? null
          : this.renderContent()}
        <div
          style={{
          marginLeft: 15,
          paddingLeft: 15,
          borderLeft: borderLeft,
          borderColor: borderColor,
        }}>
          {_.map(children, (node) => {
            return (
              <div key={node.id}>
                <NodeView id={node.id} text={node.text} children={node.children} onTextChange={onTextChange} onTabChange={onTabChange} focusId={focusId} onFocusChanged={onFocusChanged} onPressEnter={onPressEnter} onDelete={onDelete} onDirectionChange={onDirectionChange}/>
              </div>
            )
          })
}
        </div>
      </div>
    )
  }
}

export default NodeView;
