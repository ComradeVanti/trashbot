<template>
  <div>
    <div class="content">
      <div class="container">
        <h1>Ranking</h1>
        <div class="rectPlayers">
          <!-- <p v-for="(player, idx) in allPlayers" :key="idx"> -->
          <p>Gewinner</p>
        </div>

        <button-comp class="endBtn" @click="newGame">Neues Spiel</button-comp>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonComp from "@/components/ButtonComp.vue";

export default {
  name: "EndView",
  components: { ButtonComp },
  created() {
    document.addEventListener("beforeunload", this.deleteStorage);

    // this.askResult();
  },

  socket: {
    // get all results
  },

  methods: {
    deleteStorage() {
      localStorage.clear();
    },

    newGame() {
      this.$router.push("/");
    },

    // ask for results
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  height: 100%;
  align-items: center;
  justify-content: space-between;
}

h1 {
  width: 306px;
  font-family: "Play", sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 54px;
  line-height: 88.7%;
  /* or 48px */
  text-align: center;
  color: #5a81bc;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.3);
  z-index: 10;
  margin-top: 40px;
}

h2 {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 700;
  font-size: 26px;
  text-align: center;
  color: #5a81bc;
}

p {
  color: #ffffff;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 26px;
  text-align: center;
  margin-top: 10px;
}

.rectUser {
  width: 70vw;
  height: 65px;
  background: #575a68;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 18px;
  margin-top: 30px;
  margin-bottom: 20px;
}

.rectPlayers {
  width: 70vw;
  height: 36vh;
  background: #575a68;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 18px;
  overflow: scroll;
}

.endBtn {
  margin-top: 15px;
  width: 70%;
  margin-bottom: 10px;
}

.content {
  position: absolute;
  width: 90vw;
  height: 90vh;
  margin: 5vh 5vw;
  background: #ffffff;
  box-shadow: inset 3px 6px 8px rgba(0, 0, 0, 0.25);
  border-radius: 41px;
}
</style>
