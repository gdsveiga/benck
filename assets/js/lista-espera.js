/**
 * BENCK. - Lista de espera das páginas de produto.
 * Usa o mesmo worker do formulário de contato (worker/) e monta a mensagem
 * com o produto e as respostas, para cada inscrição chegar identificada no email.
 */

(function () {
  'use strict';
  var CONTACT_ENDPOINT = 'https://api.benck.tech/contact';
  var form = document.getElementById('waitlistForm');
  if (!form) return;
  var note = document.getElementById('formNote');
  var submitBtn = form.querySelector('button[type="submit"]');
  var submitLabel = submitBtn.innerHTML;

  function showNote(text, isError) {
    note.textContent = text;
    note.classList.toggle('is-error', !!isError);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      showNote('Preencha nome e e-mail para entrar na lista.', true);
      return;
    }
    var data = Object.fromEntries(new FormData(form));
    var sizeLabel = form.querySelector('select[name="size"]').dataset.label;
    var payload = {
      name: data.name,
      company: data.company,
      email: data.email,
      website: data.website,
      message: '[Lista de espera: ' + form.dataset.product + ']\n' +
        sizeLabel + ': ' + (data.size || '-') + '\n' +
        'Como fazem hoje: ' + (data.today || '-')
    };
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    showNote('');

    fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        if (!res.ok) throw new Error('request_failed');
        form.reset();
        showNote('Pronto, você está na lista. A gente entra em contato para mostrar o produto.');
      })
      .catch(function () {
        showNote('Não foi possível enviar agora. Tente de novo ou escreva para hello@benck.tech.', true);
      })
      .then(function () {
        submitBtn.disabled = false;
        submitBtn.innerHTML = submitLabel;
      });
  });

  /* Reveal */
  var els = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }
})();
