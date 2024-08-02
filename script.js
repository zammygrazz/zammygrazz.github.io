// script.js
document.addEventListener('DOMContentLoaded', function () {
    const rowsPerPage = 10; // Number of rows to show per page
    const table = document.getElementById('data-table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const nextButton = document.getElementById('next-button');

    let currentPage = 0;
    const totalPages = Math.ceil(rows.length / rowsPerPage);

    function updateTable() {
        rows.forEach((row, index) => {
            row.style.display = (index >= currentPage * rowsPerPage && index < (currentPage + 1) * rowsPerPage) ? '' : 'none';
        });
        nextButton.style.display = currentPage < totalPages - 1 ? '' : 'none';
    }

    nextButton.addEventListener('click', function () {
        if (currentPage < totalPages - 1) {
            currentPage++;
            updateTable();
        }
    });

    updateTable(); // Initial call to display the first page
});
