<template>
  <div id="timer">
    <span id="time">05:00</span>
  </div>
</template>

<script>
export default {
  name: "TimerComponent",
  mounted() {
    var fiveMinutes = 60 * 5;
    var display = document.querySelector("#time");

    console.log(display);

    this.startTimer(fiveMinutes, display);
  },
  methods: {
    startTimer(duration, display) {
      var timer = duration,
        minutes,
        seconds;

      setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.innerHTML = minutes + ":" + seconds;

        if (--timer < 0) {
          timer = duration;
        }
      }, 1000);
    },
  },
};
</script>

<style>
#timer {
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 20px;

  z-index: 1000000;

  padding: 10px 30px;
  border-radius: 30px;
  background-color: white;
  display: flex;
}
#time {
  text-align: center;
  margin: auto;
}
</style>
