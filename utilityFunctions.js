export const shortenAddress = address => {
  let slashCount = 0;
  let index = 0;

  for (let i = 0; i <= address.length || slashCount > 3; i++) {
    if (address[i] === `/`) {
      slashCount += 1;
      if (slashCount === 3) {
        index = i + 1;
      }
    }
  }
  address = address.slice(0, index);
  return address;
};
