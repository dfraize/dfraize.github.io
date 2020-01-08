'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const core = require('./core-be2a5dd1.js');

const navbarComponent = class {
    constructor(hostRef) {
        core.registerInstance(this, hostRef);
    }
    render() {
        return (core.h("div", { "navbar-wrapper": true }, core.h("ul", { class: "nav" }, core.h("li", { class: "nav-item" }, core.h("a", { class: "nav-link active", href: "#" }, "Home")), core.h("li", { class: "nav-item" }, core.h("a", { class: "nav-link", href: "#" }, "Portfolio")), core.h("li", { class: "nav-item" }, core.h("a", { class: "nav-link", href: "#" }, "About Me")), core.h("li", { class: "nav-item" }, core.h("a", { class: "nav-link", href: "#" }, "Resume")))));
    }
    static get style() { return "[navbar-wrapper]{border:2px solid #000;background-color:#b0c4de}[navbar-wrapper] ul{padding:0;margin:0;list-style:none}[navbar-wrapper] ul li{display:inline;margin-right:20px}[navbar-wrapper] ul li:last-child{margin:0}"; }
};

exports.df_navbar = navbarComponent;
