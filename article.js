const id = new URLSearchParams(window.location.search).get("id");
const article = window.articles.find((item) => item.id === id) || window.articles[0];
const page = document.querySelector("#article-page");
document.title = `${article.title} — small hours`;

page.innerHTML = `
  <a class="back-link" href="./index.html#writing">← All articles</a>
  <header class="article-header">
    <div class="post-meta"><span>${article.category}</span><time datetime="${article.isoDate}">${article.date}</time></div>
    <h1>${article.title}</h1>
    <p>${article.excerpt}</p>
  </header>
  <article class="article-body">${article.bodyHtml}</article>
`;
