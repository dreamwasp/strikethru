/* global chrome */

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      domain: '',
      headlines: []
    };
  }

  componentDidMount() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const url = new URL(tabs[0].url);
      const domain = url.hostname;
      this.setState({
        domain: domain
      });
      this.getHeadlines(domain);
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

  render() {
    return (
      <div className="App">
        <h1 className="App-title">{this.state.domain}</h1>
        Top Headlines:
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
      </div>
    );
  }
}
export default App;
