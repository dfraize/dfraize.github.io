import { r as registerInstance, h } from './core-5f07362e.js';

const navbarComponent = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h("div", { "navbar-wrapper": true }, h("ul", { class: "nav" }, h("li", { class: "nav-item" }, h("a", { class: "nav-link active", href: "#" }, "Home")), h("li", { class: "nav-item" }, h("a", { class: "nav-link", href: "#" }, "Portfolio")), h("li", { class: "nav-item" }, h("a", { class: "nav-link", href: "#" }, "About Me")), h("li", { class: "nav-item" }, h("a", { class: "nav-link", href: "#" }, "Resume")))));
    }
    static get style() { return "[navbar-wrapper]{border:2px solid #000;background-color:#b0c4de}[navbar-wrapper] ul{padding:0;margin:0;list-style:none}[navbar-wrapper] ul li{display:inline;margin-right:20px}[navbar-wrapper] ul li:last-child{margin:0}"; }
};

export { navbarComponent as df_navbar };
