## Notification

### 基础

:::demo

```js
  render(){
    return(
      <div>
        <Button type="success" onClick={this.open.bind(this)}>自动关闭</Button>
        <Button type="info" onClick={this.open1.bind(this)}>不自动关闭</Button>
      </div>
    )
  }

  open(){
    handleNotificate({type: 'success', duration: 5000, showClose:false,autoClose:true,title:'标题',message:'自动关闭通知框',onClose:()=>{console.log('关闭回调')}})
  }
  open1(){
    handleNotificate({autoClose:false,title:'标题',message:'手动关闭通知框',onClose:()=>{console.log('关闭回调')}})
  }

```
:::

### Notification Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -------- | ----- | ---- | ---- | ---- |
| type | 类型 | String | info \| error \| success \| warning | info |
| message | 提示内容 | String | - | 无 |
| title | 提示标题 | String | - | 无 |
| duration (1.4新增) | 自动关闭时，设置的等待时间，单位毫秒 | number | - | 3000 |
| autoClose | 是否自动关闭 | Boolean | true \| false | false |
| showClose | 是否显示关闭图标 | Boolean | true \| false | true |
| onClose | 关闭回调 | Function | - | 无 |
