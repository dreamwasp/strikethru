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
      currentIssue: 'Labor Violations',
      issues: [
        'Labor Violations',
        'Environmental Impact',
        'Human Rights Issues',
        'Business Practices',
        'Data Security'
      ],
      toBeAdded: '',
      articles: []
    };
    this.changeIssue = this.changeIssue.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setStorageState();
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const url = new URL(tabs[0].url);
      const domain = uppercase(shortenAddress(url.hostname));
      this.setState({
        domain: domain
      });
      this.getArticles(domain, this.state.currentIssue);
    });
  }

  async getArticles(domain, currentIssue) {
    try {
      let route = routeGetter(domain, currentIssue);
      let articles = await axios.get(route);
      this.setState({ articles: articles.data.articles.slice(0, 5) });
    } catch (err) {
      console.log('There was an error retrieving the articles', err);
    }
  }

  async setStorageState() {
    let storage = await this.getStorageValue('issues');
    if (storage.issues.length > 0) {
      this.setState({ issues: storage.issues });
    }
  }

  async getStorageValue(key) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.get(key, function(value) {
          resolve(value);
        });
      } catch (ex) {
        reject(ex);
      }
    });
  }

  handleChange(event) {
    this.setState({ toBeAdded: event.target.value });
  }

  async handleSubmit(event) {
    await this.setState({
      issues: [...this.state.issues, this.state.toBeAdded],
      toBeAdded: ''
    });
    try {
      await chrome.storage.sync.set({ issues: this.state.issues }, function() {
        console.log('Values successfully set!');
      });
    } catch (err) {
      console.log(err);
    }
    event.preventDefault();
  }

  async changeIssue(event) {
    await this.setState({ currentIssue: event.target.value }, () => {
      console.log(this.state.currentIssue);
    });
    await this.getArticles(this.state.domain, this.state.currentIssue);
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
            {this.state.issues.map(issue => (
              <option value={issue}>{issue}</option>
            ))}
          </select>
        </div>

        <div className="articles">
          {this.state.articles.map(article => (
            <div className="article">
              <div
                className="link"
                onClick={() => {
                  window.open(article.url);
                }}
              >
                {article.title}
              </div>
              <div className="sourceWrapper">
                <div className="descriptionWrapper">
                  <div className="description">{article.description}</div>
                </div>
                <div className="source">sourced from {article.source.name}</div>
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
        <div id="thanks">
          <p>
            This app was built using the{' '}
            <a href="https://newsapi.org"> News API</a>.
          </p>
        </div>
      </div>
    );
  }
}
export default Articles;
