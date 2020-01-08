import { r as registerInstance, h } from './core-5f07362e.js';
var navbarComponent = /** @class */ (function () {
    function navbarComponent(hostRef) {
        registerInstance(this, hostRef);
    }
    navbarComponent.prototype.render = function () {
        return (h("div", { "navbar-wrapper": true }, h("ul", { class: "nav" }, h("li", { class: "nav-item" }, h("a", { class: "nav-link active", href: "#" }, "Home")), h("li", { class: "nav-item" }, h("a", { class: "nav-link", href: "#" }, "Portfolio")), h("li", { class: "nav-item" }, h("a", { class: "nav-link", href: "#" }, "About Me")), h("li", { class: "nav-item" }, h("a", { class: "nav-link", href: "#" }, "Resume")))));
    };
    Object.defineProperty(navbarComponent, "style", {
        get: function () { return "[navbar-wrapper]{border:2px solid #000;background-color:#b0c4de}[navbar-wrapper] ul{padding:0;margin:0;list-style:none}[navbar-wrapper] ul li{display:inline;margin-right:20px}[navbar-wrapper] ul li:last-child{margin:0}"; },
        enumerable: true,
        configurable: true
    });
    return navbarComponent;
}());
export { navbarComponent as df_navbar };
