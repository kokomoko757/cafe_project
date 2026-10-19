

document.addEventListener('DOMContentLoaded', () => {
    initBranchSearch();
});

function initBranchSearch() {
    const searchInput = document.getElementById('branchSearchInput');
    const searchBtn = document.getElementById('branchSearchBtn');
    const resultsContainer = document.getElementById('branchSearchResults');

    if (!searchInput) return;

    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        let matchesCount = 0;

        const flagshipCards = document.querySelectorAll('.page-content section:nth-of-type(1) .row > .col-12');
        flagshipCards.forEach(col => {
            const text = col.textContent.toLowerCase();
            if (query === '' || text.includes(query)) {
                col.classList.remove('hidden');
                matchesCount++;
            } else {
                col.classList.add('hidden');
            }
        });

        const tableRows = document.querySelectorAll('#branches table tbody tr');
        let tableMatches = 0;

        tableRows.forEach(row => {

            if (row.classList.contains('table-secondary')) {
                return;
            }

            const rowText = row.textContent.toLowerCase();
            if (query === '' || rowText.includes(query)) {
                row.classList.remove('hidden');
                tableMatches++;
            } else {
                row.classList.add('hidden');
            }
        });

        const headerRows = document.querySelectorAll('#branches table tbody tr.table-secondary');
        headerRows.forEach(hr => {
            if (query === '') {
                hr.classList.remove('hidden');
            } else {
                hr.classList.add('hidden');
            }
        });

        if (resultsContainer) {
            if (query !== '') {
                const totalFound = matchesCount + tableMatches;
                if (totalFound > 0) {
                    resultsContainer.innerHTML = `<span class="badge bg-success">Найдено: ${totalFound}</span> локаций по запросу «${escapeHtml(query)}»`;
                } else {
                    resultsContainer.innerHTML = `<span class="badge bg-warning text-dark">Ничего не найдено</span> по запросу «${escapeHtml(query)}». Попробуйте ввести другую улицу.`;
                }
            } else {
                resultsContainer.innerHTML = '';
            }
        }
    }

    searchInput.addEventListener('input', performSearch);
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
