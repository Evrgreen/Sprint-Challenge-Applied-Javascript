// STEP 3: Create Article cards.
// -----------------------
// Send an HTTP GET request to the following address: https://lambda-times-backend.herokuapp.com/articles
// Stduy the response data you get back, closely.
// You will be creating a component for each 'article' in the list.
// This won't be as easy as just iterating over an array though.
// Create a function that will programmatically create the following DOM component:
//
// <div class="card">
//   <div class="headline">{Headline of article}</div>
//   <div class="author">
//     <div class="img-container">
//       <img src={url of authors image} />
//     </div>
//     <span>By {authors name}</span>
//   </div>
// </div>
//
// Create a card for each of the articles and add the card to the DOM.

// Array of template objects to map the data from the axios call to

elementTags = [
  {
    name: "card",
    tagName: "div",
    props: { className: "card", "data-parent-flag": true }
  },
  {
    name: "headline",
    tagName: "div",
    props: { className: "headline", textContent: "" }
  },
  {
    name: "author",
    tagName: "div",
    props: { className: "author", "data-grandParent-flag": true }
  },
  {
    name: "img-container",
    tagName: "div",
    props: { className: "img-container", "data-parent-flag": true }
  },
  { name: "authorPhoto", tagName: "img", props: { src: "" } },
  { name: "authorName", tagName: "span", props: { textContent: "By: " } }
];
// Axios call, json object format response.data.(target object)
//target is an object>nested objects>arrays

axios
  .get("https://lambda-times-backend.herokuapp.com/articles")
  .then(response => {
    Object.values(response.data.articles).forEach(array => {
      array.forEach((article, index) => {
        cardConstructor(article, elementTags);
      });
    });
  });

// Deep copies array called into it
const deepCopyFunction = inObject => {
  let outObject, value, key;
  if (typeof inObject !== "object" || inObject === null) {
    return inObject; // Return the value if inObject is not an object
  }
  // Create an array or object to hold the values
  outObject = Array.isArray(inObject) ? [] : {};
  for (key in inObject) {
    value = inObject[key];
    // Recursively (deep) copy for nested objects, including arrays
    outObject[key] =
      typeof value === "object" && value !== null
        ? deepCopyFunction(value)
        : value;
  }
  return outObject;
};

// creator function takes a single object and creates a HTML element, returns created element
// spreads object.props nested object into elements's properties
function creator(data) {
  return Object.assign(document.createElement(data.tagName), data.props);
}
// takes an array of html elements, returns a single HTML element with all other elements in array appended to it
function stitcher(data) {
  let parent = null,
    child,
    grandParent,
    temp;
  data.forEach((element, index) => {
    //loops through each element in array
    // filters element with custom data-parent-flag property, assigns the first one to parent variable and any subsequent elements will push current oarent to temp variable and assign itself to parent
    if (element["data-parent-flag"] == true) {
      if (parent == null) {
        parent = element;
      } else {
        temp = parent;
        parent = element;
      }
      //All other elements passed here
    } else {
      if (element["data-grandParent-flag"]) {
        //filters element with custom data-grandParent-flag property
        grandParent = element;
      } else {
        child = element; //all remain elements are assigned to child property
      }
    }
    if (child) {
      //if child element has a value other than null, appends current child to parent
      parent.append(child);
      if (grandParent) {
        //if grandParent element has a value other than null appends current parent to grandparent and sets grandParent to null
        grandParent.append(parent);
        parent = grandParent;
        grandParent = null;
      }
      child = null; //child set to null at end of loop
    }
  });
  if (temp) {
    //if temp has a value current parent will be attached to temp
    temp.append(parent);
  }
  return temp;
}
// Function for mapping data from a axios call to a objects in an array json object to

function splicer(data, skeleton) {
  let templateArray = deepCopyFunction(skeleton); //deep copies the passed in array to prevent mutation of template
  finalArray = templateArray.map((item, index) => {
    //mapsthrough each element in template array and adds them to a new array
    if (item.name in data) {
      // checks if the items name is a key in data
      // if skeleton item is a element with a textContent property the the items nested props objects textConent is updated with value from data
      if ("textContent" in item.props) {
        item.props[`textContent`] += data[item.name];
      } // if skeleton item is a element with a href property then the items nested props objects href is updated with value from data
      else if ("href" in item.props) {
        item.props["href"] = data[item.name];
        item.props.textContent = data.login;
      } // if skeleton item is a element with a textContent property the the items nested props objects textConent is updated with value from data
      else if ("src" in item.props) {
        item.props["src"] = data[item.name];
      }
    }
    return item;
  });
  return finalArray; //returns the final array comprised of the objects from the skeleton argument mapped with the data from data argument
}

// Main constructor function,takes two objects as arguments, will be fed one object at a time from axios call and the template for the element being built, appends a fully created card to Dom
function cardConstructor(data, skeleton) {
  const newArray = splicer(data, skeleton);
  newArray.forEach((element, index) => {
    newArray[index] = creator(element);
  });
  document.querySelector(".cards-container").append(stitcher(newArray));
}
