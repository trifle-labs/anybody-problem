import Q5 from "./q5.js";
import { Anybody } from "./anybody.js";

const q5 = new Q5();
let anybody;
q5.setup = () => {
  anybody = new Anybody(q5, { mode: "nft", seed: 0n });
};
q5.draw = () => {
  anybody.draw();
};
