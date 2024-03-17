import "./ui.css";

function button(label, className) {
  const el = document.createElement("div");
  el.innerHTML = `
    <button class="button-pushable ${className}" role="button">
      <span class="button-shadow"></span>
      <span class="button-edge"></span>
      <span class="button-front text">
        ${label}
      </span>
    </button>
  `;
  return el.getElementsByClassName("button-pushable")[0]
}

// ui will listen to events and update
// the dom accordingly
export function createUI(anyone) {
  // show anyone.ticks and anyone.fps in the top left
  const diagnostics = document.createElement("div");
  diagnostics.classList.add("meter");
  diagnostics.textContent = `Ticks: ${anyone.ticks}\nFPS: ${anyone.fps}`;
  document.body.appendChild(diagnostics);

  // add a button for adding bodies
  const addButton = button("Add Body", "add-body");
  document.body.appendChild(addButton);
  addButton.onclick = () => {
    anyone.addBody();
  };

  // add a button for verifying
  const verifyButton = button("Verify", "verify");
  document.body.appendChild(verifyButton);
  verifyButton.onclick = () => {
    anyone.verify();
  };

  // listen to the game for changes
  anyone.on("change", () => {
    const { live, withering } = anyone.bodies.reduce(
      (acc, body) => {
        if (body.hp > 0) {
          acc.live.push(body);
        } else if (body.hp > -anyone.WITHERING_STEPS) {
          acc.withering.push(body);
        }
        return acc;
      },
      { live: [], withering: [] }
    );

    // update the dom
    container.innerHTML = `
      <div>
        <h1>Live Bodies: ${live.length}</h1>
        <h1>Withering Bodies: ${withering.length}</h1>
      </div>
    `;
  });
}
