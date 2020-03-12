import { React, Component } from 'react';
import logo from './logo.svg';
import './App.css';

export class SomePlugin extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.somePlugin();
  }

  componentWillUnmount() {
    this.$el.somePlugin('destroy');
  }

  render() {
    return <div ref={el => (this.el = el)} />;
  }
}
