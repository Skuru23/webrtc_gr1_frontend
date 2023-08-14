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

    const email = document.getElementById("email").value;
    const name = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const data = {
      username: name,
      password: password,
      email: email,
    };

    fetch("https://web-rtc-gr1-be.onrender.com/auth/re", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Đăng ký tài khoản không thành công");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        // Xử lý dữ liệu sau khi đăng ký thành công (nếu cần)
        alert("Đăng ký tài khoản thành công!");
        // Thực hiện chuyển hướng hoặc thực hiện các thao tác cần thiết
        window.location.href = "login.html";
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("Đã xảy ra lỗi:", error.message);
        // Hiển thị thông báo lỗi cho người dùng
        alert(
          "Đăng ký tài khoản không thành công. Vui lòng kiểm tra lại thông tin."
        );
      });
  });

switchLogin = () => {
  window.location.href = "login.html";
};
