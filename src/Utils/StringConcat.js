export const getOptons = (key1, key2, key3) => {
  if (key1 || key2 || key3) {
    let dataString = '';
    const values = [key1, key2, key3].filter(Boolean);
    if (values.length > 0) {
      dataString += values.join(' / ');
    }
    return dataString.trim();
  } else {
    return '';
  }
};

export const getStringData = (values) => {
  let dataString = '';
  const stringArry = values.filter(Boolean);
  if (stringArry.length > 0) {
    dataString += stringArry.join(' , ') + ' , ';
  }
  return dataString.trim();
};
