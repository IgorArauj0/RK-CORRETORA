// ==========================================================================
// RK CORRETORA — interações do site
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- Ano automático no rodapé -------------------------------------------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Menu mobile ----------------------------------------------------------
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // fecha o menu ao clicar em um link
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Revelar elementos ao rolar a página -----------------------------------
  const revealEls = document.querySelectorAll('.reveal');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }

  // ---- Formulário de contato --------------------------------------------------
  // Sem backend próprio: monta um e-mail pré-preenchido com os dados do formulário.
  // Para receber os leads automaticamente sem precisar de servidor, troque este
  // bloco por uma integração como Formspree, Netlify Forms ou Web3Forms —
  // basta apontar o "action" do <form> para o endpoint deles.
  const form = document.getElementById('contact-form');
  const formNote = document.getElementById('form-note');

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const nome = form.nome.value.trim();
      const email = form.email.value.trim();
      const telefone = form.telefone.value.trim();
      const interesse = form.interesse.value;
      const mensagem = form.mensagem.value.trim();

      if (!nome || !email) {
        formNote.textContent = 'Preencha nome e e-mail para continuar.';
        return;
      }

      const assunto = encodeURIComponent(`Contato pelo site — ${interesse}`);
      const corpo = encodeURIComponent(
        `Nome: ${nome}\nE-mail: ${email}\nTelefone: ${telefone || 'não informado'}\nInteresse: ${interesse}\n\nMensagem:\n${mensagem || '(sem mensagem)'}`
      );

      window.location.href = `mailto:contato@rkcorretora.com.br?subject=${assunto}&body=${corpo}`;
      formNote.textContent = 'Abrindo seu app de e-mail para enviar a mensagem…';
      form.reset();
    });
  }

});




// ======================= CARROSSEL ======================= 

class Carousel {
  constructor() {
    this.track = document.querySelector('.carousel-track');
    this.slides = document.querySelectorAll('.carousel-slide');
    this.dots = document.querySelectorAll('.carousel-dot');
    this.prevBtn = document.querySelector('.carousel-btn-prev');
    this.nextBtn = document.querySelector('.carousel-btn-next');
    
    this.currentIndex = 0;
    this.slideCount = this.slides.length;
    this.autoPlayInterval = null;
    
    this.init();
  }

  init() {
    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());
    
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goTo(index));
    });

    // Auto-play (opcional)
    this.startAutoPlay();
    
    // Pausa ao hover
    this.track?.parentElement?.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.track?.parentElement?.addEventListener('mouseleave', () => this.startAutoPlay());
  }

  updateCarousel() {
    const offset = -this.currentIndex * 100;
    this.track.style.transform = `translateX(${offset}%)`;
    
    this.dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
      dot.setAttribute('aria-selected', index === this.currentIndex);
    });
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.slideCount;
    this.updateCarousel();
    this.resetAutoPlay();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.slideCount) % this.slideCount;
    this.updateCarousel();
    this.resetAutoPlay();
  }

  goTo(index) {
    this.currentIndex = index;
    this.updateCarousel();
    this.resetAutoPlay();
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => this.next(), 6000);
  }

  stopAutoPlay() {
    clearInterval(this.autoPlayInterval);
  }

  resetAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }
}

// Inicializa o carrossel quando o DOM está pronto
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.carousel-track')) {
    new Carousel();
  }
});





// ======================= CARROSSEL LOOP SEGURADORAS ======================= 

// Otimização: Pausa animação ao sair da viewport
const observerOptions = {
  threshold: 0
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const track = entry.target.querySelector('.insurers-carousel-track');
    if (entry.isIntersecting) {
      track.style.animationPlayState = 'running';
    } else {
      track.style.animationPlayState = 'paused';
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  const carouselWrapper = document.querySelector('.insurers-carousel-wrapper');
  if (carouselWrapper) {
    observer.observe(carouselWrapper);
  }
});