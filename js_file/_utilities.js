import { Modification } from "./_modification.js";

export class Utilities extends Modification {
  deleteObjects() {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Delete") {
        let objects = this.canvas.getActiveObjects();

        if (objects.length > 1) {
          objects.forEach((obj) => {
            this.canvas.remove(obj);
            this.canvas.discardActiveObject();
          });
        } else {
          if (this.canvas.getActiveObject().name === "boxCropper") {
            return false;
          }
          if (this.canvas.getActiveObject().name === "uploader") {
            return false;
          }
          if (this.canvas.getActiveObject().name === "content") {
            return false;
          }
          if (this.canvas.getActiveObject().name === "text-content") {
            return false;
          }
          this.canvas.remove(this.canvas.getActiveObject());
        }
      }
    });
  }

  discardActiveObject() {
    let a = document.querySelector(".align-canvas-buttons-container");
    window.onclick = (e) => {
      if (e.target.classList.contains("upper-canvas")) {
        if (a.classList.toggle("show")) {
          a.classList.toggle("show");
        }
      }
      if (e.target.id === "canvas-background") {
        if (a.classList.toggle("show")) {
          a.classList.toggle("show");
        }

        this.canvas.discardActiveObject();
        this.canvas.renderAll();
      }
    };
  }

  canvasOn() {
    const select_object = (o) => {
      var activeObj = o.selected[0];

      // bold text
      let bold = document.querySelector("#bold");
      if (activeObj.type == "textbox" && activeObj.fontWeight === "bold") {
        bold.style.backgroundColor = "rgba(87, 86, 86, 0.733)";
      }
      if (activeObj.type == "textbox" && activeObj.fontWeight === "normal") {
        bold.style.backgroundColor = "";
      }
      if (activeObj.type !== "textbox") {
        bold.style.backgroundColor = "";
      }
      // -------------------------------------//

      // italic text
      let italic = document.querySelector("#italic");
      if (activeObj.type == "textbox" && activeObj.fontStyle === "italic") {
        italic.style.backgroundColor = "rgba(87, 86, 86, 0.733)";
      }
      if (activeObj.type == "textbox" && activeObj.fontStyle === "normal") {
        italic.style.backgroundColor = "";
      }
      if (activeObj.type !== "textbox") {
        italic.style.backgroundColor = "";
      }
      // -------------------------------------//

      // fontSize
      if (activeObj.type == "textbox") {
        document.querySelector("#fontSize").value = activeObj.fontSize;
      } else {
        document.querySelector("#fontSize").value = "";
      }
      // -------------------------------------//

      // stroke_width
      document.querySelector("#strokeWidth").value = activeObj.strokeWidth;
      // -------------------------------------//

      // -------------------------------------//

      if (activeObj.group !== undefined) {
        let group = activeObj.group;
        group.set("borderColor", "#333");
        group.set("cornerColor", "#17a2b8");
        group.set("cornerSize", 12);
        group.set("cornerStyle", "circle");
        group.set("transparentCorners", false);
        group.set("lockUniScaling", true);
        group.setControlsVisibility({ mtr: false });
      }

      activeObj.setControlsVisibility({ mtr: false });
      activeObj.set("borderColor", "#333");
      activeObj.set("cornerColor", "#17a2b8");

      activeObj.set("cornerStyle", "circle");
      activeObj.set("transparentCorners", false);
      activeObj.set("lockUniScaling", true);

      // cropper box style
      if (activeObj.name == "boxCropper") {
        activeObj.set("borderColor", "red");
        activeObj.set(" borderScaleFactor", 2);
        activeObj.set("borderDashArray", [10]);
        activeObj.set("cornerStyle", "rectangle");
        activeObj.setControlsVisibility({ mtr: false });
        activeObj.set("cornerSize", 12);
        activeObj.set("cornerColor", "#333");
      }

      // cropper box style
      if (activeObj.name == "boxCropper-clip") {
        activeObj.set("borderColor", "red");
        activeObj.set(" borderScaleFactor", 2);
        activeObj.set("borderDashArray", [10]);
        activeObj.set("cornerStyle", "rectangle");
        activeObj.setControlsVisibility({
          mt: false,
          mb: false,
          ml: false,
          mr: false,
          mtr: false,
        });
        activeObj.set("cornerSize", 12);
        activeObj.set("cornerColor", "#333");
      }
    };

    const modify_object = (o) => {
      var activeObj = o.target;
      if (activeObj.name === "boxCropper") {
        return false;
      }
      this.updateModifications(true);
    };

    // font size change when scaling
    const scale_object = (o) => {
      let activeObj = o.target;

      if (activeObj.type === "textbox") {
        this.canvas.textbox_width_init = activeObj.getScaledWidth();
        let a = activeObj.fontSize * activeObj.scaleX;
        activeObj.fontSize = a;
        activeObj.width = this.canvas.textbox_width_init;
      }
      // resize corner size when scaling
      if (activeObj.getScaledWidth() < 600) {
        activeObj.set("cornerSize", 6);
      } else {
        activeObj.set("cornerSize", 12);
      }
    };
    // font size change when scaling
    const mouseUp_object = (o) => {
      let activeObj = o.target;
      if (activeObj !== null && activeObj.type === "textbox") {
        document.querySelector("#fontSize").value = activeObj.fontSize;
      }
    };

    // set the cropper always active
    const mouseDown_object = (o) => {
      let activeObj = o.target;

      if (activeObj == null) {
        return false;
      }
      if (activeObj.name == "boxCropper-clip") {
        this.canvas.current_cropper_width = activeObj.getScaledWidth();
        this.canvas.current_cropper_height = activeObj.getScaledHeight();
        this.canvas.current_cropper_top = activeObj.top;
        this.canvas.current_cropper_left = activeObj.left;
      }

      if (activeObj.name == "gray_background") {
        let cropper_object = this.canvas.getObjects();
        this.canvas.setActiveObject(cropper_object[cropper_object.length - 1]);
      }
      if (
        activeObj.name == "image_selected_for_crop" ||
        activeObj.name == "image_selected_for_clip"
      ) {
        let cropper_object = this.canvas.getObjects();
        this.canvas.setActiveObject(cropper_object[cropper_object.length - 1]);
      }
    };

    this.canvas.on({
      "selection:updated": select_object,
      "selection:created": select_object,
      "object:modified": modify_object,
      "object:scaling": scale_object,
      "mouse:up": mouseUp_object,

      "mouse:down": mouseDown_object,
    });
  }

  // arrow movement
  arrowMovement() {
    var Direction = {
      LEFT: 0,
      UP: 1,
      RIGHT: 2,
      DOWN: 3,
    };

    fabric.util.addListener(document.body, "keydown", (options) => {
      if (options.repeat) {
        return;
      }
      let object = this.canvas.getActiveObject();
      if (object) {
        if (object.lockMovementX !== true) {
          var key = options.which || options.keyCode; // key detection
          if (key === 37) {
            // handle Left key
            this.moveSelected(Direction.LEFT);
          } else if (key === 38) {
            // handle Up key
            this.moveSelected(Direction.UP);
          } else if (key === 39) {
            // handle Right key
            this.moveSelected(Direction.RIGHT);
          } else if (key === 40) {
            // handle Down key
            this.moveSelected(Direction.DOWN);
          }
        }
      }
    });
  }

  alignCanvasBtn() {
    document.querySelector(".align-canvas").addEventListener("click", () => {
      let a = document.querySelector(".align-canvas-buttons-container");

      a.classList.toggle("show");
    });
  }
  filesBtn() {
    document.querySelector(".files-btn").onclick = (e) => {
      let el = document.querySelector(".files-container .dropdown-content");

      if (el.style.display == "block") {
        el.style.display = "none";
      } else {
        el.style.display = "block";
      }
    };
  }
  // drop menu
  files_modal_button(element) {
    document.body.onclick = (e) => {
      if (!e.target.matches(".dropbtn")) {
        var dropdown_insert = document.querySelector(
          `.insert-shape .dropdown-content`
        );
        if (dropdown_insert.style.display == "block") {
          dropdown_insert.style.display = "none";
        }
        let dropdown_subHeader = document.querySelector(
          `header .dropdown-content`
        );
        if (dropdown_subHeader.style.display == "block") {
          dropdown_subHeader.style.display = "none";
        }
      }
    };

    // let a = false;

    // align-to-canvas
  }
}
