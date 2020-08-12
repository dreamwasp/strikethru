import { URL, search } from "./searchOptObject";
import { apiKey } from "./apiKey";

export const shortenAddress = (address) => {
  let index = address.indexOf(".");
  if (index <= 4) {
    address = address.slice(index + 1);
  }
  index = address.indexOf(".");
  address = address.slice(0, index);
  return address;
};

export const uppercase = (string) => {
  let firstLetter = string[0].toUpperCase();
  string = firstLetter + string.slice(1);
  return string;
};

const urlEncoder = (string) => {
  let newString = "";
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
  let route = "https://gnews.io/api/v3/search?q=";
  route += domain + "%20";
  if (Object.keys(search).includes(andIssues)) {
    route += search[andIssues];
  } else {
    search[andIssues] = urlEncoder(andIssues);
    route += search[andIssues];
  }
  route += `&token=${apiKey}`;
  console.log(route);
  return route;
};
