const obj = {
  id:1,
  first: "name",
  last:"last",
  Age:30
}

const reqObj = {
  first: "first",
  last:"lastFirst",
}

console.log({...obj, ...reqObj});

// const propsToUpdate = Object.entries(obj).map(o => o)

// console.log(propsToUpdate);

