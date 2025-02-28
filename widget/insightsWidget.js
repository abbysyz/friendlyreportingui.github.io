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
                    height: 98vh;
                    // background-color: black;
                }
                header {
                    width: 100%;
                    height: 80px;
                    // background-color: black;
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
                }
                nav div {
                    cursor: pointer;
                    // margin: 10px 0;
                    padding: 15px;
                    display: flex;
                    align-items: center;
                }
                nav div:hover {
                    background-color: #363640;
                }
                h1 {
                    color: #E38100
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
                button {
                    background-color: transparent;
                    border-style: none;
                }
                .table-container {
                    height: 60vh;
                    overflow-y: auto;
                    display: block;
                }
                table {
                    border-collapse: collapse;
                    position: absolute;
                    top: 100px;
                }
                th, td {
                    text-align: left;
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
                .accordion.active, .accordion:hover {
                    background-color: #212125;
                }
                .accordion:after {
                    content: "+";
                    color: #DCE3E9;
                    font-weight: bold;
                    float: right;
                    margin-left: 5px;
                }
                .accordion.active:after {
                    content: "-";
                }
                .panel {
                    padding: 0 18px;
                    background-color: #33333F;
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.2s ease-out;
                }
                #searchInput {
                    width: 70%;
                    height: 20px;
                    border: 2px solid #4F505E;
                    border-radius: 20px;
                    color: #DCE3E9;
                    margin-left: 15px;
                    background-color: #363640;
                }
            </style>

            <nav class="sidebar">
                <input id="searchInput" type="text" placeholder="Search..." onkeyup="this.getRootNode().host.searchTable()">
                <div data-page="insights">
                    <img src="https://abbysyz.github.io/friendlyreportingui.github.io/assets/icons/lightbulb.svg" class="icon">
                    <span>All Insights</span>
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
                <table id="insightsTable" class="table-container">
                    <tbody></tbody>
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
        // const apiEndpoint = "https://0.0.0.0:8000/api/v1/active_insights/insights";
        try {
            // const response = await fetch(apiEndpoint);
            // const data = await response.json();
            const data = [
                {
                    "insight": "Give me the service with the top highest upwards trend of weekly pipeline failures during the last 2 months",
                    "content": "The service with the top highest upwards trend of weekly pipeline failures during the last two months is the 'CCA Store' with a slope of 2.666667.",
                    "reporting_platform_name": "y",
                    "id": "3cbdde41-c35e-451f-9eed-16b77c660230",
                    "create_datetime": "2025-02-18T06:35:12.613000Z"
                },
                {
                    "insight": "Find the service with the max weekly average pipeline runtime during the last 2 months.",
                    "content": "The service with the maximum weekly average pipeline runtime during the last 2 months is 'DMI Pacemaker' with an average runtime of 71,840,187.71 during week 202451.",
                    "reporting_platform_name": "y",
                    "id": "d1300575-c05c-4485-a474-2b2feef5e59d",
                    "create_datetime": "2025-02-18T06:39:44.956000Z"
                },
                {
                    "insight": "What is the code coverage trend for the service:  HDL Operator during the last 2 month.",
                    "content": "There are no facts provided regarding the code coverage trend for the service: HDL Operator during the last 2 months.",
                    "reporting_platform_name": "y",
                    "id": "46f2f331-7c45-40ad-8618-3f0bc49e29a7",
                    "create_datetime": "2025-02-18T06:48:02.999000Z"
                },
                {
                    "insight": "Give me the service which shows the top highest downwards trend for code coverage during the last 1 month",
                    "content": "There are no facts available regarding the service showing the highest downwards trend for code coverage in the last month.",
                    "reporting_platform_name": "y",
                    "id": "1bd00c3a-996f-4819-8383-447ce8d2c301",
                    "create_datetime": "2025-02-18T06:45:40.541000Z"
                },
                {
                    "insight": "Give me the service with the highest weekly average pipeline failure ratio and the week when these services' pipelines started during the last 2 months.",
                    "content": "There are no facts directly related to identifying the service with the highest weekly average pipeline failure ratio and the start week of these pipelines from the last two months. Data files are mentioned, but no specific analysis or results from these files are provided.",
                    "reporting_platform_name": "y",
                    "id": "2fcee828-a09e-4300-bc30-ba76b556bb5e",
                    "create_datetime": "2025-02-26T09:39:44.202667Z"
                },
                {
                    "insight": "What is the maximum average lead-time for Very High priority jira tickets for the past one month on a monthly basis, also give details related to it.",
                    "content": "There are no facts directly related to the objective regarding the maximum average lead-time for Very High priority Jira tickets for the past month.",
                    "reporting_platform_name": "y",
                    "id": "3f8d0477-e90c-47e8-b242-6a97204ef65c",
                    "create_datetime": "2025-02-27T11:39:19.384923Z"
                },
                {
                    "insight": "Give me the service with the top highest upwards trend of weekly pipeline failures during the last 2 months",
                    "content": "The service with the top highest upwards trend of weekly pipeline failures during the last two months is the 'CCA Store' with a slope of 2.666667.",
                    "reporting_platform_name": "y",
                    "id": "3cbdde41-c35e-451f-9eed-16b77c660230",
                    "create_datetime": "2025-02-18T06:35:12.613000Z"
                },
                {
                    "insight": "Find the service with the max weekly average pipeline runtime during the last 2 months.",
                    "content": "The service with the maximum weekly average pipeline runtime during the last 2 months is 'DMI Pacemaker' with an average runtime of 71,840,187.71 during week 202451.",
                    "reporting_platform_name": "y",
                    "id": "d1300575-c05c-4485-a474-2b2feef5e59d",
                    "create_datetime": "2025-02-18T06:39:44.956000Z"
                },
                {
                    "insight": "What is the code coverage trend for the service:  HDL Operator during the last 2 month.",
                    "content": "There are no facts provided regarding the code coverage trend for the service: HDL Operator during the last 2 months.",
                    "reporting_platform_name": "y",
                    "id": "46f2f331-7c45-40ad-8618-3f0bc49e29a7",
                    "create_datetime": "2025-02-18T06:48:02.999000Z"
                },
                {
                    "insight": "Give me the service which shows the top highest downwards trend for code coverage during the last 1 month",
                    "content": "There are no facts available regarding the service showing the highest downwards trend for code coverage in the last month.",
                    "reporting_platform_name": "y",
                    "id": "1bd00c3a-996f-4819-8383-447ce8d2c301",
                    "create_datetime": "2025-02-18T06:45:40.541000Z"
                },
                {
                    "insight": "Give me the service with the highest weekly average pipeline failure ratio and the week when these services' pipelines started during the last 2 months.",
                    "content": "There are no facts directly related to identifying the service with the highest weekly average pipeline failure ratio and the start week of these pipelines from the last two months. Data files are mentioned, but no specific analysis or results from these files are provided.",
                    "reporting_platform_name": "y",
                    "id": "2fcee828-a09e-4300-bc30-ba76b556bb5e",
                    "create_datetime": "2025-02-26T09:39:44.202667Z"
                },
                {
                    "insight": "What is the maximum average lead-time for Very High priority jira tickets for the past one month on a monthly basis, also give details related to it.",
                    "content": "There are no facts directly related to the objective regarding the maximum average lead-time for Very High priority Jira tickets for the past month.",
                    "reporting_platform_name": "y",
                    "id": "3f8d0477-e90c-47e8-b242-6a97204ef65c",
                    "create_datetime": "2025-02-27T11:39:19.384923Z"
                }
            ]
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
                    <button class="accordion" style="font-size:16px; height: 65px">${insight.insight}</button>
                    <div class="panel">
                            <p style="padding: 10px">${insight["content"]}</p>
                            <div style="text-align:right;">
                                <img src="https://abbysyz.github.io/friendlyreportingui.github.io/assets/icons/thumbup.svg" alt="Icon" class="icon" style="margin: 8px">
                                <img src="https://abbysyz.github.io/friendlyreportingui.github.io/assets/icons/thumbdown.svg" alt="Icon" class="icon" style="margin: 8px">
                                <img src="https://abbysyz.github.io/friendlyreportingui.github.io/assets/icons/notification.svg" alt="Icon" class="icon" style="margin: 8px">
                            </div>
                        </div>
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