import React from 'react'
const TreeDivider = () => {
  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        width: '100%',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          flex: '0 0 5px',
          height: 5,
          border: '1px solid rgba(66,132,245,1)',
          borderRadius: '2.5px',
          boxSizing: 'border-box'
        }}
      />
      <div style={{ flex: '1', height: '1px', background: 'rgba(66,132,245,1)' }} />
    </div>
  )
}

export default TreeDivider