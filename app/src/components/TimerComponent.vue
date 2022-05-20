<template>
  <div id="timer"></div>
</template>

<script>
import { mapState } from "pinia";
import { gameStore } from "../stores/index.ts";

export default {
  name: "TimerComponent",
  props: ["time"],

  computed: {
    ...mapState(gameStore, {
      time: "time"
    })
  },

  methods: {
    startTimer() {
      console.log(this.time);

      var duration = 60 * this.time;
      var display = document.querySelector("#timer");

      var timer = duration,
        minutes,
        seconds;

      setInterval(function() {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.innerHTML = `<span id="time">${minutes}:${seconds}</span>`;

        if (--timer < 0) {
          timer = duration;
        }
      }, 1000);
    }
  },

  watch: {
    time: function() {
      this.startTimer();
    }
  }
};
</script>

<style>
#timer {
  position: absolute;
  bottom: 0;
  right: 0;
  margin: var(--dim-regular);
  background-color: var(--col-background);
  padding: var(--dim-small) var(--dim-regular);
  border-radius: var(--dim-corners);
  z-index: 1000000;
  width: 105px; 
}

#time {
  text-align: center;
  color: var(--col-on-background);
  width: 100%;
  display: block;
}
</style>
