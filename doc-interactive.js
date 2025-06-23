class InteractiveDocument {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.init();
  }

  init() {
    this.addInteractiveEffects();
    this.addScrollAnimations();
    this.addTypingEffect();
    this.addProgressiveLoading();
    this.addSmartHighlighting();
    this.addSmartSearch();
  }

  addInteractiveEffects() {
    const subsections = this.container.querySelectorAll('.subsection');
    subsections.forEach((subsection) => {
      subsection.addEventListener('mouseenter', () => {
        this.highlightSection(subsection);
      });
      subsection.addEventListener('mouseleave', () => {
        this.unhighlightSection(subsection);
      });
      subsection.addEventListener('click', () => {
        this.expandSection(subsection);
      });
    });
  }

  highlightSection(section) {
    section.style.background = 'linear-gradient(90deg, #e6fffa 0%, #b2f5ea 100%)';
    section.style.borderLeft = '4px solid #00d4ff';
    section.style.paddingLeft = '16px';
  }

  unhighlightSection(section) {
    section.style.background = '';
    section.style.borderLeft = '';
    section.style.paddingLeft = '12px';
  }

  expandSection(section) {
    const text = section.querySelector('.subsection-text');
    const isExpanded = section.classList.contains('expanded');
    if (isExpanded) {
      section.classList.remove('expanded');
      text.style.maxHeight = 'none';
    } else {
      section.classList.add('expanded');
      text.style.maxHeight = '200px';
      text.style.overflow = 'auto';
    }
  }

  addScrollAnimations() {
    const content = this.container.querySelector('.document-content');
    content.addEventListener('scroll', () => {
      const scrollPercent = (content.scrollTop / (content.scrollHeight - content.clientHeight)) * 100;
      this.updateProgressIndicator(scrollPercent);
    });
  }

  updateProgressIndicator(percent) {
    let indicator = this.container.querySelector('.progress-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'progress-indicator';
      indicator.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        height: 3px;
        background: #00d4ff;
        transition: width 0.3s ease;
        z-index: 10;
      `;
      this.container.querySelector('.document-content').appendChild(indicator);
    }
    indicator.style.width = `${percent}%`;
  }

  addTypingEffect() {
    const sections = this.container.querySelectorAll('.subsection-text');
    sections.forEach((section, index) => {
      setTimeout(() => {
        this.typeText(section);
      }, index * 300);
    });
  }

  typeText(element) {
    const text = element.textContent;
    element.textContent = '';
    element.style.opacity = '1';
    let i = 0;
    const timer = setInterval(() => {
      element.textContent += text.charAt(i);
      i++;
      if (i > text.length) {
        clearInterval(timer);
      }
    }, 20);
  }

  addProgressiveLoading() {
    const sections = this.container.querySelectorAll('.doc-section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationDelay = '0.2s';
          entry.target.style.animationFillMode = 'forwards';
        }
      });
    });
    sections.forEach(section => {
      observer.observe(section);
    });
  }

  addSmartHighlighting() {
    const textElements = this.container.querySelectorAll('.subsection-text');
    textElements.forEach(element => {
      element.addEventListener('mouseup', () => {
        const selection = window.getSelection();
        if (selection.toString().length > 0) {
          this.highlightSelectedText(selection);
        }
      });
    });
  }

  highlightSelectedText(selection) {
    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.className = 'highlighted-text';
    span.style.background = 'linear-gradient(90deg, #fed7d7, #feb2b2)';
    span.style.padding = '2px 4px';
    span.style.borderRadius = '3px';
    try {
      range.surroundContents(span);
    } catch (e) {
      span.appendChild(range.extractContents());
      range.insertNode(span);
    }
    selection.removeAllRanges();
  }

  addSmartSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search document...';
    searchInput.className = 'document-search';
    searchInput.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 8px 12px;
      border: 2px solid #00d4ff;
      border-radius: 20px;
      background: white;
      font-size: 14px;
    `;
    this.container.querySelector('.document-content').appendChild(searchInput);
    searchInput.addEventListener('input', (e) => {
      this.searchAndHighlight(e.target.value);
    });
  }

  searchAndHighlight(query) {
    const content = this.container.querySelector('.document-content');
    content.querySelectorAll('.search-highlight').forEach(el => {
      el.outerHTML = el.innerHTML;
    });
    if (query.length < 2) return;
    const walker = document.createTreeWalker(
      content,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }
    textNodes.forEach(textNode => {
      const text = textNode.textContent;
      const regex = new RegExp(`(${query})`, 'gi');
      if (regex.test(text)) {
        const highlightedHTML = text.replace(regex, '<span class="search-highlight" style="background: #ffeb3b; padding: 2px;">$1</span>');
        const wrapper = document.createElement('div');
        wrapper.innerHTML = highlightedHTML;
        textNode.parentNode.replaceChild(wrapper, textNode);
      }
    });
  }
}

// Initialize the interactive document when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const interactiveDoc = new InteractiveDocument('docContent');
});
