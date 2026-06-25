async function renderPortfolio() {
    const root = document.getElementById("portfolio-root");
    if (!root) return;

    try {
        const response = await fetch("./data/portfolio.json");
        if (!response.ok) throw new Error(`Could not load portfolio data: ${response.status}`);

        const data = await response.json();
        const fragment = document.createDocumentFragment();

        (data.tabs || []).forEach((tab) => {
            const section = document.createElement("section");
            section.id = tab.id;
            section.className = "tab-content";
            section.setAttribute("aria-label", tab.label || tab.id);

            (tab.projects || []).forEach((project) => {
                const article = document.createElement("article");
                article.className = "project";

                const title = document.createElement("h2");
                title.textContent = project.title;
                article.appendChild(title);

                if (project.buttons?.length) {
                    const links = document.createElement("div");
                    links.className = "project-links";
                    project.buttons.forEach((button) => {
                        const link = document.createElement("a");
                        link.className = button.className || "button";
                        link.href = button.href;
                        link.target = "_blank";
                        link.rel = "noopener noreferrer";
                        link.textContent = button.label;
                        links.appendChild(link);
                    });
                    article.appendChild(links);
                }

                (project.paragraphs || []).forEach((content) => {
                    const paragraph = document.createElement("p");

                    if (typeof content === "string") {
                        const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(content);
                        if (looksLikeHtml) {
                            paragraph.innerHTML = content;
                        } else {
                            paragraph.textContent = content;
                        }
                    } else if (content && typeof content === "object") {
                        if (typeof content.html === "string") {
                            paragraph.innerHTML = content.html;
                        } else if (typeof content.text === "string") {
                            paragraph.textContent = content.text;
                        } else {
                            paragraph.textContent = "";
                        }
                    } else {
                        paragraph.textContent = "";
                    }

                    article.appendChild(paragraph);
                });

                if (project.media?.length) {
                    const content = document.createElement("content");
                    if (project.scrollable) {
                        content.setAttribute("scrollable", "");
                    }

                    project.media.forEach((item) => {
                        const element = document.createElement(item.type === "pic" ? "pic" : "vid");
                        element.setAttribute("src", item.src);
                        element.textContent = item.caption || "";
                        content.appendChild(element);
                    });

                    article.appendChild(content);
                }

                section.appendChild(article);
            });

            fragment.appendChild(section);
        });

        root.innerHTML = "";
        root.appendChild(fragment);
        if (typeof window.reWriteHTMLPage === "function") {
            window.reWriteHTMLPage();
        }
        if (typeof window.openTab === "function") {
            window.openTab(null, "work");
        }
    } catch (error) {
        console.error(error);
        root.innerHTML = '<p class="error-message">Portfolio content could not be loaded.</p>';
    }
}

window.renderPortfolio = renderPortfolio;
document.addEventListener("DOMContentLoaded", renderPortfolio);
