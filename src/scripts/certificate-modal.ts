import { applyLinkTargets } from './link-targets';

const modal = document.querySelector<HTMLDialogElement>(
    '#certificate-modal'
  );

  if (modal) {
    const image = modal.querySelector<HTMLImageElement>('#modal-image');
    const title = modal.querySelector<HTMLElement>('#modal-title');
    const issuer = modal.querySelector<HTMLElement>('#modal-issuer');
    const meta = modal.querySelector<HTMLElement>('#modal-meta');
    const body = modal.querySelector<HTMLElement>('#modal-body');

    document.querySelectorAll<HTMLButtonElement>(
      '.certificate-card'
    ).forEach((card) => {
      card.addEventListener('click', () => {
        if (!image || !title || !issuer || !meta || !body) return;

        image.src = card.dataset.image ?? '';
        image.alt = `${card.dataset.title ?? 'Certificate'} certificate`;

        title.textContent = card.dataset.title ?? '';
        issuer.textContent = card.dataset.issuer ?? '';

        const { type, start, end } = card.dataset;

        meta.textContent = [
          type === 'certification' ? 'Certification' : 'Path Completion',
          start && end
            ? `${start} – ${end}`
            : end
              ? `Completed: ${end}`
              : start
                ? `Started: ${start}`
                : ''
        ].filter(Boolean).join(' · ');

        body.replaceChildren();

        const template = document.getElementById(
          `certificate-body-${card.dataset.id}`
        ) as HTMLTemplateElement | null;

        if (template) {
          body.appendChild(template.content.cloneNode(true));
          // Certificate Markdown is mounted after DOMContentLoaded.
          applyLinkTargets(body);
        }

        modal.scrollTop = 0;
        modal.showModal();
      });
    });

    modal.querySelector('.modal-close')?.addEventListener(
      'click',
      () => modal.close()
    );

    modal.addEventListener('click', (event) => {
      const rect = modal.getBoundingClientRect();
      const outside = event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom;
      if (outside) modal.close();
    });
  }
