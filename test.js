// const isoString = "2024-12-02T10:52:48.513+02:00"; // UTC time
// const date = new Date(isoString);
// console.log(date.toString()); // Converts to local time
// console.log(date.toISOString()); // Keeps it in UTC


const completedQuestions = [
    '673e23a5ec099bafb3a7a2b5',
    '673e23a5ec099bafb3a7a2b9',
    '673e23a5ec099bafb3a7a2b2',
    '673e23a5ec099bafb3a7a2c6',
    '673e23a5ec099bafb3a7a2c2',
    '673e23a5ec099bafb3a7a2ba',
    '673e23a5ec099bafb3a7a2c3',
    '673e23a5ec099bafb3a7a2bf',
    '673e23a5ec099bafb3a7a2c4',
    '673e23a5ec099bafb3a7a2cc',
    '673e23a5ec099bafb3a7a2b5',
    '673e23a5ec099bafb3a7a2b9',
    '673e23a5ec099bafb3a7a2b2',
    '673e23a5ec099bafb3a7a2c6',
    '673e23a5ec099bafb3a7a2c2',
    '673e23a5ec099bafb3a7a2ba',
    '673e23a5ec099bafb3a7a2c3',
    '673e23a5ec099bafb3a7a2bf',
    '673e23a5ec099bafb3a7a2c4',
    '673e23a5ec099bafb3a7a2cc'
  ]

  const dailyQuestions = [
    '673e23a5ec099bafb3a7a2b5',
    '673e23a5ec099bafb3a7a2b9',
    '673e23a5ec099bafb3a7a2b2',
    '673e23a5ec099bafb3a7a2c6',
    '673e23a5ec099bafb3a7a2c2',
    '673e23a5ec099bafb3a7a2ba',
    '673e23a5ec099bafb3a7a2c3',
    '673e23a5ec099bafb3a7a2bf',
    '673e23a5ec099bafb3a7a2c4',
    '673e23a5ec099bafb3a7a2cc'
  ]



  if (completedQuestions.includes(dailyQuestions)) {
    console.log("included"); 
  }
  else {
    console.log("Not included");
  }