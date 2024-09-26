class Step {
  constructor(name) {
    this.name = name;
    this.data = {};
  }

  addDataPoint(name, value) {
    this.data[name] = value;
  }
}

/**
 * The Algorithm class saves the steps while the calculation,
 * so it is used for testing the intermediate steps and also
 * to display them at the gui.
 */
export class Algorithm {
  constructor() {
    this.steps = {};
  }

  step(name) {
    const act = this.steps[name];
    if (!act) {
      this.steps[name] = new Step(name);
    }
    this.curr = this.steps[name];
    return this;
  }

  saveVariable(name, value) {
    this.curr.addDataPoint(name, value);
    return this;
  }
}
