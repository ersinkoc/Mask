/**
 * @oxog/mask Documentation - Main JavaScript
 */

// Mobile Navigation Toggle
function initMobileNav() {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('nav-open');
    });
  }
}

// Code Copy Functionality
function initCodeCopy() {
  const codeBlocks = document.querySelectorAll('pre code');

  codeBlocks.forEach((block) => {
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-btn';
    copyButton.textContent = 'Copy';

    const wrapper = document.createElement('div');
    wrapper.className = 'code-wrapper';

    block.parentNode.insertBefore(wrapper, block);
    wrapper.appendChild(block);
    wrapper.appendChild(copyButton);

    copyButton.addEventListener('click', async () => {
      const code = block.textContent;
      try {
        await navigator.clipboard.writeText(code);
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
          copyButton.textContent = 'Copy';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
        copyButton.textContent = 'Error';
        setTimeout(() => {
          copyButton.textContent = 'Copy';
        }, 2000);
      }
    });
  });
}

// Search Functionality
function initSearch() {
  const searchInput = document.querySelector('#search');
  const searchResults = document.querySelector('#search-results');

  if (searchInput && searchResults) {
    const content = Array.from(document.querySelectorAll('.main h1, .main h2, .main h3, .main p'));

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();

      if (query.length < 2) {
        searchResults.innerHTML = '';
        return;
      }

      const results = content
        .filter((el) => el.textContent.toLowerCase().includes(query))
        .slice(0, 10)
        .map((el) => ({
          title: el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3'
            ? el.textContent
            : el.previousElementSibling?.textContent || 'Content',
          text: el.textContent.substring(0, 100) + '...',
          id: el.id || el.previousElementSibling?.id,
        }));

      if (results.length > 0) {
        searchResults.innerHTML = results
          .map(
            (result) => `
          <a href="#${result.id}" class="search-result">
            <div class="search-result-title">${result.title}</div>
            <div class="search-result-text">${result.text}</div>
          </a>
        `
          )
          .join('');
      } else {
        searchResults.innerHTML = '<div class="search-result-empty">No results found</div>';
      }
    });
  }
}

// Smooth Scrolling for Anchor Links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    });
  });
}

// Table of Contents Generation
function generateTOC() {
  const tocContainer = document.querySelector('#toc');
  const headings = document.querySelectorAll('.main h2, .main h3');

  if (tocContainer && headings.length > 0) {
    const toc = document.createElement('ul');
    toc.className = 'toc-list';

    headings.forEach((heading) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${heading.id}`;
      a.textContent = heading.textContent;
      li.appendChild(a);
      toc.appendChild(li);
    });

    tocContainer.appendChild(toc);
  }
}

// API Method Highlighting
function highlightActiveSection() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');

  if (sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    {
      rootMargin: '-100px 0px -66%',
    }
  );

  sections.forEach((section) => observer.observe(section));
}

// Version Badge
function updateVersionBadge() {
  const version = document.querySelector('[data-version]');
  if (version) {
    version.textContent = `v${version.getAttribute('data-version')}`;
  }
}

// Example Runner
function initExampleRunner() {
  const runButtons = document.querySelectorAll('.run-example');

  runButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const exampleId = button.getAttribute('data-example');
      const codeBlock = document.querySelector(`#${exampleId} pre code`);
      const output = document.querySelector(`#${exampleId} .output`);

      if (codeBlock && output) {
        // In a real implementation, this would run the code
        // For demo purposes, we'll just show a message
        output.textContent = 'Example executed! (Demo mode)';
        output.classList.add('success');

        setTimeout(() => {
          output.textContent = '';
          output.classList.remove('success');
        }, 3000);
      }
    });
  });
}

// Theme Toggle
function initThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  const body = document.body;

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-theme');
      const isDark = body.classList.contains('dark-theme');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      body.classList.add('dark-theme');
    }
  }
}

// Initialize all features when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initCodeCopy();
  initSearch();
  initSmoothScroll();
  generateTOC();
  highlightActiveSection();
  updateVersionBadge();
  initExampleRunner();
  initThemeToggle();

  // Add loading animation
  document.body.classList.add('loaded');
});

// Add CSS for dynamic elements
const style = document.createElement('style');
style.textContent = `
  .copy-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.25rem 0.75rem;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.75rem;
    transition: opacity 0.2s;
  }

  .copy-btn:hover {
    opacity: 0.8;
  }

  .code-wrapper {
    position: relative;
  }

  .search-result {
    display: block;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    margin-bottom: 0.5rem;
    text-decoration: none;
    color: var(--text-color);
    transition: all 0.2s;
  }

  .search-result:hover {
    background-color: var(--bg-light);
    border-color: var(--primary-color);
  }

  .search-result-title {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .search-result-text {
    font-size: 0.875rem;
    color: var(--text-light);
  }

  .search-result-empty {
    text-align: center;
    padding: 2rem;
    color: var(--text-light);
  }

  .toc-list {
    list-style: none;
    margin-left: 0;
  }

  .toc-list li {
    margin-bottom: 0.5rem;
  }

  .toc-list a {
    color: var(--text-color);
    text-decoration: none;
    transition: color 0.2s;
  }

  .toc-list a:hover,
  .toc-list a.active {
    color: var(--primary-color);
  }

  .nav a.active {
    color: var(--primary-color);
  }

  .output {
    background-color: var(--bg-light);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 1rem;
    margin-top: 1rem;
    font-family: monospace;
    min-height: 2rem;
  }

  .output.success {
    border-color: var(--success-color);
    color: var(--success-color);
  }

  .nav-toggle {
    display: none;
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    .nav-toggle {
      display: block;
    }

    .nav {
      display: none;
    }

    .nav.nav-open {
      display: block;
    }

    .nav-list {
      flex-direction: column;
      padding: 1rem;
    }
  }

  .dark-theme {
    --text-color: #e5e7eb;
    --text-light: #9ca3af;
    --bg-color: #1f2937;
    --bg-light: #111827;
    --border-color: #374151;
    --code-bg: #374151;
  }

  body.loaded {
    opacity: 0;
    animation: fadeIn 0.3s ease-in-out forwards;
  }

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
`;

document.head.appendChild(style);
