// Google Analytics 4 Configuration
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-XXXXXXXXXX'); // Replace with your GA4 measurement ID

// Enhanced Event Tracking
document.addEventListener('DOMContentLoaded', function() {
  // Track scroll depth
  let scrollDepths = [25, 50, 75, 100];
  let scrollDepthTriggered = new Set();
  
  window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
    scrollDepths.forEach(depth => {
      if (scrollPercent >= depth && !scrollDepthTriggered.has(depth)) {
        scrollDepthTriggered.add(depth);
        gtag('event', 'scroll_depth', {
          'depth': depth,
          'page_title': document.title
        });
      }
    });
  });

  // Track engagement time
  let startTime = Date.now();
  window.addEventListener('beforeunload', () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    gtag('event', 'engagement_time', {
      'time_seconds': timeSpent
    });
  });

  // Track CTA clicks
  document.querySelectorAll('a[href="#contact"]').forEach(link => {
    link.addEventListener('click', () => {
      gtag('event', 'cta_click', {
        'cta_text': link.innerText,
        'location': 'navigation'
      });
    });
  });

  // Track skill section visibility
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        gtag('event', 'section_view', {
          'section_name': entry.target.id
        });
        observer.unobserve(entry.target);
      }
    });
  });

  document.querySelectorAll('section[id]').forEach(section => {
    observer.observe(section);
  });
});
