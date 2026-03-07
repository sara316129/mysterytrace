// MysteryTrace Blog - Universal JavaScript
// Monetag: Time-based on homepage, Scroll-based on article pages

// ===== MONETAG LINKS ROTATION =====
const monetagLinks = [
  'https://omg10.com/4/10688644',
  'https://omg10.com/4/10688643',
  'https://omg10.com/4/10688642',
  'https://omg10.com/4/10688641'
];

let monetagIndex = 0;

function getMonetag() {
  const link = monetagLinks[monetagIndex];
  monetagIndex = (monetagIndex + 1) % monetagLinks.length;
  return link;
}

function fireMonetag() {
  window.open(getMonetag(), '_blank');
}

// ===== DETECT PAGE TYPE =====
// If page has article-content = blog article page
// If page does not = homepage
const isArticlePage = document.querySelector('.article-content') !== null;
const isHomePage = !isArticlePage;

document.addEventListener('DOMContentLoaded', function () {

  // =========================================================
  // HOME PAGE — Fire Monetag after 30 seconds of being on page
  // Only fires once per session
  // =========================================================
  if (isHomePage) {
    const homeKey = 'monetag_home_fired';

    if (!sessionStorage.getItem(homeKey)) {
      setTimeout(function () {
        // Only fire if user is still on the tab (not switched away)
        if (!document.hidden) {
          sessionStorage.setItem(homeKey, 'yes');
          fireMonetag();
        }
      }, 30000); // 30 seconds

      // If user switched tab and came back after 30s, fire on return
      let timerDone = false;
      setTimeout(function () { timerDone = true; }, 30000);

      document.addEventListener('visibilitychange', function () {
        if (!document.hidden && timerDone && !sessionStorage.getItem(homeKey)) {
          sessionStorage.setItem(homeKey, 'yes');
          fireMonetag();
        }
      });
    }
  }

  // =========================================================
  // ARTICLE PAGE — Fire Monetag when user scrolls 70% of article
  // Only fires once per article per session
  // =========================================================
  if (isArticlePage) {
    const articleKey = 'monetag_article_' + window.location.pathname;
    let monetagFired = sessionStorage.getItem(articleKey) === 'yes';

    window.addEventListener('scroll', function () {
      if (monetagFired) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      if (scrollPercent >= 70) {
        monetagFired = true;
        sessionStorage.setItem(articleKey, 'yes');
        fireMonetag();
      }
    });
  }

  // =========================================================
  // READING PROGRESS BAR (all pages)
  // =========================================================
  const progressBar = document.createElement('div');
  progressBar.style.cssText = 'position:fixed;top:0;left:0;width:0;height:3px;background:linear-gradient(90deg,#c0392b,#e74c3c);z-index:9999;transition:width 0.1s;';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  });

  // =========================================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // =========================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // =========================================================
  // LAZY LOAD IMAGES
  // =========================================================
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // =========================================================
  // RELATED POST CARDS — Normal navigation, no Monetag redirect
  // =========================================================
  document.querySelectorAll('.related-card[data-post-url]').forEach(card => {
    card.addEventListener('click', function (e) {
      e.preventDefault();
      const postUrl = this.getAttribute('data-post-url');
      window.location.href = postUrl;
    });
  });

  // =========================================================
  // SOURCE LINKS — Normal navigation, no Monetag redirect
  // =========================================================
  document.querySelectorAll('.source-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      window.open(this.href, '_blank');
    });
  });

  // =========================================================
  // IMAGE CLICKS — Normal behavior, no Monetag redirect
  // =========================================================
  document.querySelectorAll('.monetag-img').forEach(img => {
    img.addEventListener('click', function (e) {
      e.preventDefault();
      // Do nothing — just prevent default empty href
    });
  });

});
