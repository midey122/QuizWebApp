document.getElementById("open-modal").addEventListener("click", function () {
  document.querySelector(".modal-container").style.display = "block";
});

document.querySelector(".close").addEventListener("click", function () {
  document.querySelector(".modal-container").style.display = "none";
});

document
  .getElementById("signup-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    alert("Sign up form submitted!");
    document.querySelector(".modal-container").style.display = "none";
  });

function editProfile() {
  // Add your code to handle editing the profile
  alert("Edit Profile");
}

function deleteAccount() {
  // Add your code to handle deleting the account
  if (confirm("Are you sure you want to delete your account?")) {
    // Add code to delete the account
    alert("Account deleted");
  }
}
