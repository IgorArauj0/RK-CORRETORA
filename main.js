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
