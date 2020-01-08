import { h } from "@stencil/core";
//import { format } from '../../utils/utils';
export class navbarComponent {
    render() {
        return (h("div", { "navbar-wrapper": true },
            h("ul", { class: "nav" },
                h("li", { class: "nav-item" },
                    h("a", { class: "nav-link active", href: "#" }, "Home")),
                h("li", { class: "nav-item" },
                    h("a", { class: "nav-link", href: "#" }, "Portfolio")),
                h("li", { class: "nav-item" },
                    h("a", { class: "nav-link", href: "#" }, "About Me")),
                h("li", { class: "nav-item" },
                    h("a", { class: "nav-link", href: "#" }, "Resume")))));
    }
    static get is() { return "df-navbar"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["navbar.scss"]
    }; }
    static get styleUrls() { return {
        "$": ["navbar.css"]
    }; }
}
