// STEP 1: Create a header component.
// -----------------------
// Using a function create the component you see below:
//
//  <div class="header">
//    <span class="date">SMARCH 28, 2019</span>
//    <h1>Lambda Times</h1>
//    <span class="temp">98°</span>
//  </div >
// And add it to the DOM in the .header-container component
elementTags = [
  {
    name: "header",
    tagName: "div",
    props: { className: "header", "data-parent-flag": true }
  },
  {
    name: "date",
    tagName: "span",
    props: { className: "data", textContent: "Smarch 28, 2019" }
  },
  { name: "title", tagName: "h1", props: { textContent: "Lambda Times" } },
  {
    name: "temp",
    tagName: "span",
    props: { className: "temp", textContent: "98 \u00B0" }
  }
];
function creator(data) {
  return Object.assign(document.createElement(data.tagName), data.props);
}

function stitcher(data) {
  let parent, child;
  data.forEach(element => {
    if (element["data-parent-flag"] == true) {
      parent = element;
    } else {
      child = element;
    }
    if (child) {
      parent.append(child);
    }
  });
  console.log(parent);
  return parent;
}
console.log(elementTags);
function Header(data) {
  const constructArray = data.map(item => {
    return creator(item);
  });
  console.log(constructArray);
  document.querySelector(".header-container").append(stitcher(constructArray));
}
Header(elementTags);
