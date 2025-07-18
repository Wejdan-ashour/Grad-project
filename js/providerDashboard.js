document.addEventListener("DOMContentLoaded", function () {
  const lastPage = localStorage.getItem("lastVisitedPage") || "dashboard";
  const targetTab = document.querySelector(`.nav-link[href="#${lastPage}"]`);
  const tabPane = document.getElementById(lastPage);

  const lastFilter = localStorage.getItem("bookingsFilter") || "all";

  const btns = document.querySelectorAll("button[data-filter]");

  btns.forEach((btn) => {
    btn.parentElement.classList.remove("active");

    if (btn.dataset.filter === lastFilter) {
      btn.parentElement.classList.add("active");
    }
  });

  const rows = document.querySelectorAll(".booking-row[data-status]");
  let visibleCount = 0;

  rows.forEach((row) => {
    const match = row.dataset.status === lastFilter || lastFilter === "all";
    row.classList.toggle("d-none", !match); // when match false => this toggle will work as add(), the other side will work as remove()
    if (match) visibleCount++;
  });

  const noResults = document.querySelector(".no-results-message");
  noResults.classList.toggle("d-none", visibleCount > 0);

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

    // if (lastPage === "dashboard") setupDashboardPage();
    // if (lastPage === "services") setupServicesPage();
    if (lastPage === "bookings") setupBookingsPage(lastPage);
    // if (lastPage === "notifications") setupNotificationsPage();

    updatePageTitle(lastPage);
  }
});

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.querySelector(".sidebar");
const navLinks = document.querySelectorAll(".nav-link");
const pageContent = document.getElementById("pageContent");

// Toggle sidebar on small screens
menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("active");
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
    const page = link.getAttribute("href")?.substring(1);

    if (page === "bookings") setupBookingsPage(page);

    updatePageTitle(page);

    localStorage.setItem("lastVisitedPage", page);

    // Close sidebar on small screens
    if (window.innerWidth <= 768) {
      sidebar.classList.remove("active");
    }
  });
});

// Update page title
function updatePageTitle(page) {
  const pageTitle = document.querySelector(".page-title");
  const titles = {
    dashboard: "Dashboard",
    services: "Browse Services",
    bookings: "My Bookings",
    favorites: "Favorites",
    profile: "Profile",
    earnings: "Earnings",
    reviews: "Reviews",
    settings: "Settings",
    logout: "Logout",
  };

  pageTitle.textContent = titles[page] || "Dashboard";
}

//  Logic Bookings Page
function setupBookingsPage(page) {
  // Active filter-tab
  const btns = document.querySelectorAll("button[data-filter]");

  btns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      btns.forEach((b) => {
        b.parentElement.classList.remove("active");
      });
      btn.parentElement.classList.add("active");

      localStorage.setItem("bookingsFilter", btn.dataset.filter);
    });
  });

  document.getElementById("bookingFilters").addEventListener("click", (e) => {
    const button = e.target.closest("button[data-filter]");
    if (!button) return;

    const filter = e.target.dataset.filter;

    const rows = document.querySelectorAll(".booking-row[data-status]");
    let visibleCount = 0;

    rows.forEach((row) => {
      const match = filter === "all" || row.dataset.status === filter;
      row.classList.toggle("d-none", !match);
      if (match) visibleCount++;
    });

    const noResults = document.querySelector(".no-results-message");
    noResults.classList.toggle("d-none", visibleCount > 0);

    localStorage.setItem("lastVisitedPage", page);
  });
}
