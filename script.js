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

        // Helper function to get grade from class (e.g., "403" -> 4, "502" -> 5)
        function getGrade(classStr) {
            return parseInt(classStr.charAt(0));
        }

        // Get color based on check-in time
        function getCheckinTimeColor(checkinTime) {
            const colorMap = {
                '08:20': '#2e7d32', // 深綠色
                '08:50': '#1565c0', // 深藍色
                '09:00': '#6a1b9a', // 紫色
                '10:10': '#d35400', // 橙色
                '10:50': '#c62828', // 紅色
                '11:05': '#00838f'  // 青色
            };
            return colorMap[checkinTime] || '#666';
        }

        // Get check-in time based on category and grade
        function getCheckinTimeByGrade(category, classStr) {
            const grade = getGrade(classStr);

            // Special check-in times by category and grade
            if (category === '字音字形') {
                return '11:05';
            } else if (category === '國語說故事') {
                if (grade === 2) {
                    return '08:20';
                } else {
                    return '08:50'; // 3年級
                }
            } else if (category === '作文') {
                return '10:10';
            } else if (category === '英語朗讀') {
                if (grade === 5) {
                    return '09:00';
                } else {
                    return '08:20'; // 4年級、6年級
                }
            } else if (category === '國語朗讀') {
                if (grade === 5) {
                    return '10:50';
                } else {
                    return '10:10'; // 4年級、6年級
                }
            } else if (category === '閩南語朗讀') {
                return '08:20';
            }

            // Default fallback: 20 minutes before start time
            return null;
        }

        // Get display text for category-level check-in time
        function getCategoryCheckinDisplay(category) {
            if (category === '字音字形') {
                return '11:05';
            } else if (category === '國語說故事') {
                return '08:20（2年級）、08:50（3年級）';
            } else if (category === '作文') {
                return '10:10';
            } else if (category === '英語朗讀') {
                return '08:20（4年級、6年級）、09:00（5年級）';
            } else if (category === '國語朗讀') {
                return '10:10（4年級、6年級）、10:50（5年級）';
            } else if (category === '閩南語朗讀') {
                return '08:20';
            }
            return '';
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

                // Get check-in time display for category
                const checkinDisplay = getCategoryCheckinDisplay(category);

                // Header for the category section
                const headerHtml = `
                    <div style="border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 15px;">
                        <h3>${category}</h3>
                        <p style="margin: 5px 0 0; font-size: 0.9rem; color: #666;">
                            📅 ${items[0].date} | 📍 ${items[0].location} | ⏰ ${items[0].time}
                        </p>
                        <p style="margin: 5px 0 0; font-size: 0.9rem; color: #d35400; font-weight: bold;">
                            🔔 報到時間：${checkinDisplay}
                        </p>
                    </div>
                `;

                // Table with check-in time column
                let tableHtml = `
                    <table>
                        <thead>
                            <tr>
                                <th width="10%">序號</th>
                                <th width="15%">班級</th>
                                <th width="40%">姓名</th>
                                <th width="35%">報到時間</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                items.forEach(item => {
                    const checkinTime = getCheckinTimeByGrade(category, item.class);
                    const checkinColor = getCheckinTimeColor(checkinTime);
                    tableHtml += `
                        <tr>
                            <td>${item.number}</td>
                            <td>${item.class}</td>
                            <td><strong>${item.name}</strong></td>
                            <td style="color: ${checkinColor}; font-weight: bold;">${checkinTime}</td>
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
