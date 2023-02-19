const color_pickerBtn = document.querySelector("#color_picker");
const colorList = document.querySelector(".all-colors");
const clearAll = document.querySelector(".clear-all");

const pickedColors = JSON.parse(localStorage.getItem("picked-colors") || "[]");

const copyColor = (elem) => {
  navigator.clipboard.writeText(elem.dataset.color);
  elem.innerText = "Copied";
  setTimeout(() => (elem.innerText = elem.dataset.color), 1000);
};

const showColors = () => {
  if (!pickedColors.length) return; // returning if there are no picked colors
  colorList.innerHTML = pickedColors
    .map(
      (color) =>
        `<li class="color"><span class="rect" style="background-color: ${color}; border: 1px solid ${
          color == "#ffffff" ? "#ccc" : color
        };"></span><span class="value" data-color="${color}">${color}</span></li>`
    )
    .join("");
  document.querySelector(".colors_picked").classList.remove("hide");
  document.querySelectorAll(".color").forEach((li) => {
    li.addEventListener("click", (e) =>
      copyColor(e.currentTarget.lastElementChild)
    );
  });
};
showColors();

const activeEyeDropper = () => {
  document.body.style.display = "none";
  setTimeout(async () => {
    try {
      // opening the eyp dropper and getting the selected color
      const eyeDropper = new EyeDropper();
      const {sRGBHex} = await eyeDropper.open();
      navigator.clipboard.writeText(sRGBHex);

      // add picked color without duplicate
      if (!pickedColors.includes(sRGBHex)) {
        pickedColors.push(sRGBHex);
        localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
        showColors();
      }
    } catch (error) {
      console.log(error);
    }
    document.body.style.display = "block";
  }, 1000);
};
const clearAllColor = () => {
  pickedColors.length = 0;
  localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
  document.querySelector(".colors_picked").classList.add("hide");
};

clearAll.addEventListener("click", clearAllColor);
color_pickerBtn.addEventListener("click", activeEyeDropper);
