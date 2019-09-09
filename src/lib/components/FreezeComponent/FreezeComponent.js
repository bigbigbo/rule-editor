import { Component } from 'react';

class FreezeComponent extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !nextProps.freeze
  }
  
  
  render() {
    return this.props.children
  }
}

export default FreezeComponent;
