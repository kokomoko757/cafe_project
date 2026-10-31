/**
 * ==============================================================================
 * GLOBAL COFFEE — BRANCH SEARCH & DIRECTORY FILTER (JQUERY 3.7.1)
 * File: js/location.js
 * 
 * JQUERY VERSION: 3.7.1
 * WHY $(function () { ... }) IS NEEDED:
 * Waits for all 28 table rows and flagship location cards to render before attaching
 * search event listeners.
 * ==============================================================================
 */

'use strict';

$(function () {
  initBranchSearch();
});

function initBranchSearch() {
  const $searchInput = $('#branchSearchInput');
  const $searchBtn = $('#branchSearchBtn');
  const $resultsContainer = $('#branchSearchResults');

  if (!$searchInput.length) return;

  function performSearch() {
    const query = $.trim($searchInput.val()).toLowerCase();
    let matchesCount = 0;

    // Filter flagship location cards using traversal and .each()
    const $flagshipCards = $('.page-content section:first .row > .col-12');
    $flagshipCards.each(function () {
      const cardText = $(this).text().toLowerCase();
      const isMatch = query === '' || cardText.indexOf(query) !== -1;
      $(this).toggleClass('hidden', !isMatch);
      if (isMatch) matchesCount++;
    });

    // Filter branches table rows using :not() filter and traversal
    // Using filter :not(.table-secondary) to ignore sub-header category rows
    const $tableRows = $('#branches table tbody tr:not(.table-secondary)');
    let tableMatches = 0;

    $tableRows.each(function () {
      const rowText = $(this).text().toLowerCase();
      const isMatch = query === '' || rowText.indexOf(query) !== -1;
      $(this).toggleClass('hidden', !isMatch);
      if (isMatch) tableMatches++;
    });

    // Handle table secondary header row visibility
    const $headerRows = $('#branches table tbody tr.table-secondary');
    $headerRows.each(function () {
      $(this).toggleClass('hidden', query !== '');
    });

    if ($resultsContainer.length) {
      if (query !== '') {
        const totalFound = matchesCount + tableMatches;
        if (totalFound > 0) {
          $resultsContainer.html(
            '<span class="badge bg-success">Найдено: ' + totalFound + '</span> локаций по запросу «' + escapeHtml(query) + '»'
          );
        } else {
          $resultsContainer.html(
            '<span class="badge bg-warning text-dark">Ничего не найдено</span> по запросу «' + escapeHtml(query) + '». Попробуйте ввести другую улицу.'
          );
        }
      } else {
        $resultsContainer.empty();
      }
    }
  }

  // Bind using .on('input') and .on('click')
  $searchInput.on('input', performSearch);
  if ($searchBtn.length) {
    $searchBtn.on('click', performSearch);
  }
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
