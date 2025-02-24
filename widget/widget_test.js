(function () {
    class InsightsPage extends HTMLElement {
        constructor() {
            super();
            
            // Create shadow DOM
            this.attachShadow({ mode: 'open' });

            // Define the template
            this.shadowRoot.innerHTML = `
                <style>
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
                        padding: 10px;
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
                        padding-top: 80px;
                    }
                    input {
                        width: 70%;
                        height: 20px;
                        border: 2px solid #4F505E;
                        border-radius: 20px;
                        color: #DCE3E9;
                        margin: 10px;
                        background-color: #363640;
                        padding: 5px;
                    }
                    h1 {
                        color: #E38100;
                    }
                    .icon {
                        width: 20px;
                        height: 20px;
                        cursor: pointer;
                    }
                    table {
                        border-collapse: collapse;
                        margin-top: 10px;
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
                        content: '\\002B';
                        color: #DCE3E9;
                        font-weight: bold;
                        float: right;
                    }
                    .active:after {
                        content: "\\2212";
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

                <nav>
                    <input id="searchInput" type="text" placeholder="Search...">
                    <div data-page="insights"><span>All Insights</span></div>
                    <div data-page="favorites"><span>Favorites</span></div>
                    <div data-page="customization"><span>Customization</span></div>
                    <div data-page="info"><span>Info</span></div>
                    <div data-page="contact"><span>Contact Us</span></div>
                </nav>

                <div class="main-content" id="insights">
                    <header><h1>All Insights</h1></header>
                    <table id="allInsightsTable"><tbody id="allInsightsTableBody"></tbody></table>
                </div>

                <div class="main-content" id="favorites" style="display: none;">
                    <header><h1>Favorites</h1></header>
                    <table><tbody id="favouriteTableBody"></tbody></table>
                </div>

                <div class="main-content" id="customization" style="display: none;">
                    <header><h1>Customization</h1></header>
                    <p>Some customizable filters for insights.</p>
                </div>

                <div class="main-content" id="info" style="display: none;">
                    <header><h1>Info Page</h1></header>
                    <p>Information about insights.</p>
                </div>

                <div class="main-content" id="contact" style="display: none;">
                    <header><h1>Contact Us</h1></header>
                    <p>Contact information.</p>
                </div>
            `;

            // Call functions
            this.setupEventListeners();
            this.populateTable();
        }

        setupEventListeners() {
            this.shadowRoot.querySelectorAll('nav div').forEach(item => {
                item.addEventListener('click', () => {
                    const page = item.dataset.page;
                    this.shadowRoot.querySelectorAll('.main-content').forEach(section => {
                        section.style.display = section.id === page ? '' : 'none';
                    });
                });
            });

            this.shadowRoot.getElementById('searchInput').addEventListener('keyup', () => this.searchTable());
        }

        populateTable() {
            let tableBody = this.shadowRoot.getElementById('allInsightsTableBody');

            fetch('https://hda-friendly-reporting.me.sap.corp/api/v1/active_insights/insights')
            .then(response => response.json())
            .then(data => {
                tableBody.innerHTML = ''; 
                data.forEach((item, index) => {
                    let row = document.createElement('tr');
                    row.innerHTML = `
                        <td>
                            <button onclick="this.toggleFavourite(${index}, this)">
                                <img src="/assets/icons/${item.favorite ? 'favorite' : 'unfavorite'}.svg" class="icon">
                            </button>
                        </td>
                        <td>
                            <button class="accordion">${item["insight"]}</button>
                            <div class="panel">
                                <p>${item["content"]}</p>
                            </div>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });

                this.toggleAccordion();
            })
            .catch(error => console.error('Error:', error));
        }

        toggleAccordion() {
            this.shadowRoot.querySelectorAll(".accordion").forEach(acc => {
                acc.addEventListener("click", function() {
                    this.classList.toggle("active");
                    let panel = this.nextElementSibling;
                    panel.style.maxHeight = panel.style.maxHeight ? null : panel.scrollHeight + "px";
                });
            });
        }
    }

    // Define the custom element
    customElements.define('insights-page', InsightsPage);
    // customElements.define("external-di-widget", Widget);
})();