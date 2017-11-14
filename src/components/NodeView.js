import React, {Component} from 'react';
import _ from 'lodash';
import {Affix, Button, Badge, Input} from 'antd';

class NodeView extends Component {
  constructor(props) {
    super(props);
    // console.log('NodeView props', props)

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
    const {root, children,onTextChange,onTabChange, id} = this.props
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
  }
  onBlur = (e)=>{
    console.log('onBlur',e)
    const {onFocusChanged,id} = this.props
    if(onFocusChanged)onFocusChanged(id, false)
  }
  onFocus = (e)=>{
    const {onFocusChanged,id} = this.props    
    console.log('onFocus',e)
    if(onFocusChanged)onFocusChanged(id, true)
  }
  onPressEnter = (e)=>{
    const {onPressEnter,id} = this.props    
    console.log('onPressEnter',e)
    if(onPressEnter)onPressEnter(id)
    
  }
  renderContent = () => {
    const {root, text, children,focusId,onFocusChanged,id} = this.props
    
    return (
      <div style={{
        marginLeft: 10,
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
              border: '4px solid #666',
    '-webkit-border-radius': 4,
    '-moz-border-radius': 4,
    '-ms-border-radius': 4,
    borderRadius: 4,}}></div></div>
        {/* <Badge status="default"/> */}
        <Input
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
    const {root, text, children, onTextChange, onTabChange,focusId,onFocusChanged,onPressEnter} = this.props
    const borderLeft = root ? '0px solid #e5e5e5' : '1px solid #e5e5e5'
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
          borderLeft: borderLeft
        }}>
          {_.map(children, (node) => {
            return (
              <div key={node.id}>
                <NodeView id={node.id} text={node.text} children={node.children} onTextChange={onTextChange} onTabChange={onTabChange} focusId={focusId} onFocusChanged={onFocusChanged} onPressEnter={onPressEnter}/>
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
