//check the console for date click event
//Fixed day highlight
//Added previous month and next month view

function LoadData() {
  const ownItemList = document.getElementById("ownitemList");
  const joinedItemList = document.getElementById("joineditemList");
  let data = [];

  const user = JSON.parse(sessionStorage.getItem("user"));
  if (user == null) {
    window.location.href = "login.html";
  }
  console.log(user);

  function getCookie(cookieName) {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(cookieName + "=")) {
        return cookie.substring(cookieName.length + 1);
      }
    }
    return null;
  }

  const accessToken = getCookie("accessToken");

  // Hàm khởi tạo danh sách
  function createOwnItemList(data) {
    data.forEach((item) => {
      const listItem = document.createElement("div");
      listItem.classList.add("list-item");
      listItem.setAttribute("data-id", item._id);

      const itemName = document.createElement("div");
      itemName.textContent = "Tên mục: " + item.name;
      listItem.appendChild(itemName);

      listItem.textContent = item.name; // Thay thế "name" bằng trường dữ liệu bạn muốn hiển thị
      // listItem.appendChild(listItem);

      const itemButton = document.createElement("button");
      itemButton.textContent = "Mở";
      itemButton.classList.add("join-button");
      listItem.appendChild(itemButton);

      itemButton.addEventListener("click", function () {
        // Truy xuất thuộc tính ẩn từ data attribute của thẻ cha
        const itemId = listItem.getAttribute("data-id");
        console.log("Id mục:", itemId);
        window.location.href = `index.html?room=${itemId}`;
      });

      ownItemList.appendChild(listItem);
    });
  }

  function createJoinedItemList(data) {
    data.forEach((item) => {
      const listItem = document.createElement("div");
      listItem.classList.add("list-item");
      listItem.setAttribute("data-id", item._id);

      const itemName = document.createElement("div");
      itemName.textContent = "Tên mục: " + item.name;
      listItem.appendChild(itemName);

      listItem.textContent = item.name; // Thay thế "name" bằng trường dữ liệu bạn muốn hiển thị
      // listItem.appendChild(listItem);

      const itemButton = document.createElement("button");
      itemButton.classList.add("join-button");
      itemButton.textContent = "Mở";
      listItem.appendChild(itemButton);

      itemButton.addEventListener("click", function () {
        // Truy xuất thuộc tính ẩn từ data attribute của thẻ cha
        const itemId = listItem.getAttribute("data-id");
        console.log("Id mục:", itemId);
        window.location.href = `index.html?room=${itemId}`;
      });

      joinedItemList.appendChild(listItem);
    });
  }
  // Tạo danh sách các mục
  function getOwnedRoomInfo() {
    console.log(accessToken);

    fetch("http://localhost:8000/callroom/getAll/" + `${user._id}`, {
      method: "GET",
      headers: {
        token: `Bearer ${accessToken}`,
      },
    }) // Thay thế URL và endpoint phù hợp
      .then((response) => response.json())
      .then((data) => {
        // Xử lý dữ liệu và hiển thị danh sách các đối tượng
        createOwnItemList(data);
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("Đã xảy ra lỗi:", error);
        // Hiển thị thông báo lỗi cho người dùng (nếu cần)
        ownItemList.innerHTML =
          "<li>Đã xảy ra lỗi khi tải danh sách đối tượng</li>";
      });
  }

  function getJoinedRoomInfo() {
    fetch("http://localhost:8000/callroom/getJoined/" + `${user._id}`, {
      method: "GET",
      headers: {
        token: `Bearer ${accessToken}`,
      },
    }) // Thay thế URL và endpoint phù hợp
      .then((response) => response.json())
      .then((data) => {
        // Xử lý dữ liệu và hiển thị danh sách các đối tượng
        createJoinedItemList(data);
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("Đã xảy ra lỗi:", error);
        // Hiển thị thông báo lỗi cho người dùng (nếu cần)
        ownItemList.innerHTML =
          "<li>Đã xảy ra lỗi khi tải danh sách đối tượng</li>";
      });
  }

  function filterItems(filterdate) {
    console.log(data);
    const filteredItems = data.filter((item) =>
      item.startTime.toLowerCase().includes(filterdate.toLowerCase())
    );
    createOwnItemList(filteredItems);
    createJoinedItemList(filteredItems);
  }

  getJoinedRoomInfo();
  getOwnedRoomInfo();
  CalendarControl();

  const openFormBtn = document.getElementById("openAddFormBtn");
  const closeFormBtn = document.getElementById("closeAddFormBtn");
  const formPopup = document.getElementById("addForm");

  openFormBtn.addEventListener("click", function () {
    formPopup.classList.add("show");
  });

  closeFormBtn.addEventListener("click", function () {
    formPopup.classList.remove("show");
  });

  formPopup.addEventListener("submit", function (event) {
    location.reload();
    const roomname = document.getElementById("roomname").value;
    const participants = document
      .getElementById("participants")
      .value.split(/[,\s]+/);
    const startdate = document.getElementById("startdate").value;
    let password = document.getElementById("password").value;

    let roomdata;
    if (password === "") {
      roomdata = {
        name: roomname,
        registor: user._id,
        participants: participants,
        startTime: startdate,
      };
    }else{
      roomdata = {
        name: roomname,
        registor: user._id,
        participants: participants,
        startTime: startdate,
        password: password,
      };
    }
    

    sessionStorage.setItem("roomdata", JSON.stringify(roomdata));

    fetch("http://localhost:8000/callroom/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(roomdata),
    }) // Thay thế URL và endpoint phù hợp
      .then((response) => {
        if (!response.ok) {
          throw new Error("Tạo không thành công");
        }
        localStorage.setItem("res", response);
        return response.json();
      })
      .then((data) => {
        // Xử lý dữ liệu và hiển thị danh sách các đối tượng
        sessionStorage.setItem("sentroomdata", data);
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("Đã xảy ra lỗi:", error);
        // Hiển thị thông báo lỗi cho người dùng (nếu cần)
      });
  });

  let selectedDate;

  const showName = document.getElementById("user-name");
  showName.innerText = user.username;

  function CalendarControl() {
    const calendar = new Date();
    const calendarControl = {
      localDate: new Date(),
      prevMonthLastDate: null,
      calWeekDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      calMonthName: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      daysInMonth: function (month, year) {
        return new Date(year, month, 0).getDate();
      },
      firstDay: function () {
        return new Date(calendar.getFullYear(), calendar.getMonth(), 1);
      },
      lastDay: function () {
        return new Date(calendar.getFullYear(), calendar.getMonth() + 1, 0);
      },
      firstDayNumber: function () {
        return calendarControl.firstDay().getDay() + 1;
      },
      lastDayNumber: function () {
        return calendarControl.lastDay().getDay() + 1;
      },
      getPreviousMonthLastDate: function () {
        let lastDate = new Date(
          calendar.getFullYear(),
          calendar.getMonth(),
          0
        ).getDate();
        return lastDate;
      },
      navigateToPreviousMonth: function () {
        calendar.setMonth(calendar.getMonth() - 1);
        calendarControl.attachEventsOnNextPrev();
      },
      navigateToNextMonth: function () {
        calendar.setMonth(calendar.getMonth() + 1);
        calendarControl.attachEventsOnNextPrev();
      },
      navigateToCurrentMonth: function () {
        let currentMonth = calendarControl.localDate.getMonth();
        let currentYear = calendarControl.localDate.getFullYear();
        calendar.setMonth(currentMonth);
        calendar.setYear(currentYear);
        calendarControl.attachEventsOnNextPrev();
      },
      displayYear: function () {
        let yearLabel = document.querySelector(
          ".calendar .calendar-year-label"
        );
        yearLabel.innerHTML = calendar.getFullYear();
      },
      displayMonth: function () {
        let monthLabel = document.querySelector(
          ".calendar .calendar-month-label"
        );
        monthLabel.innerHTML =
          calendarControl.calMonthName[calendar.getMonth()];
      },
      selectDate: function (e) {
        selectedDate = `${calendar.getFullYear()}-${calendar.getMonth()}-${
          e.target.textContent
        }`;
        filterItems(selectedDate);
        console.log(
          `${calendar.getFullYear()}-${calendar.getMonth()}-${
            e.target.textContent
          }`
        );
      },
      plotSelectors: function () {
        document.querySelector(
          ".calendar"
        ).innerHTML += `<div class="calendar-inner"><div class="calendar-controls">
            <div class="calendar-prev"><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><path fill="#666" d="M88.2 3.8L35.8 56.23 28 64l7.8 7.78 52.4 52.4 9.78-7.76L45.58 64l52.4-52.4z"/></svg></a></div>
            <div class="calendar-year-month">
            <div class="calendar-month-label"></div>
            <div>-</div>
            <div class="calendar-year-label"></div>
            </div>
            <div class="calendar-next"><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><path fill="#666" d="M38.8 124.2l52.4-52.42L99 64l-7.77-7.78-52.4-52.4-9.8 7.77L81.44 64 29 116.42z"/></svg></a></div>
            </div>
            <div class="calendar-today-date">Today: 
              ${
                calendarControl.calWeekDays[calendarControl.localDate.getDay()]
              }, 
              ${calendarControl.localDate.getDate()}, 
              ${
                calendarControl.calMonthName[
                  calendarControl.localDate.getMonth()
                ]
              } 
              ${calendarControl.localDate.getFullYear()}
            </div>
            <div class="calendar-body"></div></div>`;
      },
      plotDayNames: function () {
        for (let i = 0; i < calendarControl.calWeekDays.length; i++) {
          document.querySelector(
            ".calendar .calendar-body"
          ).innerHTML += `<div>${calendarControl.calWeekDays[i]}</div>`;
        }
      },
      plotDates: function () {
        document.querySelector(".calendar .calendar-body").innerHTML = "";
        calendarControl.plotDayNames();
        calendarControl.displayMonth();
        calendarControl.displayYear();
        let count = 1;
        let prevDateCount = 0;

        calendarControl.prevMonthLastDate =
          calendarControl.getPreviousMonthLastDate();
        let prevMonthDatesArray = [];
        let calendarDays = calendarControl.daysInMonth(
          calendar.getMonth() + 1,
          calendar.getFullYear()
        );
        // dates of current month
        for (let i = 1; i < calendarDays; i++) {
          if (i < calendarControl.firstDayNumber()) {
            prevDateCount += 1;
            document.querySelector(
              ".calendar .calendar-body"
            ).innerHTML += `<div class="prev-dates"></div>`;
            prevMonthDatesArray.push(calendarControl.prevMonthLastDate--);
          } else {
            document.querySelector(
              ".calendar .calendar-body"
            ).innerHTML += `<div class="number-item" data-num=${count}><a class="dateNumber" href="#">${count++}</a></div>`;
          }
        }
        //remaining dates after month dates
        for (let j = 0; j < prevDateCount + 1; j++) {
          document.querySelector(
            ".calendar .calendar-body"
          ).innerHTML += `<div class="number-item" data-num=${count}><a class="dateNumber" href="#">${count++}</a></div>`;
        }
        calendarControl.highlightToday();
        calendarControl.plotPrevMonthDates(prevMonthDatesArray);
        calendarControl.plotNextMonthDates();
      },
      attachEvents: function () {
        let prevBtn = document.querySelector(".calendar .calendar-prev a");
        let nextBtn = document.querySelector(".calendar .calendar-next a");
        let todayDate = document.querySelector(
          ".calendar .calendar-today-date"
        );
        let dateNumber = document.querySelectorAll(".calendar .dateNumber");
        prevBtn.addEventListener(
          "click",
          calendarControl.navigateToPreviousMonth
        );
        nextBtn.addEventListener("click", calendarControl.navigateToNextMonth);
        todayDate.addEventListener(
          "click",
          calendarControl.navigateToCurrentMonth
        );
        for (var i = 0; i < dateNumber.length; i++) {
          dateNumber[i].addEventListener(
            "click",
            calendarControl.selectDate,
            false
          );
        }
      },
      highlightToday: function () {
        let currentMonth = calendarControl.localDate.getMonth() + 1;
        let changedMonth = calendar.getMonth() + 1;
        let currentYear = calendarControl.localDate.getFullYear();
        let changedYear = calendar.getFullYear();
        if (
          currentYear === changedYear &&
          currentMonth === changedMonth &&
          document.querySelectorAll(".number-item")
        ) {
          document
            .querySelectorAll(".number-item")
            [calendar.getDate() - 1].classList.add("calendar-today");
        }
      },
      plotPrevMonthDates: function (dates) {
        dates.reverse();
        for (let i = 0; i < dates.length; i++) {
          if (document.querySelectorAll(".prev-dates")) {
            document.querySelectorAll(".prev-dates")[i].textContent = dates[i];
          }
        }
      },
      plotNextMonthDates: function () {
        let childElemCount =
          document.querySelector(".calendar-body").childElementCount;
        //7 lines
        if (childElemCount > 42) {
          let diff = 49 - childElemCount;
          calendarControl.loopThroughNextDays(diff);
        }

        //6 lines
        if (childElemCount > 35 && childElemCount <= 42) {
          let diff = 42 - childElemCount;
          calendarControl.loopThroughNextDays(42 - childElemCount);
        }
      },
      loopThroughNextDays: function (count) {
        if (count > 0) {
          for (let i = 1; i <= count; i++) {
            document.querySelector(
              ".calendar-body"
            ).innerHTML += `<div class="next-dates">${i}</div>`;
          }
        }
      },
      attachEventsOnNextPrev: function () {
        calendarControl.plotDates();
        calendarControl.attachEvents();
      },
      init: function () {
        calendarControl.plotSelectors();
        calendarControl.plotDates();
        calendarControl.attachEvents();
      },
    };
    calendarControl.init();
  }
}

const dataloader = new LoadData();

document.addEventListener("DOMContentLoaded", dataloader);

document.getElementById("logout").addEventListener("click", function (event) {
  function logout() {
    // Xóa dữ liệu trong session storage
    sessionStorage.clear();

    // Xóa dữ liệu trong cookies
    document.cookie =
      "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Đặt hết hạn ngày trong quá khứ để xóa cookie
    localStorage.removeItem("accessToken");
    // Chuyển hướng đến trang đăng nhập (hoặc trang chủ)
    window.location.href = "login.html"; // Thay đổi đường dẫn nếu cần
  }
  logout();
});
