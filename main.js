import { Canvas } from "./js_file/canvas.js";
import { Open_file } from "./js_file/_open_file.js";

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
});

// ==========================================================//

// ====================== canvas tools ========================//

let file = new Open_file();

file.get_file_json();
