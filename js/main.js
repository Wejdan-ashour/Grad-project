const menuToggle = document.getElementById("menuToggle");
const sidebar = document.querySelector(".sidebar");
const navLinks = document.querySelectorAll(".nav-link");

document.addEventListener("DOMContentLoaded", () => {
  const lastPage = localStorage.getItem("lastVisitedPage") || "home";
  const targetTab = document.querySelector(`.nav-link[href="#${lastPage}"]`);
  const tabPane = document.getElementById(lastPage);

  if (targetTab && tabPane) {
    // Remove current active tabs
    document
      .querySelectorAll(".nav-link.active")
      .forEach((el) => el.classList.remove("active"));
    document.querySelectorAll(".tab-pane.show.active").forEach((el) => {
      el.classList.remove("show", "active");
    });

    // Activate the saved tab and content
    targetTab.classList.add("active");
    tabPane.classList.add("show", "active");
  }

  if (lastPage === "services") {
    initServiceSearch();
    const bookingBtns = document.querySelectorAll(".booking-now-btn");
    bookingBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        window.location.href = "/login.html";
      });
    });
  }

  const logoLink = document.querySelector(".logo-link");
  logoLink.addEventListener("click", function (e) {
    e.preventDefault();

    const homeNavLink = document.querySelector('.nav-link[href="#home"]');

    if (homeNavLink) {
      homeNavLink.click();
    }
  });

  document.querySelectorAll(".view-services-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const servicesNavLink = document.querySelector(
        ".nav-link[href='#services']"
      );

      if (servicesNavLink) servicesNavLink.click();

      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" }, 100);
      });
    });
  });

  document
    .getElementById("testimoialsBtn")
    .addEventListener("click", function () {
      const testimoialsNavLink = document.querySelector(
        ".nav-link[href='#testimonials']"
      );

      if (testimoialsNavLink) testimoialsNavLink.click();

      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" }, 100);
      });
    });
});

// Close sidebar when clicking outside
document.addEventListener("click", (e) => {
  if (window.innerWidth <= 768) {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
      sidebar.classList.remove("active");
    }
  }
});

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    // Get the Requested page
    const page = link.getAttribute("href")?.substring(1);

    console.log(page);

    // Save last visited tab in localStorage
    localStorage.setItem("lastVisitedPage", page);

    // Close sidebar on small screens
    if (window.innerWidth <= 768) {
      sidebar.classList.remove("active");
    }
  });
});

function initServiceSearch() {
  const searchInput = document.getElementById("searchInput");
  const serviceCards = document.querySelectorAll("#servicesContainer .card");

  searchInput.addEventListener("input", function (e) {
    const query = searchInput.value.trim().toLowerCase();

    serviceCards.forEach((card) => {
      const serviceName = card
        .querySelector(".card-title")
        ?.textContent.trim()
        .toLowerCase();
      const description = card
        .querySelector(".card-body .description")
        ?.textContent.trim()
        .toLowerCase();

      const matches =
        serviceName?.includes(query) || description?.includes(query);

      card.parentElement.style.display = matches ? "block" : "none";

      if (query.length < 3) {
        card.parentElement.style.display = "block";
      }
    });
  });
}

function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

async function getAddress({ latitude, longitude }) {
  // getting some info about that the GPS location city name
  const res = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`
  );
  if (!res.ok) throw Error("Failed getting address");

  const data = await res.json();
  console.log(data);
  return data;
}

async function getYourLocation() {
  const positionObj = await getPosition(); //  Data comes from the API

  const position = {
    latitude: positionObj.coords.latitude,
    longitude: positionObj.coords.longitude,
  };

  const addressObj = await getAddress(position);
  const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

  return { position, address };
}

export function getLocation() {
  const locationBtn = document.querySelector(".get-location-btn");
  const locationInput = document.getElementById("location");
  const notyf = new Notyf();

  locationBtn?.addEventListener("click", async function (e) {
    e.preventDefault();

    //   locationInput?.disabled = true;
    //   locationInput?.placeholder = "Fetching location...";
    locationBtn.disabled = true;
    locationBtn.textContent = "Loading...";
    locationInput.disabled = true;

    try {
      const res = await getYourLocation();
      console.log(res);

      if (res?.address) {
        locationInput.value = res.address;
        locationInput.disabled = false;
        notyf.success("Address fetched successfully!");
      } else {
        notyf.error("Failed to get location");
      }

      console.log(res);
    } catch (err) {
      notyf.error(err.message);
      console.error(err);
    }

    locationInput.disabled = false;
    locationBtn.disabled = false;
    locationBtn.textContent = "Get Address";
  });
}

getLocation();
