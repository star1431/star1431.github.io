/**
 * custom : HeaderScrollHandler
 */

class HeaderScrollHandler {
  constructor() {
    this.HeaderElements = document.querySelector('#topbar-wrapper');
    this.lastScrollTop = 0;
    this.initScrollEvents = true;
    // 탑바 존재 여부 이벤트 제어
    if (this.HeaderElements) {
      this.scrollEventBinding = this.onScrollEvent.bind(this);
      window.addEventListener('scroll', this.scrollEventBinding);

      setTimeout(() => {
        this.initScrollEvents = false;
      }, 150);
    }
  }

  // 스크롤시 탑바 event
  onScrollEvent() {
    let currentScroll =
      window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > this.lastScrollTop) {
      // 스크롤 다운
      this.HeaderElements.classList.add('topbar-scroll-down');
    } else {
      // 스크롤 업
      this.HeaderElements.classList.remove('topbar-scroll-down');
    }
    this.lastScrollTop = currentScroll;
  }

  destroy() {
    window.removeEventListener('scroll', this.scrollEventBinding);
  }
}

export function setHeaderScrollHandler() {
  window.addEventListener('DOMContentLoaded', function () {
    new HeaderScrollHandler();
  });
}
