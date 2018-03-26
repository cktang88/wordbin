let url = "https://api.myjson.com/bins/9jfkn";

// from http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
String.prototype.hashCode = function() {
  let hash = 0;
  if (this.length === 0) return hash;
  for (let i = 0; i < this.length; i++) {
    let chr = this.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function submitKey() {
  getData()
    .then(data => {
      entry = data[document.getElementById("text2").value];
      console.log(entry);
      if (entry && entry.text)
        document.getElementById("text1").value = entry.text;
      else alert("No text stored at that location.");
    })
    .then(console.log("Loaded."))
    .catch(err => console.log(err));
}

function submit() {
  let text = document.getElementById("text1").value;
  console.log("Submitted.");
  let hash = text.hashCode();

  getData()
    .then(data => {
      data[hash] = {
        text: String(text),
        dateSubmitted: new Date().toJSON().slice(0, 16)
      };
      return data;
    })
    .then(data => updateData(data))
    .then(alert("Saved key: " + hash));
}

function getData() {
  // get data from db
  return fetch(url).then(function(response) {
    return response.json();
  });
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
    .then(response => console.log("Success:", response));
}

window.onload = function() {
  console.log("Loaded.");
};
