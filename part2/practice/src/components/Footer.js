import React from 'react'

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontSize: 16,
    fontStyle: 'italic'
  }
  return (
    <div style={footerStyle}>
      <br/>
      <em>Note app, Department of Computer Science.</em>
    </div>
  )
}

export default Footer
