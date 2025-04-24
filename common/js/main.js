let github = "깃헙 테스트입니다.";

////////////////////////////////////////// 나중에 파일 분리 필요 ///////////////////////////////////////
const totalPage = 3;

const FILE_EXTENSION = ".html";
const currentURL = window.location.href;
const fileName = currentURL.substring(currentURL.lastIndexOf("/") + 1);

const currentPageStr = fileName.replace(FILE_EXTENSION, "").padStart(2, "0");
const nowPageNum = parseInt(currentPageStr, 10);

const dirName = currentURL.split("/").slice(-2)[0].replace(/[^\d]/g, "").padStart(2, "0");
const nowChasiNum = parseInt(dirName, 10);

function nmr_itostr(num) {
  return num < 10 ? "0" + num : String(num);
}

const video = document.getElementById("my-video");
const source = video.querySelector("source");
const videoURL = "../mp4/";

source.src = `${videoURL}${nmr_itostr(nowChasiNum)}/${nmr_itostr(nowPageNum)}.mp4`;

function prevPage() {
  if (nowPageNum === 1) {
    alert("첫 페이지입니다.");
    return;
  }
  const prev = nmr_itostr(nowPageNum - 1) + FILE_EXTENSION;
  location.href = prev;
}

function nextPage() {
  if (nowPageNum === totalPage) {
    alert("마지막 페이지입니다.");
    return;
  }
  const next = nmr_itostr(nowPageNum + 1) + FILE_EXTENSION;
  location.href = next;
}

function movePage(num) {
  const move = nmr_itostr(num) + FILE_EXTENSION;
  location.href = move;
}

///////////////////////////// video js 관련 - 추후 파일 분리 필요 /////////////////////////////

var player = videojs("my-video", {
  controls: true,
  playbackRates: [0.5, 1, 1.5, 2],
  controlBar: {
    children: [
      "playToggle",
      "volumePanel",
      "progressControl",
      "playbackRateMenuButton",
      "currentTimeDisplay",
      "timeDivider",
      "durationDisplay",
      "fullscreenToggle",
    ],
    captionsButton: true,
    volumePanel: { inline: false },
  },
});

player.ready(function () {
  // 백넥스트 버튼, 페이지 숫자
  const wrapper = videojs.dom.createEl("div", {
    className: "next-button-box vjs-control",
  });
  const backBtn = videojs.dom.createEl("button", {
    className: "vjs-control vjs-button back-button",
    innerHTML: "",
    title: "Back",
  });
  backBtn.onclick = function () {
    prevPage();
  };

  const pageNum = videojs.dom.createEl("div", {
    className: "pageNum",
    innerHTML: nowPageNum,
  });

  const centerNum = videojs.dom.createEl("div", {
    className: "centerNum",
    innerHTML: "/",
  });

  const nextNum = videojs.dom.createEl("div", {
    className: "totalNum",
    innerHTML: totalPage,
  });

  const nextBtn = videojs.dom.createEl("button", {
    className: "vjs-control vjs-button next-button",
    innerHTML: "",
    title: "Next",
  });
  nextBtn.onclick = function () {
    nextPage();
  };

  const controlBar = player.getChild("controlBar");
  wrapper.appendChild(backBtn);
  wrapper.appendChild(pageNum);
  wrapper.appendChild(centerNum);
  wrapper.appendChild(nextNum);
  wrapper.appendChild(nextBtn);
  controlBar.el().appendChild(wrapper);

  // 말풍선
  const bubble = videojs.dom.createEl("div", {
    className: "bubble",
    innerHTML: `<button onclick="nextPage()"></button>`,
  });
  controlBar.el().appendChild(bubble);

  bubble.style.display = "none";

  player.on("ended", function () {
    bubble.style.display = "block";
  });

  // 인덱스
  const indexArea = document.createElement("div");
  indexArea.id = "indexArea";

  const indexBtn = document.createElement("div");
  indexBtn.id = "indexBtn";

  const indexCon = document.createElement("div");
  indexCon.id = "indexCon";

  const closeBtn = document.createElement("div");
  closeBtn.className = "closeBtn";

  function createIndexItem(classSuffix, text) {
    const indexDiv = document.createElement("div");
    indexDiv.className = `index${classSuffix} index`;

    const textBox = document.createElement("div");
    textBox.className = "textBox";
    textBox.textContent = text;

    indexDiv.appendChild(textBox);
    return indexDiv;
  }

  const index1 = createIndexItem("1", "START");
  const index2 = createIndexItem("2", "LEARNING");
  const index3 = createIndexItem("3", "QUIZ");

  indexCon.appendChild(closeBtn);
  indexCon.appendChild(index1);
  indexCon.appendChild(index2);
  indexCon.appendChild(index3);

  indexArea.appendChild(indexBtn);
  indexArea.appendChild(indexCon);

  controlBar.el().appendChild(indexArea);

  document.querySelector("#indexBtn").onclick = function () {
    if (indexCon.style.opacity === 1) {
      indexCon.style.opacity = 0;
      indexCon.style.left = "-270px";
      indexBtn.style.display = "block";
    } else {
      indexCon.style.opacity = 1;
      indexCon.style.left = "0px";
      indexBtn.style.display = "none";
    }
  };
  document.querySelector(".closeBtn").onclick = function () {
    indexCon.style.opacity = 0;
    indexCon.style.left = "-270px";
    indexBtn.style.display = "block";
  };

  document.querySelector(`.index${nowPageNum}`).classList.add("on");

  document.querySelectorAll(".index").forEach((el, idx) => {
    el.addEventListener("click", () => {
      const pageNum = idx + 1;
      document.querySelector(".index").classList.remove("on");
      document.querySelector(`.index${pageNum}`).classList.add("on");
      movePage(pageNum);
    });
  });

  // 최초 재생 후 -> 다음페이지 자동재생
  player.on("play", function () {
    localStorage.setItem("videoAutoplay", "true");
  });

  const shouldAutoplay = localStorage.getItem("videoAutoplay") === "true";
  if (shouldAutoplay) {
    const playPromise = player.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // 재생 성공
        })
        .catch((error) => {
          console.log("재생 실패:", error);
        });
    }
  }
});
