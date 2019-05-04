import React, { Component } from 'react';
import _ from 'lodash';
import { Affix, Button } from 'antd';
import NodeView from './NodeView';
import { relativeTimeRounding } from 'moment';
import request from '../utils/request';
import {
    saveWorkflowy,
    getDefaultWorkflowy,
    getWorkflowyByVersion,
    generateUuid,
    getAllRelations,
    getAllNodes,
    getNodesByIds,
    saveAllNodes,
    saveAllRelations,
} from '../services/workflowyService';
class Tree extends React.PureComponent {
    constructor(props){
        super(props);
    }
}
class AppView extends Component {
    constructor(props) {
        super(props);
        console.log('AppView props', props);
        const strs = 'abcdefghigklmnopqrst';
        const strArray = strs.split('');

        // this.state = {
        //   data: {children:[{id: 'default'}]},
        // }
        this.buildDefaultData();

        if (false) this.buildTestData();
    }

    componentWillMount = () => {
        // getDefaultWorkflowy()
        //     .then((data) => {
        //         const { id, workflowy, version } = data;
        //         console.log('getDefaultWorkflowy success data', data);
        //         if (workflowy && workflowy.node_json) {
        //             this.parseJson(json);
        //         }
        //     })
        //     .catch((error) => {
        //         console.log('getDefaultWorkflowy error', error);
        //     });
        // const json = localStorage.getItem('NodeJSON');
        // if (json) {
        //     this.parseJson(json);
        // } else {
        //     this.buildDefaultData();
        // }
        // Promise
        let relations = null;
        let nodes = null;
        getAllRelations().then((data)=>{
            // const {relations} = data;
            relations = data.relations
            console.log("getAllRelations return ", relations, data)
            return relations;
        }).then((relations)=>{
            const ids = _(relations).map("id")

            console.log("getAllRelations ids ", ids)

            return getNodesByIds(ids)
        }).then((data)=>{
            // const {nodes} = data
            nodes = data.nodes
            console.log("getNodesByIds return ", nodes, data)

            const rootNode = { id: 'root' };
            this.generateStateData(rootNode, nodes, relations);
            this.setState({
                data: rootNode,
                nodes,
                relations: relations,
            });

        }).catch((error)=>{
                console.error("Promise.all", error)
        })

        // Promise.all([getAllNodes(), getAllRelations()]).then(function(values) {
        //     console.log("Promise.all", values);
        // }).catch((error)=>{
        //     console.error("Promise.all", error)
        // });
        // getAllNodes()
        // const rootNode = { id: 'root' };
        // this.generateStateData(rootNode, nodes, relations);
        // this.setState({
        //     data: rootNode,
        //     nodes,
        //     relations,
        // });



        document.onkeydown = (e) => {
            let currKey = 0;
            e = e || event;
            currKey = e.keyCode || e.which || e.charCode;// 支持IE、FF
            if (currKey == 83 && e.ctrlKey) {
                console.log('Ctrl + S, save', e, event);
                this.save();
                if (event) {
                    e.returnValue = false;
                } else {
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
    };
    componentWillUnmount = () => {
        this.save();
    };
    save = () => {
        const json = this.toJson();
        localStorage.setItem('NodeJSON', json);

        // let headers = {
        //   "Authentication-Token": '',
        //   'Access-Control-Allow-Origin': '*.*',
        //   'Content-Type': 'application/json',
        //   'Accept': 'application/json',
        // }
        // request(`/api/v1/workflowy`, {
        //   method: 'post',
        //   headers,
        //   body: JSON.stringify({
        //     node_json: json,
        //     version: 1
        //   })
        // })

        saveWorkflowy({ node_json: json, version: 1 })
            .then((data) => {
                console.log('success data', data);
            })
            .catch((error) => {
                console.log('error', error);
            });
        saveAllRelations(this.state.relations)
        saveAllNodes(this.state.nodes)
    };


    buildTestData = () => {
        const originData = [
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
                ],
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
                ],
            },
        ];
        const { nodes, relations } = this.parseOriginData({ id: 'root' }, originData);
        const rootNode = { id: 'root' };
        this.generateStateData(rootNode, nodes, relations);
        this.state = {
            data: rootNode,
            nodes,
            relations,
        };
    };

