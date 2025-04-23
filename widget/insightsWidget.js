class InsightsWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        // this.username ='';
        this.insightsData = [];
        this.feedbackCounts = {};
        this.pageTitle = '';
        this.baseURL = "https://abbysyz.github.io/friendlyreportingui.github.io/assets";

        this.isDevelopment = false;
        this.apiEndpoint = this.isDevelopment 
            ? "https://0.0.0.0:8000/api/v1/active_insights"
            : "https://microdelivery-pipeline-lenny.helium.me.sap.corp/api/v1/active_insights";
    }

    connectedCallback() {
        this.captureTitleFromParent();
        // this.requestUsernameFromSAC();
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

    // requestUsernameFromSAC() {
    //     // Fire a custom event to ask SAC (if supported) for user info
    //     this.dispatchEvent(
    //         new CustomEvent("onUserInfoRequest", {
    //             detail: {
    //                 callback: (userInfo) => {
    //                     console.log('Received userInfo:', userInfo);
    //                     if (userInfo && userInfo.fullName) {
    //                         this.username = userInfo.fullName;
    //                     } else if (userInfo && userInfo.id) {
    //                         this.username = userInfo.id;
    //                     } else {
    //                         this.username = 'Unknown User';
    //                     }

    //                     console.log('Captured Username:', this.username);
    //                     // Now you can render or use the username as needed
    //                 }
    //             },
    //             bubbles: true,
    //             composed: true
    //         })
    //     );
    // }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.sap.com/css?family=72');
                :host {
                    display: block;
                    font-family: '72', sans-serif;
                    color: white;
                    min-height: 90vh;
                    // overflow: auto;
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
                }
                .main-content.active {
                    display: block; /* Show active page */
                }
                .icon {
                    width: 20px;
                    height: 20px;
                    margin-right: 10px; 
                    vertical-align: middle;
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
                    max-height: 70vh;
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
                .scrollable-content {
                    max-height: calc(100vh - 80px); /* Adjust this value based on your header/footer height */
                    overflow-y: auto;
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
                    display: block;
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
                    top: 50%;
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
                    <img src="${this.baseURL}/icons/lightbulb.svg" class="icon">
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
        try {
            const response = await fetch(`${this.apiEndpoint}/tasks`);
            const data = await response.json();
            this.insightsData = data.map(task => ({
                ...task,
                insight_task_id: task.id
            }));
          this.fetchFeedbackData();
        } catch (error) {
            console.error("Error fetching insights data:", error);
        }
    }

    async fetchFeedbackData() {
        try {
            const response = await fetch(`${this.apiEndpoint}/feedbacks`);
            const feedbackData = await response.json();

            if (!Array.isArray(feedbackData) || feedbackData.length === 0) {
                console.warn("No feedback data found or invalid format.");
                this.feedbackCounts = {};
                this.insights.forEach((insight) => {
                    this.feedbackCounts[insight.insight_task_id] = { likes: 0, dislikes: 0 };
                })
                console.log(this.feedbackCounts)
                this.populateTable();
                return;
            }

            this.feedbackCounts = feedbackData.reduce((acc, feedback) => {
                const { id, is_like } = feedback;
                if (!acc[id]) {
                    acc[id] = { likes: 0, dislikes: 0 };
                }
                if (is_like) {
                    acc[id].likes++;
                } else {
                    acc[id].dislikes++;
                }
                return acc;
            }, {});

            // // Ensure all insights are included even if missing feedback
            // this.insights.forEach((insight) => {
            //     if (!this.feedbackCounts[insight.insight_task_id]) {
            //         this.feedbackCounts[insight.insight_task_id] = { likes: 0, dislikes: 0 };
            //     }
            // });
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
            insight.status === "completed" &&
            getFirstTwoWords(insight.story_name || '') === titleFirstTwoWords
        );

        // If nothing matches, fall back to all "completed"
        const insightsToRender = filteredInsights.length > 0
        ? filteredInsights
        : this.insightsData.filter(insight => insight.status === "completed");
    
        insightsToRender.forEach((insight) => {
            let parsedResult;
            try {
                parsedResult = JSON.parse(insight.result);
            } catch (e) {
                console.error("Failed to parse result JSON:", insight.result, e);
                return;
            }
    
            const { answer, key_info, explanation } = parsedResult;
            const row = document.createElement("tr");
            row.setAttribute("data-insight-task-id", insight.insight_task_id);
            const feedback = this.feedbackCounts[insight.insight_task_id] || { likes: 0, dislikes: 0 };
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
                                <img src="${this.baseURL}/icons/trend.svg" alt="Icon" class="icon" style="margin: 8px">
                                <span class="tooltiptext">Coming soon</span>
                            </div>` : ''}
                        <div style="text-align:right;">
                            <div class="tooltip like-btn" data-insight-task-id="${insight.insight_task_id}" data-feedback="like">
                                <img src="${this.baseURL}/icons/like_lineal.svg" alt="Icon" class="icon" style="margin: 8px; ">
                                <span class="tooltiptext">Like</span> <span class="like-count" style="font-size: 14px;">${feedback.likes}</span>
                            </div>
                            <div class="tooltip dislike-btn" data-insight-task-id="${insight.insight_task_id}" data-feedback="dislike">
                                <img src="${this.baseURL}/icons/dislike_lineal.svg" alt="Icon" class="icon" style="margin: 8px">
                                <span class="tooltiptext">Dislike</span> <span class="dislike-count" style="font-size: 14px;">${feedback.dislikes}</span>
                            </div>
                            <div class="tooltip comment-btn" data-insight-task-id="${insight.insight_task_id}">
                                <img src="${this.baseURL}/icons/notification.svg" alt="Icon" class="icon" style="margin: 8px">
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
        // this.setupImagePopup();
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
        icon.src = `${this.baseURL}/icons/${this.insightsData[index].favorite ? 'favorite' : 'unfavorite'}.svg`;
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
    
        let commentInsightTaskId = "";

        const sendFeedback = async (insightTaskId, comment, isLike) => {
            const insightRow = this.shadowRoot.querySelector(`tr[data-insight-task-id='${insightTaskId}']`);
            // Select the like/dislike button and count elements
            const iconSelector = isLike ? '.like-btn img' : '.dislike-btn img';
            const countSelector = isLike ? '.like-count' : '.dislike-count';
            const oppositeIconSelector = isLike ? '.dislike-btn img' : '.like-btn img';

            const icon = insightRow.querySelector(iconSelector);
            const countSpan = insightRow.querySelector(countSelector);
            const oppositeIcon = insightRow.querySelector(oppositeIconSelector);

            // Check if already liked/disliked
            if (icon.src.includes(`${isLike ? 'like_filled' : 'dislike_filled'}`)) {
                this.showToast(`You already ${isLike ? 'liked' : 'disliked'}!`, "error");
                return;
            }

            // Update UI with filled icons and counts
            if (icon && countSpan) {
                icon.src = `${this.baseURL}/icons/${isLike ? 'like_filled' : 'dislike_filled'}.svg`;

                if (oppositeIcon) {
                    oppositeIcon.src = `${this.baseURL}/icons/${isLike ? 'dislike_lineal' : 'like_lineal'}.svg`;
                }

                const currentCount = parseInt(countSpan.textContent, 10) || 0;
                countSpan.textContent = currentCount + 1;
            } 

            try {
                const response = await fetch(`${this.apiEndpoint}/feedbacks`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "insight_task_id": insightTaskId,
                        "comment": comment,
                        "is_like": isLike,
                        "user_id":""
                    })
                });
                if (!response.ok) {
                    throw new Error("Failed to send feedback");
                }
                console.log(`Feedback sent successfully:`, insightTaskId, comment, isLike);
                this.showToast("Thank you for your feedback!", "info");
            } catch (error) {
                console.error("Error sending feedback:", error);
                console.log(`Error sent successfully:`, insightTaskId, comment, isLike);

            }
        };

        likeButtons.forEach((btn) => {
            btn.addEventListener("click", async () => {
                const insightTaskId = btn.getAttribute("data-insight-task-id");
                sendFeedback(insightTaskId, '', true, "");
            });
        });
    
        dislikeButtons.forEach((btn) => {
            btn.addEventListener("click", async () => {                
                const insightTaskId = btn.getAttribute("data-insight-task-id");
                sendFeedback(insightTaskId, '', false, "");
            });
        });
    
        commentButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                commentInsightTaskId = btn.getAttribute("data-insight-task-id");
                console.log(commentInsightTaskId)
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
            if (!commentInsightTaskId || !commentInput.value.trim()) {
                commentInput.classList.add("error");
                commentInput.placeholder = "Please type your feedback...";
                commentInput.focus();
                return;
            }
            commentInput.classList.remove("error");
            sendFeedback(commentInsightTaskId, commentInput.value, null, "");
            modal.style.display = "none";
        });
    }

    toggleCommentModal(show, insightTaskId = null) {
        const modal = this.shadowRoot.querySelector("#commentModal");
        modal.classList.toggle("active", show);
        if (show) this.currentInsightTaskId = insightTaskId;
    }

    showToast(message, type = "info") {
        const toast = this.shadowRoot.getElementById("toast");
        toast.textContent = message;
        toast.style.color = type === "error" ? "#f44336" : "#27272F"; //red or default dark
        toast.classList.add("show");
    
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
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
            // popup.innerHTML = `
            //     <button id="closePopup" style="position: absolute; top: 10px; right: 10px; background: red; color: white; border: none; border-radius: 5px; cursor: pointer;">X</button>
            //     <img src="${this.baseURL}/images/trend.png" alt="Popup Image" style="max-width: 100%; height: auto;">
            // `;
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