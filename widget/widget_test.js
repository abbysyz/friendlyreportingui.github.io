class InsightsWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.insightsData = [];
        this.render();
    }

    // static get observedAttributes() {
    //     return ["title"="All Insights", "apiEndpoint"="https://hda-friendly-reporting.me.sap.corp/api/v1/active_insights/insights"];
    // }

    // attributeChangedCallback(name, oldValue, newValue) {
    //     if (name === "apiEndpoint" && newValue) {
    //         this.fetchData();
    //     }
    // }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: Arial, sans-serif;
                    color: white;
                    padding: 10px;
                }
                html {
                    height: 100%;
                }
                body {
                    display: flex;
                    font-family: Arial, sans-serif;
                    margin: 0;
                    height: 100vh;
                    flex-direction: column;
                    background-color: black;
                }
                header {
                    width: 100%;
                    height: 80px;
                    background-color: black;
                    color: #9EA0A7;
                    padding: 10px 0;
                    text-align: left;
                    position: fixed;
                    top: 0;
                    left: 200px;
                    z-index: 1000;
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
                    display: flex;
                    align-items: center;
                }
                nav div:hover {
                    background-color: #363640;
                    width: 100%;
                }
                nav div span {
                    margin-left: 10px;
                }
                .main-content {
                    padding: 10px;
                    color: white;
                    flex: 1;
                    margin-left: 200px;
                    padding-top: 60px; /* Adjust this value based on the height of the nav bar */
                }
                input {
                    width: 70%;
                    height: 20px;
                    border: 2px solid #4F505E;
                    border-radius: 20px;
                    color: #DCE3E9;
                }
                h1 {
                    color: #E38100
                }
                .icon {
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                }
                table {
                    border-collapse: collapse;
                    position: absolute;
                    top: 100px;
                }

                .accordion {
                    background-color: #27272F;
                    color: #DCE3E9;
                    cursor: pointer;
                    padding: 18px;
                    width: 100%;
                    border: none;
                    text-align: left;
                    outline: none;
                    font-size: 15px;
                    transition: 0.4s;
                }

                .active, .accordion:hover {
                    background-color: #212125;
                }

                .accordion:after {
                    content: '\002B';
                    color: #DCE3E9;
                    font-weight: bold;
                    float: right;
                    margin-left: 5px;
                }

                .active:after {
                    content: "\2212";
                }

                .panel {
                    padding: 0 18px;
                    background-color: #33333F;
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.2s ease-out;
                }

                button {
                    background-color: transparent;
                    border-style: none;
                }
            </style>

            <div style="overflow: scroll;">
                <nav>
                    <input id="searchInput" type="text" placeholder="Search..." onkeyup="this.getRootNode().host.searchTable()">
                    <div data-page="insights" style="padding: 0 0 0 20px">
                        <img src="https://abbysyz.github.io/friendlyreportingui.github.io/assets/icons/lightbulb.svg" alt="Icon" class="icon">
                        <span>All Insights</span>
                    </div>
                    <div data-page="customization" style="padding: 0 0 0 20px">
                        <img src="https://abbysyz.github.io/friendlyreportingui.github.io/assets/icons/customize.svg" alt="Icon" class="icon">
                        <span>Customization</span>
                    </div>
                    <div data-page="info" style="padding: 0 0 0 20px">
                        <img src="https://abbysyz.github.io/friendlyreportingui.github.ioassets/icons/information.svg" alt="Icon" class="icon">
                        <span>Info</span>
                    </div>
                    <div data-page="contact" style="padding: 0 0 0 20px">
                        <img src="https://abbysyz.github.io/friendlyreportingui.github.io/assets/icons/person.svg" alt="Icon" class="icon">
                        <span>Contact Us</span>
                    </div>
                </nav>
                
            </div>

            <div class="main-content" id="insights">
                <h1>All Insights</h1>
                <table id="insightsTable">
                    <tbody></tbody>
                </table>
            </div>

            <div class="main-content" id="favorites" style="display: none;">
                <header>
                    <h1 style="color:#E38100">Favorites</h1>
                </header>
                <table>
                    <tbody id="favouriteTableBody"></tbody>
                </table>
            </div>

            <div class="main-content" id="customization" style="display: none;">
                <header>
                    <h1 style="color:#E38100">Customization</h1>
                    <p>Some customizable filters for insights.</p>
                </header>
            </div>

            <div class="main-content" id="info" style="display: none;">
                <header>
                    <h1>Info Page</h1>
                    <p>Information about insights.</p>
                </header>
            </div>

            <div class="main-content" id="contact" style="display: none;">
                <header>
                    <h1>Contact Us Page</h1>
                    <p>Contact information.</p>
                </header>
            </div>
        `;

        this.fetchData();
    }

    async fetchData() {
        const apiEndpoint = "https://hda-friendly-reporting.me.sap.corp/api/v1/active_insights/insights"
         try {
            const response = await fetch(apiEndpoint);
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const data = await response.json();
            this.insightsData = data;
            this.populateTable();
        } catch (error) {
            console.error("Error fetching insights data:", error);
            this.showError("Failed to load insights data. Please try again later.");
        }
    }

    populateTable() {
        const tableBody = this.shadowRoot.querySelector("#insightsTable tbody");
        tableBody.innerHTML = "";

        this.insightsData.forEach((insight, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `<tr>
                <td>
                    <button class="accordion" style="font-size:16px; height: 65px">${insight["insight"]}</button>
                    <div class="panel">
                        <p style="padding: 10px">${insight["content"]}</p>
                        <div style="text-align:right;">
                            <img src="/assets/icons/thumbup.svg" alt="Icon" class="icon" style="margin: 8px">
                            <img src="/assets/icons/thumbdown.svg" alt="Icon" class="icon" style="margin: 8px">
                            <img src="/assets/icons/notification.svg" alt="Icon" class="icon" style="margin: 8px">
                        </div>
                    </div>
                </td>
            </tr>`;

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