    buildDefaultData = () => {
        const originData = [
            {
                id: 'default',
                text: '',
            },
        ];
        const { nodes, relations } = this.parseOriginData({ id: 'root' }, originData);
        const rootNode = { id: 'root' };
        this.generateStateData(rootNode, nodes, relations);
        this.state = {
            data: rootNode,
            nodes,
            relations,
            focusId: 'default',
        };
    };

    toJson = () => {
        const { data, node, relations } = this.state;
        const json = JSON.stringify(data.children);
        return json;
    };

    parseJson = (json) => {
        const object = JSON.parse(json);
        const { nodes, relations } = this.parseOriginData({ id: 'root' }, object);
        const rootNode = { id: 'root' };
        this.generateStateData(rootNode, nodes, relations);
        this.setState({
            data: rootNode,
            nodes,
            relations,
        });
    };

    parseOriginData = (root, data) => {
        let nodes = [];
        let relations = [];
        if (root.id == 'root') {
            nodes.push(root);
            relations.push({ id: 'root', parent: null, left_id: null, right_id: null });
        }


        const levelNodes = data.map(d => _.omit(d, ['children']));
        nodes = _.concat(nodes, levelNodes);

        let lastNode = null;
        // let nextNode = null
        const levelrelations = _.map(levelNodes, ((node) => {
            let left_id = null;
            const right_id = null;
            if (lastNode) {
                left_id = lastNode.id;
                // lastNode
            }

            lastNode = node;

            return (
                {
                    id: node.id,
                    parent_id: root.id,
                    left_id,
                    right_id,
                }
            );
        }));
        lastNode = null;
        _.forEach(levelrelations, (node, k) => {
            if (lastNode && node.left_id == lastNode.id) {
                lastNode.right_id = node.id;
            }
            lastNode = node;
        });
        relations = _.concat(relations, levelrelations);

        // let children = data.map(d => _.omit(d,['children']))
        data.map((d) => {
            const children = d.children;
            if (!_.isEmpty(children)) {
                const result = this.parseOriginData(d, children);
                nodes = _.concat(nodes, result.nodes);
                relations = _.concat(relations, result.relations);
            }
        });


        // nodes.push(data.)
        return ({
            nodes,
            relations,
        });
    };
    generateStateData = (root, nodes, relations) => {
        const node = root;
        let parentNode = null;
        let leftNode = null;
        let rightNode = null;
        let parentParentNode = null;

        // if (node) parentNode = _.find(relations, d => d.id == node.parent_id);
        // if (node) parentNode = _(relations).find({ id: node.parent_id })
        // if (node) leftNode = _.find(relations, d => d.id == node.left_id);
        // if (node) rightNode = _.find(relations, d => d.id == node.right_id);
        // if (parentNode) parentParentNode = _.find(relations, d => d.id == parentNode.parent_id);

        if (node) {
            parentNode = _(relations).find({ id: node.parent_id })
            leftNode = _.find(relations, {id: node.left_id});
            rightNode = _.find(relations, {id: node.right_id});
            if(parentNode) parentParentNode = _.find(relations, {id: parentNode.parent_id});
        }



        const data = Array.new;
        // const childrenIds = relations.filter(d => d.parent_id == root.id)
        //     .map(d => d.id);
        const childrenIds = _(relations).filter({parent_id: root.id}).map("id")
        const childrenNodes = _(nodes).filter(d => _.includes(childrenIds, d.id))
        // const childrenNodes = nodes.filter(d => _.includes(childrenIds, d.id));
        // let childFirstId = relations.filter(d => d.parent_id == root.id && d.left_id == null)[0];
        let childFirstId = _(relations).find(d => d.parent_id == root.id && !d.left_id)
        let childFirstNode = null;
        if (childFirstId) childFirstNode = _.find(nodes, {id: childFirstId.id});
        // console.log(childFirstId, childFirstNode)
        let chainChildren = new Array();
        let set = new Set
        if(childFirstId) set.add(childFirstId.right_id)
        while (childFirstId && childFirstNode) {
            console.log('while',childFirstId, childFirstNode)

            chainChildren.push(_.clone(childFirstNode));
            chainChildren = _.uniqBy(chainChildren, 'id')
            childFirstId = _.find(relations, {id: childFirstId.right_id});
            if (childFirstId){
                if (set.has(childFirstId.right_id)) {
                    console.error("发生死循环了1！！！", root, nodes, relations, childFirstId, childFirstNode);
                    throw '发生死循环了'
                    // raise()
                } else {
                    set.add(childFirstId.right_id)
                }
            }
            childFirstNode = null;
            if (childFirstId) childFirstNode = _.find(nodes, {id: childFirstId.id});
        }
        chainChildren = _.uniqBy(chainChildren, 'id')
        console.log("chainChildren: ", chainChildren)
        _.forEach(chainChildren, (tempNode) => {
            if (tempNode.id == root.id){
                console.log("死循环了",root, chainChildren, tempNode)
                alert('死循环了');
            }
            this.generateStateData(tempNode, nodes, relations);
        });
        root.children = chainChildren;

        // _.forEach(rootNodes, (node)=>{
        //   let children = Array.new
        //   let rootNodeIds = relations.filter(d => d.parent_id == root.id).map(d=>d.id)
        //   let rootNodes = nodes.filter(d => _.includes(rootNodeIds, d.id))
        //   if (!_.isEmpty(children)) node.children = children
        // })
        // this.state = {
        //   data,
        //   nodes,
        //   relations
        // }
    };
    onNodeClick = (id)=>{
        console.log("onNodeClick: ", id)
        let { data, nodes, relations } = this.state;
        // const rootNode = { id: 'root' };
        let clickedNode = _.find(nodes, {id: id})
        this.generateStateData(clickedNode, nodes, relations);
        console.log('onNodeClick: root', clickedNode)
        this.setState({
            data: clickedNode,
            nodes,
            relations,
        }, () => this.save());
    };
    onTextChange = (id, text) => {
        let { data, nodes, relations } = this.state;
        console.log('onTextChange', id, text, data);
        const rootNode = { id: 'root' };
        _.find(nodes, d => d.id == id).text = text;
        this.generateStateData(rootNode, nodes, relations);
        this.setState({
            data: rootNode,
            nodes,
            relations,
        }, () => this.save());

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
        console.log('setState', data);
    };
    printNode = (relations, node, depth) => {
        const text = _.find(this.state.nodes, n => n.id == node.id).text
        // 此处死循环了
        console.log(_.times(depth, () => '--')
            .join('') + `${''}: ${text}`);
        const children = _.filter(relations, d => d.parent_id == node.id);
        let leftNode = _.find(relations, d => d.parent_id == node.id && d.left_id == null);
        while (leftNode) {
            this.printNode(relations, leftNode, depth + 1);
            leftNode = _.find(relations, d => d.parent_id == node.id && d.left_id == leftNode.id);
        }
        return node;
    };
    printrelations = (relations) => {
        // console.log('')
        const node = _.find(relations, d => d.id == 'root');
        this.printNode(relations, node, -1);
    };

