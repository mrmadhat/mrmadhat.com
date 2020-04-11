import React from 'react'
import danny from '../images/danny.jpg'

function ArticleFooter() {
  return (
    <div style={{display: 'flex'}}>
      <div
        style={{
          paddingRight: 20,
        }}
      >
        <img
          src={danny}
          alt="Daniel Gregory"
          style={{
            maxWidth: 80,
            borderRadius: '50%',
          }}
        />
      </div>
      <p>
        <strong>Daniel Gregory</strong>
        {`
          is a website developer building digital products that makes people's lives easier. He lives with his wife and two (soon to be three) kids in Bolton, UK.
        `}
      </p>
    </div>
  )
}

export default ArticleFooter
