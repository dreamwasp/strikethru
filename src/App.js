/* global chrome */

import React, { Component } from 'react';
import { shortenAddress, uppercase } from './utilityFunctions';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      domain: '',
      issues: 'Labor Violation',
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
      this.getHeadlines(`${domain} AND ${this.state.issues}`);
    });
  }

  async getHeadlines(query) {
    try {
      let headlines = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: query,
          language: 'en',
          apiKey: '16fbf241528c49dd9b6437cca20a0b5e'
        }
      });
      await this.setState({ headlines: headlines.data.articles.slice(0, 5) });
    } catch (err) {
      console.log('There was an error retrieving the articles', err);
    }
  }

  changeIssue(event) {
    this.setState({
      issues: event.target.value
    });
    console.log(this.state.issues);
    this.getHeadlines(`${this.state.domain} AND ${this.state.issues}`);
  }

  render() {
    return (
      <div className="App">
        <div className="App-padding">
          <h1 className="App-title">{this.state.domain}</h1>
          {this.state.headlines.map(headline => (
            <h4
              className="link"
              onClick={() => {
                window.open(headline.url);
              }}
            >
              {headline.title}
            </h4>
          ))}
          <p className="footer">
            You are now viewing
            <select value={this.state.issues} onChange={this.changeIssue}>
              <option value="Labor Violations">Labor Violations</option>
              <option value="Enviromental Impact">Enviromental Impact</option>
              <option value="Human Rights Violations">
                Human Rights Violations
              </option>
              <option value="Unethical">Unethical Business Practices</option>
              <option value="Data Security Violations">Data Security </option>
            </select>
            issues.
          </p>
        </div>
      </div>
    );
  }
}
export default App;
