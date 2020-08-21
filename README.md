# strikethru
strikethru is a [Google Chrome plug-in](https://chrome.google.com/webstore/detail/strikethru/iiddfdfnhogoilpammecdbbcnaambjid?hl=en&authuser=3) that aggregates news data to help consumers make conscious buying decisions. Add custom issues to track the ones that are pertinent to you across multiple websites and synced across your Chrome browsers!

![strikethru screenshot](https://i.imgur.com/pa7CpSX.png)


## To Install
strikethru is available for download through the [Google Chrome Store](https://chrome.google.com/webstore/detail/strikethru/iiddfdfnhogoilpammecdbbcnaambjid?hl=en&authuser=3)! If you'd like to install strikethru on your local machine:

 - Clone or fork this repository
 - Once downloaded, navigate to the appropriate folder in your terminal, then run `npm install'
 - You will need an API Key from the [GNews API](https://https://gnews.io/), which you can get for free [here](https://https://gnews.io/#pricing) after creating an account. Create an "apiKey.js" file within your search folder, and export the api key from there
 - Run `npm run-scripts build`
 - You should now see a `build` folder in the directory
 - Open up Google Chrome, navigate to `Settings` > `Extensions` and make sure Developer (in the top right corner) is switched on
 - Click `Load unpack` and then upload the build folder.
 - You are good to go!

## Features currently in development
- an internally-built webscraper for vetted new sources
- an alert system for if a user navigates to the website of a company that is currently on strike, has a major enviromental violation, etc.
- a machine-learning algorithm to quantify a company's "grade" for each "out-of-the-box" category

strikethru project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) + currently utilizes the [GNews API](https://https://gnews.io/)
