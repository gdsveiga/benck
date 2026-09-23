/**
 * BENCK. - Configuração compartilhada por todas as páginas
 * (index, privacidade e termos): analytics, WhatsApp e ano do rodapé.
 */

(function() {
  'use strict';

  const CONFIG = {
    // Número do WhatsApp Business só com dígitos: 55 + DDD + número.
    // Ex.: '5511912345678'. Enquanto estiver vazio, os links de WhatsApp ficam escondidos.
    whatsappNumber: '',
    whatsappMessage: 'Olá! Vim pelo site da Benck e quero conversar sobre um projeto.',

    // Token do Cloudflare Web Analytics (dash.cloudflare.com > Analytics & Logs > Web Analytics).
    // Não é segredo: ele aparece no HTML de qualquer site que usa o Cloudflare.
    // Enquanto estiver vazio, nenhum script de analytics é carregado.
    cloudflareAnalyticsToken: '',
  };

  // Analytics: sem cookies, então não precisa de banner de consentimento.
  if (CONFIG.cloudflareAnalyticsToken) {
    const beacon = document.createElement('script');
    beacon.defer = true;
    beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    beacon.setAttribute('data-cf-beacon', JSON.stringify({ token: CONFIG.cloudflareAnalyticsToken }));
    document.head.appendChild(beacon);
  }

  // WhatsApp: todo elemento com [data-whatsapp] vira link para a conversa.
  if (CONFIG.whatsappNumber) {
    const href = 'https://wa.me/' + CONFIG.whatsappNumber +
      '?text=' + encodeURIComponent(CONFIG.whatsappMessage);

    document.querySelectorAll('[data-whatsapp]').forEach(link => {
      link.href = href;
      link.target = '_blank';
      link.rel = 'noopener';
      link.hidden = false;
    });
  }

  // Ano do rodapé
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

})();
