class InsightsWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.insightsData = [];
        this.render();
    }

    static get observedAttributes() {
        return ["title", "apiEndpoint"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "apiEndpoint" && newValue) {
            this.fetchData();
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: Arial, sans-serif;
                    background-color: black;
                    color: white;
                    padding: 10px;
                }
                .sidebar {
                    width: 180px;
                    background-color: #24242C;
                    padding: 20px;
                    position: fixed;
                    left: 0;
                    top: 0;
                    height: 100%;
                    overflow-y: auto;
                    color: #9EA0A7;
                }
                .sidebar div {
                    margin: 10px 0;
                    cursor: pointer;
                }
                .sidebar div:hover {
                    background-color: #363640;
                }
                .main-content {
                    margin-left: 200px;
                    padding-top: 80px;
                }
                .accordion {
                    background-color: #27272F;
                    color: #DCE3E9;
                    cursor: pointer;
                    padding: 10px;
                    width: 100%;
                    border: none;
                    text-align: left;
                    outline: none;
                    font-size: 16px;
                    transition: 0.4s;
                }
                .accordion:after {
                    content: '\\002B';
                    float: right;
                }
                .active:after {
                    content: "\\2212";
                }
                .panel {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.2s ease-out;
                    background-color: #33333F;
                    padding: 10px;
                }
                .icon {
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
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
                    width: 80%;
                    padding: 5px;
                    border-radius: 5px;
                    border: 1px solid #4F505E;
                    background-color: #363640;
                    color: #DCE3E9;
                }
            </style>

            <div class="sidebar">
                <input id="searchInput" type="text" placeholder="Search..." onkeyup="this.getRootNode().host.searchTable()">
                <div data-page="insights">📜 All Insights</div>
                <div data-page="favorites">⭐ Favorites</div>
            </div>

            <div class="main-content">
                <h1>${this.getAttribute("title")}</h1>
                <table id="insightsTable">
                    <tbody></tbody>
                </table>
            </div>
        `;

        this.fetchData();
    }

    async fetchData() {
        const apiEndpoint = this.getAttribute("apiEndpoint");
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