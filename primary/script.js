let isDragging = false;
let curTime = "";

enableDrag("myWindow");

let bg = document.querySelector(".background");
let sep = document.querySelector(".separated");
let boot = document.querySelector(".boot");
let style = getComputedStyle(document.body);
let image = style
  .getPropertyValue("--desktop-wallpaper")
  .replace('url("', "")
  .replace('")', "");

console.log(encodeURI(image));

function separateBackground(path) {
  // WARNING: This function takes long to load! Only load this in production
  // TODO: caching
  const finalURL = new URL(
    "https://backgroundremovalapi.skywarspro15.repl.co/separate"
  );
  finalURL.searchParams.append("p", path);
  console.log(finalURL.href);
  sep.src = finalURL.href;
  sep.addEventListener("load", () => {
    bg.src = path;
    bg.addEventListener("load", () => {
      boot.style.animation = "fadeOut 0.5s ease-in-out";
      setTimeout(() => {
        boot.remove();
      }, 500);
    });
  });
}

separateBackground(image);

function formatTimeDate(date) {
  var daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  var day = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;

  var strDate =
    daysOfWeek[date.getDay()] + ", " + months[date.getMonth()] + " " + day;
  return strTime + "\n" + strDate;
}

function formatTime(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes;

  return strTime;
}

let timeElement = document.querySelector(".time");
let timeDesktop = document.querySelector(".timeDesktop");
curTime = formatTimeDate(new Date());
console.log(curTime);
timeElement.innerText = curTime;
timeDesktop.innerText = formatTime(new Date());

setInterval(() => {
  curTime = formatTimeDate(new Date());
  console.log(curTime);
  timeElement.innerText = curTime;
  timeDesktop.innerText = formatTime(new Date());
}, 1000);

function windowGenerate(winData) {
  let winContent = winData.content;
  let winTitle = winData.title;
  let winId = winData.id;

  let cWinFrame = document.createElement("div");
  cWinFrame.id = winId;
  cWinFrame.className = "window-frame";

  let cWinSidebar = document.createElement("div");
  let cWinDrag = document.createElement("div");
  let cWinContent = document.createElement("div");
  let cWinControls = document.createElement("div");
  let cWinData = document.createElement("div");
  let cWinHeader = document.createElement("div");

  cWinDrag.className = "window-drag";
  cWinDrag.textContent = winTitle;

  cWinControls.className = "window-controls";
  cWinSidebar.className = "window-sidebar";
  cWinContent.className = "window-contents";
  cWinData.className = "window-data";
  cWinData.innerHTML = "xpos,ypos,snapped:no,system_app:no";
  cWinHeader.className = "window-header";
  cWinHeader.innerHTML = winContent;

  let cWinMinimize = document.createElement("button");
  let cWinMaximize = document.createElement("button");
  let cWinClose = document.createElement("button");

  cWinMinimize.className = "controls";
  cWinMinimize.innerHTML = "&#xE921;";

  cWinMaximize.className = "controls";
  cWinMaximize.innerHTML = "&#xE922;";
  cWinMaximize.addEventListener("click", () => {
    maximizeWindow(winId);
  });

  cWinClose.className = "controls";
  cWinClose.innerHTML = "&#xE8BB;";
  cWinClose.addEventListener("click", () => {
    closeWindow(winId);
  });

  cWinControls.appendChild(cWinMinimize);
  cWinControls.appendChild(cWinMaximize);
  cWinControls.appendChild(cWinClose);

  cWinContent.appendChild(cWinHeader);

  cWinFrame.appendChild(cWinDrag);
  cWinFrame.appendChild(cWinSidebar);
  cWinFrame.appendChild(cWinData);
  cWinFrame.appendChild(cWinControls);
  cWinFrame.appendChild(cWinContent);

  document.body.appendChild(cWinFrame);
  enableDrag(winId);
}

let curZIndex = 10;
let currentlyFocused = "";
let prevX;
let prevY;
let prevW;
let prevH;

window.addEventListener("resize", () => {
  if (currentlyFocused == "") {
    return;
  }
  let windowElement = document.getElementById(currentlyFocused);
  if (window.innerWidth > 600) {
    console.log("desktop");
    windowElement.style.left = prevX;
    windowElement.style.top = prevX;
    windowElement.style.width = prevW;
    windowElement.style.height = prevH;
    return;
  }
  console.log("mobile");
  prevX = windowElement.style.left;
  prevY = windowElement.style.top;
  prevW = windowElement.style.width;
  prevH = windowElement.style.height;
  windowElement.style.width = window.innerWidth + "px";
  windowElement.style.height = window.innerHeight + "px";
  windowElement.style.top = "0";
  windowElement.style.left = "0";
});

