import { Modification } from "./_modification.js";

export class Menu_tools extends Modification {
  // textbox
  insertText(selector) {
    let insert_text = document.querySelector(selector);
    insert_text.addEventListener("click", () => {
      let object = new fabric.Textbox("Your Text Here", {
        textAlign: "center",

        fontSize: 100, // this.canvas.getWidth() * .17,
        id: this.uniqueId(),
        dirty: true,
        // width: 400,//this.canvas.getWidth() * .80
        width: 500,
        splitByGrapheme: true,
        // height: 1900,
        centeredScaling: true,
      });
      object.name = object.type;

      this.adding_object_style(object);
    });
  }

  uploadImageLocalFile(selector) {
    document.querySelector(selector).addEventListener("click", async () => {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: "Images",
            accept: {
              "image/jpeg": [".jpg", ".jpeg"],
              "image/png": [".png"],
              "image/svg+xml": [".svg"],
            },
          },
        ],
      });
      this.loaderShow();
      const file = await fileHandle.getFile();

      let reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        fabric.Image.fromURL(reader.result, (img) => {
          img.name = img.type;
          img.id = this.uniqueId();
          this.adding_object_style(img);

          this.loaderHide();
        });
      };
    });
  }

  dragAndDrop_image() {
    const dropZoneElement = document
      .querySelector(".drop-zone__input")
      .closest(".canvas-container");

    dropZoneElement.addEventListener("drop", (e) => {
      e.preventDefault();
      let file = e.dataTransfer.files;
      if (file[0].type == "image/jpeg" || file[0].type == "image/png") {
        Array.from(file).forEach((e) => {
          let reader = new FileReader();
          reader.readAsDataURL(e);

          reader.onload = () => {
            fabric.Image.fromURL(reader.result, (img) => {
              img.name = img.type;
              img.id = this.uniqueId();
              // img.originX ='center',
              // img.originY ='center'
              this.adding_object_style(img);
            });
          };
        });
      } else {
        return false;
      }
    });
  }

  paste_image() {
    window.addEventListener("paste", (e) => {
      let items = e.clipboardData.items;

      if (items.length === 0) {
        return false;
      }

      if (items.length === 1) {
        let local_image = items[0].getAsFile();

        if (
          local_image.type === "image/png" ||
          local_image.type === "image/jpeg"
        ) {
          let reader = new FileReader();
          reader.readAsDataURL(local_image);

          reader.onload = () => {
            fabric.Image.fromURL(reader.result, (img) => {
              img.name = img.type;
              img.id = this.uniqueId();
              this.adding_object_style(img);
            });
          };
        }
      }

      // if gikan sa web brower ang file
      if (items.length > 1) {
        let imageData = items[1].getAsFile();

        if (imageData.type === "image/png" || imageData.type === "image/jpeg") {
          let reader = new FileReader();

          reader.readAsDataURL(imageData);

          reader.onload = () => {
            fabric.Image.fromURL(reader.result, (img) => {
              img.name = img.type;
              img.id = this.uniqueId();
              this.adding_object_style(img);
            });
          };
        } else {
          return false;
        }
      }
    });
  }

  insert_square() {
    let element = document.querySelector("#square");
    element.onclick = () => {
      let object = new fabric.Rect({
        width: 238.10051968360946,
        height: 228.71676505318098,

        fill: "gray",
        originX: "center",
        originY: "center",
      });
      object.dirty = true;
      object.name = "aa";
      object.id = this.uniqueId();
      // object.opacity = .5

      this.adding_object_style(object);
    };
  }
  insert_circle() {
    let element = document.querySelector("#circle");
    element.onclick = () => {
      let object = new fabric.Circle({
        radius: 200,
        originX: "center",
        originY: "center",
      });
      object.dirty = true;

      object.name = "circle";
      object.id = this.uniqueId();
      this.adding_object_style(object);
    };
  }

  async save_file_json() {
    document.getElementById("save_json").addEventListener("click", async () => {
      let json = this.canvas.toJSON([
        "borderColor",
        "cornerColor",
        "cornerSize",
        "cornerStyle",
        "transparentCorners",
        "_controlsVisibility",
        "lockMovementX",
        "lockMovementY",
        "lockScalingX",
        "lockScalingY",
        "selectable",
        "textAlign",
        "fontFamily",
        "id",
        "name",
        "clip_image_src_org",
        "orig_url",
      ]);

      if (this.fileHandle == undefined) {
        let suggest_name = document.querySelector("#file_name").innerHTML;

        this.fileHandle = await window.showSaveFilePicker({
          startIn: "desktop",
          suggestedName: `${suggest_name}.json`,
          types: [
            {
              description: "Text documents",
              accept: {
                "text/plain": [".json"],
              },
            },
          ],
        });
        let size = {
          w: this.width,
          h: this.height,
        };
        let fileHandle = {
          s: this.fileHandle,
        };
        let merge = {
          json,
          size,
          fileHandle,
        };
        let stream = await this.fileHandle.createWritable();
        await stream.write(JSON.stringify(merge));
        await stream.close();
        document.querySelector("#file_name").innerHTML =
          this.fileHandle.name.replace(".json", " ");
      } else {
        let size = {
          w: this.width,
          h: this.height,
        };
        let fileHandle = {
          s: this.fileHandle,
        };
        let merge = {
          json,
          size,
          fileHandle,
        };
        let stream = await this.fileHandle.createWritable();
        await stream.write(JSON.stringify(merge));
        await stream.close();
      }
    });
  }

  canvasBackgroundColor() {
    let canvasBackground = document.querySelector("#canvas_background");
    canvasBackground.oninput = (e) => {
      this.canvas.setBackgroundColor(e.target.value);
      this.canvas.renderAll();
    };
    let transparent = document.querySelector("#transparent");
    transparent.onclick = () => {
      this.canvas.setBackgroundColor(null);
      this.canvas.renderAll();
    };
  }

  bringToFront_object() {
    let bringToFront = document.querySelector("#bringToFront_object");
    bringToFront.onclick = (e) => {
      let object = this.canvas.getActiveObject();
      if (object.name === "boxCropper") {
        return false;
      }
      this.canvas.bringForward(object);
    };
  }

  bringToBack_object() {
    let bringToBack = document.querySelector("#bringToBack_object");
    bringToBack.onclick = (e) => {
      let object = this.canvas.getActiveObject();

      if (object.name === "boxCropper") {
        return false;
      }
      this.canvas.sendBackwards(object);
    };
  }

  horizontal_object() {
    document.querySelector("#horizontal").onclick = () => {
      if (this.canvas.getActiveObject().name === "boxCropper") {
        return false;
      }
      if (this.canvas.getActiveObject().type === "activeSelection") {
        let obj = this.canvas.getActiveObject().toGroup();
        this.canvas.viewportCenterObjectH(obj);

        let selected_objects = this.canvas
          .getActiveObject()
          .toActiveSelection();
        selected_objects.set("borderColor", "#333");
        selected_objects.set("cornerColor", "#17a2b8");
        selected_objects.set("cornerSize", 15);
        selected_objects.set("cornerStyle", "circle");
        selected_objects.set("transparentCorners", false);
        selected_objects.set("lockUniScaling", true);

        this.canvas.renderAll();
      } else {
        let object = this.canvas.getActiveObject();
        this.canvas.viewportCenterObjectH(object);
        this.canvas.setActiveObject(object);
      }
    };
  }

  vertical_object() {
    document.querySelector("#vertical").onclick = () => {
      if (this.canvas.getActiveObject().name === "boxCropper") {
        return false;
      }
      if (this.canvas.getActiveObject().type === "activeSelection") {
        let obj = this.canvas.getActiveObject().toGroup();
        this.canvas.viewportCenterObjectV(obj);
        let selected_objects = this.canvas
          .getActiveObject()
          .toActiveSelection();
        selected_objects.set("borderColor", "#333");
        selected_objects.set("cornerColor", "#17a2b8");
        selected_objects.set("cornerSize", 15);
        selected_objects.set("cornerStyle", "circle");
        selected_objects.set("transparentCorners", false);
        selected_objects.set("lockUniScaling", true);

        this.canvas.renderAll();
      } else {
        let object = this.canvas.getActiveObject();
        this.canvas.viewportCenterObjectV(object);
        this.canvas.setActiveObject(object);
      }
    };
  }

  center_object() {
    document.querySelector("#center").onclick = () => {
      if (this.canvas.getActiveObject().name === "boxCropper") {
        return false;
      }
      if (this.canvas.getActiveObject().type === "activeSelection") {
        let obj = this.canvas.getActiveObject().toGroup();
        this.canvas.viewportCenterObject(obj);
        let selected_objects = this.canvas
          .getActiveObject()
          .toActiveSelection();
        this.groupObjectStyle(selected_objects);

        this.canvas.renderAll();
      } else {
        let object = this.canvas.getActiveObject();
        this.canvas.viewportCenterObject(object);

        this.canvas.setActiveObject(object);
      }
    };
  }

  align_left() {
    let align_left = document.querySelector("#align_left");
    align_left.onclick = () => {
      let object = this.canvas.getActiveObjects();
      if (object.length < 2) {
        return false;
      }

      let group_objects = this.canvas.getActiveObject().toGroup();

      var groupWidth = group_objects.width;

      object.forEach((obj) => {
        obj.set({
          left: -(groupWidth / 2),
          originX: "left",
        });
      });
      let each_object = this.canvas.getActiveObject().toActiveSelection();
      this.groupObjectStyle(each_object);
      this.canvas.renderAll();
    };
  }

  align_center() {
    let align_center = document.querySelector("#align_center");
    align_center.onclick = () => {
      let object = this.canvas.getActiveObjects();
      if (object.length < 2) {
        return false;
      }

      let group_objects = this.canvas.getActiveObject().toGroup();

      var groupWidth = group_objects.width;

      object.forEach((obj) => {
        var itemWidth = obj.getBoundingRect().width;
        obj.set({
          left: 0 - itemWidth / 2,
          originX: "left",
        });
      });
      let each_object = this.canvas.getActiveObject().toActiveSelection();
      this.groupObjectStyle(each_object);
      this.canvas.renderAll();
    };
  }

  align_right() {
    let align_right = document.querySelector("#align-right");
    align_right.onclick = () => {
      let object = this.canvas.getActiveObjects();
      if (object.length < 2) {
        return false;
      }

      let group_objects = this.canvas.getActiveObject().toGroup();

      var groupWidth = group_objects.width;

      object.forEach((obj) => {
        var itemWidth = obj.getBoundingRect().width;
        obj.set({
          left: groupWidth / 2 - itemWidth / 2,
          originX: "center",
        });
      });

      let each_object = this.canvas.getActiveObject().toActiveSelection();
      this.groupObjectStyle(each_object);
      this.canvas.renderAll();
    };
  }

  align_top() {
    document.querySelector("#align-top").onclick = () => {
      let object = this.canvas.getActiveObjects();
      if (object.length < 2) {
        return false;
      }

      let group_objects = this.canvas.getActiveObject().toGroup();
      var groupHeight = group_objects.height;

      object.forEach((obj) => {
        obj.set({
          top: 0 - groupHeight / 2,
          originY: "top",
        });
      });

      let each_object = this.canvas.getActiveObject().toActiveSelection();
      this.groupObjectStyle(each_object);
      this.canvas.renderAll();
    };
  }

  align_middle() {
    document.querySelector("#align-middle").onclick = () => {
      let object = this.canvas.getActiveObjects();

      if (object.length < 2) {
        return false;
      }
      object.forEach((obj) => {
        let itemHeight = obj.getBoundingRect().height;

        obj.set({
          top: 0 - itemHeight / 2,
          originY: "top",
        });
      });

      this.canvas.renderAll();
    };
  }

  align_bottom() {
    document.querySelector("#align-bottom").onclick = () => {
      let object = this.canvas.getActiveObjects();
      if (object.length < 2) {
        return false;
      }

      let group_objects = this.canvas.getActiveObject().toGroup();
      var groupHeight = group_objects.height;

      object.forEach((obj) => {
        var itemHeight = obj.getBoundingRect().height;
        obj.set({
          top: groupHeight / 2 - itemHeight / 2,
          originY: "center",
        });
      });
      let each_object = this.canvas.getActiveObject().toActiveSelection();
      this.groupObjectStyle(each_object);
      this.canvas.renderAll();
    };
  }

  //insert data
  insertData() {
    //  insert-data
    let element = document.querySelector(".excel-html");
    let list_names = document.querySelector(".list-names");
    let parent = document.querySelector(".list-name-container");
    let add_name_btn = document.querySelector("#add_name_btn");
    add_name_btn.addEventListener("click", () => {
      parent.style.display = "block";
    });

    let saveCloseBtn = document.querySelector(".list-name-container .save");
    // Close
    saveCloseBtn.addEventListener("click", () => {
      parent.style.display = "none";
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
                
          <input type="text" value="${a}">
          <input type="text" value="${b}">

          <div>
          <span class="btn btn-sm btn-danger delete text text-white">Remove</span>
          </div>

                `;
          list_names.appendChild(div);
          div.scrollIntoView();
        } else {
          let a = element.children[0].innerText;
          let b = " ";

          let div = document.createElement("div");
          div.classList.add("input-container");
          div.innerHTML = `
                
      <input type="text" value="${a}">
      <input type="text" value="${b}">

      <div>
      <span class="btn btn-sm btn-danger delete text text-white">Remove</span>
      </div>


              

            `;

          list_names.appendChild(div);
          div.scrollIntoView();
        }
      });
    });

    //insert name tools
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
          div.scrollIntoView();
        }

        //remove row
        if (e.target.classList.contains("delete")) {
          e.target.parentElement.parentElement.remove();
        }
        //swap column
        if (e.target.classList.contains("swap-column")) {
          let names = document.querySelectorAll(
            ".list-name-container .list-names .input-container"
          );
          let column_A = [];
          let column_B = [];
          names.forEach((element) => {
            column_A.push(element.children[0].value);
            column_B.push(element.children[1].value);

            column_A.forEach((text) => {
              //column B input
              element.children[1].value = text;
              let a = this.canvas.getObjects().filter((e) => {
                return e.name === "column-1-textbox";
              });
              a[0].set({ text: text });
              this.canvas.renderAll();
            });
            column_B.forEach((text) => {
              //column A input
              element.children[0].value = text;
            });
          });
        }
        //clear all rows
        if (e.target.classList.contains("clear-all")) {
          let names = document.querySelectorAll(
            ".list-name-container .list-names .input-container"
          );
          names.forEach((element) => {
            element.remove();
          });
        }
      });
  }

  //loop name
  preview_image() {
    const preview_image = document.querySelector("#preview-image");

    const modal = document.querySelector("#modal-container");

    const closeBtn = document.querySelector(".modal .close");
    closeBtn.addEventListener("click", closeModal);
    window.addEventListener("click", outsideClick);

    // Close
    function closeModal() {
      modal.style.display = "none";

      let printImageView = document.querySelectorAll(".print-view-img");
      printImageView.forEach((item) => {
        item.remove();
      });
    }

    // Close If Outside Click
    function outsideClick(e) {
      if (e.target.className == "modal-body") {
        modal.style.display = "none";

        let printImageView = document.querySelectorAll(".print-view-img");
        printImageView.forEach((item) => {
          item.remove();
        });
      }
    }

    preview_image.onclick = () => {
      const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (
          let offset = 0;
          offset < byteCharacters.length;
          offset += sliceSize
        ) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);

          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
      };

      //get selected column from choose column modal
      let text = document.querySelector(".same-as-selected");
      let arrayName = [];
      if (text.innerText === "Column 2") {
        let a = document.querySelectorAll(
          ".list-name-container .list-names .input-container"
        );

        a.forEach((element) => {
          arrayName.push(element.children[1].value);
        });
      }
      if (text.innerText === "Column 1") {
        let a = document.querySelectorAll(
          ".list-name-container .list-names .input-container"
        );

        a.forEach((element) => {
          arrayName.push(element.children[0].value);
        });
      }
      let names = arrayName;

      for (let i = 0; i < names.length; i++) {
        var scaleFactor = 1;
        this.canvas.setWidth(this.width * scaleFactor);
        this.canvas.setHeight(this.height * scaleFactor);
        this.canvas.setZoom(scaleFactor);

        this.canvas.renderAll();

        // let display_name = document.querySelector("#file_name").innerHTML;
        let a = this.canvas.getObjects().filter((e) => {
          return e.name === "column-1-textbox";
        });
        a[0].set({ text: names[i] });
        this.canvas.renderAll();
        // let imgSrc = document.querySelector(".try").src;
        let imgSrc = this.canvas
          .toDataURL("image/jpeg", [0.0, 1.0])
          .split(",")[1];

        const blob = b64toBlob(imgSrc, "image/jpeg");
        const blobUrl = URL.createObjectURL(blob);

        const img = document.createElement("img");
        img.src = blobUrl;
        img.width = "600";
        img.className = "print-view-img";

        setTimeout(() => {
          document.querySelector(".modal-body").appendChild(img);
          document.querySelector(".modal").style.display = "block";
        }, 1000);

        this.canvas.setHeight(this.canvas.current_height);
        this.canvas.setWidth(this.canvas.current_width);
        this.canvas.setZoom(this.canvas.current_canvasScale);
      }
    };
  }

  //choose column
  chooseColumn() {
    const doubleClick = (e) => {
      if (e.target && e.target.name == "column-1-textbox") {
        let activeObject = this.canvas.getActiveObject();
        if (activeObject && activeObject.name === "column-1-textbox") {
          document.querySelector(".choose-columm-container").style.display =
            "block";
          this.canvas.discardActiveObject(activeObject);
          this.canvas.renderAll();
        }
      }
    };
    this.canvas.on({
      "mouse:dblclick": doubleClick,
    });

    //close button
    document
      .querySelector(".choose-columm-container .close")
      .addEventListener("click", () => {
        document.querySelector(".choose-columm-container").style.display =
          "none";
        let element = document.querySelector(".same-as-selected");

        if (element.innerText === "Column 2") {
          let a = document.querySelectorAll(
            ".list-name-container .list-names .input-container"
          );

          let b = this.canvas.getObjects().filter((e) => {
            return e.name === "column-1-textbox";
          });
          b[0].set({ text: a[a.length - 1].children[1].value });
          this.canvas.renderAll();
        }

        if (element.innerText === "Column 1") {
          let a = document.querySelectorAll(
            ".list-name-container .list-names .input-container"
          );

          let b = this.canvas.getObjects().filter((e) => {
            return e.name === "column-1-textbox";
          });
          b[0].set({ text: a[a.length - 1].children[0].value });
          this.canvas.renderAll();
        }
      });

    // for select columms
    var x, i, j, l, ll, selElmnt, a, b, c;
    /*look for any elements with the class "custom-select":*/
    x = document.getElementsByClassName("custom-select");
    l = x.length;
    for (i = 0; i < l; i++) {
      selElmnt = x[i].getElementsByTagName("select")[0];
      ll = selElmnt.length;
      /*for each element, create a new DIV that will act as the selected item:*/
      a = document.createElement("DIV");
      a.setAttribute("class", "select-selected");
      a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
      x[i].appendChild(a);
      /*for each element, create a new DIV that will contain the option list:*/
      b = document.createElement("DIV");
      b.setAttribute("class", "select-items select-hide");
      for (j = 1; j < ll; j++) {
        /*for each option in the original select element,
    create a new DIV that will act as an option item:*/
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", function (e) {
          /*when an item is clicked, update the original select box,
        and the selected item:*/
          var y, i, k, s, h, sl, yl;
          s = this.parentNode.parentNode.getElementsByTagName("select")[0];
          sl = s.length;
          h = this.parentNode.previousSibling;
          for (i = 0; i < sl; i++) {
            if (s.options[i].innerHTML == this.innerHTML) {
              s.selectedIndex = i;
              h.innerHTML = this.innerHTML;
              y = this.parentNode.getElementsByClassName("same-as-selected");
              yl = y.length;
              for (k = 0; k < yl; k++) {
                y[k].removeAttribute("class");
              }
              this.setAttribute("class", "same-as-selected");
              break;
            }
          }
          h.click();
        });

        b.appendChild(c);
      }
      x[i].appendChild(b);
      a.addEventListener("click", function (e) {
        /*when the select box is clicked, close any other select boxes,
      and open/close the current select box:*/
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
      });
    }
    function closeAllSelect(elmnt) {
      /*a function that will close all select boxes in the document,
  except the current select box:*/
      var x,
        y,
        i,
        xl,
        yl,
        arrNo = [];
      x = document.getElementsByClassName("select-items");
      y = document.getElementsByClassName("select-selected");
      xl = x.length;
      yl = y.length;
      for (i = 0; i < yl; i++) {
        if (elmnt == y[i]) {
          arrNo.push(i);
        } else {
          y[i].classList.remove("select-arrow-active");
        }
      }
      for (i = 0; i < xl; i++) {
        if (arrNo.indexOf(i)) {
          x[i].classList.add("select-hide");
        }
      }
    }
    /*if the user clicks anywhere outside the select box,
then close all select boxes:*/
    document.addEventListener("click", closeAllSelect);
  }

  download_as_Zip() {
    const download_as_Zip = document.querySelector("#download_as_Zip");
    download_as_Zip.onclick = () => {
      let images = document.querySelectorAll(".print-view-img");

      var urls = [];
      images.forEach((e) => {
        urls.push(e.src);
      });
      downloadZip();
      function downloadZip() {
        var zip = new JSZip();
        var count = 0;
        var zipFilename = "zipFilename.zip";

        urls.forEach(function (url) {
          var filename = "filename";
          // loading a file and add it in a zip file
          JSZipUtils.getBinaryContent(url, function (err, data) {
            if (err) {
              throw err; // or handle the error
            }
            var img = zip.folder("images");
            img.file(filename + "_" + count + ".png", data, { binary: true });
            count++;
            if (count == urls.length) {
              zip.generateAsync({ type: "blob" }).then(function (content) {
                const a = document.createElement("a");
                a.href = URL.createObjectURL(content);

                document.body.appendChild(a);
                a.download = zipFilename;
                a.click();
                document.body.removeChild(a);

                // saveAs(content, "zipFilename");
              });
            }
          });
        });
      }

      // let images = document.querySelectorAll(".test-image");
      // images.forEach((e) => {
      //   e.remove();
      // });
    };
  }
  print() {
    let printCanvas = document.querySelector("#printCanvas");
    printCanvas.onclick = () => {
      let printImageView = document.querySelectorAll(".print-view-img");
      let new_array_images = [];
      printImageView.forEach((e) => {
        new_array_images.push(e.src);
      });

      printJS({
        printable: new_array_images,
        type: "image",
      });
    };
  }

  trim() {
    let trim_btn = document.querySelector("#trim-image");
    trim_btn.onclick = () => {
      let object = this.canvas.getActiveObject();

      if (!object) {
        return false;
      }

      if (object.type == "activeSelection") {
        return false;
      }
      if (object.name === "boxCropper") {
        return false;
      }
      this.canvas.discardActiveObject(object);
      object.hoverCursor = "crosshair";
      this.canvas.renderAll();

      const lock = (bollean) => {
        this.canvas.getObjects().forEach((obj) => {
          if (obj.name === "trimmer") {
            return false;
          }
          // if(obj.name === 'bg_trim'){
          // return false
          // }
          this.lock_image(obj, bollean);
          if (bollean === true) {
            // obj.hoverCursor = 'crosshair'
            this.canvas.hoverCursor = "crosshair";
            this.canvas.defaultCursor = "crosshair";
          } else {
            this.canvas.defaultCursor = "default";
            this.canvas.hoverCursor = "all-scroll";
          }
        });
      };

      lock(true);

      // create dark background
      let background = new fabric.Rect({
        width: this.width,
        height: this.height,
        fill: "gray",
        opacity: 0.9,
        name: "bg_trim",
      });

      this.canvas.add(background);
      this.canvas.viewportCenterObject(background);
      this.lock_image(background, true);

      // dark_background.moveTo(this.canvas.getObjects().indexOf(image_object))

      this.canvas.selection = false;
      let trimmer_box;
      let mouseDown = false;
      let stopDrawing = false;
      let origX;
      let origY;

      let current_index = this.canvas.getObjects().indexOf(object);
      this.canvas.bringToFront(object);
      background.moveTo(this.canvas.getObjects().indexOf(object) - 1);

      const start_add = (o) => {
        if (stopDrawing === false) {
          let pointer = this.canvas.getPointer(o.e);
          origX = pointer.x;
          origY = pointer.y;

          mouseDown = true;

          trimmer_box = new fabric.Rect({
            fill: "gray",
            left: pointer.x,
            top: pointer.y,
            stroke: "#F51720",
            strokeWidth: 3,
            name: "trimmer",
            objectCaching: false,
            excludeFromExport: true,
            opacity: 0.5,
          });
          // trimmer_box.setControlsVisibility({
          // mt: false,mb: false,ml: false, mr: false,tr: false,tl: false,br: false,bl: false, mtr: false
          // });

          this.canvas.add(trimmer_box);

          this.canvas.renderAll();
        }
      };
      let delete_trimmer;
      const start_draw = (o) => {
        let pointer = this.canvas.getPointer(o.e);

        if (mouseDown === true && pointer.x > origX && pointer.y > origY) {
          trimmer_box.width = pointer.x - origX;
          trimmer_box.height = pointer.y - origY;

          this.canvas.renderAll();
          delete_trimmer = true;
        }
      };
      let cut_out = true;
      const stop_draw = () => {
        if (cut_out === true) {
          let scaleFactor = 1;
          this.canvas.setWidth(this.width * scaleFactor);
          this.canvas.setHeight(this.height * scaleFactor);
          this.canvas.setZoom(scaleFactor);
          mouseDown = false;
          trimmer_box.setCoords();
          stopDrawing = true;
          this.canvas.selection = true;
          // kung nagsugod  ang trimmer sa gawas ng object sa bottom//bottom
          let trimmer_height_onObject =
            trimmer_box.getBoundingRect().top - object.getBoundingRect().top;
          if (trimmer_height_onObject > object.getScaledHeight()) {
            this.returnToOriginalSize();
            lock(false);
            this.canvas.remove(trimmer_box);
            object.hoverCursor = "all-scroll";
            cut_out = false;
            this.canvas.remove(background);
            this.canvas.renderAll();
            return false;
          }
          // kung nagsugod  ang trimmer sa gawas ng object sa right//width
          let trimmer_width_onObject =
            trimmer_box.getBoundingRect().left - object.getBoundingRect().left;
          if (trimmer_width_onObject > object.getScaledWidth()) {
            this.returnToOriginalSize();

            lock(false);
            this.canvas.remove(trimmer_box);
            object.hoverCursor = "all-scroll";
            cut_out = false;
            this.canvas.remove(background);
            this.canvas.renderAll();
            return false;
          }

          // kung ang tumoy mo sa trimmer box ing abot ba sa sugdanan ng object sa left//hint start
          let width_of_trimmer =
            trimmer_box.getBoundingRect().left + trimmer_box.getScaledWidth();
          if (width_of_trimmer < object.getBoundingRect().left) {
            this.returnToOriginalSize();
            lock(false);
            this.canvas.remove(background);
            this.canvas.remove(trimmer_box);
            object.hoverCursor = "all-scroll";
            cut_out = false;

            this.canvas.renderAll();
            return false;
          }

          // kung ang tumoy mo sa trimmer box ing abot ba sa sugdanan ng object sa top//top
          let height_of_trimmer =
            trimmer_box.getBoundingRect().top + trimmer_box.getScaledHeight();
          if (height_of_trimmer < object.getBoundingRect().top) {
            this.returnToOriginalSize();
            lock(false);
            this.canvas.remove(background);
            this.canvas.remove(trimmer_box);
            object.hoverCursor = "all-scroll";
            cut_out = false;
            this.canvas.renderAll();
            return false;
          }

          // asa ng start ang left
          let start_of_trimmer_onObject_left =
            trimmer_box.getBoundingRect().left - object.getBoundingRect().left;
          let width_ng_trimmer_sa_left =
            trimmer_box.getBoundingRect().left + trimmer_box.getScaledWidth();
          let sobra_sa_left = 0;
          let ang_nabilin =
            width_ng_trimmer_sa_left - start_of_trimmer_onObject_left;

          if (ang_nabilin > width_ng_trimmer_sa_left) {
            sobra_sa_left = ang_nabilin - width_ng_trimmer_sa_left;
          } else {
            start_of_trimmer_onObject_left = 0;
          }

          let start_of_trimmer_onObject_right =
            trimmer_box.getBoundingRect().left - object.getBoundingRect().left;
          let get_entire_width_viaTrimmer =
            start_of_trimmer_onObject_right + trimmer_box.getScaledWidth();
          let labaw;
          if (get_entire_width_viaTrimmer > object.getScaledWidth()) {
            labaw = get_entire_width_viaTrimmer - object.getScaledWidth();
          } else {
            labaw = 0;
          }
          // top
          let start_of_trimmer_onObject_top =
            trimmer_box.getBoundingRect().top - object.getBoundingRect().top;
          let width_ng_trimmer_sa_top =
            trimmer_box.getBoundingRect().top + trimmer_box.getScaledHeight();
          let sobra_sa_top = 0;
          let ang_nabilin_top =
            width_ng_trimmer_sa_top - start_of_trimmer_onObject_top;

          if (ang_nabilin_top > width_ng_trimmer_sa_top) {
            sobra_sa_top = ang_nabilin_top - width_ng_trimmer_sa_top;
          } else {
            start_of_trimmer_onObject_top = 0;
          }

          // bottom
          let start_of_trimmer_onObject_bottom =
            trimmer_box.getBoundingRect().top - object.getBoundingRect().top;
          let get_entire_width_viaTrimmer_bottom =
            start_of_trimmer_onObject_bottom + trimmer_box.getScaledHeight();
          let labaw_bottom;
          if (get_entire_width_viaTrimmer_bottom > object.getScaledHeight()) {
            labaw_bottom =
              get_entire_width_viaTrimmer_bottom - object.getScaledHeight();
          } else {
            labaw_bottom = 0;
          }

          let b = object.toDataURL({
            left:
              trimmer_box.getBoundingRect().left -
              object.getBoundingRect().left -
              start_of_trimmer_onObject_left,
            top:
              trimmer_box.getBoundingRect().top -
              object.getBoundingRect().top -
              start_of_trimmer_onObject_top,
            width: trimmer_box.getScaledWidth() - sobra_sa_left - labaw,
            height: trimmer_box.getScaledHeight() - sobra_sa_top - labaw_bottom,
            format: "png",
          });

          fabric.Image.fromURL(b, (img) => {
            if (sobra_sa_left > 0 || sobra_sa_top > 0) {
              img.left = trimmer_box.left + sobra_sa_left;
              img.top = trimmer_box.top + sobra_sa_top;
            } else {
              img.left = trimmer_box.left;
              img.top = trimmer_box.top;
            }

            img.objectCaching = false;
            this.canvas.setActiveObject(img);

            if (delete_trimmer == true) {
              this.canvas.add(img);
            }
          });

          cut_out = false;
          lock(false);

          this.canvas.remove(trimmer_box);
          this.canvas.remove(background);
          object.moveTo(current_index);
        }
        this.returnToOriginalSize();
        object.hoverCursor = "all-scroll";
        this.canvas.renderAll();
      };
      this.canvas.on("mouse:down", start_add);
      this.canvas.on("mouse:move", start_draw);
      this.canvas.on("mouse:up", stop_draw);
    };
  }

  sample_crop() {
    let sample = document.querySelector("#sample-crop");
    let cropper_box = new fabric.Rect({
      width: 600,
      height: 600,
      shape: "square",
      fill: "gray",

      objectCaching: false,
      excludeFromExport: true,
      left: 600,
      top: 600,
      opacity: 0.6,
    });
    this.canvas.add(cropper_box);
    sample.onclick = () => {
      let object = this.canvas.getActiveObject();
      let canvas = new fabric.Canvas("canvas-3", {
        width: object.getScaledWidth(),
        height: object.getScaledHeight(),
      });

      fabric.Image.fromURL(object._originalElement.currentSrc, (img) => {
        img.scaleToWidth(object.getScaledWidth());
        canvas.viewportCenterObject(img);
        canvas.add(img);
        canvas.renderAll();
        let a = img.toDataURL();

        fabric.Image.fromURL(a, (img) => {
          // img.left = cropper_box.left
          // img.top = cropper_box.top

          // exist in left
          if (object.left > cropper_box.left) {
            this.canvas.exist_left = object.left - cropper_box.left;
          } else {
            this.canvas.exist_left = 0;
          }

          // exist in right
          var a = object.left + object.getScaledWidth();
          var b = cropper_box.left + cropper_box.getScaledWidth();

          if (b > a) {
            this.canvas.exist_right = b - a;
          } else {
            this.canvas.exist_right = 0;
          }

          img.cropX = cropper_box.left - object.left;

          // img.cropY =object.top
          img.width =
            cropper_box.getScaledWidth() -
            this.canvas.exist_right -
            this.canvas.exist_left;

          // exist in top
          if (object.top > cropper_box.top) {
            this.canvas.exist_top = object.top - cropper_box.top;
          } else {
            this.canvas.exist_top = 0;
          }

          // exist in bottom
          var a = object.top + object.getScaledHeight();
          var b = cropper_box.top + cropper_box.getScaledHeight();
          if (b > a) {
            this.canvas.exist_bottom = b - a;
          } else {
            this.canvas.exist_bottom = 0;
          }

          img.cropY = cropper_box.top - object.top;
          img.height =
            cropper_box.getScaledHeight() -
            this.canvas.exist_top -
            this.canvas.exist_bottom;
          this.canvas.add(img);
          this.canvas.renderAll();
        });

        canvas.dispose();
      });
    };
  }

  upload_and_clip() {
    // const  handleImage = async ()=>{
    // const [fileHandle] = await window.showOpenFilePicker({
    //     types: [{
    //     description: 'Images',
    //     accept: {
    //     "image/jpeg": [".jpg", ".jpeg"],
    //     "image/png": [".png"],
    //     "image/svg+xml": [".svg"],
    //     }
    //     }],
    //     })
    //     this.loaderShow()
    //     const file = await fileHandle.getFile();
    //     let reader = new FileReader();
    //     reader.readAsDataURL(file)
    //     reader.onload = () => {
    //     fabric.Image.fromURL(reader.result, (img)=>{
    //     img.name = img.type
    //     img.id = this.uniqueId()
    //     this.adding_object_style(img)
    //     this.loaderHide()
    //     })
    //     };
    // }
    // document.querySelector('.upload').addEventListener('click',handleImage)
  }
}
