import '../scss/style.scss';

const root = document.getElementById("root");

const options = {
  carousel: {
    title: "Opacity",
    values: ["None", "Low", "Medium", "High"],
  },
  gauge: {
    title: "Blur",
    values: [10],
  },
};

let selected = -1;

class CarouselEditor {
  constructor(parent, values) {
    this.parent = parent;
    this.values = values;
    this.selectValue = 0;
    this.overlayElement = document.querySelector(".overlay");
    this.init();
  }

  init() {
    this.createElements();
    this.addEventListeners();
    this.updateOverlayOpacity();
    this.levelState(this.selectValue);
  }

  createElements() {
    this.carouselEditor = document.createElement("div");
    this.carouselEditor.classList.add("carousel-editor");

    this.prevButton = this.createButton("prev-btn");
    this.nextButton = this.createButton("next-btn");
    this.editorWrapper = this.createEditorWrapper();
    this.optionTitle = this.createOptionTitle(this.values[0]);
    this.levelPoinsWrapper = this.createIndicatorWrapper();

    this.editorWrapper.appendChild(this.optionTitle);
    this.editorWrapper.appendChild(this.levelPoinsWrapper);
    this.carouselEditor.appendChild(this.prevButton);
    this.carouselEditor.appendChild(this.editorWrapper);
    this.carouselEditor.appendChild(this.nextButton);
    this.parent.appendChild(this.carouselEditor);

    this.addLevelPoint({ values: this.values });

    if (this.selectValue === 0) {
      this.prevButton.classList.add("disable");
    }

    if (this.selectValue === this.values.at(-1)) {
      this.nextButton.classList.add("disable");
    }
  }

  createButton(className) {
    const button = document.createElement("button");
    button.classList.add(className, "hidden");
    return button;
  }

  createEditorWrapper() {
    const editorWrapper = document.createElement("div");
    editorWrapper.classList.add("editor-wrapper");
    return editorWrapper;
  }

  createOptionTitle(text) {
    const optionTitle = document.createElement("h4");
    optionTitle.classList.add("option-title");
    optionTitle.textContent = text;
    return optionTitle;
  }

  createIndicatorWrapper() {
    const levelPoinsWrapper = document.createElement("div");
    levelPoinsWrapper.classList.add("indicator-wrapper", "hidden");
    return levelPoinsWrapper;
  }

  addLevelPoint({ values }) {
    const indicators = document.querySelector(".indicator-wrapper");

    if (values) {
      values.forEach((_, index) => {
        const circle = document.createElement("div");
        circle.classList.add("circle");
        circle.setAttribute("data-index", index);
        indicators.appendChild(circle);

        circle.addEventListener("click", () => {
          this.selectValue = index;
          this.optionTitle.textContent = values[this.selectValue];
          this.updateOverlayOpacity();
          this.levelState(this.selectValue);

          if (this.selectValue === 0) {
            this.prevButton.classList.add("disable");
            this.nextButton.classList.remove("disable");
          } else if (this.selectValue === values.length - 1) {
            this.nextButton.classList.add("disable");
            this.prevButton.classList.remove("disable");
          } else {
            this.prevButton.classList.remove("disable");
            this.nextButton.classList.remove("disable");
          }
        });
      });
    }
  }

  levelState(selectedIndex) {
    const circles = document.querySelectorAll(".circle");
    circles.forEach((circle, index) => {
      if (index === selectedIndex) {
        circle.classList.add("selected");
      } else {
        circle.classList.remove("selected");
      }
    });
  }

  updateOverlayOpacity() {
    const opacityValues = [0, 0.25, 0.6, 0.9];
    this.overlayElement.style.opacity = opacityValues[this.selectValue];
  }

  addEventListeners() {
    this.nextButton.addEventListener("click", () => {
      if (this.selectValue < this.values.length - 1) {
        this.selectValue++;
        this.optionTitle.textContent = this.values[this.selectValue];
        this.levelState(this.selectValue);
        this.updateOverlayOpacity();
        this.prevButton.classList.remove("disable");

        if (this.selectValue === this.values.length - 1) {
          this.nextButton.classList.add("disable");
        } else {
          this.nextButton.classList.remove("disable");
        }
      }
    });

    this.prevButton.addEventListener("click", () => {
      if (this.selectValue > 0) {
        this.selectValue--;
        this.optionTitle.textContent = this.values[this.selectValue];
        this.levelState(this.selectValue);
        this.updateOverlayOpacity();
        this.nextButton.classList.remove("disable");

        if (this.selectValue === 0) {
          this.prevButton.classList.add("disable");
        } else {
          this.prevButton.classList.remove("disable");
        }
      }
    });

    this.parent.addEventListener("mouseenter", () => {
      this.nextButton.classList.remove("hidden");
      this.prevButton.classList.remove("hidden");
      this.levelPoinsWrapper.classList.remove("hidden");
    });

    this.parent.addEventListener("mouseleave", () => {
      this.nextButton.classList.add("hidden");
      this.prevButton.classList.add("hidden");
      this.levelPoinsWrapper.classList.add("hidden");
    });
  }
}

