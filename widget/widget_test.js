class InsightsWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.insightsData = [];
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.sap.com/css?family=72');
                :host {
                    display: block;
                    font-family: '72', sans-serif;
                    color: white;
                    padding: 10px;
                }
                nav {
                    width: 180px;
                    background-color: #24242C;
                    color: #9EA0A7;
                    display: flex;
                    flex-direction: column;
                    align-items: left;
                    padding-top: 20px;
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 100%;
                    overflow-y: auto;
                }
                nav div {
                    margin: 10px 0;
                    cursor: pointer;
                    padding: 10px;
                    display: flex;
                    align-items: center;
                }
                nav div:hover {
                    background-color: #363640;
                }
                h1 {
                    color: #BE882E
                }
                .main-content {
                    padding: 10px;
                    color: white;
                    flex: 1;
                    margin-left: 200px;
                    display: none; /* Hide all pages by default */
                }
                .main-content.active {
                    display: block; /* Show active page */
                }
                .icon {
                    width: 20px;
                    height: 20px;
                    margin-right: 10px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    padding: 8px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                #searchInput {
                    width: 70%;
                    height: 20px;
                    border: 2px solid #4F505E;
                    border-radius: 20px;
                    color: #DCE3E9;
                    margin-left: 20px;
                    background-color: #363640;
                }
            </style>

            <nav class="sidebar">
                <input id="searchInput" type="text" placeholder="Search..." onkeyup="this.getRootNode().host.searchTable()">
                <div data-page="insights">
                    <img src="https://abbysyz.github.io/friendlyreportingui.github.io/assets/icons/lightbulb.svg" class="icon">
                    <span>All Insights</span>
                </div>
                <div data-page="favorites">
                    <img src="https://abbysyz.github.io/friendlyreportingui.github.io/assets/icons/unfavorite_gray.svg" class="icon">
                    <span>Favorites</span>
                </div>
                <div data-page="customization">
                    <img src="https://abbysyz.github.io/friendlyreportingui.github.io/assets/icons/customize.svg" class="icon">
                    <span>Customization</span>
                </div>
                <div data-page="info">
                    <img src="https://abbysyz.github.io/friendlyreportingui.github.io/assets/icons/information.svg" class="icon">
                    <span>Info</span>
                </div>
                <div data-page="contact">
                    <img src="https://abbysyz.github.io/friendlyreportingui.github.io/assets/icons/person.svg" class="icon">
                    <span>Contact Us</span>
                </div>
            </nav>

            <div class="main-content active" id="insights">
                <h1>All Insights</h1>
                <table id="insightsTable">
                    <tbody></tbody>
                </table>
            </div>

            <div class="main-content" id="favorites">
                <h1>Favorites</h1>
                <p>Favourited insights list. This function will be implemented in the next release.</p>
                <table>
                    <tbody id="favouriteTableBody"></tbody>
                </table>
            </div>

            <div class="main-content" id="customization">
                <h1>Customization</h1>
                <p>Some customizable filters for insights.</p>
            </div>

            <div class="main-content" id="info">
                <h1>Info Page</h1>
                <p>Information about insights.</p>
            </div>

            <div class="main-content" id="contact">
                <h1>Contact Us Page</h1>
                <p>Contact information.</p>
            </div>
        `;

        this.setupNavigation();
        this.fetchData();
    }

    setupNavigation() {
        const navItems = this.shadowRoot.querySelectorAll("nav div");
        const pages = this.shadowRoot.querySelectorAll(".main-content");

        navItems.forEach((item) => {
            item.addEventListener("click", () => {
                const pageId = item.getAttribute("data-page");

                // Hide all pages
                pages.forEach((page) => page.classList.remove("active"));

                // Show the selected page
                const activePage = this.shadowRoot.querySelector(`#${pageId}`);
                if (activePage) {
                    activePage.classList.add("active");
                }
            });
        });
    }

    async fetchData() {
        // const apiEndpoint = "https://hda-friendly-reporting.me.sap.corp/api/v1/active_insights/insights";
        const apiEndpoint = "http://0.0.0.0:8000/api/v1/active_insights/insights"
        try {
            const response = await fetch(apiEndpoint);
            const data = await response.json();
            this.insightsData = data;
            this.populateTable();
        } catch (error) {
            console.error("Error fetching insights data:", error);
        }
    }

    populateTable() {
        const tableBody = this.shadowRoot.querySelector("#insightsTable tbody");
        tableBody.innerHTML = "";

        this.insightsData.forEach((insight, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>
                    <button onclick="this.getRootNode().host.toggleFavourite(${index}, this)">
                        <img src="/assets/icons/${insight.favorite ? 'favorite' : 'unfavorite'}.svg" class="icon">
                    </button>
                </td>
                <td>
                    <button class="accordion">${insight.insight}</button>
                    <div class="panel">${insight.content}</div>
                </td>
            `;

            tableBody.appendChild(row);
        });

        this.setupAccordions();
    }

    setupAccordions() {
        const accordions = this.shadowRoot.querySelectorAll(".accordion");
        accordions.forEach((accordion) => {
            accordion.addEventListener("click", function () {
                this.classList.toggle("active");
                let panel = this.nextElementSibling;
                panel.style.maxHeight = panel.style.maxHeight ? null : panel.scrollHeight + "px";
            });
        });
    }

    toggleFavourite(index, button) {
        const icon = button.querySelector("img");
        this.insightsData[index].favorite = !this.insightsData[index].favorite;
        icon.src = `/assets/icons/${this.insightsData[index].favorite ? 'favorite' : 'unfavorite'}.svg`;
    }

    searchTable() {
        const input = this.shadowRoot.querySelector("#searchInput").value.toLowerCase();
        const rows = this.shadowRoot.querySelectorAll("#insightsTable tbody tr");

        rows.forEach((row) => {
            const text = row.innerText.toLowerCase();
            row.style.display = text.includes(input) ? "" : "none";
        });
    }
}
customElements.define("insights-widget", InsightsWidget);