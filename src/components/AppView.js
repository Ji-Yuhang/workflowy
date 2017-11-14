import React, {Component} from 'react';
import _ from 'lodash';
import {Affix, Button} from 'antd';
import NodeView from './NodeView';
class AppView extends Component {
  constructor(props) {
    super(props);
    console.log('AppView props', props)
    let strs = "abcdefghigklmnopqrst"
    let strArray = strs.split("")

    // this.state = {
    //   data: {children:[{id: 'default'}]},
    // }
    this.buildDefaultData();
    
    if (false) this.buildTestData();
  }
  componentWillMount = () => {
    const json = localStorage.getItem("NodeJSON");
    if (json) {
      this.parseJson(json);
    } else {
      this.buildDefaultData();
    }
    

    document.onkeydown = (e) => {
      let currKey=0;
      e=e||event;   
      currKey=e.keyCode||e.which||e.charCode;//支持IE、FF   
      if (currKey == 83 && e.ctrlKey){
        console.log('Ctrl + S, save',e,event)
        this.save();
           if(event){  
               e.returnValue = false;   
           }else{                      
               e.preventDefault();  
           }
      }  
    // if(currKey==27){ // 按 Esc   
    //        //要做的事情  
    //  }  
    //  if(currKey==113){ // 按 F2   
    //         //要做的事情  
    //   }
    };
  }
  componentWillUnmount = () => {
    this.save();
  }
  save = () => {
    const json = this.toJson()
    localStorage.setItem("NodeJSON", json);
    
  }
  
  
  
  buildTestData = () => {
    let originData = [
      {
        id: 1,
        text: '1',
        children: [
          {
            id: 2,
            text: '2',
          },
          {
            id: 3,
            text: '3',
          },
        ]
      },
      {
        id: 4,
        text: '4',
        children: [
          {
            id: 5,
            text: '5',
          },
          {
            id: 6,
            text: '6',
          },
        ]
      }
    ];
    let {nodes, releations} = this.parseOriginData({id: 'root'}, originData)
    let rootNode = {id: 'root'}
    this.generateStateData(rootNode, nodes, releations)
    this.state = {
      data: rootNode,
      nodes,
      releations
    }
  }

  buildDefaultData = () => {
    let originData = [
      {
        id: 'default',
        text: '',
      }
    ];
    let {nodes, releations} = this.parseOriginData({id: 'root'}, originData)
    let rootNode = {id: 'root'}
    this.generateStateData(rootNode, nodes, releations)
    this.state = {
      data: rootNode,
      nodes,
      releations,
      focusId: 'default',
    }
  }

  toJson = () => {
    const {data,node,releations} = this.state;
    const json = JSON.stringify(data.children);
    return json;
  }

  parseJson = (json) => {
    const object = JSON.parse(json)
    let {nodes, releations} = this.parseOriginData({id: 'root'}, object)
    let rootNode = {id: 'root'}
    this.generateStateData(rootNode, nodes, releations)
    this.setState({
      data: rootNode,
      nodes,
      releations
    })
  }
  
