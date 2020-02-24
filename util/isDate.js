const isDate = (dateToCheck) => {
  if (/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])$/g.test(dateToCheck)) {
    return true;
  }
  return false;
};


module.exports = isDate;
