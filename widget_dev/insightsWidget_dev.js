class InsightsWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        // this.username ='';
        this.insightsData = [];
        this.feedbackCounts = {};
        this.pageTitle = '';
        this.baseURL = "https://abbysyz.github.io/friendlyreportingui.github.io/assets";

        this.isDevelopment = true;
        this.apiEndpoint = this.isDevelopment 
            ? "http://127.0.0.1:8000/api/v1/active_insights"
            : "https://microdelivery-pipeline-lenny.helium.me.sap.corp";
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
                    padding: 10px;
                    text-align: left;
                    position: fixed;
                    top: 0;
                    left: 180;
                    z-index: 1000;
                }
                nav.topnav {
                    width: 100%;
                    background-color: #365F83;
                    color: #9EA0A7;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 20px;
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 30px;
                    z-index: 1000;
                }
                nav.topnav .nav-links {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }
                nav.topnav .nav-links div[data-page] {
                    cursor: pointer;
                    padding: 10px 15px;
                    color: #9EA0A7;
                    font-weight: 500;
                    border-radius: 4px;
                }
                nav.topnav .nav-links div[data-page]:hover {
                    background-color: #294B68;
                }
                nav.topnav .nav-links div[data-page].active span {
                    color: #E38100;
                    font-weight: bold;
                }
                nav.topnav .nav-right {
                    display: flex;
                    align-items: center;
                }
                #searchInput {
                    width: 250px;
                    height: 26px;
                    border: 2px solid #2F5171;
                    border-radius: 20px;
                    color: #DCE3E9;
                    padding: 4px 12px;
                    background-color: #363640;
                    margin-right: 40px;
                }

                /* Adjust main content position for topnav */
                .main-content {
                    margin-left: 0;
                    margin-top: 70px;
                }

                h1 {
                    color: #E38100
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
                .scrollable-content {
                    max-height: calc(100vh - 80px); /* Adjust this value based on your header/footer height */
                    overflow-y: auto;
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
                    border: 2px solid #4074A2;
                    border-radius: 20px;
                    color: #DCE3E9;
                    margin-left: 15px;
                    background-color: #294B68;
                }
                .toast {
                    visibility: hidden;
                    min-width: 250px;
                    background-color: #DCE3E9;
                    color: #27272F;
                    text-align: center;
                    padding: 12px;
                    position: fixed;
                    top: 30%;
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

                .tiles-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 16px;
                    padding: 20px;
                    justify-content: flex-start;
                }

                .tile {
                    background-color: #1D2225;
                    color: #DCE3E9;
                    border-radius: 8px;
                    width: 300px;
                    min-height: 300px;
                    padding: 16px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }

                .tile-header {
                    font-size: 14px;
                    cursor: pointer;
                }

                .tile-panel {
                    display: block;
                    font-size: 14px;
                    flex-grow: 1;
                    color: #A39F9E;
                    
                }

                .tile-actions {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 12px;
                }
                
                .detail-line {
                    margin: 0;
                    color: #DCE3E9;
                    font-size: 13px;
                }
                
                .explanation-wrapper {
                overflow: hidden;
                transition: max-height 0.4s ease;
                margin-top: 14px;
                }

                .explanation-content {
                transition: max-height 0.4s ease;
                }

                .explanation-content.collapsed {
                overflow: hidden;
                }

                .toggle-btn {
                background: none;
                border: none;
                color: #007aff;
                cursor: pointer;
                margin-top: 4px;
                font-size: 14px;
                }

                .toggle-btn {
                    background: none;
                    border: none;
                    color: #81B3E0;
                    font-size: 12px;
                    cursor: pointer;
                    text-align: left;
                    padding: 4px 0 0;
                }

            </style>

            <nav class="topnav">
                <div class="nav-links">
                    <div data-page="insights" class="active">
                        <span>All Insights</span>
                    </div>
                </div>
                <div class="nav-right">
                    <input id="searchInput" type="text" placeholder="Search..." onkeyup="this.getRootNode().host.searchFunction()">
                </div>
            </nav>

            <div class="main-content active" id="insights">
                <div id="toast" class="toast">Feedback sent successfully!</div>
                <div id="insightsTiles" class="tiles-container"></div>

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
        const navItems = this.shadowRoot.querySelectorAll("nav.sidebar div[data-page]");
        const pages = this.shadowRoot.querySelectorAll(".main-content");

        navItems.forEach((item) => {
            item.addEventListener("click", () => {
                const pageId = item.getAttribute("data-page");

                navItems.forEach(nav => nav.classList.remove("active"));
                pages.forEach(page => page.classList.remove("active"));

                item.classList.add("active");

                const activePage = this.shadowRoot.querySelector(`#${pageId}`);
                if (activePage) {
                    activePage.classList.add("active");
                }
            });
        });

        const defaultPage = this.shadowRoot.querySelector("nav.sidebar div[data-page='insights']");
        if (defaultPage) {
            defaultPage.classList.add("active");
        }

    }

    async fetchData() {
        try {
            const response = await fetch(`${this.apiEndpoint}/api/v1/active_insights/tasks`);
            const data = await response.json();
            const trendData = await Promise.all(data.map(async task => {
                const insightTaskId = task.id;
                try {
                    const trendRes = await fetch(`${this.apiEndpoint}/api/v1/active_insights/file?insight_task_id=${insightTaskId}`);
                    const trendJson = await trendRes.json();
                    if (Array.isArray(trendJson) && trendJson.length > 0) {
                        return { ...task, insight_task_id: insightTaskId, trendURL: `${this.apiEndpoint}${trendJson[0]}` };
                    }
                } catch (err) {
                    // ignore error
                }
                return { ...task, insight_task_id: insightTaskId, trendURL: '' };
            }));
    
            this.insightsData = trendData;
          this.fetchFeedbackData();
        } catch (error) {
            console.error("Error fetching insights data:", error);
        }
    }

    async fetchFeedbackData() {
        try {
            const response = await fetch(`${this.apiEndpoint}/api/v1/active_insights/feedbacks`);
            const feedbackData = await response.json();

            if (!Array.isArray(feedbackData) || feedbackData.length === 0) {
                console.warn("No feedback data found or invalid format.");
                this.feedbackCounts = {};
                this.insightsData.forEach((insight) => {
                    this.feedbackCounts[insight.insight_task_id] = { likes: 0, dislikes: 0 };
                })
                this.populateTable();
                return;
            }

            this.feedbackCounts = feedbackData.reduce((acc, feedback) => {
                const { insight_task_id, is_like } = feedback;
                if (!acc[insight_task_id]) {
                    acc[insight_task_id] = { likes: 0, dislikes: 0 };
                }
                if (is_like) {
                    acc[insight_task_id].likes++;
                } else {
                    acc[insight_task_id].dislikes++;
                }
                return acc;
            }, {});

            this.populateTable();
        } catch (error) {
            console.error("Error fetching feedback data:", error);
        }
    }

    populateTable() {
        const tilesContainer = this.shadowRoot.querySelector("#insightsTiles");
        tilesContainer.innerHTML = "";
    
        const getFirstTwoWords = (text) => text.split(/\s+/).slice(0, 2).join(" ").toLowerCase();
        const titleFirstTwoWords = getFirstTwoWords(this.pageTitle);
    
        const filteredInsights = this.insightsData.filter(insight => 
            insight.status === "completed" &&
            getFirstTwoWords(insight.story_name || '') === titleFirstTwoWords
        );
    
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
            const feedback = this.feedbackCounts[insight.insight_task_id] || { likes: 0, dislikes: 0 };
            const containsTrend = answer.toLowerCase().includes("trend") || key_info.toLowerCase().includes("trend");
    
            const tile = document.createElement("div");
            tile.className = "tile";
            tile.setAttribute("data-insight-task-id", insight.insight_task_id);
    
            tile.innerHTML = `
                <div class="tile-header">${answer}</div>
                <div class="tile-panel">
                    <div class="details-section">
                        <p style="margin-bottom: 0;"><span style="color: #E38100;">Details:</span></p>
                        ${key_info.split(';').map(item => `<p class="detail-line">${item.trim()}</p>`).join('')}
                    </div>
                </div>
                <div class="tile-actions">
                ${insight.trendURL.includes(".png") ? `
                    <div class="tooltip trend-btn" data-image-url="${insight.trendURL}">
                        <img src="${this.baseURL}/icons/trend.svg" class="icon" />
                        <span class="tooltiptext">View trend</span>
                    </div>` : '<div></div>'}
                    <div style="display: flex; gap: 12px; align-items: center;">
                    <div class="tooltip like-btn" data-insight-task-id="${insight.insight_task_id}" data-feedback="like">
                        <img src="${this.baseURL}/icons/like_lineal.svg" class="icon">
                        <span class="tooltiptext">Like</span> <span class="like-count">${feedback.likes}</span>
                    </div>
                    <div class="tooltip dislike-btn" data-insight-task-id="${insight.insight_task_id}" data-feedback="dislike">
                        <img src="${this.baseURL}/icons/dislike_lineal.svg" class="icon">
                        <span class="tooltiptext">Dislike</span> <span class="dislike-count">${feedback.dislikes}</span>
                    </div>
                    <div class="tooltip comment-btn" data-insight-task-id="${insight.insight_task_id}">
                        <img src="${this.baseURL}/icons/notification.svg" class="icon">
                        <span class="tooltiptext">Add comments</span>
                    </div>
                    </div>
                </div>
            `;
    
            // Add explanation + toggle
            const explanationWrapper = document.createElement("div");
            explanationWrapper.className = "explanation-wrapper";
    
            const explanationContent = document.createElement("div");
            explanationContent.className = "explanation-content";
            explanationContent.innerHTML = explanation;
    
            const toggleBtn = document.createElement("button");
            toggleBtn.className = "toggle-btn";
            toggleBtn.textContent = "more...";
            toggleBtn.style.display = "none";
    
            explanationWrapper.appendChild(explanationContent);
            tile.querySelector(".tile-panel").appendChild(explanationWrapper);
            tile.querySelector(".tile-panel").appendChild(toggleBtn);
    
            // Wait for DOM layout
            requestAnimationFrame(() => {
                const tileMinHeight = 300;
                const tileHeader = tile.querySelector(".tile-header");
                const detailsSection = tile.querySelector(".details-section");
    
                const headerHeight = tileHeader.offsetHeight;
                const detailsHeight = detailsSection.offsetHeight;
    
                const availableHeight = tileMinHeight - headerHeight - detailsHeight - 32; // estimate padding
                const contentHeight = explanationContent.scrollHeight;
    
                if (contentHeight > availableHeight) {
                    explanationContent.style.maxHeight = `${availableHeight}px`;
                    explanationContent.classList.add("collapsed");
                    toggleBtn.style.display = "block";
    
                    toggleBtn.addEventListener("click", () => {
                        const isCollapsed = explanationContent.classList.toggle("collapsed");
                        explanationContent.style.maxHeight = isCollapsed ? `${availableHeight}px` : `${contentHeight}px`;
                        toggleBtn.textContent = isCollapsed ? "more..." : "hide";
                    });
                }
            });
    
            tile.querySelector(".tile-header").addEventListener("click", () => {
                tile.classList.toggle("active");
            });
    
            tilesContainer.appendChild(tile);
        });
    
        this.setupFeedbackButtons();
        // this.setupImagePopup();
    }

    toggleFavourite(index, button) {
        const icon = button.querySelector("img");
        this.insightsData[index].favorite = !this.insightsData[index].favorite;
        icon.src = `${this.baseURL}/icons/${this.insightsData[index].favorite ? 'favorite' : 'unfavorite'}.svg`;
    }

    searchFunction() {
        const input = this.shadowRoot.querySelector("#searchInput").value.toLowerCase();
        const rows = this.shadowRoot.querySelectorAll(".tile");

        rows.forEach((row) => {
            const text = row.innerText.toLowerCase();
            row.style.display = text.includes(input) ? "block" : "none";
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
            const insightRow = this.shadowRoot.querySelector(`.tile[data-insight-task-id='${insightTaskId}']`);
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
                const response = await fetch(`${this.apiEndpoint}/api/v1/active_insights/feedbacks`, {
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
        let popup = this.shadowRoot.querySelector("#imagePopup");
        if (!popup) {
            popup = document.createElement("div");
            popup.id = "imagePopup";
            popup.style.position = "fixed";
            popup.style.top = "50%";
            popup.style.left = "50%";
            popup.style.transform = "translate(-50%, -50%)";
            popup.style.background = "#fff";
            popup.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
            popup.style.border = "1px solid #ccc";
            popup.style.borderRadius = "10px";
            popup.style.zIndex = "9999";
            popup.style.padding = "16px";
            popup.style.display = "none";
    
            const closeBtn = document.createElement("button");
            closeBtn.textContent = "Close";
            closeBtn.style.marginTop = "8px";
            closeBtn.addEventListener("click", () => {
                popup.style.display = "none";
            });
    
            const img = document.createElement("img");
            img.style.maxWidth = "600px";
            img.style.maxHeight = "400px";
            img.id = "popupImage";
    
            popup.appendChild(img);
            popup.appendChild(closeBtn);
            this.shadowRoot.appendChild(popup);
        }
    
        const trendBtns = this.shadowRoot.querySelectorAll(".trend-btn");
        trendBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const imageUrl = btn.getAttribute("data-image-url");
                const popupImage = this.shadowRoot.querySelector("#popupImage");
                popupImage.src = imageUrl;
                popup.style.display = "block";
            });
        });
    }
    
}
customElements.define("insights-widget", InsightsWidget);