var myPath;
var textGroup = new Group();
let textPosition = 0;

const params = {
  spacing: 12,
  repeat: false,
  yourTextHere: "It was on a dreary night of November...",
};

// Rectangle and text initialization
let rectSize = new Size(250, 250);
let rect = new Path.Rectangle({
  point: view.bounds.topLeft - [50, 50],
  size: rectSize,
  strokeColor: "white",
});
project.activeLayer.addChild(rect);

let centerText = new PointText({
  point: [view.bounds.topLeft.x + 10, view.bounds.topLeft.y + 25],
  content: "Welcome to touch-reading, visual poetry! Click and drag to compose your poem:)",
  fillColor: "black",
  fontFamily: "Arial",
  fontWeight: "bold",
  fontSize: 20,
  justification: "left",
});
project.activeLayer.addChild(centerText);

// Date and signature text
let dateTimeText = new PointText({
  point: view.bounds.bottomLeft + [10, -20],
  content: "today",
  fillColor: "black",
  fontFamily: "Arial",
  fontWeight: "bold",
  fontSize: 10,
  justification: "left",
});
project.activeLayer.addChild(dateTimeText);

let signature = new PointText({
  point: view.bounds.bottomRight - [10, 20],
  content: "words from mary shelley, frankenstein, chapter 5 - @caterinarigobianco",
  fillColor: "black",
  fontFamily: "Arial",
  fontWeight: "bold",
  fontSize: 10,
  justification: "right",
});
project.activeLayer.addChild(signature);

// Update positions on resize
view.onResize = function (event) {
  updateTextAndRectPosition();
  updateDatePosition();
  updateSignaturePosition();
};

// Functions to update positions
function updateTextAndRectPosition() {
  rect.position = view.center;
  centerText.point = [
    view.center.x - rectSize.width / 2 + 10,
    view.center.y - rectSize.height / 2 + 30,
  ];
}

function updateDatePosition() {
  dateTimeText.point = view.bounds.bottomLeft + [10, -20];
}

function updateSignaturePosition() {
  signature.point = view.bounds.bottomRight - [10, 20];
}

// Update date and time content
function updateDateTime() {
  let now = new Date();
  let dateString = now.toLocaleDateString();
  let timeString = now.toLocaleTimeString();
  dateTimeText.content = `date: ${dateString}, time: ${timeString}`;
}

setInterval(updateDateTime, 1000);

// Mouse events for drawing and text placement
function onMouseDown(event) {
  if (centerText) {
    centerText.remove();
    centerText = null;
  }
  if (rect) {
    rect.remove();
    rect = null;
  }
  myPath = new Path();
  myPath.strokeColor = "black";
}

let numCharacters;

function onMouseDrag(event) {
  myPath.add(event.point);
  textGroup.removeChildren();
  numCharacters = Math.ceil(myPath.length / params.spacing);

  for (let i = 0; i < numCharacters; i++) {
    const offset = params.spacing * i;
    const point = myPath.getPointAt(offset);
    const tangent = myPath.getTangentAt(offset);

    if (tangent && textPosition + i < params.yourTextHere.length) {
      const text = new PointText({
        point: point,
        content: params.yourTextHere[textPosition + i],
        fillColor: "black",
        fontFamily: "Arial",
        fontWeight: "bold",
        fontSize: 20,
      });
      text.rotate(tangent.angle);
      textGroup.addChild(text);
    }
  }
}

function onMouseUp(event) {
  myPath = null;
  if (!params.repeat) {
    textPosition += numCharacters;
  }
  project.activeLayer.addChildren(textGroup.children);
}

const pane = new Pane();

pane.addBinding(params, "spacing", { min: 10, max: 200 });
pane.addBinding(params, "repeat");
pane.addButton({ title: "restart text" }).on("click", function () {
  textPosition = 0;
});

pane.addButton({ title: "export" }).on("click", function () {
  const svg = project.exportSVG({ asString: true });
  downloadSVGFile("touch-reading", svg);
});

