(function () {
    let template = document.createElement("template");
    template.innerHTML = `
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

    class Widget extends HTMLElement {
        constructor() {
            super();
            let shadowRoot = this.attachShadow({ mode: "open" });
                
            shadowRoot.appendChild(template.content.cloneNode(true));
            this._props = {};

            this.addEventListener("click", event => {
                var event = new Event("onClick");
                this.dispatchEvent(event);
            });
            this._props = {};
            
        }
    }
    customElements.define("external-di-widget", Widget);
})();