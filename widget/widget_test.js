(function () {
    let template = document.createElement("template");
    template.innerHTML = `
            <style>
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

                <div class="main-content" id="insights">
                    <header>
                        <h1>All Insights</h1>
                    </header>
                    <table id="allInsightsTable">
                        <tbody id="allInsightsTableBody"></tbody>
                    </table>
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