    onTabChange = (id, isLeft) => {
        let { data, nodes, relations } = this.state;
        console.log('begin----------------------onTabChange------------------------------------begin');
        this.printrelations(_.cloneDeep(relations));
        console.log('begin onTabChange　setState', _.cloneDeep(relations));
        // console.log('clone relations', _.cloneDeep(relations))

        console.log('onTabChange', id, isLeft ? 'left' : 'right', isLeft);
        const rootNode = { id: 'root' };
        // _.find(relations, d => d.id == id).text = text
        const node = _.find(relations, d => d.id == id);
        let parentNode = null;
        if (node) parentNode = _.find(relations, d => d.id == node.parent_id);
        let leftNode = null;
        if (node) leftNode = _.find(relations, d => d.id == node.left_id);
        let rightNode = null;
        if (node) rightNode = _.find(relations, d => d.id == node.right_id);
        let parentParentNode = null;
        if (parentNode) parentParentNode = _.find(relations, d => d.id == parentNode.parent_id);


        console.log('curentNode', node);
        console.log('parentNode', parentNode);
        console.log('leftNode', leftNode);
        console.log('rightNode', rightNode);
        console.log('parentParentNode', parentParentNode);

        if (isLeft) {
            // left => set this.parent = left_id

            if (node && node.left_id) {
                if (node.parent_id != 'root') {
                    node.right_id = null;
                    node.left_id = node.parent_id;
                    if (leftNode) leftNode.right_id = null;
                    const parentRightNode = _.find(relations, d => d.id == parentNode.right_id);
                    if (parentRightNode) {
                        node.right_id = parentRightNode.id;
                        parentRightNode.left_id = node.id;
                    }
                    if (parentNode) parentNode.right_id = node.id;
                    if (rightNode && leftNode) {
                        leftNode.right_id = rightNode.id;
                        rightNode.left_id = leftNode.id;
                    }
                }

                if (parentParentNode) {
                    node.parent_id = parentParentNode.id;
                    // parentNode.right_id = node.id
                } else if (parentNode && parentNode.id == 'root') {

                }
            }
            if (node && !node.left_id) {
                if (node.parent_id != 'root') {
                    let childLastId = relations.filter(d => d.parent_id == parentNode.parent_id && d.right_id == null)[0];
                    let childLastNode = null;
                    if (childLastId) childLastNode = _.find(nodes, d => d.id == childLastId.id);

                    node.right_id = null;
                    if (rightNode) rightNode.left_id = null;
                    if (parentParentNode) node.parent_id = parentParentNode.id;
                    if (parentNode) {
                        // parentNode.right_id = node.id
                        // node.left_id = parentNode.id

                        if (parentNode.right_id) {
                            let parentRightNode = _.find(relations, d => d.id == parentNode.right_id);
                            if (parentRightNode) {
                                node.right_id = parentRightNode.id;
                                parentRightNode.left_id = node.id;
                            }
                            node.left_id = parentNode.id;
                            parentNode.right_id = node.id;
                        } else {
                            console.log('left', childLastId, childLastNode);

                            if (childLastId) {
                                childLastId.right_id = node.id;
                                node.left_id = childLastId.id;
                            }
                        }
                    }
                }
            }
        } else {
            // right => set this.parent = right_id
            if (node && node.left_id) {
                let childLastId = relations.filter(d => d.parent_id == leftNode.id && d.right_id == null)[0];
                let childLastNode = null;
                if (childLastId) childLastNode = _.find(nodes, d => d.id == childLastId.id);

                node.parent_id = node.left_id;
                if (leftNode) leftNode.right_id = null;
                if (leftNode && rightNode) {
                    leftNode.right_id = rightNode.id;
                    rightNode.left_id = leftNode.id;
                }

                node.left_id = null;
                node.right_id = null;

                console.log('right', childLastId, childLastNode);
                if (childLastId) {
                    childLastId.right_id = node.id;
                    node.left_id = childLastId.id;
                }
            }
            if (node && !node.left_id) {

            }
        }
        this.check(_.clone(relations));

        this.generateStateData(rootNode, nodes, relations);
        this.setState({
            data: rootNode,
            nodes,
            relations,
        }, () => this.save());

        // _.flattenDeep(data).find( (obj)=> obj.id == id).text = text
        // this.setState({data})
        console.log('end onTabChange　setState', rootNode, nodes, _.cloneDeep(relations));
        this.printrelations(_.cloneDeep(relations));

        console.log('end----------------------onTabChange------------------------------------end');
    };
    check = (relations) => {
        _.forEach(relations, (v, k) => {
            const temp = _.compact([v.parent_id, v.left_id, v.right_id]);
            if (_.size(temp) != _.size(_.uniq(temp))) {
                console.log('出错的 relations', relations);
                alert('错误了');
            }
        });
        const left_ids = _.compact(_.map(relations, d => d.left_id));
        const right_ids = _.compact(_.map(relations, d => d.right_id));
        if (_.size(left_ids) != _.size(_.uniq(left_ids))) {
            console.log('出错的 relations', relations);

            alert('错误了');
        }
        if (_.size(right_ids) != _.size(_.uniq(right_ids))) {
            console.log('出错的 relations', relations);

            alert('错误了');
        }
        const groups = _.groupBy(relations, d => d.parent_id);
        _.forEach(groups, (v, k) => {
            const ids = _.map(v, d => d.id);
            const temp_left_ids = _.compact(_.map(v, d => d.left_id));
            const temp_right_ids = _.compact(_.map(v, d => d.right_id));
            if (_.size(temp_left_ids) != _.size(_.uniq(temp_left_ids))) {
                console.log('出错的 relations', relations);

                alert('错误了');
            }
            if (_.size(temp_right_ids) != _.size(_.uniq(temp_right_ids))) {
                console.log('出错的 relations', relations);

                alert('错误了');
            }
        });
    };
    onFocusChanged = (id, isFocus) => {
        console.log('onFocusChanged', id, isFocus);
        let { focusId } = this.state;
        if (isFocus) {
            focusId = id;
        } else {
            focusId = null;
        }
        this.setState({ focusId });
    };
    onPressEnter = (id) => {
        console.log('onPressEnter', id);
        let { data, nodes, relations } = this.state;
        // const new_id = _.uniqueId('new_');

        const new_id = generateUuid();
        if ( _(relations).map("id").includes(new_id)){
            alert("UUID 冲突")
            throw "UUID冲突"
        }
        nodes = _.concat(nodes, [{ id: new_id, text: '' }]);
        let new_releation = { id: new_id };
        let node = _.find(relations, {id: id});
        let firstChild = _.find(relations, d => d.parent_id == id && !d.left_id);
        let rightNode = _.find(relations, d => d.parent_id == node.parent_id && d.left_id == id);

        if (firstChild) {
            // 插入第一个孩子位置
            console.log('插入第一个孩子位置', node, firstChild, new_releation);
            new_releation.parent_id = node.id;
            new_releation.left_id = null;
            new_releation.right_id = firstChild.id;
            firstChild.left_id = new_releation.id;
        } else {
            // 插入当前位置后面
            console.log('插入当前位置后面', node, rightNode, new_releation);

            new_releation.parent_id = node.parent_id;
            new_releation.left_id = node.id;
            new_releation.right_id = null;
            node.right_id = new_releation.id;
            if (rightNode) {
                new_releation.right_id = rightNode.id;
                rightNode.left_id = new_releation.id;
            }
        }

        relations = _.concat(relations, [new_releation]);


        const rootNode = { id: 'root' };
        console.log('begin generateStateData', rootNode, nodes, _.cloneDeep(relations));

        this.generateStateData(rootNode, nodes, relations);
        console.log('after generateStateData', rootNode, nodes, _.cloneDeep(relations));

        this.setState({
            data: rootNode,
            nodes,
            relations,
            focusId: new_releation.id,
        }, () => this.save());
        console.log('end onPressEnter setState', rootNode, nodes, _.cloneDeep(relations));
        this.printrelations(_.cloneDeep(relations));
    };
    onDelete = (id) => {
        console.log('onDelete', id);
        let { data, nodes, relations } = this.state;
        console.log('begin----------------------onDelete------------------------------------begin');
        this.printrelations(_.cloneDeep(relations));
        console.log('begin onDelete', _.cloneDeep(relations));
        // console.log('clone relations', _.cloneDeep(relations))

        console.log('onDelete', id);
        const rootNode = { id: 'root' };
        // _.find(relations, d => d.id == id).text = text
        const node = _.find(relations, d => d.id == id);
        let parentNode = null;
        if (node) parentNode = _.find(relations, d => d.id == node.parent_id);
        let leftNode = null;
        if (node) leftNode = _.find(relations, d => d.id == node.left_id);
        let rightNode = null;
        if (node) rightNode = _.find(relations, d => d.id == node.right_id);
        let parentParentNode = null;
        if (parentNode) parentParentNode = _.find(relations, d => d.id == parentNode.parent_id);


        console.log('curentNode', node);
        console.log('parentNode', parentNode);
        console.log('leftNode', leftNode);
        console.log('rightNode', rightNode);
        console.log('parentParentNode', parentParentNode);
        // if (n)
        if (parentNode.id == 'root' && !leftNode) {
            console.log('only one node , skip delete ');
            return;
        }
        const children = _.find(relations, d => d.parent_id == id);
        if (_.isEmpty(children)) {
            // DO Delete
            console.log(' DO Delete ');
            // node.parent_id = parentNode.id

            if (leftNode && rightNode) {
                leftNode.right_id = rightNode.id;
                rightNode.left_id = leftNode.id;
            } else {
                if (leftNode && !rightNode) {
                    leftNode.right_id = null;
                }
                if (rightNode && !leftNode) {
                    rightNode.left_id = null;
                }
            }
            let new_releation = null;
            if (leftNode) {
                new_releation = leftNode;
            } else if (parentNode) new_releation = parentNode;
            const focusId = new_releation ? new_releation.id : null;
            this.check(_.clone(relations));

            this.setState({ focusId }, () => {
                relations = _.filter(relations, d => d.id != id);
                nodes = _.filter(nodes, d => d.id != id);
                // this.setState({relations, nodes})
                // let rootNode = {id: 'root'}
                this.generateStateData(rootNode, nodes, relations);
                this.setState({
                    data: rootNode,
                    nodes,
                    relations,
                    focusId,
                }, () => this.save());
                this.domFocus(focusId);
                console.log('end onDelete setState', rootNode, nodes, _.cloneDeep(relations), focusId);
                this.printrelations(_.cloneDeep(relations));
            });
        }
    };
    onDirectionChange = (id, direction) => {
        console.log('onDirectionChange', id, direction);
        const { data, nodes, relations } = this.state;
        // console.log('begin----------------------onDirectionChange------------------------------------begin')
        // this.printrelations(_.cloneDeep(relations))
        // console.log('begin onDirectionChange' , _.cloneDeep(relations))
        // console.log('clone relations', _.cloneDeep(relations))

        // console.log('onDirectionChange', id)
        const rootNode = { id: 'root' };
        // _.find(relations, d => d.id == id).text = text
        const node = _.find(relations, d => d.id == id);
        let parentNode = null;
        if (node) parentNode = _.find(relations, d => d.id == node.parent_id);
        let leftNode = null;
        if (node) leftNode = _.find(relations, d => d.id == node.left_id);
        let rightNode = null;
        if (node) rightNode = _.find(relations, d => d.id == node.right_id);
        let parentParentNode = null;
        if (parentNode) parentParentNode = _.find(relations, d => d.id == parentNode.parent_id);
        const childFirstId = relations.filter(d => d.parent_id == node.id && d.left_id == null)[0];

        let focusId = null;
        if (direction == 'up') {
            if (leftNode) focusId = leftNode.id;
            if (!leftNode && parentNode) focusId = parentNode.id;
            if (focusId) {
                this.setState({ focusId }, () => {
                    this.domFocus(focusId);
                });
            }
        }
        if (direction == 'down') {
            focusId = null;
            if (rightNode) focusId = rightNode.id;
            if (!rightNode && childFirstId && childFirstId.id) focusId = childFirstId.id;

            if (focusId) {
                this.setState({ focusId }, () => {
                    this.domFocus(focusId);
                });
            }
        }
    };
    domFocus = (id) => {
        const input_id = `input_of_${id}`;
        const element = document.getElementById(input_id);
        console.log('domFocus', id, input_id, element);
        if (!id) return;
        // if(!ele)
        setTimeout(() => {
            if (element) element.focus();
        }, 0);
    };

    render() {
        return (
            <div style={{background: '#f2f2f2'}}>
                <div style={{width: 600, background: 'fff'}}>


                    <NodeView root children={this.state.data.children} onTabChange={this.onTabChange}
                          onNodeClick={this.onNodeClick}
                          onTextChange={this.onTextChange} focusId={this.state.focusId}
                          onFocusChanged={this.onFocusChanged} onPressEnter={this.onPressEnter}
                          onDelete={this.onDelete} onDirectionChange={this.onDirectionChange}/>
                </div>
            </div>
        );
    }
}

export default AppView;
