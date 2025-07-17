document.addEventListener("DOMContentLoaded", () => {
  // 🔁 Restore last visited tab
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

    if (lastPage === "dashboard") setupDashboardPage();
    if (lastPage === "services") setupServicesPage();
    if (lastPage === "bookings") setupBookingsPage();
    if (lastPage === "notifications") setupNotificationsPage();

    updatePageTitle(lastPage);
  }

  // For Search Services
  const searchInput = document.querySelector(".search-box input");
  const overlay = document.getElementById("searchOverlay");
  const servicesNavLink = document.querySelector('.nav-link[href="#services"]');

  let overlayShown = false;

  searchInput.addEventListener("focus", function () {
    if (!overlayShown) {
      overlay.classList.remove("d-none"); // Show overlay
      overlayShown = true;

      // Hide after 0.5s
      setTimeout(() => {
        overlay.classList.add("d-none");
      }, 3000);
    }
  });

  searchInput.addEventListener("keydown", function (e) {
    const value = searchInput.value.trim();

    if (value && e.key === "Enter") {
      if (servicesNavLink) servicesNavLink.click();
    }
  });
});

function initServiceSearch() {
  const searchInput = document.querySelector(".search-box input");
  const serviceCards = document.querySelectorAll(
    ".services-grid .service-card"
  );

  searchInput.addEventListener("input", function (e) {
    const query = searchInput.value.trim().toLowerCase();

    serviceCards.forEach((card) => {
      const serviceName = card
        .querySelector(".title")
        ?.textContent.trim()
        .toLowerCase();
      const description = card
        .querySelector(".description")
        ?.textContent.trim()
        .toLowerCase();

      const matches =
        serviceName?.includes(query) || description?.includes(query);

      card.style.display = matches ? "block" : "none";

      if (query.length < 3) {
        card.style.display = "block";
      }
    });
  });
}

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
    // Get the Requested page
    const page = link.getAttribute("href")?.substring(1);

    if (page === "dashboard") setupDashboardPage();
    if (page === "services") setupServicesPage();
    if (page === "bookings") setupBookingsPage();
    if (page === "notifications") setupNotificationsPage();

    updatePageTitle(page);

    // Save last visited tab in localStorage
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
    notifications: "Notifications",
    support: "Support",
    settings: "Settings",
    logout: "Logout",
  };

  pageTitle.textContent = titles[page] || "Dashboard";
}

// Logic Dashboard Page
function setupDashboardPage() {
  handleViewBookings();
  handleCompletedBookings();

  function handleViewBookings() {
    const viewBookingsBtn = document.getElementById("viewBookings");

    viewBookingsBtn.addEventListener("click", () => {
      const bookingsNavLink = document.querySelector(
        '.nav-link[href="#bookings"]'
      );

      if (bookingsNavLink) {
        bookingsNavLink.click();
      }
    });
  }
  function handleCompletedBookings() {
    const rateBtn = document.getElementById("rateBtn");

    rateBtn.addEventListener("click", () => {
      const bookingsNavLink = document.querySelector(
        '.nav-link[href="#bookings"]'
      );

      if (bookingsNavLink) {
        bookingsNavLink.click();
      }

      const navItems = document.querySelectorAll(".bookings-page .nav-item");
      if (navItems) {
        navItems.forEach((item) => {
          item.classList.remove("active");

          if (
            item.children[0] ===
            document.querySelector(".nav-item [data-filter='confirmed']")
          ) {
            console.log("TRUE");
            item.classList.add("active");
            item.children[0].click();
          }
        });
      }
    });
  }
}

/* Logic Services Page */
function setupServicesPage() {
  initServiceSearch();
  handleFav();
  const filterSelect = document.querySelector(".services-page .filter-select");
  const sortSelect = document.querySelector(".services-page .sort-select");

  filterSelect?.addEventListener("change", function (e) {
    filterServices(e.target.value);
  });

  sortSelect?.addEventListener("change", function (e) {
    sortServices(e.target.value);
  });

  function handleFav() {
    const serviceCards = document.querySelectorAll(
      ".services-page .service-card"
    );

    serviceCards.forEach((srv) => {
      srv.addEventListener("click", function (e) {
        if (e.target.classList.contains("fav-icon")) {
          e.target.classList.toggle("fas");
          e.target.parentElement.classList.toggle("active");
        }
      });
    });
  }

  function filterServices(filterOption) {
    const serviceCards = document.querySelectorAll(
      ".services-page .service-card"
    );
    const normalizedFilter = filterOption.toLowerCase();

    serviceCards.forEach((card) => {
      const category = (card.dataset.category || "").toLowerCase();

      if (normalizedFilter === "all" || category === normalizedFilter) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  }
  function sortServices(sortBy) {
    const servicesGrid = document.querySelector(
      ".services-page .services-grid"
    );
    const serviceCards = Array.from(
      document.querySelectorAll(".services-page .service-card")
    );

    const extractRating = (card) => {
      const text =
        card.querySelector(".service-rating span")?.textContent || "";
      const match = text.match(/([\d.]+)/);
      return match ? parseFloat(match[1]) : 0;
    };

    const extractPrice = (card) => {
      const text = card.querySelector(".service-price")?.textContent || "";
      const match = text.match(/(\d+)/);
      return match ? parseFloat(match[1]) : Infinity;
    };

    let sortedCards = [...serviceCards];

    switch (sortBy) {
      case "price-low":
        sortedCards.sort((a, b) => extractPrice(a) - extractPrice(b));
        break;
      case "price-high":
        sortedCards.sort((a, b) => extractPrice(b) - extractPrice(a));
        break;
      case "popular":
        sortedCards.sort((a, b) => {
          const aReviews = parseInt(
            a
              .querySelector(".service-rating span")
              ?.textContent.match(/\((\d+)/)?.[1] || 0
          );
          const bReviews = parseInt(
            b
              .querySelector(".service-rating span")
              ?.textContent.match(/\((\d+)/)?.[1] || 0
          );
          return bReviews - aReviews;
        });
        break;
      default:
        sortedCards = sortedCards.sort(
          (a, b) => extractRating(b) - extractRating(a)
        );
    }

    servicesGrid.innerHTML = "";
    sortedCards.forEach((card) => servicesGrid.appendChild(card));
  }
}

//  Logic Bookings Page
function setupBookingsPage() {
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

    localStorage.setItem("lastVisitedPage", "bookings");
  });
}

function setupNotificationsPage() {
  const markAllBtn = document.getElementById("markAll");

  markAllBtn.addEventListener("click", (e) => {
    document
      .querySelectorAll(".notifications-page .notification-item.unread")
      .forEach((item) => {
        item.classList.remove("unread");
        item.querySelector("button").remove();
      });
  });

  const markBtns = document.querySelectorAll(
    ".notifications-page .notification-item.unread"
  );

  markBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (e.target == btn.querySelector("button")) {
        btn.classList.remove("unread");
        btn.querySelector("button").remove();
      }
    });
  });
}
