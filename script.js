let data = [];
let newData = [];
let dataArr = [];
let set = 1;
let setArr = ["data.json", "data1.json"];
let dataset = document.getElementById("dataset");
dataset.addEventListener("change", changeData);

let name = "";
let email = "";

function changeData(e) {
  let value = e.target.value;
  data = [];
  newData = [];
  dataArr = [];
  set = value;
  document.getElementsByTagName("main")[0].innerHTML = "";
  document.getElementsByTagName("section")[0].innerHTML = "";
  document.getElementById("video").style.display = "block";
  getData(set);
}

getData(set);

// get data from dataset
function getData(set) {
  console.log(set);
  const xhr = new XMLHttpRequest();
  xhr.open("GET", setArr[set - 1]);
  xhr.onreadystatechange = function() {
    if (this.readyState === 4 && this.status == 200) {
      data = JSON.parse(this.responseText);
      newData = data;
      dataArr.push(newData);
      console.log(newData);
      renderForm(data);
    }
  };
  xhr.send();
}

//use localStorage to render results after refleshing the page
// localStorage.clear();
for (let i = 0; i < localStorage.length; i++) {
  let arr = JSON.parse(localStorage.getItem(localStorage.key(i)));
  let item = document.createElement("li");
  let link = document.createElement("a");
  link.setAttribute("target", "_blank");
  link.href = arr.url;
  link.appendChild(document.createTextNode(arr.name));
  item.appendChild(link);
  document.getElementById("list").appendChild(item);
}

//use the current data to render the form
function renderForm(data) {
  //create label
  let label = document.createElement("label");
  label.id = "label";
  label.appendChild(
    document.createTextNode(
      `Do you prefer ${data[1].option} or ${data[2].option}?`
    )
  );
  //create select
  let select = document.createElement("select");
  select.id = "select";
  data.map(item => {
    let option = document.createElement("option");
    option.value = `${item.option}`;
    if (item.option === "choose one") {
    }
    option.appendChild(document.createTextNode(`${item.option}`));
    select.appendChild(option);
  });
  //create group
  let group = document.createElement("div");
  group.setAttribute("class", "group");
  group.appendChild(label);
  group.appendChild(select);
  document.getElementsByTagName("main")[0].appendChild(group);

  //add event listener to <select>
  select.addEventListener("change", getAnswer, false);
}
store;
//get selected option
//use the selectedIndex to pick the latest data
function getAnswer(e) {
  document.getElementById("video").style.display = "block";
  let result = document.getElementsByTagName("section")[0];
  result.innerHTML = "";

  let parent = e.target.parentNode;
  let grandparent = parent.parentNode;
  let answer = e.target.value;
  let id = e.target.selectedIndex;
  console.log(parent, grandparent, answer, id);

  if (answer === "nature") {
    video.pause();
    document.getElementById("videoSrc").src = "media/nature.mp4";
    video.load();
    video.play();
  } else {
    video.pause();
    document.getElementById("videoSrc").setAttribute("src", "media/city.mp4");
    video.load();
    video.play();
  }

  if (parent.nextSibling) {
    while (parent.nextSibling) {
      grandparent.removeChild(parent.nextSibling);
      dataArr.shift();
    }
    console.log("has nextSibling: ", dataArr);
    if (answer !== "choose one") {
      newData = dataArr[0][id]["content"];
      dataArr.unshift(newData);
      renderForm(newData);
    }
  } else {
    newData = dataArr[0][id]["content"];
    if (newData[0]["option"]) {
      dataArr.unshift(newData);
      renderForm(newData);
    } else {
      if (name === "") {
        checkInformation();
      } else {
        renderResult(newData);
        storeResult(newData);
      }
    }
    console.log("has no nextSibling: ", newData);
    fadeout(parent);
  }
}

function checkInformation() {
  document.getElementById("information").style.display = "block";
  document.getElementById("name").addEventListener("change", handleChange);
  document.getElementById("email").addEventListener("change", handleChange1);
  document.getElementById("form").addEventListener("submit", handleSubmit);
  renderResult(newData);
  storeResult(newData);
}

function handleChange(e) {
  document.getElementById("name").value = e.target.value;
}
function handleChange1(e) {
  document.getElementById("email").value = e.target.value;
}

function handleSubmit(e) {
  e.preventDefault();
  name = document.getElementById("name").value;
  email = document.getElementById("email").value;
  if (emailIsValid(email)) {
    document.getElementById("information").style.display = "none";
  } else {
    let wrong = document.createElement("p");
    wrong.appendChild(
      document.createTextNode(
        "Please type correct email format (eg: love@love.com)"
      )
    );
    document.getElementById("wrapper").append(wrong);
  }
  console.log(name);
}

//validate email
function emailIsValid(email) {
  return /\S+@\S+\.\S+/.test(email);
}

//set localStorage
function storeResult(data) {
  localStorage.setItem(`${data[0].name}`, JSON.stringify(data[0]));
  let arr = JSON.parse(localStorage.getItem(`${data[0].name}`));
  let item = document.createElement("li");
  let link = document.createElement("a");
  link.setAttribute("target", "_blank");
  link.href = arr.url;
  link.appendChild(document.createTextNode(arr.name));
  item.appendChild(link);
  document.getElementById("list").appendChild(item);
}

//when there are no more options to choose, render the result
function renderResult(data) {
  document.getElementById("video").style.display = "none";
  //create the image of the selected destination
  let img = document.createElement("img");
  img.src = `${data[0].image}`;
  document.getElementsByTagName("section")[0].appendChild(img);
  //create the link of the selected destination
  let link = document.createElement("a");
  link.setAttribute("class", "result");
  link.href = `${data[0].url}`;
  link.setAttribute("target", "_blank");
  link.appendChild(document.createTextNode(`${data[0].name}`));
  document.getElementsByTagName("section")[0].appendChild(link);
}

function fadeout(element) {
  let opacity = 1;
  let timer = setInterval(function() {
    if (opacity <= 0.1) {
      clearInterval(timer);
      // element.style.display = "invisible";
    }
    element.style.opacity = opacity;
    element.style.filter = "alpha(opacity=" + opacity * 100 + ")";
    opacity -= opacity * 0.1;
  }, 50);
}
