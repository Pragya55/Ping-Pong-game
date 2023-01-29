"use strict";
let paddle1 = document.getElementById("rodOne");
let paddle2 = document.getElementById("rodTwo");
let currentTimeoutIsRunning = false;
let ball = document.getElementById("ball");

let currentScore = {
  first: 0,
  second: 0
};
let action = {
  loosing_side: "",
  lost: false
};

function touchUpperRod() {
  let ballLeftNumerical = ball.getBoundingClientRect().left;
  let ballTopNumerical = ball.getBoundingClientRect().top;
  let barLeftNumerical = parseInt(
    paddle1.style.left.substring(0, paddle1.style.left.length - 2)
  );
  if (
    ballTopNumerical <= paddle1.clientHeight &&
    ballLeftNumerical + ball.clientWidth / 2 > barLeftNumerical &&
    ballLeftNumerical + ball.clientWidth / 2 <
      barLeftNumerical + paddle1.clientWidth
  ) {
    if (!currentTimeoutIsRunning) {
      currentTimeoutIsRunning = true;
      setTimeout(function () {
        currentScore.first++;
        currentTimeoutIsRunning = false;
      }, 200);
    }
    return true;
  }
  return false;
}

function touchLowerRod() {
  let ballTopNumerical = ball.getBoundingClientRect().top;
  let ballLeftNumerical = ball.getBoundingClientRect().left;
  let barLeftNumerical = parseInt(
    paddle2.style.left.substring(0, paddle2.style.left.length - 2)
  );
  if (
    ballTopNumerical + ball.clientHeight + paddle2.clientHeight >=
      document.documentElement.clientHeight &&
    ballLeftNumerical + ball.clientWidth / 2 > barLeftNumerical &&
    ballLeftNumerical + ball.clientWidth / 2 <
      barLeftNumerical + paddle2.clientWidth
  ) {
    if (!currentTimeoutIsRunning) {
      currentTimeoutIsRunning = true;
      setTimeout(function () {
        currentScore.second++;
        currentTimeoutIsRunning = false;
      }, 200);
    }
    return true;
  }
  return false;
}

function alignCenterElement(element) {
  element.style.left =
    (
      document.documentElement.clientWidth / 2 -
      element.offsetWidth / 2
    ).toString() + "px";
  element.style.left =
    (
      document.documentElement.clientWidth / 2 -
      element.offsetWidth / 2
    ).toString() + "px";
  if (element == ball) {
    if (action.lost) {
      if (action.loosing_side == "first") {
        ball.style.top = (paddle1.clientHeight + 5).toString() + "px";
      } else {
        ball.style.top =
          (
            document.documentElement.clientHeight -
            paddle2.clientHeight -
            ball.clientHeight -
            5
          ).toString() + "px";
      }
    } else {
      element.style.top =
        (document.documentElement.clientHeight / 2).toString() + "px";
    }
  }
}

function addEventToRods() {
  window.addEventListener("keydown", function (event) {
    let code = event.keyCode;
    // code 68 for key of 'd'
    if (code == 68) {
      let left_numeric = parseInt(
        paddle1.style.left.substring(0, paddle1.style.left.length - 2)
      );
      left_numeric += 20;
      if (
        left_numeric + paddle1.offsetWidth >
        document.documentElement.clientWidth
      ) {
        left_numeric =
          document.documentElement.clientWidth - paddle1.offsetWidth;
      }
      paddle1.style.left = left_numeric.toString() + "px";
      paddle2.style.left = left_numeric.toString() + "px";
      // code 65 for key of 'a'
    } else if (code == 65) {
      let left_numeric = parseInt(
        paddle1.style.left.substring(0, paddle1.style.left.length - 2)
      );
      left_numeric -= 20;
      if (left_numeric < 0) {
        left_numeric = 0;
      }
      paddle1.style.left = left_numeric.toString() + "px";
      paddle2.style.left = left_numeric.toString() + "px";
    }
  });
}

function setIntervalForBall() {
  let intervalId = setInterval(function () {
    let numLeft = ball.getBoundingClientRect().left;
    let numTop = ball.getBoundingClientRect().top;
    //hit left paddel
    if (numLeft <= 0) {
      let class_present = ball.classList[0];
      if (class_present == "animateTopLeft") {
        ball.classList.remove(class_present);
        ball.classList.add("animateTopRight");
      } else if (class_present == "animateBottomLeft") {
        ball.classList.remove(class_present);
        ball.classList.add("animateBottomRight");
      }
    } else if (
      numLeft + ball.offsetWidth >=
      document.documentElement.clientWidth
    ) {
      //hit right paddel
      let class_present = ball.classList[0];
      if (class_present == "animateTopRight") {
        ball.classList.remove(class_present);
        ball.classList.add("animateTopLeft");
      } else if (class_present == "animateBottomRight") {
        ball.classList.remove(class_present);
        ball.classList.add("animateBottomLeft");
      }
    } else if (
      numTop <= 0 ||
      numTop + ball.offsetHeight >= document.documentElement.clientHeight
    ) {
      //game over
      ball.classList.remove(ball.classList[0]);
      if (numTop <= 0) {
        action.loosing_side = "first";
        action.lost = true;
      } else if (
        numTop + ball.offsetHeight >=
        document.documentElement.clientHeight
      ) {
        action.loosing_side = "second";
        action.lost = true;
      }
      alignCenterElement(ball);
      alignCenterElement(paddle1);
      alignCenterElement(paddle2);

      alert("Game Over");
      clearInterval(intervalId);
      if (currentScore.first > localStorage.getItem("first")) {
        localStorage.setItem("first", currentScore.first);
      }
      if (currentScore.second > localStorage.getItem("second")) {
        localStorage.setItem("second", currentScore.second);
      }
      currentScore.first = 0;
      currentScore.second = 0;
      show_score();
    } else if (touchLowerRod()) {
      //touched lower bar

      let class_present = ball.classList[0];
      if (class_present == "animateBottomRight") {
        ball.classList.remove(class_present);
        ball.classList.add("animateTopRight");
      } else if (class_present == "animateBottomLeft") {
        ball.classList.remove(class_present);
        ball.classList.add("animateTopLeft");
      }
    } else if (touchUpperRod()) {
      //touched upper bar

      let class_present = ball.classList[0];
      if (class_present == "animateTopRight") {
        ball.classList.remove(class_present);
        ball.classList.add("animateBottomRight");
      } else if (class_present == "animateTopLeft") {
        ball.classList.remove(class_present);
        ball.classList.add("animateBottomLeft");
      }
    }
  }, 1);
}

function show_score() {
  if (localStorage.getItem("first") == null) {
    localStorage.setItem("first", 0);
    localStorage.setItem("second", 0);
    window.alert(
      "This is your first time \n For start the Game Press Enter \n  Press A and D key to Play !!"
    );
  } else {
    window.alert(
      "Rod 1 has a maximum score of " +
        localStorage.getItem("first").toString() +
        "\n" +
        "Rod 2 has a maximum score of " +
        localStorage.getItem("second")
    );
  }
}

show_score();
alignCenterElement(paddle1);
alignCenterElement(paddle2);
alignCenterElement(ball);
setIntervalForBall();
addEventToRods();

document.addEventListener("keydown", function (event) {
  if (event.keyCode == 13) {
    if (action.lost) {
      if (action.loosing_side == "first") {
        ball.classList.add("animateBottomRight");
      } else {
        ball.classList.add("animateTopRight");
      }
    } else ball.classList.add("animateBottomRight");
    setIntervalForBall();
  }
});
