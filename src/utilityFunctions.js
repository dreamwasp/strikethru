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
