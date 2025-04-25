class InsightsWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.insightsData = [];
        this.feedbackCounts = {};
        this.pageTitle = '';
    }

    connectedCallback() {
        this.captureTitleFromParent();
        this.render();
        // this.fetchFeedbackData();
        this.setupNavigation();

        this.style.overflow = "auto";
        this.style.height = "100%";
        this.style.display = "block";
        // setTimeout(() => {
        //     let parent = this.parentElement;
        //     while (parent) {
        //         parent.style.overflow = "auto";
        //         parent.style.maxHeight = "100vh"; // Ensure scrolling is possible
        //         parent = parent.parentElement;
        //     }
        // }, 100);
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
                    min-height: 90vh;
                    overflow: auto;
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
                    display: none;
                    overflow-y: auto;
                    max-height: 90vh;
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
                    max-width: 250px;
                    width: auto;
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
                    overflow-y: auto;
                    display: block;
                    max-height: calc(100vh - 50px);;
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
        const apiEndpoint = "https://microdelivery-pipeline-lenny.lithium.me.sap.corp/api/v1/active_insights/insights";
        // const apiEndpoint = "https://0.0.0.0:8000/api/v1/active_insights/insights";
        try {
            const response = await fetch(apiEndpoint);
            const data = await response.json();
            this.insightsData = data;
            this.fetchFeedbackData();
        } catch (error) {
            console.error("Error fetching insights data:", error);
        }
    }

    async fetchFeedbackData() {
        const apiEndpoint = "https://microdelivery-pipeline-lenny.lithium.me.sap.corp/api/v1/active_insights/feedbacks";
        // const apiEndpoint = "https://0.0.0.0:8000/api/v1/active_insights/feedbacks";

        try {
            const response = await fetch(apiEndpoint);
            const feedbackData = await response.json();

            this.feedbackCounts = feedbackData.reduce((acc, feedback) => {
                const { insight_id, is_like } = feedback;
                if (!acc[insight_id]) {
                    acc[insight_id] = { likes: 0, dislikes: 0 };
                }
                if (is_like) {
                    acc[insight_id].likes++;
                } else {
                    acc[insight_id].dislikes++;
                }
                return acc;
            }, {});
            this.populateTable();
        } catch (error) {
            console.error("Error fetching feedback data:", error);
        }
    }

    populateTable() {
        const tableBody = this.shadowRoot.querySelector("#insightsTable tbody");
        tableBody.innerHTML = "";

        const getFirstTwoWords = (text) => {
            return text.split(/\s+/).slice(0, 2).join(" ").toLowerCase();
        };
    
        const titleFirstTwoWords = getFirstTwoWords(this.pageTitle);
        
        const filteredInsights = this.insightsData.filter(insight => 
            getFirstTwoWords(insight.reporting_platform_name) === titleFirstTwoWords || 
            !this.insightsData.some(i => getFirstTwoWords(i.reporting_platform_name) === titleFirstTwoWords)
        );
    
        filteredInsights.forEach((insight) => {
            let parsedContent;
            try {
                parsedContent = JSON.parse(insight.content);
            } catch (e) {
                console.error("Failed to parse content JSON:", insight.content, e);
                return;
            }
    
            const { answer, key_info, explanation } = parsedContent;
            const row = document.createElement("tr");
            const feedback = this.feedbackCounts[insight.id] || { likes: 0, dislikes: 0 };
            const containsTrend = answer.toLowerCase().includes("trend") || key_info.toLowerCase().includes("trend");

            row.innerHTML = `
                <td>
                    <button class="accordion" style="font-size:16px; height: 65px">${answer}</button>
                    <div class="panel">
                        <p style="padding: 10px; font-size:14px;">${explanation}</p>
                        <p style="padding: 10px; font-size:14px;">
                            <span style="color: #E38100; font-weight: bold;">Details: </span>${key_info}
                        </p>
                        ${containsTrend ? 
                            `<div class="tooltip trend-btn">
                                <img src="https://abbysyz.github.io/friendlyreportingui.github.io/assets/icons/trend.svg" alt="Icon" class="icon" style="margin: 8px">
                                <span class="tooltiptext">Coming soon</span>
                            </div>` : ''}
                        <div style="text-align:right;">
                            <div class="tooltip like-btn" data-insight-id="${insight.id}" data-feedback="like">
                                <img src="https://abbysyz.github.io/friendlyreportingui.github.io/assets/icons/thumbup.svg" alt="Icon" class="icon" style="margin: 8px">
                                <span class="tooltiptext">Like</span> <span class="feedback-count" style="font-size: 14px;">${feedback.likes}</span>
                            </div>
                            <div class="tooltip dislike-btn" data-insight-id="${insight.id}" data-feedback="dislike">
                                <img src="https://abbysyz.github.io/friendlyreportingui.github.io/assets/icons/thumbdown.svg" alt="Icon" class="icon" style="margin: 8px">
                                <span class="tooltiptext">Dislike</span> <span class="feedback-count" style="font-size: 14px;">${feedback.dislikes}</span>
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
        this.setupFeedbackButtons();
        this.setupImagePopup();
    }

    setupAccordions() {
        const accordions = this.shadowRoot.querySelectorAll(".accordion");

        accordions.forEach((accordion) => {
            const panel = accordion.nextElementSibling;
            accordion.classList.add("active");
            panel.style.maxHeight = panel.scrollHeight + "px";

            accordion.addEventListener("click", function () {
                if (this.classList.contains("active")) {
                    this.classList.remove("active");
                    panel.style.maxHeight = null; // Collapse
                } else {
                    this.classList.add("active");
                    panel.style.maxHeight = panel.scrollHeight + "px";
                }
            });
        });
    }

    toggleFavourite(index, button) {
        const icon = button.querySelector("img");
        this.insightsData[index].favorite = !this.insightsData[index].favorite;
        icon.src = `https://abbysyz.github.io/friendlyreportingui.github.io/assets/icons/${this.insightsData[index].favorite ? 'favorite' : 'unfavorite'}.svg`;
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
                    const response = await fetch("https://microdelivery-pipeline-lenny.lithium.me.sap.corp/api/v1/active_insights/feedbacks", {
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
                updateFeedbackCounts(insightId); 
            } catch (error) {
                console.error("Error sending feedback:", error);
            }
        };

        const updateFeedbackCounts = async (insightId) => {
            try {
                const response = await fetch(`https://microdelivery-pipeline-lenny.lithium.me.sap.corp/api/v1/active_insights/feedbacks?insight_id=${insightId}`);
                // const response = await fetch(`https://0.0.0.0:8000/api/v1/active_insights/feedbacks?insight_id=${insightId}`);

                const feedbackData = await response.json();
    
                // Count the number of likes and dislikes
                const likeCount = feedbackData.filter(feedback => feedback.is_like).length;
                const dislikeCount = feedbackData.filter(feedback => !feedback.is_like).length;
    
                // Update the UI with the counts
                const insightRow = this.shadowRoot.querySelector(`tr[data-insight-id='${insightId}']`);
                if (!insightRow) {
                    console.error(`Insight row for insightId ${insightId} not found. Check if the correct insightId is assigned.`);
                    return;
                }
                // if (insightRow) {
                //     const likeCountElement = insightRow.querySelector(".like-count");
                //     const dislikeCountElement = insightRow.querySelector(".dislike-count");
    
                //     if (likeCountElement) likeCountElement.textContent = `Likes: ${likeCount}`;
                //     if (dislikeCountElement) dislikeCountElement.textContent = `Dislikes: ${dislikeCount}`;
                // }
                if (insightRow) {
                    const likeCountElement = insightRow.querySelector(".like-count");
                    const dislikeCountElement = insightRow.querySelector(".dislike-count");
    
                    if (likeCountElement) {
                        likeCountElement.textContent = `Likes: ${likeCount}`;
                        console.log("Updated like count element");
                    } else {
                        console.error("Like count element not found");
                    }
    
                    if (dislikeCountElement) {
                        dislikeCountElement.textContent = `Dislikes: ${dislikeCount}`;
                        console.log("Updated dislike count element");
                    } else {
                        console.error("Dislike count element not found");
                    }
                } else {
                    console.error(`Insight row for insightId ${insightId} not found`);
                }
            } catch (error) {
                console.error("Error fetching feedback counts:", error);
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

    setupImagePopup() {
        if (!this.shadowRoot.querySelector("#imagePopup")) {
            const popup = document.createElement("div");
            popup.id = "imagePopup";
            popup.style.position = "fixed";
            popup.style.top = "50%";
            popup.style.left = "50%";
            popup.style.transform = "translate(-40%, -40%)";
            popup.style.background = "white";
            popup.style.boxShadow = "0px 4px 6px rgba(0,0,0,0.1)";
            popup.style.display = "none";
            popup.style.padding = "10px";
            popup.style.borderRadius = "8px";
            popup.innerHTML = `
                <button id="closePopup" style="position: absolute; top: 10px; right: 10px; background: red; color: white; border: none; border-radius: 5px; cursor: pointer;">X</button>
                <img src="https://abbysyz.github.io/friendlyreportingui.github.io/assets/images/trend.png" alt="Popup Image" style="max-width: 100%; height: auto;">
            `;
            this.shadowRoot.appendChild(popup);
    
            this.shadowRoot.querySelector("#closePopup").addEventListener("click", () => {
                popup.style.display = "none";
            });
        }
    
        this.shadowRoot.querySelectorAll(".trend-btn").forEach(button => {
            button.addEventListener("click", () => {
                this.shadowRoot.querySelector("#imagePopup").style.display = "block";
            });
        });
    }    


    
}
customElements.define("insights-widget", InsightsWidget);