  parseOriginData = (root,data) => {
    let nodes = []
    let releations = []
    if (root.id == 'root') {
      nodes.push(root);
      releations.push({id: 'root', parent: null, left_id: null, right_id: null});
    }
   
  
    let levelNodes = data.map(d => _.omit(d,['children']))
    nodes = _.concat(nodes, levelNodes)    
    
    let lastNode = null
    // let nextNode = null
    let levelReleations = _.map(levelNodes, (node => {
      let left_id = null
      let right_id = null
      if (lastNode){
        left_id = lastNode.id
        // lastNode
      }
      
      lastNode = node
      
      return (
        {
          id: node.id,
          parent_id: root.id,
          left_id,
          right_id,
        }
      )
    }))
    lastNode = null
    _.forEach(levelReleations, (node,k)=>{
      if (lastNode && node.left_id == lastNode.id){
        lastNode.right_id = node.id
      }
      lastNode = node
    })
    releations = _.concat(releations, levelReleations)    
    
    // let children = data.map(d => _.omit(d,['children']))
    data.map(d => {
      let children = d.children
      if (!_.isEmpty(children)) {
        let result = this.parseOriginData(d, children)
        nodes = _.concat(nodes, result.nodes)    
        releations = _.concat(releations, result.releations)   
      }
    })
    
    
    // nodes.push(data.)
    return ({
      nodes,
      releations
    })
  }
  generateStateData = ( root, nodes, releations ) => {
    let node = root
    let parentNode =null
    if(node) parentNode = _.find(releations, d => d.id == node.parent_id)
    let leftNode =null
    if(node) leftNode = _.find(releations, d => d.id == node.left_id)
    let rightNode =null
    if(node) rightNode = _.find(releations, d => d.id == node.right_id)
    let parentParentNode = null
    if (parentNode) parentParentNode = _.find(releations, d => d.id == parentNode.parent_id)
    
    let data = Array.new
    let childrenIds = releations.filter(d => d.parent_id == root.id).map(d=>d.id)
    let childrenNodes = nodes.filter(d => _.includes(childrenIds, d.id))
    let childFirstId = releations.filter(d => d.parent_id == root.id && d.left_id == null)[0]
    let childFirstNode = null
    if(childFirstId) childFirstNode = _.find(nodes, d => d.id == childFirstId.id)
    // console.log(childFirstId, childFirstNode)
    let chainChildren = new Array
    while(childFirstId &&　childFirstNode){
      // console.log('while',childFirstId, childFirstNode)
      
      chainChildren.push(_.clone(childFirstNode))
      childFirstId = _.find(releations, d => d.id == childFirstId.right_id)
      childFirstNode = null
      if(childFirstId) childFirstNode = _.find(nodes, d => d.id == childFirstId.id)
            
    }
    _.forEach(chainChildren, (tempNode)=>{
      if (tempNode == root) alert("死循环了")
      this.generateStateData(tempNode, nodes, releations)
    })
    root.children = chainChildren
    
    // _.forEach(rootNodes, (node)=>{
    //   let children = Array.new
    //   let rootNodeIds = releations.filter(d => d.parent_id == root.id).map(d=>d.id)
    //   let rootNodes = nodes.filter(d => _.includes(rootNodeIds, d.id))
    //   if (!_.isEmpty(children)) node.children = children
    // })
    // this.state = {
    //   data,
    //   nodes,
    //   releations
    // }
  }
  onTextChange = (id, text)=> {
    let {data, nodes, releations} = this.state
    console.log('onTextChange', id, text, data)
    let rootNode = {id: 'root'}
    _.find(nodes, d => d.id == id).text = text
    this.generateStateData(rootNode, nodes, releations)
    this.setState({
      data: rootNode,
      nodes,
      releations
    }, () => this.save())
    
    // let temp = data
    // while(!_.isEmpty(temp)) {
    //   let temp2 = _.flattenDeep(temp).find( (obj)=> obj.id == id);
    //   if (temp2) {temp2.text = text; break;}
    //   else {
    //     let children = _.flattenDeep(_.map(temp, obj => obj.children))
    //     temp2 = children.find( (obj)=> obj.id == id);
    //     if (temp2){ temp2.text = text; break;}
    //     else temp = children
    //   }
    //   console.log(temp ,temp2)
    // }
   
    // _.flattenDeep(data).find( (obj)=> obj.id == id).text = text
    // this.setState({data})
    console.log('setState' ,data)
    

  }
  printNode = (releations, node, depth) => {
    console.log(_.times(depth, ()=>'--').join('')+node.id)
    let children = _.filter(releations, d => d.parent_id == node.id)
    let leftNode = _.find(releations, d => d.parent_id == node.id && d.left_id == null)
    while(leftNode){
      this.printNode(releations, leftNode, depth+1)
      leftNode =  _.find(releations, d => d.parent_id == node.id && d.left_id == leftNode.id)
    }
    return node

  }
  printReleations = (releations) => {
    // console.log('')
    let node = _.find(releations, d => d.id == 'root')
    this.printNode(releations, node, -1)

  }

