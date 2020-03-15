import { URL, search } from './searchOptObject';

export const shortenAddress = address => {
  let index = address.indexOf('.');
  if (index <= 4) {
    address = address.slice(index + 1);
  }
  index = address.indexOf('.');
  address = address.slice(0, index);
  return address;
};

export const uppercase = string => {
  let firstLetter = string[0].toUpperCase();
  string = firstLetter + string.slice(1);
  return string;
};

const urlEncoder = string => {
  let newString = '';
  for (let i = 0; i < string.length; i++) {
    if (Object.keys(URL).includes(string[i])) {
      newString += URL[string[i]];
    } else {
      newString += string[i];
    }
  }
  return newString;
};

export const routeGetter = (domain, andIssues) => {
  let route = 'https://newsapi.org/v2/everything?q=%2B';
  route += domain + '%20';
  if (Object.keys(search).includes(andIssues)) {
    route += search[andIssues];
  } else {
    search[andIssues] = urlEncoder(andIssues);
    route += search[andIssues];
  }
  route += `&qInTitle=%2B${domain}`;
  route += '&apiKey=16fbf241528c49dd9b6437cca20a0b5e';
  return route;
};
