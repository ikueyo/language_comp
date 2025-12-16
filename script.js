document.addEventListener('DOMContentLoaded', () => {
    // === SPA NAVIGATION LOGIC ===
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.tab-content');
    const navTriggers = document.querySelectorAll('.nav-trigger'); // Buttons inside pages

    function switchTab(targetId) {
        // Update Nav
        navLinks.forEach(link => {
            if (link.dataset.target === targetId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Update Section
        sections.forEach(section => {
            if (section.id === targetId) {
                section.classList.add('active');
                // Special check: If switching to participants and using global scroll, maybe scroll up?
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                section.classList.remove('active');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.dataset.target;
            switchTab(target);
        });
    });

    navTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = btn.dataset.target;
            switchTab(target);
        });
    });


    // === PARTICIPANT LOGIC ===
    const participantsContainer = document.getElementById('participantsContainer');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const loadingDiv = document.getElementById('loading');
    const noResultsDiv = document.getElementById('noResults');

    // Only run if elements exist (they should in SPA)
    if (participantsContainer) {

        let participantsData = [];
        if (typeof PARTICIPANTS_DATA !== 'undefined') {
            participantsData = PARTICIPANTS_DATA;
            populateFilter(participantsData);
            renderParticipants(participantsData);
            if (loadingDiv) loadingDiv.style.display = 'none';
        } else {
            console.error('Data not found');
            if (loadingDiv) loadingDiv.textContent = '無法載入資料 (PARTICIPANTS_DATA is not defined)';
        }

        // Populate Category Filter
        function populateFilter(data) {
            const categories = [...new Set(data.map(item => item.category))];
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });
        }

        // Filter Logic
        function filterData() {
            const searchTerm = searchInput.value.toLowerCase();
            const categoryTerm = categoryFilter.value;

            const filtered = participantsData.filter(item => {
                const matchesSearch = item.name.includes(searchTerm) ||
                    item.class.includes(searchTerm) ||
                    item.number.includes(searchTerm);
                const matchesCategory = categoryTerm === '' || item.category === categoryTerm;
                return matchesSearch && matchesCategory;
            });

            renderParticipants(filtered);
        }

        searchInput.addEventListener('input', filterData);
        categoryFilter.addEventListener('change', filterData);

        // Helper function to calculate check-in time (20 minutes before start)
        function getCheckinTime(timeStr) {
            // Extract start time from format like "08:40~10:10"
            const startTime = timeStr.split('~')[0];
            const [hours, minutes] = startTime.split(':').map(Number);

            // Calculate 20 minutes before
            let checkinMinutes = minutes - 20;
            let checkinHours = hours;

            if (checkinMinutes < 0) {
                checkinMinutes += 60;
                checkinHours -= 1;
            }

            // Format with leading zeros
            return `${String(checkinHours).padStart(2, '0')}:${String(checkinMinutes).padStart(2, '0')}`;
        }

        // Render Logic
        function renderParticipants(data) {
            participantsContainer.innerHTML = '';

            if (data.length === 0) {
                noResultsDiv.style.display = 'block';
                return;
            } else {
                noResultsDiv.style.display = 'none';
            }

            // Group by Category
            const grouped = data.reduce((acc, item) => {
                if (!acc[item.category]) acc[item.category] = [];
                acc[item.category].push(item);
                return acc;
            }, {});

            Object.keys(grouped).forEach(category => {
                const items = grouped[category];
                const section = document.createElement('div');
                section.className = 'card';
                section.style.marginBottom = '32px';

                // Calculate check-in time
                const checkinTime = getCheckinTime(items[0].time);

                // Header for the category section
                const headerHtml = `
                    <div style="border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 15px;">
                        <h3>${category}</h3>
                        <p style="margin: 5px 0 0; font-size: 0.9rem; color: #666;">
                            📅 ${items[0].date} | 📍 ${items[0].location} | ⏰ ${items[0].time}
                        </p>
                        <p style="margin: 5px 0 0; font-size: 0.9rem; color: #d35400; font-weight: bold;">
                            🔔 報到時間：${checkinTime}
                        </p>
                    </div>
                `;

                // Table
                let tableHtml = `
                    <table>
                        <thead>
                            <tr>
                                <th width="15%">序號/編號</th>
                                <th width="20%">班級</th>
                                <th width="65%">姓名</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                items.forEach(item => {
                    tableHtml += `
                        <tr>
                            <td>${item.number}</td>
                            <td>${item.class}</td>
                            <td><strong>${item.name}</strong></td>
                        </tr>
                    `;
                });

                tableHtml += `
                        </tbody>
                    </table>
                `;

                section.innerHTML = headerHtml + tableHtml;
                participantsContainer.appendChild(section);
            });
        }
    }
});
