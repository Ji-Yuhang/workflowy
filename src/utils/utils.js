import React from 'react';
import _ from 'lodash';

export function highlightSearch(text='', search={}){
  // const { search } = this.state.search || {};
  // console.log('highlight_search:',text ,search)
  if (search && _.includes(text, search)) {
    let others = _.split(text, search)
    return (
      <span>
      {
        _.map(others, (o, i) => {
          return (
            <span>
                {o}
              {
                i < others.length - 1  ? <span style={{backgroundColor: 'orange',color:'black'}}>{search}</span> : null

              }
              </span>
          )
        })
      }
      </span>
    )
  }
  return (
    <span>{text}</span>
  )
}
