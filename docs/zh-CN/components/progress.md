## Progress进度条

### 进度条类型

:::demo 

Progress组件

```js
render() {
  return (
    <div>
      <Progress percent={10}/>
      <br/>
      <Progress percent={10} withOutText/>
      <br/>
      <Progress size='middle' status='success' text='成功' percent={40}/>
      <br/>
      <Progress size='small' status='warn' text='错误' percent={50}/>
      <br/>
      <Progress size='small' status='error' text='警示' percent={100}/>
    </div>
  )
}
```
:::

### 进度条动态

:::demo 

Progress动态

```js
constructor () {
  super()
  this.state = {
    percent: 10
  }
}

render() {
  return (
    <div>
      <Progress percent={this.state.percent}/>
      <br/>
      <Counter
          value={this.state.percent}
          step={10}
          min={0}
          max={100}
          onChange={(e,percent) => this.setState({percent})}
        />
    </div>
  )
}
```
:::

### 环形进度条

:::demo 

环形进度条

```js
constructor () {
  super()
  this.state = {
    percent: 10
  }
}

render() {
  return (
    <div>
      <div style={{display:'inline-block'}}>
        <Progress percent={this.state.percent} type='circle'/>
      </div>
      <div style={{display:'inline-block',marginLeft: '50px'}}>
        <Progress percent={this.state.percent} type='circle' status='warn' text={<i className='hi-icon icon-close' style={{fontSize: '18px'}}/>}/>
      </div>
      <div style={{display:'inline-block',marginLeft: '50px'}}>
        <Progress percent={this.state.percent} type='circle' status='error' text={<i className='hi-icon icon-alarm' style={{fontSize: '18px'}}/>}/>
      </div>
      <div style={{display:'inline-block',marginLeft: '50px'}}>
        <Progress percent={this.state.percent} type='circle' status='success' text={<i className='hi-icon icon-check' style={{fontSize: '18px'}}/>}/>
      </div>
      <div style={{display:'inline-block',marginLeft: '50px'}}>
        <Progress percent={this.state.percent} type='circle' status='success' radius={60} text={<i className='hi-icon icon-check' style={{fontSize: '25px'}}/>}/>
      </div>
      <br/>
      <Counter
          value={this.state.percent}
          step={10}
          min={0}
          max={100}
          onChange={(e,percent) => this.setState({percent})}
        />
    </div>
  )
}
```
:::

### 仪表盘进度条

:::demo 

环形进度条

```js
constructor () {
  super()
  this.state = {
    percent: 10
  }
}

render() {
  return (
    <div>
      <div style={{display:'inline-block'}}>
        <Progress percent={this.state.percent} type='dashboard' radius={50}/>
      </div>
      <br/>
      <Counter
          value={this.state.percent}
          step={10}
          min={0}
          max={100}
          onChange={(e,percent) => this.setState({percent})}
        />
    </div>
  )
}
```
:::


### 进度条文字内显

:::demo 

Progress组件

```js
render() {
  return (
    <div>
      <Progress percent={20} inside height={20}/>
      <br/>
      <Progress percent={30} inside status='success' text='成功' height={20}/>
      <br/>
      <Progress percent={10} inside status='warn' height={20}/>
    </div>
  )
}
```
:::



#### Progress Attributes

| 参数       | 说明   |  类型  | 可选值 |默认值  |
| --------   | -----  | ----  |    ----  |   ----  |
| type |   进度条类型  |  String  | bar \| circle \| dashboard | bar |
| size |   进度条大小  |  String   | large \| middle \| small | - |
| texxt |   显示文本  |   String \| Component   | - | 当前进度百分比 |
| withOutText |   是否显示文本  |    Boolean   | true \| false | false |
| status |   进度条类型  |   String   |  primary \| success \| warn \| error | primary |
| radius |    环形进度条半径  |    Number   | - | 40 |
| inside |   文字在进度条内显示，需配合 height 使用  |   Boolean   | true \| false | false |
