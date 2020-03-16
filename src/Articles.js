/* global chrome */

import React, { Component } from 'react';
import { shortenAddress, uppercase, routeGetter } from './utilityFunctions';
import './index.css';
import axios from 'axios';

class Articles extends Component {
  constructor(props) {
    super(props);

    this.state = {
      domain: '',
      currentIssue: 'labor',
      issues: [
        'labor',
        'environment',
        'humanRights',
        'unethical',
        'dataSecurity'
      ],
      issueText: [
        'Labor Violations',
        'Environmental Impact',
        'Human Rights Issues',
        'Business Practices',
        'Data Security'
      ],
      toBeAdded: '',
      headlines: []
    };
    this.changeIssue = this.changeIssue.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const url = new URL(tabs[0].url);
      const domain = uppercase(shortenAddress(url.hostname));
      this.setState({
        domain: domain
      });
      this.getHeadlines(domain, this.state.currentIssue);
    });
  }

  async getHeadlines(domain, currentIssue) {
    try {
      let route = routeGetter(domain, currentIssue);
      let headlines = await axios.get(route);
      await this.setState({ headlines: headlines.data.articles.slice(0, 5) });
    } catch (err) {
      console.log('There was an error retrieving the articles', err);
    }
  }

  handleChange(event) {
    this.setState({ toBeAdded: event.target.value });
  }

  handleSubmit(event) {
    this.setState({
      issues: [...this.state.issues, this.state.toBeAdded],
      issueText: [...this.state.issueText, this.state.toBeAdded]
    });
    event.preventDefault();
  }

  async changeIssue(event) {
    await this.setState({ currentIssue: event.target.value }, () => {
      console.log(this.state.currentIssue);
    });
    await this.getHeadlines(this.state.domain, this.state.currentIssue);
  }

  render() {
    return (
      <div className="App-padding">
        <div className="selectTextContainer">
          Recent articles about {this.state.domain}'s
          <select
            value={this.state.currentIssue}
            onChange={this.changeIssue}
            className="selectText"
          >
            {this.state.issues.map((issue, index) => (
              <option value={issue}>{this.state.issueText[index]}</option>
            ))}
          </select>
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
                <div className="descriptionWrapper">
                  <div className="description">{headline.description}</div>
                </div>
                <div className="source">
                  sourced from {headline.source.name}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="symbol">☭</div>
        <form className="addBar" onSubmit={this.handleSubmit}>
          I'd like to follow articles about...
          <input
            type="text"
            className="inputText"
            value={this.state.toBeAdded}
            onChange={this.handleChange}
          />
          <button type="submit" className="addButton" value="Submit">
            +
          </button>
        </form>
      </div>
    );
  }
}
export default Articles;
