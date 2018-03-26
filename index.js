const url = "https://api.myjson.com/bins/9jfkn";
const $ = str => document.getElementById(str);

// from http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
String.prototype.hashCode = function() {
  let hash = 0;
  if (this.length === 0) return hash;
  for (let i = 0; i < this.length; i++) {
    const chr = this.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function loadData() {
  getData()
    .then(data => {
      entry = data[URLHash()];
      console.log(entry);
      if (entry && entry.text) $("text1").value = entry.text;
    })
    .then(console.log("Loaded."))
    .catch(err => console.log(err));
}

function submit() {
  const text = $("text1").value;
  console.log("Submitted.");
  const hash = text.hashCode();

  getData()
    .then(data => {
      data[hash] = {
        text: String(text),
        dateSubmitted: new Date().toJSON().slice(0, 16)
      };
      return data;
    })
    .then(data => updateData(data)) // update data
    .then(navigate(hash)); // redirect to new url
}

function getData() {
  // get data from db
  return fetch(url).then(res => res.json());
}

function updateData(newData) {
  // update JSON
  fetch(url, {
    method: "PUT", // or POST
    body: JSON.stringify(newData),
    headers: new Headers({
      "Content-Type": "application/json"
    })
  })
    .then(res => res.json())
    .catch(error => console.error("Error:", error))
}

function URLHash() {
  // hash-based client side routing
  return String(window.location.href.split("#")[1]) || "";
}

function navigate(path) {
  const current = window.location.href;
  window.location.href = current.replace(/#(.*)$/, "") + "#" + path;
  // set confirmation
  const url = window.location.href.replace(/(^\w+:|^)\/\//, ''); // remove http, https, www
  $("confirm").innerText = "Successfully saved at " + url;
}

function textChanged() {
  $("confirm").innerText = "Unsaved changes.";
}

window.onload = function() {
  console.log("URL is: " + window.location.href);
  if (URLHash()) {
    loadData();
  }
};
