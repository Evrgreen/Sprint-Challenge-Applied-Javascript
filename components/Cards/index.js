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
// axios
//   .get("https://lambda-times-backend.herokuapp.com/articles")
//   .then(response => {
//     console.log(response);
//   });

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

const dummy_data = {
  javascript: [
    {
      headline:
        "ES8: The Next Step in the Evolution of Javascript and What it Means For Your Projects",
      authorPhoto: "./assets/sir.jpg",
      authorName: "SIR RUFF'N'STUFF"
    },
    {
      headline:
        "Type Coercion: Why Does NaN !== NaN? and Other Strange Occurrences",
      authorPhoto: "./assets/bones.jpg",
      authorName: "BONES R. LIFE"
    },
    {
      headline:
        "When to Rest, When to Spread: Why There Are Two Meanings Behind '...'",
      authorPhoto: "./assets/puppers.jpg",
      authorName: "PUPPER S. DOGGO"
    },
    {
      headline:
        "Typescript: Ten Things you Should Know Before Building Your Next Angular Application",
      authorPhoto: "./assets/sir.jpg",
      authorName: "SIR RUFF'N'STUFF"
    }
  ],
  bootstrap: [
    {
      headline: "Bootstrap 5: Get a Sneak Peak at all the New Features",
      authorPhoto: "./assets/fido.jpg",
      authorName: "FIDO WALKSALOT"
    },
    {
      headline:
        "UI Frameworks: A Comparison, Which Made Our List? (Hint: Bootstrap is on it)",
      authorPhoto: "./assets/max.jpg",
      authorName: "MAX GOODBOYE"
    },
    {
      headline:
        "The Hottest New Bootstrap 4 Components Every Developer Needs to Know About",
      authorPhoto: "./assets/max.jpg",
      authorName: "MAX GOODBOYE"
    }
  ]
};

function creator(data) {
  return Object.assign(document.createElement(data.tagName), data.props);
}
function stitcher(data) {
  let parent = null,
    child,
    grandParent,
    temp;
  data.forEach(element => {
    if (element["data-grandparent-flag"]) {
      grandParent = element;
    }
    if (element["data-parent-flag"] == true) {
      if (parent == null) {
        parent = element;
      } else {
        temp = parent = element;
        // console.log(parent, temp);
      }
    } else {
      child = element;
    }
    if (child) {
      parent.append(child);
      if (grandParent) {
        grandParent.append(parent);
        parent = grandparent;
      }
      child = null;
    }
    if (temp) {
      temp.append(parent);
    }
    return temp;
  });
  console.log(parent);
  return parent;
}
function splicer(data, skeleton) {
  let count = 0;
  let templateArray = deepCopyFunction(skeleton);
  console.log(elementTags === templateArray);
  // loops through each element in skeleton

  finalArray = templateArray.map((item, index) => {
    // checks if the items name is a key in data
    if (item.name in data) {
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
    count++;
    return item;
  });
  console.log(`the count is ${count}`);
  return finalArray;
}
Object.values(dummy_data).forEach(array => {
  console.log(array);
  array.forEach((article, index) => {
    console.log(article, index);
    cardConstructor(article, elementTags);
  });
});
// console.log(elementTags);
function cardConstructor(data, skeleton) {
  const newArray = splicer(data, skeleton);
  newArray.forEach((element, index) => {
    newArray[index] = creator(element);
  });
  console.log(newArray);
}
