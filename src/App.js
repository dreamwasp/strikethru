/* global chrome */

import React, { Component } from 'react';
import { shortenAddress, uppercase, routeGetter } from './utilityFunctions';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      domain: '',
      issues: 'labor',
      headlines: []
    };
    this.changeIssue = this.changeIssue.bind(this);
  }

  componentDidMount() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const url = new URL(tabs[0].url);
      const domain = uppercase(shortenAddress(url.hostname));
      this.setState({
        domain: domain
      });
      this.getHeadlines(domain, this.state.issues);
    });
  }

  async getHeadlines(domain, issues) {
    try {
      let route = routeGetter(domain, issues);
      let headlines = await axios.get(route);
      console.log(route);
      await this.setState({ headlines: headlines.data.articles.slice(0, 5) });
    } catch (err) {
      console.log('There was an error retrieving the articles', err);
    }
  }

  async changeIssue(event) {
    await this.setState({ issues: event.target.value }, () => {
      console.log(this.state.issues);
    });
    await this.getHeadlines(this.state.domain, this.state.issues);
  }

  render() {
    return (
      <div className="App">
        <div className="App-padding">
          <h1 className="App-title">{this.state.domain}</h1>
          <div className="selectText">
            You are now viewing
            <select value={this.state.issues} onChange={this.changeIssue}>
              <option value="labor">Labor Violations</option>
              <option value="environment">Environmental Impact</option>
              <option value="humanRights">Human Rights Violations</option>
              <option value="unethical">Unethical Business Practices</option>
              <option value="dataSecurity">Data Security</option>
            </select>
            issues.
          </div>
          <div className="articles">
            {this.state.headlines.map(headline => (
              <div className="article">
                <div
                  className="link"
                  onClick={() => {
                    window.open(headline.url);
                  }}
                >
                  {headline.title}
                </div>
                <div className="sourceWrapper">
                  <div className="source">{headline.source.name}</div>
                  <div>|</div>
                  <div className="author">{headline.author}</div>
                </div>
                <div className="descriptionWrapper">
                  <div className="description">{headline.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
export default App;
