// MysteryTrace Homepage - JavaScript
// Monetag fires after 30 seconds of real user time on page
// MOBILE FRIENDLY - Uses invisible iframe fallback

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

// ===== FIRE MONETAG - MOBILE FRIENDLY METHOD =====
function fireMonetag() {
  const monetagUrl = getMonetag();
  
  // Try Method 1: Popup window (works on desktop)
  let popup = null;
  try {
    popup = window.open(monetagUrl, '_blank', 'noopener,noreferrer');
  } catch (e) {
    popup = null;
  }
  
  // Method 2: If popup blocked, use invisible iframe (works on mobile!)
  if (!popup || popup.closed || typeof popup.closed === 'undefined') {
    const iframe = document.createElement('iframe');
    
    // Make it invisible but functional
    iframe.style.cssText = 'position:fixed;width:1px;height:1px;top:-100px;left:-100px;border:none;opacity:0;pointer-events:none;z-index:-1;';
    iframe.src = monetagUrl;
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups');
    
    document.body.appendChild(iframe);
    
    // Remove iframe after monetag registers (3 seconds)
    setTimeout(() => {
      if (iframe && iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    }, 3000);
    
    console.log('Monetag loaded via iframe (mobile-friendly)');
  } else {
    console.log('Monetag opened in new tab (desktop)');
  }
}

// ===== 30 SECOND MONETAG TRIGGER =====
// Only fires once per session
// Does NOT fire for bots/crawlers (they don't wait 30 seconds)
(function () {
  const homeKey = 'monetag_home_fired';
  if (sessionStorage.getItem(homeKey)) return; // already fired this session

  let timerDone = false;

  // Start 30 second countdown
  setTimeout(function () {
    timerDone = true;
    // Only fire if user is actively on the tab
    if (!document.hidden) {
      sessionStorage.setItem(homeKey, 'yes');
      fireMonetag();
    }
  }, 30000);

  // If user switched tabs and comes back after 30s, fire on return
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && timerDone && !sessionStorage.getItem(homeKey)) {
      sessionStorage.setItem(homeKey, 'yes');
      fireMonetag();
    }
  });
})();

// ===== BLOG POST CARD CLICKS =====
// Normal navigation — no Monetag redirect on click
document.querySelectorAll('.card[data-post-url]').forEach(card => {
  card.addEventListener('click', function (e) {
    e.preventDefault();
    window.location.href = this.getAttribute('data-post-url');
  });
});

// ===== LOAD MORE BUTTON =====
const loadMoreBtn = document.getElementById('loadMoreBtn');
let hiddenPosts = document.querySelectorAll('.post-card.hidden');

if (loadMoreBtn && hiddenPosts.length > 0) {
  loadMoreBtn.addEventListener('click', function () {
    hiddenPosts.forEach(post => post.classList.remove('hidden'));
    loadMoreBtn.style.display = 'none';
    setTimeout(() => {
      hiddenPosts[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  });
} else if (loadMoreBtn) {
  loadMoreBtn.style.display = 'none';
}

// ===== CATEGORY FILTER =====
const catCards = document.querySelectorAll('.cat-card');
const postCards = document.querySelectorAll('.post-card');

catCards.forEach(cat => {
  cat.addEventListener('click', function (e) {
    e.preventDefault();
    const category = this.getAttribute('data-category');

    catCards.forEach(c => c.classList.remove('active'));
    this.classList.add('active');

    let visibleCount = 0;
    postCards.forEach(post => {
      const postCat = post.getAttribute('data-category');
      if (category === 'all' || postCat === category) {
        post.classList.remove('hidden');
        visibleCount++;
        if (visibleCount > 9) post.classList.add('hidden');
      } else {
        post.classList.add('hidden');
      }
    });

    const hiddenFiltered = document.querySelectorAll('.post-card.hidden');
    if (hiddenFiltered.length > 0) {
      loadMoreBtn.style.display = 'inline-block';
      loadMoreBtn.textContent = `Load More Stories (${hiddenFiltered.length} more)`;
    } else {
      loadMoreBtn.style.display = 'none';
    }

    document.getElementById('latest').scrollIntoView({ behavior: 'smooth' });
  });
});

// ===== FOOTER CATEGORY LINKS =====
document.querySelectorAll('.footer-links a[data-filter]').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const catCard = document.querySelector(`.cat-card[data-category="${this.getAttribute('data-filter')}"]`);
    if (catCard) catCard.click();
  });
});

// ===== PARTICLES ANIMATION =====
const container = document.getElementById('particles');
if (container) {
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.animationDuration = (8 + Math.random() * 15) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    p.style.width = p.style.height = (1 + Math.random() * 3) + 'px';
    if (Math.random() > 0.5) p.style.background = '#c0392b';
    container.appendChild(p);
  }
}

// ===== SCROLL TOP BUTTON =====
window.addEventListener('scroll', () => {
  const btn = document.getElementById('scrollTop');
  if (btn) btn.classList.toggle('visible', window.scrollY > 400);
});
