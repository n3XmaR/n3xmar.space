const filters = document.querySelectorAll<HTMLButtonElement>(
    '.filter-btn'
  );

  const cards = document.querySelectorAll<HTMLElement>(
    '.archive-grid .certificate-card'
  );

  filters.forEach((button) => {
    button.addEventListener('click', () => {
      const selected = button.dataset.filter;

      filters.forEach((filter) => {
        filter.setAttribute(
          'aria-pressed',
          String(filter === button)
        );
      });

      cards.forEach((card) => {
        card.hidden =
          selected !== 'all' &&
          card.dataset.type !== selected;
      });
    });
  });
