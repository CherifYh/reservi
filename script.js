// Reservi.tn — interactions de démonstration (aucun paiement réel n'est effectué).
document.addEventListener('DOMContentLoaded', () => {
  const year = document.querySelectorAll('[data-year]');
  year.forEach(el => el.textContent = new Date().getFullYear());

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if (toggle && nav) toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  document.querySelectorAll('[data-faq]').forEach(button => button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    item.classList.toggle('open');
    button.setAttribute('aria-expanded', String(item.classList.contains('open')));
  }));

  const toast = document.querySelector('.toast');
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 3300);
  }

  const searchForm = document.querySelector('[data-search-form]');
  if (searchForm) searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const term = (searchForm.querySelector('[name="q"]')?.value || '').trim().toLowerCase();
    const city = (searchForm.querySelector('[name="city"]')?.value || '').trim().toLowerCase();
    const cards = [...document.querySelectorAll('[data-event-card]')];
    if (!cards.length) {
      const params = new URLSearchParams();
      if (term) params.set('q', term);
      if (city) params.set('city', city);
      window.location.href = 'evenements.html' + (params.toString() ? '?' + params : '');
      return;
    }
    let count = 0;
    cards.forEach(card => {
      const matchesTerm = !term || card.textContent.toLowerCase().includes(term);
      const matchesCity = !city || (card.dataset.city || '').toLowerCase().includes(city);
      const show = matchesTerm && matchesCity;
      card.hidden = !show;
      if (show) count++;
    });
    const empty = document.querySelector('.empty-state');
    if (empty) empty.style.display = count ? 'none' : 'block';
    document.querySelector('#events-results')?.scrollIntoView({behavior:'smooth',block:'start'});
  });

  const filterSearch = document.querySelector('[data-filter-search]');
  const filterCity = document.querySelector('[data-filter-city]');
  function filterCards() {
    const term = (filterSearch?.value || '').toLowerCase().trim();
    const city = (filterCity?.value || '').toLowerCase();
    const cards = [...document.querySelectorAll('[data-event-card]')];
    let count = 0;
    cards.forEach(card => {
      const ok = (!term || card.textContent.toLowerCase().includes(term)) && (!city || (card.dataset.city || '').toLowerCase().includes(city));
      card.hidden = !ok;
      if (ok) count++;
    });
    const empty = document.querySelector('.empty-state');
    if (empty) empty.style.display = count ? 'none' : 'block';
  }
  filterSearch?.addEventListener('input', filterCards);
  filterCity?.addEventListener('change', filterCards);

  // Modal de réservation : prototype de parcours utilisateur, sans collecte ni paiement.
  const modal = document.querySelector('.modal-backdrop');
  const modalTitle = modal?.querySelector('[data-modal-title]');
  const modalPrice = modal?.querySelector('[data-modal-price]');
  let selectedEvent = '';
  let selectedPrice = 0;
  document.querySelectorAll('[data-book-event]').forEach(button => button.addEventListener('click', () => {
    selectedEvent = button.dataset.eventName || 'Événement';
    selectedPrice = Number(button.dataset.eventPrice || 0);
    if (modalTitle) modalTitle.textContent = 'Réserver : ' + selectedEvent;
    if (modalPrice) modalPrice.textContent = selectedPrice.toFixed(0) + ' TND / billet';
    modal?.classList.add('show');
    modal?.setAttribute('aria-hidden','false');
  }));
  modal?.querySelectorAll('[data-modal-close]').forEach(el => el.addEventListener('click', () => {
    modal.classList.remove('show'); modal.setAttribute('aria-hidden','true');
  }));
  modal?.addEventListener('click', e => { if (e.target === modal) { modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); } });
  modal?.querySelector('form')?.addEventListener('submit', e => {
    e.preventDefault();
    const qty = Number(modal.querySelector('[name="quantity"]')?.value || 1);
    const name = modal.querySelector('[name="customer-name"]')?.value.trim();
    const email = modal.querySelector('[name="customer-email"]')?.value.trim();
    if (!name || !email) return;
    modal.classList.remove('show'); modal.setAttribute('aria-hidden','true');
    showToast(`Demande de démonstration enregistrée : ${qty} billet(s), ${selectedPrice * qty} TND. Aucun paiement effectué.`);
    e.target.reset();
  });

  document.querySelectorAll('[data-demo-form]').forEach(form => form.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Merci ! Ce formulaire est une démonstration. Connectez un service pour recevoir les messages.');
    form.reset();
  }));
});
