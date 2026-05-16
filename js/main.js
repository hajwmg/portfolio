/* ====================================================
   하지원 Portfolio — Main JavaScript v2
   ==================================================== */

'use strict';

/* ──────────────────────────────────────────────────
   1. 읽기 진행 바 (Progress Bar)
────────────────────────────────────────────────── */
const progressBar = document.getElementById('progress-bar');

function updateProgress() {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = progress + '%';
}

/* ──────────────────────────────────────────────────
   2. Navbar — 스크롤 효과 + 활성 링크
────────────────────────────────────────────────── */
const navbar   = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function updateNavbar() {
  // scrolled 클래스
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // 활성 링크 하이라이트
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 80) {
      current = sec.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle(
      'active',
      link.getAttribute('href') === '#' + current
    );
  });
}

/* ──────────────────────────────────────────────────
   3. 모바일 네비게이션 토글
────────────────────────────────────────────────── */
const navToggle      = document.getElementById('navToggle');
const navLinksEl     = document.getElementById('navLinks');

if (navToggle && navLinksEl) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinksEl.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    // 햄버거 → X 애니메이션
    const spans = navToggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  // 링크 클릭 시 메뉴 닫기
  navLinksEl.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinksEl.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    });
  });
}

/* ──────────────────────────────────────────────────
   4. 스무스 스크롤 (앵커 링크)
────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = window.scrollY + target.getBoundingClientRect().top - 58;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

/* ──────────────────────────────────────────────────
   5. Intersection Observer — fade-up 공통 애니메이션
────────────────────────────────────────────────── */
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 그룹 내 여러 자식에 stagger 적용
        const children = entry.target.querySelectorAll(
          '.proj-card, .hl-item, .edu-entry, .tl-block, .info-row, .skill-item, .hero-stat'
        );
        if (children.length > 0) {
          children.forEach((child, i) => {
            setTimeout(() => {
              child.style.opacity   = '1';
              child.style.transform = 'translateY(0)';
            }, i * 70);
          });
        }
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
);

// 초기 숨김 처리 (JS로 동적 적용 → CSS 의존 없이 안전하게)
function initFadeTargets() {
  // 그룹 컨테이너 관찰
  document.querySelectorAll(
    '.projects-grid, .highlights-grid, .about-info, .edu-layout, .hero-right, .skill-list'
  ).forEach(el => {
    // 자식 요소들 초기 숨김
    el.querySelectorAll(
      '.proj-card, .hl-item, .edu-entry, .info-row, .hero-stat, .skill-item'
    ).forEach(child => {
      child.style.opacity   = '0';
      child.style.transform = 'translateY(18px)';
      child.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    });
    fadeObserver.observe(el);
  });
}

/* ──────────────────────────────────────────────────
   6. Intersection Observer — 타임라인 블록
────────────────────────────────────────────────── */
const tlObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        tlObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
);

/* ──────────────────────────────────────────────────
   7. 스킬 바 애니메이션
────────────────────────────────────────────────── */
const skillSection = document.querySelector('#skills');
let skillsAnimated = false;

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !skillsAnimated) {
        skillsAnimated = true;
        document.querySelectorAll('.skill-fill').forEach((fill, i) => {
          setTimeout(() => {
            fill.classList.add('animated');
          }, i * 100);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

if (skillSection) skillObserver.observe(skillSection);

/* ──────────────────────────────────────────────────
   8. fade-up 섹션 헤더 & 개별 요소
────────────────────────────────────────────────── */
const sectionFadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        sectionFadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
);

/* ──────────────────────────────────────────────────
   9. 프로젝트 필터
────────────────────────────────────────────────── */
const filterBtns  = document.querySelectorAll('.filter-btn');
const projCards   = document.querySelectorAll('.proj-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // 활성 버튼 교체
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projCards.forEach(card => {
      const cat = card.dataset.cat || '';
      if (filter === 'all' || cat === filter) {
        card.classList.remove('hidden');
        card.style.opacity   = '0';
        card.style.transform = 'translateY(12px)';
        // 재등장 애니메이션
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            card.style.opacity   = '1';
            card.style.transform = 'translateY(0)';
          });
        });
      } else {
        card.classList.add('hidden');
      }
    });

    // 그리드 빈칸 정리 — 보이는 카드 수에 따라 그리드 재배치
    const grid = document.querySelector('.projects-grid');
    if (grid) {
      const visible = [...projCards].filter(c => !c.classList.contains('hidden'));
      if (visible.length === 1) {
        grid.style.gridTemplateColumns = '1fr';
      } else if (visible.length === 2) {
        grid.style.gridTemplateColumns = 'repeat(2,1fr)';
      } else {
        grid.style.gridTemplateColumns = '';
      }
    }
  });
});

/* ──────────────────────────────────────────────────
   10. 푸터 연도 자동 업데이트
────────────────────────────────────────────────── */
const footerYear = document.getElementById('footer-year');
if (footerYear) footerYear.textContent = new Date().getFullYear();

/* ──────────────────────────────────────────────────
   11. 통합 스크롤 핸들러 (passive)
────────────────────────────────────────────────── */
function onScroll() {
  updateProgress();
  updateNavbar();
}

window.addEventListener('scroll', onScroll, { passive: true });

/* ──────────────────────────────────────────────────
   12. 초기화 (DOMContentLoaded)
────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // 초기 상태 적용
  onScroll();
  initFadeTargets();

  // fade-up 클래스 요소 관찰
  document.querySelectorAll('.fade-up').forEach(el => {
    sectionFadeObserver.observe(el);
  });

  // 타임라인 블록 관찰
  document.querySelectorAll('.tl-block').forEach(el => {
    tlObserver.observe(el);
  });

  // 프로젝트 카드 트랜지션 설정 (필터 애니메이션용)
  projCards.forEach(card => {
    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease, background 0.25s ease';
  });
});
