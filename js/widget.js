customElements.define('com-sap-customwidget-insights', class InsightsWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
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
            <div id="widget-container">
                <nav>
                    <input id="searchInput" onkeyup="searchTable()" style="margin: 0 0 0 20px; background-color: #363640" type="text" placeholder="Search...">
                    <div data-page="insights" style="padding: 0 0 0 20px">
                        <img src="/assets/icons/lightbulb.svg" alt="Icon" class="icon">
                        <span>All Insights</span>
                    </div>
                    <div data-page="favorites" style="padding: 0 0 0 20px">
                        <img src="/assets/icons/unfavorite_gray.svg" alt="Icon" class="icon">
                        <span>Favorites</span>
                    </div>
                    <div data-page="customization" style="padding: 0 0 0 20px">
                        <img src="/assets/icons/customize.svg" alt="Icon" class="icon">
                        <span>Customization</span>
                    </div>
                    <div data-page="info" style="padding: 0 0 0 20px">
                        <img src="/assets/icons/information.svg" alt="Icon" class="icon">
                        <span>Info</span>
                    </div>
                    <div data-page="contact" style="padding: 0 0 0 20px">
                        <img src="/assets/icons/person.svg" alt="Icon" class="icon">
                        <span>Contact Us</span>
                    </div>
                </nav>

                <div class="main-content" id="insights">
                    <header>
                        <h1>All Insights</h1>
                    </header>
                    <table id="allInsightsTable">
                        <tbody id="allInsightsTableBody"></tbody>
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
                    </header>
                    <p>Some customizable filters for insights.</p>
                </div>

                <div class="main-content" id="info" style="display: none;">
                    <header>
                        <h1>Info Page</h1>
                    </header>
                    <p>Information about insights.</p>
                </div>

                <div class="main-content" id="contact" style="display: none;">
                    <header>
                        <h1>Contact Us Page</h1>
                    </header>
                    <p>Contact information.</p>
                </div>
            </div>
        `;

        this.shadowRoot.querySelectorAll('nav div').forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                this.shadowRoot.querySelectorAll('.main-content').forEach(section => {
                    section.style.display = section.id === page ? '' : 'none';
                });
            });
        });

        this.populateTable();
        this.toggleAccordion();
    }

    toggleAccordion() {
        const acc = this.shadowRoot.getElementsByClassName("accordion");
        for (let i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function() {
                this.classList.toggle("active");
                const panel = this.nextElementSibling;
                if (panel.style.maxHeight) {
                    panel.style.maxHeight = null;
                } else {
                    panel.style.maxHeight = panel.scrollHeight + "px";
                }
            });
        }
    }

    populateTable() {
        const tableBody = this.shadowRoot.getElementById('allInsightsTableBody');
        const favouriteTableBody = this.shadowRoot.getElementById('favouriteTableBody');
        tableBody.innerHTML = ''; // Clear existing rows
        favouriteTableBody.innerHTML = ''; // Clear existing rows
        fetch('https://hda-friendly-reporting.me.sap.corp/api/v1/active_insights/insights')
            .then(response => response.json())
            .then(data => {
                let table_html = "";
                let favourite_html = "";
                data.forEach((data, index) => {
                    table_html += `<tr>
                        <td>
                            <button onclick="toggleFavourite(${index}, this)" style="display: none"><img src="/assets/icons/${data.favorite ? 'favorite' : 'unfavorite'}.svg" alt="Icon" class="icon"></button>
                        </td>
                        <td>
                            <button class="accordion">${data["insight"]}</button>
                            <div class="panel">
                                <p>${data["content"]}</p>
                                <div style="text-align:right;">
                                    <img src="/assets/icons/thumbup.svg" alt="Icon" class="icon" style="margin: 8px">
                                    <img src="/assets/icons/thumbdown.svg" alt="Icon" class="icon" style="margin: 8px">
                                    <img src="/assets/icons/notification.svg" alt="Icon" class="icon" style="margin: 8px">
                                </div>
                            </div>
                        </td>
                    </tr>`;
                    if (data.favorite) {
                        favourite_html += `<tr>
                            <td>
                                <button onclick="toggleFavourite(${index}, this)" disabled><img src="/assets/icons/favorite.svg" alt="Icon" class="icon"></button>
                            </td>
                            <td>
                                <button class="accordion">${data["insight"]}</button>
                                <div class="panel">
                                    <p>${data["content"]}</p>
                                    <div style="text-align:right;">
                                        <img src="/assets/icons/thumbup.svg" alt="Icon" class="icon" style="margin: 8px">
                                        <img src="/assets/icons/thumbdown.svg" alt="Icon" class="icon" style="margin: 8px">
                                        <img src="/assets/icons/notification.svg" alt="Icon" class="icon" style="margin: 8px">
                                    </div>
                                </div>
                        </tr>`;
                    }
                });
                tableBody.innerHTML += table_html;
                favouriteTableBody.innerHTML += favourite_html;
                this.toggleAccordion();
            })
            .catch(error => console.error('Error:', error));
    }

    searchTable() {
        const input = this.shadowRoot.getElementById('searchInput').value.toLowerCase();
        const table = this.shadowRoot.getElementById('allInsightsTable');
        const rows = table.getElementsByTagName('tr');

        for (let i = 1; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('td');
            let match = false;

            for (let j = 0; j < cells.length; j++) {
                if (cells[j].innerText.toLowerCase().includes(input)) {
                    match = true;
                    break;
                }
            }

            rows[i].style.display = match ? '' : 'none';
        }
    }
});