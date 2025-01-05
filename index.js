import express from 'express';
import moment from 'moment/moment.js';
const app = express();
const PORT = 8000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const interval = 1000;
let canRegister = false;

const drawees = [];
const winners = [];

app.get('/', (req, res) => {
  res.send(' app started successfully');
});

app.post('/initiateLottery', (req, res) => {
  canRegister = true;
  const drawTime = req.body.drawTime; // in minutes
  const registerCloseTime = req.body.registerCloseTime; // in minutes

  const currentTime = moment();
  const momentRegisterCloseTime = currentTime
    .clone()
    .add(registerCloseTime, 'minutes')
    .unix();
  const momentTimeTillDraw = currentTime
    .clone()
    .add(drawTime, 'minutes')
    .unix();

  res
    .status(200)
    .send('success countdown timers have begun check your console')
    .end();

  // Start the interval to update the countdown
  const intervalId = setInterval(() => {
    const currentUnixTimestamp = moment().unix();
    // Calculate remaining time for registration and draw
    const timeTillDraw = momentTimeTillDraw - currentUnixTimestamp;
    let registercountDown = showRemaining(
      currentUnixTimestamp,
      momentRegisterCloseTime
    );
    let drawCountDown = showRemaining(currentUnixTimestamp, momentTimeTillDraw);

    if (registercountDown < 0) {
      canRegister = false;
    } else {
      console.log(
        'time until registration closes',
        formatTime(registercountDown)
      );
    }

    if (drawCountDown <= 0) {
      console.log(drawees);
      const uniqueRegistrants = removeDuplicates(drawees);
      for (let i = 0; i < 3; i++) {
        drawWinner(uniqueRegistrants);
      }
      console.log(winners);
    } else {
      console.log('time till draw', formatTime(drawCountDown));
    }
    // Stop the interval when the draw closes
    if (timeTillDraw <= 0) {
      clearInterval(intervalId); // Stop the interval
    }
  }, interval);
  res.end();
});

app.post('/register', (req, res) => {
  const companyID = req.body.companyID;
  if (canRegister === false) {
    res.send('registration is closed');
    res.end();
  } else if (drawees.includes(companyID)) {
    res
      .send(
        'Sorry you have already registered, you are only allowed to register once.'
      )
      .end();
  } else {
    drawees.push(companyID);
    console.log(drawees);
    res.end();
  }
});

app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`);
});

function showRemaining(currentTime, deadlineTime) {
  const countdown = deadlineTime - currentTime;
  return countdown;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes} minutes and ${remainingSeconds} seconds`;
}

function removeDuplicates(array) {
  let unique = [...new Set(array)];
  return unique;
}

function drawWinner(registrants) {
  // Select a random index
  const randomIndex = Math.floor(Math.random() * registrants.length);
  const winner = registrants[randomIndex];
  registrants.splice(randomIndex, 1);
  winners.push(winner);
}
