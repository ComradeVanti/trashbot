import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/StartView.vue";
import GameView from "../views/GameView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import LobbyView from "../views/LobbyView.vue";
import RuleSetView from "../views/RuleSetView.vue";
import EndView from "../views/EndView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/game",
      name: "game",
      component: GameView,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not_found",
      component: NotFoundView,
    },
    {
      path: "/lobby",
      name: "lobby",
      component: LobbyView,
    },
    {
      path: "/rules",
      name: "rules",
      component: RuleSetView,
    },
    {
      path: "/end",
      name: "end",
      component: EndView,
    },
  ],
});

export default router;
