

document.addEventListener('DOMContentLoaded', () => {
    initPartnerForm();
});

function initPartnerForm() {
    const form = document.getElementById('partnerForm');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const cityInput = document.getElementById('city');
    const ageInput = document.getElementById('age');
    const errorAlert = document.getElementById('partnerError');
    const confirmAlert = document.getElementById('partnerConfirmation');
    const resultBox = document.getElementById('partnerResult');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = nameInput?.value.trim();
        const phone = phoneInput?.value.trim();
        const city = cityInput?.value.trim() || 'Астана';
        const age = ageInput?.value.trim() || 'Не указан';

        if (!name || !phone) {
            if (errorAlert) {
                errorAlert.classList.remove('hidden');
                errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        if (errorAlert) {
            errorAlert.classList.add('hidden');
        }

        const appId = '#FR-2026-' + Math.floor(100 + Math.random() * 900);

        if (resultBox) {
            resultBox.innerHTML = `
                <div class="border-bottom pb-2 mb-2">
                    <span class="badge bg-success mb-1">Заявка ${appId}</span>
                    <h4 class="h6 fw-bold mb-1">Кандидат: ${escapeHtml(name)} (${escapeHtml(phone)})</h4>
                    <p class="small text-muted mb-0">Город для запуска: <strong>${escapeHtml(city)}</strong> · Возраст: <strong>${escapeHtml(age)}</strong></p>
                </div>
                <h5 class="h6 fw-bold mt-3 mb-2">Следующие шаги:</h5>
                <ol class="small mb-2 ps-3">
                    <li>Директор по франчайзингу свяжется с вами по номеру ${escapeHtml(phone)} в течение 24 часов.</li>
                    <li>Мы предоставим презентацию и финансовую модель окупаемости кофейни в г. ${escapeHtml(city)}.</li>
                </ol>
                <div class="small text-success fw-bold">
                    ✓ Статус: Успешно зарегистрировано в базе партнеров Global Coffee
                </div>
            `;
        }

        if (confirmAlert) {
            confirmAlert.classList.remove('hidden');
            confirmAlert.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        form.reset();
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