class GaugeEditor {
  constructor(parent, value) {
    this.parent = parent;
    this.value = value;
    this.currentValue = value[0];
    this.blurElement = document.querySelector(".blur");
    this.init();
  }

  init() {
    this.createElements();
    this.addEventListeners();
    this.updateBlur();
  }

  createElements() {
    this.gaugeEditor = document.createElement("div");
    this.gaugeEditor.classList.add("gauge-editor");

    this.prevButton = this.createButton("prev-btn");
    this.nextButton = this.createButton("next-btn");
    this.editorWrapper = this.createEditorWrapper();
    this.progressLine = document.createElement("div");
    this.progressLine.classList.add("progress-line");

    this.progressValue = document.createElement("h5");
    this.progressValue.classList.add("progressValue");

    this.valueBar = document.createElement("div");
    this.valueBar.classList.add("valueBar");
    this.valueBar.style.width = this.currentValue + "%";

    this.gaugeEditor.appendChild(this.prevButton);
    this.gaugeEditor.appendChild(this.editorWrapper);
    this.editorWrapper.appendChild(this.progressValue);
    this.editorWrapper.appendChild(this.progressLine);
    this.progressLine.appendChild(this.valueBar);
    this.gaugeEditor.appendChild(this.nextButton);

    this.parent.appendChild(this.gaugeEditor);

    this.progressValue.textContent = this.currentValue;

    if (this.currentValue === 0) {
      this.prevButton.classList.add("disable");
    }

    if (this.currentValue === 100) {
      this.nextButton.classList.add("disable");
    }
  }

  createButton(className) {
    const button = document.createElement("button");
    button.classList.add(className, "hidden");
    return button;
  }

  createEditorWrapper() {
    const editorWrapper = document.createElement("div");
    editorWrapper.classList.add("editor-wrapper");
    return editorWrapper;
  }

  updateBlur() {
    this.blurElement.style.backdropFilter = `blur(${this.currentValue}px)`;
  }

  addEventListeners() {
    this.nextButton.addEventListener("click", () => {
      if (this.currentValue < 100) {
        this.currentValue += 10;
        this.valueBar.style.width = this.currentValue + "%";
        this.prevButton.classList.remove("disable");
        this.progressValue.textContent = this.currentValue;
        this.updateBlur();

        if (this.currentValue === 100) {
          this.nextButton.classList.add("disable");
        } else {
          this.nextButton.classList.remove("disable");
        }
      }
    });

    this.prevButton.addEventListener("click", () => {
      if (this.currentValue > 0) {
        this.currentValue -= 10;
        this.valueBar.style.width = this.currentValue + "%";
        this.nextButton.classList.remove("disable");
        this.progressValue.textContent = this.currentValue;
        this.updateBlur();

        if (this.currentValue === 0) {
          this.prevButton.classList.add("disable");
        } else {
          this.prevButton.classList.remove("disable");
        }
      }
    });

    this.parent.addEventListener("mouseenter", () => {
      this.nextButton.classList.remove("hidden");
      this.prevButton.classList.remove("hidden");
    });

    this.parent.addEventListener("mouseleave", () => {
      this.nextButton.classList.add("hidden");
      this.prevButton.classList.add("hidden");
    });
  }
}

function addCarouselEditor(parent, values) {
  new CarouselEditor(parent, values);
}

function addGaugeEditor(parent, value) {
  new GaugeEditor(parent, value);
}

function showList() {
  const list = document.createElement("div");
  list.classList.add("list");
  root.appendChild(list);
}

function createWidgetWrapper() {
  const wrapper = document.createElement("div");
  wrapper.classList.add("widget-wrapper");
  return wrapper;
}

function createItem(index, title) {
  const item = document.createElement("div");
  item.classList.add("item");
  item.setAttribute("id", index);

  const widgetTitle = document.createElement("h4");
  widgetTitle.classList.add("widget-title");
  widgetTitle.textContent = title;

  item.appendChild(widgetTitle);
  return item;
}

function addEventListenersToItem(item) {
  item.addEventListener("mouseenter", () => {
    selected = item.getAttribute("id");
    item.classList.add("hover");
    console.log("selected:", selected);
  });

  item.addEventListener("mouseleave", () => {
    selected = -1;
    console.log("selected:", selected);
    item.classList.remove("hover");
  });
}

function addOptionItem(data) {
  const list = document.querySelector(".list");
  let index = 0;

  for (const key in data) {
    const { title, values } = data[key];
    const wrapper = createWidgetWrapper();
    const item = createItem(index, title);
    index++;

    addEventListenersToItem(item);

    wrapper.appendChild(item);
    list.appendChild(wrapper);

    if (key === "carousel") {
      addCarouselEditor(item, values);
    }

    if (key === "gauge") {
      addGaugeEditor(item, values);
    }
  }
}

function background() {
  const img = document.createElement("div");
  img.classList.add("backgound");

  const overlay = document.createElement("div");
  overlay.classList.add("overlay");

  const blur = document.createElement("div");
  blur.classList.add("blur");

  root.appendChild(img);
  root.appendChild(blur);
  root.appendChild(overlay);
}

document.addEventListener("DOMContentLoaded", () => {
  background();
  showList();
  addOptionItem(options);
});