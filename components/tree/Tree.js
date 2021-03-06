import React, { Component } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
// import Checkbox from '../checkbox/index'
import TreeNode from './TreeNode'
import isEqual from 'lodash/isEqual'
import {
  calcDropPosition,
  deepClone,
  getChildren,
  getDisabled,
  getAll
} from './util'

import './style/index'
const dealData = (data, tempData = {}, parent = null) => {
  if (data.length === 0) {
    return data
  }
  data.map((item) => {
    tempData[item.id] = {...item}
    if (parent) {
      tempData[item.id].parent = parent
    }
    if (item.children && item.children.length > 0) {
      const tempArr = []
      item.children.map((i) => {
        tempArr.push(i.id)
      })
      tempData[item.id].children = tempArr
      dealData(item.children, tempData, item.id)
    }
  })
}

export default class Tree extends Component {
  constructor (props) {
    super(props)

    this.state = {
      hasChecked: props.defaultCheckedKeys,
      hasExpanded: [],
      dataMap: {},
      data: {},
      dragNode: '',
      dragNodePosition: null,
      semiChecked: [],
      disabledKeys: [],
      all: []
    }
  }

  // updateCheckStatus (props) {
  //
  // }
  //
  // componentDidMount () {
  //   this.updateCheckStatus(this.props)
  // }

  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    defaultCheckedKeys: PropTypes.arrayOf(PropTypes.any),
    onDragStart: PropTypes.func,
    // render: PropTypes.func,
    defaultExpandAll: PropTypes.bool,
    checkable: PropTypes.bool,
    draggable: PropTypes.bool,
    withLine: PropTypes.bool,
    onNodeClick: PropTypes.func,
    onClick: PropTypes.func,
    onChange: PropTypes.func
  }

  static defaultProps = {
    prefixCls: 'hi-tree',
    defaultCheckedKeys: [],
    data: []
  }

  static getDerivedStateFromProps (props, prevState) {
    let data = {}
    if (!isEqual(props.data, prevState.data)) {
      const dataMap = {}
      dealData(deepClone(props.data), dataMap)
      data.dataMap = dataMap
      data.data = props.data

      if (Object.keys(prevState.data).length === 0) {
        if (props.defaultExpandAll) {
          let tempExpandedArr = []
          for (let key in dataMap) {
            if (dataMap[key].children && dataMap[key].children.length > 0) {
              tempExpandedArr.push(dataMap[key].id)
            }
          }
          data.hasExpanded = tempExpandedArr
        }
      }
    }

    if (props.data && props.checkedKeys) {
      data.all = getAll(props.data, props.checkedKeys)
      // data.semiChecked = data.all.filter(item => item.semi).map(item => item.id)
      // data.disabledKeys = data.all.filter(item => item.disabled).map(item => {
      //   return {
      //     id: item.id,
      //     checked: props.checkedKeys.includes(item.id)
      //   }
      // })
    }

    return data
  }

  onCheckChange (checked, item) {
    const {
      onChange,
      checkedKeys
    } = this.props
    let checkedArr = checkedKeys

    let {
      all
    } = this.state
    let semiChecked = all.filter(item => item.semi).map(item => item.id)
    let disabledKeys = all.filter(item => item.disabled).map(item => item.id)
    let myself = all.find(a => a.id === item.id)
    let children = myself.child
    let parent = myself.parent

    if (semiChecked.includes(item.id)) {
      children.forEach(child => {
        checkedArr = checkedArr.filter(c => c !== child)
      })
      checkedArr = checkedArr.filter(c => c !== item.id)
    } else {
      if (checked) {
        checkedArr = checkedArr.filter(c => c !== item.id)
        children.forEach(child => {
          checkedArr = checkedArr.filter(c => c !== child)
        })
        parent.forEach(p => {
          checkedArr = checkedArr.filter(c => c !== p)
        })
      } else {
        checkedArr = checkedArr.concat(children)
        checkedArr.push(item.id)
        parent.forEach(p => {
          let par = all.find(a => a.id === p).child
          let bool = true
          par.forEach(p => {
            if (!checkedArr.includes(p)) {
              bool = false
            }
          })
          bool && checkedArr.push(p)
        })
      }
    }

    disabledKeys.forEach(d => {
      if (d.checked) {
        if (!checkedArr.includes(d.id)) {
          checkedArr.push(d.id)
        }
      } else {
        checkedArr = checkedArr.filter(c => c !== d.id)
      }
    })

    parent.forEach(p => {
      let child = all.find(item => item.id === p).child
      let semi = false
      let num = 0
      checkedArr.forEach(c => {
        if (child.includes(c)) {
          num = num + 1
        }
      })

      semi = num !== 0 && num !== child.length

      if (semi) {
        if (!semiChecked.includes(p)) {
          semiChecked.push(p)
        }
      } else {
        semiChecked = semiChecked.filter(s => s !== p)
      }
      console.log('chedked', checked, 'child', child, 'checkedkeys', checkedArr, 'child.length', child.length, 'title', all.find(item => item.id === p).title, 'checknum', num, 'semi', semi)
    })

    // let semiChecked = getSemi(this.props.data, checkedArr)
    // this.setCheckTreeCheckedParent(item.id, checked, checkedArr)
    // this.setCheckTreeCheckedChild(item.id, checked, checkedArr, semiChecked.includes(item.id))
    // semiChecked = getSemi(this.props.data, checkedArr) // 重新设置一次
    // this.setState({
    //   hasChecked: checkedArr,
    //   semiChecked
    // })
    // onCheckChange && onCheckChange(checkedArr, item.title, !checked, semiChecked)
    onChange && onChange(checkedArr, item.title, !checked, semiChecked)
    this.props.onCheckChange && this.props.onCheckChange(checkedArr, item.title, !checked, semiChecked)
  }

  setCheckTreeCheckedChild (id, checked, tempCheckedArr, semi) {
    let child = getChildren(this.props.data, id)
    let disabled = getDisabled(this.props.data)
    child.forEach(c => {
      if (disabled.includes(c)) {
        return
      }
      if (semi) {
        tempCheckedArr.splice(tempCheckedArr.indexOf(c), 1)
        return
      }
      if (!tempCheckedArr.includes(c) && !disabled.includes(c)) {
        tempCheckedArr.push(c)
      } else {
        tempCheckedArr.splice(tempCheckedArr.indexOf(c), 1)
      }
    })

    // console.log(arguments)
    // const {dataMap} = this.state
    //
    // let childNotExist = !(dataMap[id].children && dataMap[id].children.length > 0)
    //
    // if(!(dataMap[id].children && dataMap[id].children.length > 0)){
    //   dataMap[id].children = []
    // }else {
    //   dataMap[id].children = dataMap[id].children.filter(item => !item.disabled)
    // }
    //
    // if (dataMap[id].children && dataMap[id].children.length > 0) {
    //   dataMap[id].children.map((i) => {
    //     if (checked) {
    //       if (tempCheckedArr.indexOf(i) >= 0) {
    //         tempCheckedArr.splice(tempCheckedArr.indexOf(i), 1)
    //       }
    //     } else {
    //       if (tempCheckedArr.indexOf(i) < 0) {
    //         tempCheckedArr.push(i)
    //       }
    //     }
    //   })
    // }
    // if (dataMap[id].children) {
    //   dataMap[id].children.map((i) => {
    //     this.setCheckTreeCheckedChild(i, checked, tempCheckedArr)
    //   })
    // }
  }

  setCheckTreeCheckedParent (id, checked, tempCheckedArr) {
    const {dataMap} = this.state
    if (checked) {
      if (tempCheckedArr.indexOf(id) >= 0) {
        tempCheckedArr.splice(tempCheckedArr.indexOf(id), 1)
      }
    } else {
      let allChecked = true

      dataMap[id].children && dataMap[id].children.map((i) => {
        if (tempCheckedArr.indexOf(i) < 0) {
          allChecked = false
        }
      })
      if (allChecked && tempCheckedArr.indexOf(id) < 0) { tempCheckedArr.push(id) }
    }
    if (dataMap[id].parent) {
      this.setCheckTreeCheckedParent(dataMap[id].parent, checked, tempCheckedArr)
    }
  }

  onExpanded (expanded, item) {
    let expandedArr = this.state.hasExpanded

    if (expandedArr.indexOf(item.id) >= 0) {
      expandedArr.splice(expandedArr.indexOf(item.id), 1)
    } else {
      expandedArr.push(item.id)
    }
    this.setState({
      hasExpanded: expandedArr
    })
  }

   // 当拖拽元素开始被拖拽的时候触发的事件
   onDragStart = (e, data) => {
     const { onDragStart } = this.props
     e.stopPropagation()

     let expandedArr = this.state.hasExpanded

     if (expandedArr.indexOf(data.id) >= 0) {
       expandedArr.splice(expandedArr.indexOf(data.id), 1)
     }

     this.dargNode = e.target
     this.curData = data
     this.setState({
       expandedKeys: expandedArr
     })
     if (onDragStart) {
       onDragStart(e)
     }

     try {
       e.dataTransfer.setData('text/plain', '')
     } catch (error) {
     }
   }
  // 当拖拽完成后触发的事件
  onDragEnd = (e) => {
    const { onDragEnd } = this.props
    e.stopPropagation()

    if (onDragEnd) {
      onDragEnd(e)
    }
  }

  // 当拖曳元素进入目标元素的时候触发的事件
  onDragEnter = (e, data) => {
    const { onDragEnter } = this.props
    let dropPosition = calcDropPosition(e, e.currentTarget)

    e.preventDefault()
    e.stopPropagation()

    if (data.id === this.curData.id && dropPosition === 0) {
      this.setState({
        dragNode: '',
        dragNodePosition: null
      })
      return
    }

    setTimeout(() => {
      this.setState({
        dragNode: data.id,
        dragNodePosition: dropPosition
      })
    }, 0)

    if (onDragEnter) {
      onDragEnter({ event: e, dropPosition })
    }
  }
  // 拖拽元素在目标元素上移动的时候触发的事件
  onDragOver = (e) => {
    const { onDragOver } = this.props
    e.preventDefault()
    e.stopPropagation()

    if (onDragOver) {
      onDragOver(e)
    }
  }
  // 当拖拽元素离开目标元素时触发
  onDragLeave = (e) => {
    const { onDragLeave } = this.props
    e.stopPropagation()

    this.setState({
      dragNode: '',
      dragNodePosition: null
    })

    if (onDragLeave) {
      onDragLeave(e)
    }
  }
  // 被拖拽的元素在目标元素上同时鼠标放开触发的事件
  onDrop = (e, data, parentData) => {
    const { onDrop } = this.props
    e.preventDefault()
    e.stopPropagation()
    this.setState({
      dragNode: '',
      dragNodePosition: null
    })
    this.props.dragEnd(this.curData, data, parentData)
    if (onDrop) {
      onDrop(e)
    }
  }

  renderTreeNodes (data) {
    const { prefixCls, draggable, checkable, closeIcon, openIcon, withLine, highlightable } = this.props
    const { dragNode, dragNodePosition } = this.state

    return (
      <TreeNode
        draggable={draggable || undefined}
        onDragStart={this.onDragStart}
        onDragEnter={this.onDragEnter}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
        checked={this.props.checkedKeys || []}
        onNodeClick={this.props.onNodeClick}
        onClick={this.props.onClick}
        semiChecked={this.state.all.filter(item => item.semi).map(item => item.id)}
        expanded={this.state.hasExpanded}
        onCheckChange={this.onCheckChange.bind(this)}
        hightLightNodes={this.props.hightLightNodes}
        onHightLightChange={this.props.onHightLightChange}
        onExpanded={this.onExpanded.bind(this)}
        data={data}
        dragNodePosition={dragNodePosition}
        dragNode={dragNode}
        prefixCls={prefixCls}
        checkable={checkable}
        highlightable={highlightable}
        openIcon={openIcon}
        closeIcon={closeIcon}
        withLine={withLine}
      />
    )
  }

  render () {
    const { prefixCls, draggable, style } = this.props
    const classes = classNames(`${prefixCls}`, {
      'draggable-tree': draggable
    })

    return (
      <div className={classes}
        style={style}
      >
        {this.renderTreeNodes(this.state.data)}
      </div>
    )
  }
}
