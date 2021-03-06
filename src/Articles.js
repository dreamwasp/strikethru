/* global chrome */

import React, { Component } from "react";
import { shortenAddress, uppercase, routeGetter } from "./utilityFunctions";
import { Footer } from "./Footer";

import "./index.css";
import axios from "axios";

class Articles extends Component {
  constructor(props) {
    super(props);

    this.state = {
      domain: "",
      currentIssue: "Labor Violations",
      issues: [
        "Labor Violations",
        "Environmental Impact",
        "Human Rights Issues",
        "Business Practices",
      ],
      toBeAdded: "",
      articles: [],
    };
    this.changeIssue = this.changeIssue.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.articleRenderer = this.articleRenderer.bind(this);
  }

  componentDidMount() {
    this.setStorageState();
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = new URL(tabs[0].url);
      const domain = uppercase(shortenAddress(url.hostname));
      this.setState({
        domain: domain,
      });
      this.getArticles(domain, this.state.currentIssue);
    });
  }

  async setStorageState() {
    let storage = await this.getStorageValue("issues");
    if (storage.issues.length > 0) {
      this.setState({ issues: storage.issues });
    }
  }

  async getStorageValue(key) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.get(key, function (value) {
          resolve(value);
        });
      } catch (ex) {
        reject(ex);
      }
    });
  }

  async getArticles(domain, currentIssue) {
    try {
      let route = routeGetter(domain, currentIssue);
      let articles = await axios.get(route);
      this.setState({ articles: articles.data.articles.slice(0, 5) });
    } catch (err) {
      console.log("There was an error retrieving the articles", err);
    }
  }

  handleChange(event) {
    this.setState({ toBeAdded: event.target.value });
  }

  async handleSubmit(event) {
    if (this.state.toBeAdded.length > 0) {
      await this.setState({
        issues: [...this.state.issues, this.state.toBeAdded],
        toBeAdded: "",
      });
      try {
        await chrome.storage.sync.set(
          { issues: this.state.issues },
          function () {
            console.log("Values successfully set!");
          }
        );
      } catch (err) {
        console.log(err);
      }
      event.preventDefault();
    }
  }

  async changeIssue(event) {
    await this.setState({ currentIssue: event.target.value }, () => {
      console.log(this.state.currentIssue);
    });
    await this.getArticles(this.state.domain, this.state.currentIssue);
  }

  articleRenderer(articles) {
    if (articles < 1) {
      return (
        <div className="noArticle">
          It looks like no articles were found. Try a different issue?
        </div>
      );
    } else {
      return articles.map((article) => (
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
      ));
    }
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
            {this.state.issues.map((issue) => (
              <option value={issue}>{issue}</option>
            ))}
          </select>
        </div>

        <div className="articles">
          {this.articleRenderer(this.state.articles)}
        </div>
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
        <Footer />
      </div>
    );
  }
}
export default Articles;
