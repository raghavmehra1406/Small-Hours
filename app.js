const articleList = document.querySelector("#article-list");
const articlesNewestFirst = [...window.articles].sort(
  (first, second) => new Date(second.isoDate) - new Date(first.isoDate)
);

articleList.innerHTML = articlesNewestFirst.map((article, index) => `
  <article class="featured-post">
    <a class="featured-art ${article.cover || ""}" href="./article.html?id=${article.id}" aria-label="Read ${article.title}">
      <span class="art-number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
      <span class="art-orbit" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="art-theme" aria-hidden="true">${article.theme}</span>
      <span class="art-caption">${article.label}</span>
    </a>
    <div class="article-copy">
      <div class="post-meta"><span>${article.category}</span><time datetime="${article.isoDate}">${article.date}</time></div>
      <h2><a href="./article.html?id=${article.id}">${article.title}</a></h2>
      <p>${article.excerpt}</p>
      <a class="text-link" href="./article.html?id=${article.id}">Read the article <span>→</span></a>
    </div>
  </article>
`).join("") + `<p class="soon">More articles will arrive here as they’re ready.</p>`;

document.querySelectorAll('nav a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll('nav a[href^="#"]').forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});
