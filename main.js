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
const modalBtn = document.querySelector("#modal-btn");
const modal = document.querySelector("#modal-container");

const closeBtn = document.querySelector(".close");
closeBtn.addEventListener("click", closeModal);
window.addEventListener("click", outsideClick);

// Open
function openModal() {
  modal.style.display = "block";
}

// Close
function closeModal() {
  modal.style.display = "none";
}

// Close If Outside Click
function outsideClick(e) {
  if (e.target.className == "modal-body") {
    modal.style.display = "none";
  }
}
