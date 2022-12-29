import { Canvas } from "./js_file/canvas.js";
import { Open_file } from "./js_file/_open_file.js";

window.addEventListener("click", (e) => {
  console.log("id:" + e.target.id);
  console.log("className:" + e.target.className);
});
// ==================window height size=======================//
let header_size = document.querySelector("header").offsetHeight;

document.querySelector("main").style.height =
  window.innerHeight - header_size + "px";

// inside canvas tools
document.querySelector(".box-tools-container").style.height =
  window.innerHeight - header_size - 25 + "px";

// window_height resize
window.addEventListener("resize", () => {
  let header_size = document.querySelector("header").offsetHeight;

  const heightBefore = window.innerHeight;
  const heightAfter = window.innerHeight;
  let total_height = heightAfter - heightBefore;

  document.querySelector("main").style.height =
    window.innerHeight - header_size + "px";
  console.log("resize");
});

// ==========================================================//

// ====================== canvas tools ========================//

let file = new Open_file();

file.get_file_json();

//  insert-name
let element = document.querySelector(".excel-html");
let list_names = document.querySelector(".list_names");

let add_name_btn = document.querySelector("#add_name_btn");
add_name_btn.addEventListener("click", () => {
  let parent = document.querySelector(".list-name-container");
  parent.style.display = "block";
});
window.addEventListener("paste", function (e) {
  e.preventDefault();

  let parent = document.querySelector(".list-name-container");
  parent.style.display = "block";

  element.innerHTML = e.clipboardData.getData("text/html");

  let aa = document.querySelectorAll("table tr");

  aa.forEach((element) => {
    if (element.children.length > 1) {
      let a = element.children[0].innerText;
      let b = element.children[1].innerText;

      let div = document.createElement("div");
      div.classList.add("input-container");
      div.innerHTML = `
                
          <input type="text" value="  ${a} ">
          <input type="text" value="  ${b} ">

          <div>
          <span class="btn btn-sm btn-danger delete text text-white">Remove</span>
          </div>

                `;
      list_names.appendChild(div);
    } else {
      let a = element.children[0].innerText;
      let b = " ";

      let div = document.createElement("div");
      div.classList.add("input-container");
      div.innerHTML = `
                
      <input type="text" value="  ${a} ">
      <input type="text" value="  ${b} ">

      <div>
      <span class="btn btn-sm btn-danger delete text text-white">Remove</span>
      </div>


              

            `;

      list_names.appendChild(div);
    }
  });
});
document
  .querySelector(".list-name-container")
  .addEventListener("click", (e) => {
    if (e.target.classList.contains("add-rows")) {
      console.log("sdf");
      let div = document.createElement("div");
      div.classList.add("input-container");
      div.innerHTML = `
              
        <input type="text" value="" placeholder="click to type">
        <input type="text" value="" placeholder="click to type">


        <div>
        <span class="btn btn-sm btn-danger delete text text-white">Remove</span>
        </div>

              `;
      list_names.appendChild(div);
    }
    if (e.target.classList.contains("delete")) {
      e.target.parentElement.parentElement.remove();
    }
  });