  onTabChange = (id, isLeft)=> {
    let {data, nodes, releations} = this.state
    console.log('begin----------------------onTabChange------------------------------------begin')
    this.printReleations(_.cloneDeep(releations))
    console.log('begin onTabChange　setState' , _.cloneDeep(releations))  
    // console.log('clone releations', _.cloneDeep(releations))
    
    console.log('onTabChange', id, isLeft? 'left' : 'right', isLeft)
    let rootNode = {id: 'root'}
    // _.find(releations, d => d.id == id).text = text
    let node = _.find(releations, d => d.id == id)
    let parentNode =null
    if(node) parentNode = _.find(releations, d => d.id == node.parent_id)
    let leftNode =null
    if(node) leftNode = _.find(releations, d => d.id == node.left_id)
    let rightNode =null
    if(node) rightNode = _.find(releations, d => d.id == node.right_id)
    let parentParentNode = null
    if (parentNode) parentParentNode = _.find(releations, d => d.id == parentNode.parent_id)
    

    console.log('curentNode', node)
    console.log('parentNode', parentNode)
    console.log('leftNode', leftNode)
    console.log('rightNode', rightNode)
    console.log('parentParentNode', parentParentNode)
    
    if (isLeft){
      // left => set this.parent = left_id
     
      if (node && node.left_id){
        if(node.parent_id != 'root'){
          node.right_id = null
          node.left_id = node.parent_id          
          if (leftNode) leftNode.right_id = null
          let parentRightNode = _.find(releations, d => d.id == parentNode.right_id)
          if (parentRightNode) {
            node.right_id = parentRightNode.id
            parentRightNode.left_id = node.id
          }      
          if (parentNode) parentNode.right_id = node.id
          if (rightNode && leftNode ){
            leftNode.right_id = rightNode.id
            rightNode.left_id = leftNode.id
          } 
          
        } 
        
        if(parentParentNode){
          node.parent_id = parentParentNode.id
          // parentNode.right_id = node.id
        } 
        else{
          if (parentNode && parentNode.id == 'root'){

          }
        }
      }
      if (node && !node.left_id){
        if (node.parent_id != 'root') {

          let childLastId = releations.filter(d => d.parent_id == parentNode.parent_id && d.right_id == null)[0]
          let childLastNode = null
          if(childLastId) childLastNode = _.find(nodes, d => d.id == childLastId.id)

          node.right_id = null
          if (rightNode) rightNode.left_id = null
          if(parentParentNode) node.parent_id = parentParentNode.id             
          if(parentNode) {
            // parentNode.right_id = node.id 
            // node.left_id = parentNode.id    
            
            if (parentNode.right_id){
              
              let parentRightNode = _.find(releations, d => d.id == parentNode.right_id)
              if (parentRightNode) {
                node.right_id = parentRightNode.id
                parentRightNode.left_id = node.id
              }
              node.left_id = parentNode.id
              parentNode.right_id = node.id
  
            } else {
             
              console.log( 'left', childLastId, childLastNode)
              
              if (childLastId) {
                childLastId.right_id = node.id
                node.left_id = childLastId.id
              }
            }
           
          }
        }
        
   
      }
    } else {
      // right => set this.parent = right_id
      if (node && node.left_id){
        let childLastId = releations.filter(d => d.parent_id == leftNode.id && d.right_id == null)[0]
        let childLastNode = null
        if(childLastId) childLastNode = _.find(nodes, d => d.id == childLastId.id)

        node.parent_id = node.left_id 
        if (leftNode ) leftNode.right_id = null
        if (leftNode && rightNode) {
          leftNode.right_id = rightNode.id
          rightNode.left_id = leftNode.id
        }
   
        node.left_id = null     
        node.right_id = null
        
        console.log( 'right', childLastId, childLastNode)
        if (childLastId) {
          childLastId.right_id = node.id
          node.left_id = childLastId.id
        }
      }
      if (node && !node.left_id) {

      }
    }
    this.check(_.clone(releations))
    
    this.generateStateData(rootNode, nodes, releations)
    this.setState({
      data: rootNode,
      nodes,
      releations
    }, () => this.save())
   
    // _.flattenDeep(data).find( (obj)=> obj.id == id).text = text
    // this.setState({data})
    console.log('end onTabChange　setState' ,rootNode,nodes, _.cloneDeep(releations))
    this.printReleations(_.cloneDeep(releations))
    
    console.log('end----------------------onTabChange------------------------------------end')
    

  }
  check = (releations) => {
    _.forEach(releations, (v,k)=>{
      let temp = _.compact([v.parent_id, v.left_id, v.right_id])
      if (_.size(temp) != _.size(_.uniq(temp))){
        console.log('出错的 releations', releations)
        alert('错误了')

        
      } 
    })
    let left_ids = _.compact(_.map(releations, d => d.left_id))
    let right_ids = _.compact(_.map(releations, d => d.right_id))
    if (_.size(left_ids) != _.size(_.uniq(left_ids))){
      console.log('出错的 releations', releations)
      
      alert('错误了')
      
    } 
    if (_.size(right_ids) != _.size(_.uniq(right_ids))){
      console.log('出错的 releations', releations)
      
      alert('错误了')
    } 
    let groups = _.groupBy(releations, d=>d.parent_id)
    _.forEach(groups, (v,k)=>{
      let ids = _.map(v, d => d.id)
      let temp_left_ids = _.compact(_.map(v, d => d.left_id))
      let temp_right_ids = _.compact(_.map(v, d => d.right_id)) 
      if (_.size(temp_left_ids) != _.size(_.uniq(temp_left_ids))){
        console.log('出错的 releations', releations)
        
        alert('错误了')
        
      } 
      if (_.size(temp_right_ids) != _.size(_.uniq(temp_right_ids))){
        console.log('出错的 releations', releations)
        
        alert('错误了')
      } 
    })
    
    
  }
  onFocusChanged = (id, isFocus)=> {
    // console.log('onFocusChanged',id, isFocus)
    let {focusId} = this.state
    if (isFocus) focusId = id
    else focusId = null
    this.setState({focusId})

  }
  onPressEnter = (id)=> {
    console.log('onPressEnter',id)
    let {data, nodes, releations} = this.state
    let new_id = _.uniqueId('new_');
    nodes = _.concat(nodes, [{id: new_id, text: ''}])
    let new_releation = {id: new_id}
    let node = _.find(releations,(d)=> d.id == id)
    let firstChild = _.find(releations,(d)=> d.parent_id == id && d.left_id == null)
    let rightNode = _.find(releations,(d)=> d.parent_id == node.parent_id && d.left_id == id)
    
    if (firstChild){
      // 插入第一个孩子位置
      console.log('插入第一个孩子位置', node ,firstChild)
      new_releation.parent_id = node.id
      new_releation.left_id = null
      new_releation.right_id = firstChild.id
      firstChild.left_id = new_releation.id
    } else {
      // 插入当前位置后面
      console.log('插入当前位置后面', node ,rightNode)
      
      new_releation.parent_id = node.parent_id
      new_releation.left_id = node.id
      new_releation.right_id = null
      node.right_id = new_releation.id
      if (rightNode){
        new_releation.right_id = rightNode.id
        rightNode.left_id = new_releation.id
      }
     
    }
    
    releations = _.concat(releations, [new_releation])
    


    let rootNode = {id: 'root'}    
    this.generateStateData(rootNode, nodes, releations)
    this.setState({
      data: rootNode,
      nodes,
      releations,
      focusId: new_releation.id
    }, () => this.save())
    console.log('end onPressEnter setState' ,rootNode,nodes, _.cloneDeep(releations))
    this.printReleations(_.cloneDeep(releations))
    
  }
  render() {
    return (
      <div>
        <NodeView root={true} children={this.state.data.children} onTabChange={this.onTabChange} onTextChange={this.onTextChange} focusId={this.state.focusId} onFocusChanged={this.onFocusChanged} onPressEnter={this.onPressEnter}/>
      </div>
    )
  }
}

export default AppView;
