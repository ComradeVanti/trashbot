<template>
  <div class="fill-parent">
    <toast-msg
      id="locationError"
      msg="Wir konnten keinen Standort finden! Überprüfe deine Standorteinstellungen."
      bgColor="danger"
    />
    <div class="content">
      <h1>Ranking</h1>

      <div class="rectPlayers">
        <table class="table">
          <tbody>
            <tr v-for="(player, idx) in robots" :key="idx">
              <th scope="row">{{ idx + 1 }}.</th>
              <td>{{ player.name }}</td>
              <td>{{ getCoolness(idx) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <button-comp class="startBtn" @click="newGame()">
        Neues Spiel
      </button-comp>
    </div>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { gameStore } from "../stores/index.ts";

import ButtonComp from "@/components/ButtonComp.vue";

export default {
  name: "EndView",
  components: { ButtonComp },
  data() {
    return {
      robots: [
        {
          id: null,
          location: {
            lat: 0,
            lng: 0,
          },
          name: "",
          robot: {
            arms: {
              coolness: null,
              range: null,
            },
            body: {
              coolness: null,
              range: null,
            },
            head: {
              coolness: null,
              range: null,
            },
            legs: {
              coolness: null,
              range: null,
            },
          },
        },
      ],
    };
  },

  created() {
    document.addEventListener("beforeunload", this.deleteStorage);

    this.$socket.emit("game/robots", {
      roomId: this.roomId,
    });
  },

  computed: {
    ...mapState(gameStore, {
      roomId: "roomId",
    }),
  },

  sockets: {
    "game/robots": function (data) {
      this.robots = data;
    },
  },

  methods: {
    deleteStorage() {
      localStorage.clear();
    },

    newGame() {
      this.$router.push("/");
    },

    getCoolness(idx) {
      const robot = this.robots[idx];
      return (
        robot.robot.head.coolness +
        robot.robot.body.coolness +
        robot.robot.arms.coolness +
        robot.robot.legs.coolness
      );
    },
  },
};
</script>

<style scoped>
h2 {
  font-size: 26px;
  margin-top: var(--dim-regular);
}

p {
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  font-size: 26px;
  text-align: center;
  margin-top: 10px;
}

.rectUser {
  width: 70vw;
  height: 65px;
  margin-top: var(--dim-large);
}

.rectPlayers {
  width: 70vw;
  height: 36vh;
  background: #575a68;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 18px;
  flex-grow: 1;
  overflow: scroll;
}

.startBtn {
  margin-top: 15px;
  width: 60%;
  margin-bottom: 10px;
}

.content {
  background: #ffffff;
  box-shadow: inset 3px 6px 8px rgba(0, 0, 0, 0.25);
  border-radius: 41px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
</style>