function closeWindow(winId) {
  let windowElement = document.getElementById(winId);
  windowElement.style.animation =
    "exitOut 0.5s cubic-bezier(0.19, 1, 0.22, 1) forwards";
  setTimeout(() => {
    windowElement.remove();
  }, 498);
}

let maximizedApps = {};
let beforeMaximized = {};

function maximizeWindow(winId) {
  let windowElement = document.getElementById(winId);
  console.log(maximizedApps);
  if (winId in maximizedApps) {
    beforeMaximized = maximizedApps[winId];
    windowElement.style.transitionDuration = "200ms";
    windowElement.style.transitionTimingFunction =
      "cubic-bezier(0.86,0,0.07,1)";
    windowElement.style.transitionProperty =
      "background-color, box-shadow, width, height, left, top";
    windowElement.style.width = beforeMaximized.width;
    windowElement.style.height = beforeMaximized.height;
    windowElement.style.left = beforeMaximized.left;
    windowElement.style.top = beforeMaximized.top;
    delete maximizedApps[winId];
    setTimeout(() => {
      windowElement.style.transitionDuration = "100ms";
      windowElement.style.transitionTimingFunction = "ease-out";
      windowElement.style.transitionProperty =
        "background-color, box-shadow, width, height";
    }, 200);
    return;
  }
  beforeMaximized = {
    width: windowElement.style.width,
    height: windowElement.style.height,
    left: windowElement.style.left,
    top: windowElement.style.top,
  };
  maximizedApps[winId] = beforeMaximized;
  windowElement.style.transitionDuration = "200ms";
  windowElement.style.transitionTimingFunction = "cubic-bezier(0.19,1,0.22,1)";
  windowElement.style.transitionProperty =
    "background-color, box-shadow, width, height, left, top";
  windowElement.style.width = "100%";
  windowElement.style.height = "100%";
  windowElement.style.left = 0;
  windowElement.style.top = 0;
  setTimeout(() => {
    windowElement.style.transitionDuration = "100ms";
    windowElement.style.transitionProperty =
      "background-color, box-shadow, width, height";
  }, 100);
}

let currentlyDragging;
let prevWindow;

function enableDrag(winId) {
  let windowElement = document.getElementById(winId);
  let windowHeader = windowElement.querySelector(".window-drag");
  let taskbar = document.getElementById("taskbar");

  windowHeader.addEventListener("mousedown", () => {
    if (isDragging) {
      return;
    }
    if (prevWindow) {
      prevWindow.classList.remove("focused");
    }
    curZIndex++;
    isDragging = true;
    currentlyFocused = winId;
    prevWindow = windowElement;
    currentlyDragging = windowElement;
    windowElement.style.zIndex = curZIndex;
    taskbar.style.zIndex = curZIndex + 1;
    windowElement.classList.add("focused");
  });

  window.addEventListener("mousemove", (event) => {
    if (isDragging) {
      event.preventDefault();
      if (winId in maximizedApps) {
        currentlyDragging.style.transitionDuration = "200ms";
        currentlyDragging.style.transitionTimingFunction =
          "cubic-bezier(0.19,1,0.22,1)";
        currentlyDragging.style.transitionProperty =
          "background-color, box-shadow, width, height, left, top";
        currentlyDragging.style.width = beforeMaximized.width;
        currentlyDragging.style.height = beforeMaximized.height;
        delete maximizedApps[winId];
        setTimeout(() => {
          currentlyDragging.style.transitionDuration = "100ms";
          currentlyDragging.style.transitionTimingFunction = "ease-out";
          currentlyDragging.style.transitionProperty =
            "background-color, box-shadow, width, height";
        }, 200);
      }

      currentlyDragging.style.left = `${
        event.clientX - windowElement.offsetWidth / 2
      }px`;
      currentlyDragging.style.top = `${event.clientY}px`;
      currentlyDragging.style.zIndex = curZIndex;
    }
  });

  window.addEventListener("mouseup", () => {
    if (isDragging) {
      if (currentlyDragging.style.top === 0) {
        maximizeWindow(winId);
      }
      isDragging = false;
    }
  });
}
