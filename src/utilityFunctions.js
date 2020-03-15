export const shortenAddress = address => {
  address = address.slice(4);
  const index = address.indexOf('.');
  address = address.slice(0, index);
  return address;
};

export const uppercase = string => {
  let firstLetter = string[0].toUpperCase();
  string = firstLetter + string.slice(1);
  return string;
};
