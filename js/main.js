(function () {
    const viewRoot = document.querySelector("[data-view-root]");
    const navButtons = Array.from(document.querySelectorAll("[data-nav-view]"));
    const eventCardsCount = 3;
    const infoSections = [
        {
            id: "search-books-title",
            title: "Find your perfect book in minutes!",
            text: "Use our online search to instantly find the shelf and bookshelf number you need. And if you prefer to read in the comfort of your own home, simply reserve a book online and pick it up at a time that suits you."
        },
        {
            id: "welcome-title",
            title: 'Welcome to "Rivna Kniga"!',
            text: "We have gathered the largest collection of literature in the city, so that you have an unlimited choice for leisure and study. We are proud of the status of the largest library in the city, because our fund has over 5,000 copies - from immortal classics to the latest bestsellers. We have combined long-standing traditions with modern service, so that every resident of the city can find a book to their liking."
        }
    ];

    const views = {
        home: {
            pageLabel: "City Library",
            render: renderHomeView
        },
        catalog: createPlaceholderView(
            "Catalog",
            "This section is already wired for JavaScript rendering. When you send the catalog layout, I can replace this block without reloading the page."
        ),
        booking: createPlaceholderView(
            "Booking",
            "This area is reserved for the booking interface. The tab already switches dynamically, so the final layout can be connected here in the next step."
        )
    };

    document.addEventListener("click", handleNavigationClick);
    window.addEventListener("hashchange", renderCurrentView);

    renderCurrentView();

    function handleNavigationClick(event) {
        const trigger = event.target.closest("[data-nav-view]");

        if (!trigger) {
            return;
        }

        const nextView = trigger.dataset.navView;

        if (!views[nextView]) {
            return;
        }

        event.preventDefault();
        navigateToView(nextView);
    }

    function navigateToView(viewKey) {
        if (getViewKeyFromHash() === viewKey) {
            renderCurrentView();
            return;
        }

        if (viewKey === "home") {
            history.replaceState(null, "", window.location.pathname + window.location.search);
            renderCurrentView();
            return;
        }

        window.location.hash = viewKey;
    }

    function getViewKeyFromHash() {
        const hashValue = window.location.hash.slice(1).trim().toLowerCase();
        return views[hashValue] ? hashValue : "home";
    }

    function renderCurrentView() {
        const viewKey = getViewKeyFromHash();
        const currentView = views[viewKey];

        document.title = viewKey === "home"
            ? currentView.pageLabel
            : currentView.pageLabel + " | City Library";
        viewRoot.innerHTML = currentView.render();
        updateActiveNavigation(viewKey);
    }

    function updateActiveNavigation(viewKey) {
        navButtons.forEach(function (button) {
            const isActive = button.dataset.navView === viewKey && viewKey !== "home";
            button.classList.toggle("is-active", isActive);
            button.toggleAttribute("aria-current", isActive);
        });
    }

    function renderHomeView() {
        return `
            <section class="view-panel home-view">
                <div class="home-hero">
                    <h2>City Library</h2>
                </div>
                ${infoSections.map(renderInfoSection).join("")}
                <section class="events-section" aria-labelledby="events-title">
                    <hr class="section-divider">
                    <h3 id="events-title">Our events</h3>
                    <div class="events-grid">${renderEventCards()}</div>
                </section>
                <footer class="site-footer">
                    <div class="footer-seal">
                        <img src="./assets/logo/bottom%20logo.png" alt="City Library logo">
                    </div>
                    <div class="footer-text">
                        <p>"Equal Book" all rights reserved &copy;</p>
                        <p>Address: 66 Central Street</p>
                        <p>Mobile: 097 66 000</p>
                    </div>
                </footer>
            </section>
        `;
    }

    function renderInfoSection(section) {
        return `
            <section class="copy-block" aria-labelledby="${section.id}">
                <h3 id="${section.id}">${section.title}</h3>
                <p>${section.text}</p>
            </section>
        `;
    }

    function renderEventCards() {
        return Array.from({ length: eventCardsCount }, function (_, index) {
            return `
                <article class="event-card" aria-label="Upcoming event ${index + 1}">
                    <div class="event-card__body" aria-hidden="true"></div>
                    <button class="event-card__action" type="button">Details</button>
                </article>
            `;
        }).join("");
    }

    function createPlaceholderView(sectionName, description) {
        return {
            pageLabel: sectionName,
            render: function () {
                return `
                    <section class="view-panel placeholder-view">
                        <div class="placeholder-card">
                            <span>${sectionName}</span>
                            <h2>${sectionName} will load here via JavaScript</h2>
                            <p>${description}</p>
                            <button class="inline-action" type="button" data-nav-view="home">Back to main menu</button>
                        </div>
                    </section>
                `;
            }
        };
    }
}());
