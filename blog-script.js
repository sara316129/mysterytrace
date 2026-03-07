// MysteryTrace Blog - Universal JavaScript

// Monetag links rotation
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

// ===== MONETAG ON IMAGES (30% chance per click) =====
document.addEventListener('DOMContentLoaded', function() {
  
  // Image clicks with 30% monetag chance
  document.querySelectorAll('.monetag-img').forEach(img => {
    img.addEventListener('click', function(e) {
      if (Math.random() < 0.3) {
        e.preventDefault();
        window.open(getMonetag(), '_blank');
      }
    });
  });

  // ===== MONETAG ON SOURCE LINKS (ALWAYS on first click to each link) =====
  document.querySelectorAll('.source-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const linkUrl = this.href;
      const linkKey = 'source_' + btoa(linkUrl).substring(0, 20);
      
      if (!sessionStorage.getItem(linkKey)) {
        sessionStorage.setItem(linkKey, 'clicked');
        window.open(getMonetag(), '_blank');
        setTimeout(() => {
          window.open(linkUrl, '_blank');
        }, 1000);
      } else {
        window.open(linkUrl, '_blank');
      }
    });
  });

  // ===== RELATED POST CARDS (First click only) =====
  function hasClickedBlog(blogId) {
    return sessionStorage.getItem('blog_' + blogId) === 'clicked';
  }
  
  function markBlogClicked(blogId) {
    sessionStorage.setItem('blog_' + blogId, 'clicked');
  }

  document.querySelectorAll('.related-card[data-post-url]').forEach(card => {
    card.addEventListener('click', function(e) {
      e.preventDefault();
      const postUrl = this.getAttribute('data-post-url');
      const blogId = postUrl.replace('.html', '');
      
      if (!hasClickedBlog(blogId)) {
        markBlogClicked(blogId);
        window.open(getMonetag(), '_blank');
      } else {
        window.location.href = postUrl;
      }
    });
  });

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== LAZY LOAD IMAGES =====
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

  // ===== READING PROGRESS BAR (optional) =====
  const progressBar = document.createElement('div');
  progressBar.style.cssText = 'position:fixed;top:0;left:0;width:0;height:2px;background:#e74c3c;z-index:9999;transition:width 0.1s;';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  });

});
