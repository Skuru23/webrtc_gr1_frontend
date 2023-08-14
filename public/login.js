$(document).ready(function () {
  $("#eye").click(function () {
    $(this).toggleClass("open");
    $(this).children("i").toggleClass("fa-eye-slash fa-eye");
    if ($(this).hasClass("open")) {
      $(this).prev().attr("type", "text");
    } else {
      $(this).prev().attr("type", "password");
    }
  });
});

document
  .getElementById("form-login")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Lấy thông tin đăng nhập từ form
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Gửi yêu cầu đăng nhập tới API backend bằng cách sử dụng fetch()
    fetch("https://web-rtc-gr1-be.onrender.com/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Đăng nhập không thành công");
        }
        return response.json();
      })
      .then((data) => {
        // Xử lý dữ liệu đăng nhập thành công
        console.log(data);
        let accessToken = data.accessToken;
        document.cookie = `accessToken=${accessToken}; path=/`;
        alert("Đăng nhập thành công!");
        // Lưu accessToken vào localStorage hoặc sessionStorage để sử dụng sau này
        localStorage.setItem("accessToken", data.accessToken);
        sessionStorage.setItem("user", JSON.stringify(data));
        sessionStorage.setItem('display_name', data.username);
        // Redirect hoặc thực hiện các thao tác cần thiết

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

        // Lấy access token từ cookie
        accessToken = getCookie("accessToken");

        // In ra màn hình console
        console.log("Access Token:", accessToken);
        window.location.href = "mainPage.html";
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("Đã xảy ra lỗi:", error.message);
        // Hiển thị thông báo lỗi cho người dùng
        alert(
          "Đăng nhập không thành công. Vui lòng kiểm tra lại tên người dùng và mật khẩu."
        );
      });
  });

switchRegister = () => {
  window.location.href = "register.html";
};
