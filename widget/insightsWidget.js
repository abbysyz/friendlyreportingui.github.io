class InsightsWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.insightsData = [];
        this.pageTitle = '';
    }

    connectedCallback() {
        this.captureTitleFromParent();
        this.render();
        this.setupNavigation();
    }

    captureTitleFromParent() {
        const titleElement = document.querySelector('.sapFpaStoryEntityHeaderHeaderWidgetTextEditorContainer .sapFpaStoryEntityTextTextWidget span');
        if (titleElement) {
            this.pageTitle = titleElement.textContent.trim();
            console.log('Captured Title from Parent:', this.pageTitle);
        } else {
            console.log('Title element not found in parent.');
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.sap.com/css?family=72');
                :host {
                    display: block;
                    font-family: '72', sans-serif;
                    color: white;
                    // height: 90vh;
                    min-height: 90vh;
                    overflow: auto;
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
                    // padding: 10px;
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
                .tooltip {
                    position: relative;
                    display: inline-block;
                    cursor: pointer;
                }
                .tooltip .tooltiptext {
                    visibility: hidden;
                    background-color: #9EA0A7;
                    color: #363640;
                    font-size: 10px;
                    text-align: center;
                    border-radius: 5px;
                    padding: 5px;
                    position: absolute;
                    z-index: 1;
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                .tooltip:hover .tooltiptext {
                    visibility: visible;
                    opacity: 2;
                }
                .table-container {
                    height: 80vh;
                    overflow-y: auto;
                    display: block;
                    // height: calc(98vh - 70px);
                }
                table {
                    border-collapse: collapse;
                    position: absolute;
                    top: 80px;
                }
                tbody {
                    display: block;
                    width: 100%;
                }
                th, td {
                    text-align: left;
                }
                // thead, tbody tr {
                //     display: table;
                //     width: 100%;
                //     table-layout: fixed; /* Ensures column alignment */
                // }
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
                .toast {
                    visibility: hidden;
                    min-width: 250px;
                    background-color: #DCE3E9;
                    color: #27272F;
                    text-align: center;
                    padding: 12px;
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    border-radius: 5px;
                    z-index: 1000;
                    font-size: 14px;
                    opacity: 0;
                    transition: opacity 0.5s, visibility 0.5s;
                }

                .toast.show {
                    visibility: visible;
                    opacity: 1;
                }

                .modal {
                    display: none;
                    position: fixed;
                    z-index: 1000;
                    width: 500px;
                    left: 50%;
                    top: 20%;
                    transform: translate(-50%, -50%);
                    background-color: #DCE3E9;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    color: #363640;
                }
                .modal.active {
                    display: block;
                }
                .modal h3 {
                    margin: 0 0 10px;
                    font-size: 16px;
                    font-weight: bold;
                }
                .modal textarea {
                    width: 100%;
                    height: 100px;
                    margin-bottom: 10px;
                }
                .modal button {
                    width: 100%;
                    margin-right: 10px;
                    cursor: pointer;
                    background-color: #363640;
                    color: #DCE3E9;
                }
                .modal button:hover {
                    opacity: 0.8;
                }
                .button-container {
                    display: flex;
                    flex-direction: row;
                    gap: 10px;
                    justify-content: flex-end;
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
                <div id="toast" class="toast">Feedback sent successfully!</div>
                <table id="insightsTable" class="table-container">
                    <tbody></tbody>
                </table>

                <div id="commentModal" class="modal" style="flex-direction: column;">
                    <h3>Add Comments</h3>
                    <textarea class="comment-input"></textarea>
                    <div class="button-container">
                        <button class="cancel-btn" style="height: 30px; width: 100px; border-radius: 5px;">Cancel</button>
                        <button class="send-btn" style="height: 30px; width: 100px; border-radius: 5px;">Send</button>
                    </div>
                </div>
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
        const apiEndpoint = "https://microdelivery-pipeline-lenny.me.sap.corp/api/v1/active_insights/insights";
        // const apiEndpoint = "https://0.0.0.0:8000/api/v1/active_insights/insights";
        try {
            const response = await fetch(apiEndpoint);
            const data = await response.json();
            this.insightsData = data;
            this.populateTable();
            console.log(encodeURIComponent(this.pageTitle))
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
                            <p style="padding: 10px; font-size:14px;">${insight["content"]}</p>
                            <div style="text-align:right;">
                                <div class="tooltip like-btn" data-insight-id="${insight.id}" data-feedback="like">
                                    <img src="https://abbysyz.github.io/friendlyreportingui.github.io/assets/icons/thumbup.svg" alt="Icon" class="icon" style="margin: 8px">
                                    <span class="tooltiptext">Like</span>
                                </div>
                                <div class="tooltip dislike-btn" data-insight-id="${insight.id}" data-feedback="dislike">
                                    <img src="https://abbysyz.github.io/friendlyreportingui.github.io/assets/icons/thumbdown.svg" alt="Icon" class="icon" style="margin: 8px">
                                    <span class="tooltiptext">Dislike</span>
                                </div>
                                <div class="tooltip comment-btn" data-insight-id="${insight.id}">
                                    <img src="https://abbysyz.github.io/friendlyreportingui.github.io/assets/icons/notification.svg" alt="Icon" class="icon" style="margin: 8px">
                                    <span class="tooltiptext">Add comments</span>
                                </div>
                            </div>
                        </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
        this.setupAccordions();
        this.setupFeedbackButtons()
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

    setupFeedbackButtons() {
        const likeButtons = this.shadowRoot.querySelectorAll(".like-btn");
        const dislikeButtons = this.shadowRoot.querySelectorAll(".dislike-btn");
        const commentButtons = this.shadowRoot.querySelectorAll(".comment-btn");
    
        const modal = this.shadowRoot.querySelector("#commentModal");
        const cancelButton = modal?.querySelector(".cancel-btn");
        const sendButton = modal?.querySelector(".send-btn");
        const commentInput = modal?.querySelector(".comment-input");
    
        let commentInsightId = "";

        const sendFeedback = async (insightId, comment, isLike) => {
            try {
                const response = await fetch("https://microdelivery-pipeline-lenny.me.sap.corp/api/v1/active_insights/feedbacks", {
                    // const response = await fetch("https://0.0.0.0:8000/api/v1/active_insights/feedbacks", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        insight_id: insightId,
                        feedback: comment,
                        is_like: isLike
                    })
                });
                if (!response.ok) {
                    throw new Error("Failed to send feedback");
                }
                console.log(`Feedback sent successfully:`, insightId, comment, isLike);
                this.showToast("Thank you for your feedback!");
            } catch (error) {
                console.error("Error sending feedback:", error);
            }
        };

        likeButtons.forEach((btn) => {
            btn.addEventListener("click", async () => {
                const insightId = btn.getAttribute("data-insight-id");
                sendFeedback(insightId, '', true);
            });
        });
    
        dislikeButtons.forEach((btn) => {
            btn.addEventListener("click", async () => {                
                const insightId = btn.getAttribute("data-insight-id");
                sendFeedback(insightId, '', false);
            });
        });
    
        commentButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                commentInsightId = btn.getAttribute("data-insight-id");
                console.log(commentInsightId)
                commentInput.value = ""; // Clear previous input
                commentInput.classList.remove("error"); // Remove error class if any
                commentInput.placeholder = "Type your feedback here..."; // Reset placeholder
                modal.style.display = "flex"; // Show modal
            });
        });
    
        cancelButton.addEventListener("click", () => {
            modal.style.display = "none";
        });

        sendButton.addEventListener("click", async () => {
            // Check if the feedback text is empty
            if (!commentInsightId || !commentInput.value.trim()) {
                commentInput.classList.add("error");
                commentInput.placeholder = "Please type your feedback...";
                commentInput.focus();
                return;
            }
            commentInput.classList.remove("error");
            sendFeedback(commentInsightId, commentInput.value, null);
            modal.style.display = "none";
        });
    }

    toggleCommentModal(show, insightId = null) {
        const modal = this.shadowRoot.querySelector("#commentModal");
        modal.classList.toggle("active", show);
        if (show) this.currentInsightId = insightId;
    }

    showToast(message) {
        const toast = this.shadowRoot.getElementById("toast");
        toast.textContent = message;
        toast.classList.add("show");
    
        setTimeout(() => {
            toast.classList.remove("show");
        }, 4000);
    }
    
}
customElements.define("insights-widget", InsightsWidget);