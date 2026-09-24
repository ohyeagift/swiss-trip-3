const BIN_ID = '6aaa036dffd5d160530c6dc7';
const API_KEY = '$2a$10$z0tuz7VnBdEZDTEF2ZMaeeVWpAhZW7pFESa9z1DB6tLEBYLAtgc5m';

let currentData = null;
let map;
let markers = [];
let currentDayIndex = 0;
let editingActivityIndex = null;
let editingAccKey = null;
let isAuthenticated = false;
let isViewAuthenticated = false;
let editingExpCatIndex = null;
let editingExpItemIndex = null;
let editingNoteDayIdx = null;
let editingNoteIdx = null;
let scrollObserver = null;

// 1. 初始化
async function initMap() {
    document.getElementById('day-title').innerText = "雲端資料載入中...";
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
            headers: { 'X-Master-Key': API_KEY }
        } );
        const result = await response.json();
        currentData = result.record;
        if (currentData.requireViewPassword === undefined) currentData.requireViewPassword = true;
        checkViewPasswordAndRender();
    } catch (error) {
        alert("讀取雲端資料失敗，請檢查網路連線！");
        document.getElementById('day-title').innerText = "載入失敗";
    }
}

// 2. 檢查觀看密碼
function checkViewPasswordAndRender() {
    if (currentData.requireViewPassword && !isViewAuthenticated) {
        document.getElementById('password-overlay').style.display = 'flex';
    } else {
        renderApp();
    }
}

function verifyViewPassword() {
    const pwd = document.getElementById('view-pwd-input').value;
    if (pwd === '1016') {
        document.getElementById('password-overlay').style.display = 'none';
        isViewAuthenticated = true;
        renderApp();
    } else {
        alert('密碼錯誤！提示：出發日期 (4碼數字)');
    }
}

// 3. 渲染地圖與主畫面
async function renderApp() {
    const { Map } = await google.maps.importLibrary("maps");
    map = new Map(document.getElementById("map"), {
        zoom: 8, center: { lat: 46.8182, lng: 8.2275 }, mapId: "DEMO_MAP_ID", disableDefaultUI: true, zoomControl: true
    });
    renderTabs();
    loadDay(0);
}

// 4. 儲存資料到雲端 (背景非同步執行)
function saveCloudData() {
    if (currentDayIndex === 'expense') loadPreTripExpenses();
    else if (currentDayIndex === 'weather') loadWeatherWebcam();
    else if (currentDayIndex === 'notes') loadNotesSummary();
    else loadDay(currentDayIndex);

    const titleEl = document.getElementById('day-title');
    const originalText = titleEl.innerText;
    titleEl.innerText = originalText + " (☁️同步中...)";

    fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Master-Key': API_KEY },
        body: JSON.stringify(currentData )
    })
    .then(response => {
        if (response.ok) {
            titleEl.innerText = originalText;
        } else {
            throw new Error("伺服器錯誤");
        }
    })
    .catch(error => {
        console.error(error);
        titleEl.innerText = originalText + " (⚠️同步失敗)";
    });
}

// 5. 渲染導航 Tabs
function renderTabs() {
    const tabsContainer = document.getElementById('tabs-container');
    tabsContainer.innerHTML = '';
    
    currentData.daily_itinerary.forEach((day, index) => {
        const btn = document.createElement('button');
        btn.className = `tab-btn ${index === currentDayIndex && typeof currentDayIndex === 'number' ? 'active' : ''}`;
        btn.innerText = day.day_id;
        btn.onclick = () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('timeline-container').scrollTop = 0; 
            loadDay(index);
        };
        tabsContainer.appendChild(btn);
    });

    const expenseBtn = document.createElement('button');
    expenseBtn.className = `tab-btn ${currentDayIndex === 'expense' ? 'active' : ''}`;
    expenseBtn.innerText = "支出明細";
    expenseBtn.onclick = () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        expenseBtn.classList.add('active');
        document.getElementById('timeline-container').scrollTop = 0; 
        loadPreTripExpenses();
    };
    tabsContainer.appendChild(expenseBtn);

    const weatherBtn = document.createElement('button');
    weatherBtn.className = `tab-btn ${currentDayIndex === 'weather' ? 'active' : ''}`;
    weatherBtn.innerText = "天氣與攝影機";
    weatherBtn.onclick = () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        weatherBtn.classList.add('active');
        document.getElementById('timeline-container').scrollTop = 0; 
        loadWeatherWebcam();
    };
    tabsContainer.appendChild(weatherBtn);

    const notesBtn = document.createElement('button');
    notesBtn.className = `tab-btn ${currentDayIndex === 'notes' ? 'active' : ''}`;
    notesBtn.innerText = "備註總結";
    notesBtn.onclick = () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        notesBtn.classList.add('active');
        document.getElementById('timeline-container').scrollTop = 0; 
        loadNotesSummary();
    };
    tabsContainer.appendChild(notesBtn);
}

// 6. 載入特定天數的資料
async function loadDay(index) {
    currentDayIndex = index;
    document.querySelector('.map-container').style.display = 'block';
    const dayData = currentData.daily_itinerary[index];
    document.getElementById('day-title').innerText = `${dayData.day_id} · ${dayData.date} | ${dayData.route_title}`;
    const timelineContainer = document.getElementById('timeline-container');
    timelineContainer.innerHTML = '';

    // --- 1. 住宿卡片區塊 ---
    if (dayData.accommodation && currentData.accommodations[dayData.accommodation] && !dayData.hide_acc_card) {
        const acc = currentData.accommodations[dayData.accommodation];
        let accLinksHtml = '';
        if (acc.query && acc.query.trim() !== '') {
            const accSearchQuery = encodeURIComponent(acc.query);
            accLinksHtml += `<a href="https://www.google.com/maps/search/?api=1&query=${accSearchQuery}" target="_blank" class="link-btn">📍 地圖</a>`;
        }
        if (acc.website  ) accLinksHtml += `<a href="${acc.website}" target="_blank" class="link-btn">🌐 官網</a>`;
        if (acc.other) accLinksHtml += `<a href="${acc.other}" target="_blank" class="link-btn">🔗 其他</a>`;

        timelineContainer.innerHTML += `
            <div class="accommodation-card scroll-track" data-lat="${acc.lat || ''}" data-lng="${acc.lng || ''}">
                <div class="acc-left">
                    <div class="acc-icon">🏠</div>
                    <div>
                        <div class="acc-title">今晚住宿</div>
                        <div class="acc-name">${acc.name}</div>
                    </div>
                </div>
                <div class="acc-right">${accLinksHtml}</div>
            </div>
        `;
    }

    // --- 2. 每日行程區塊 ---
    dayData.activities.forEach((act, i) => {
        let linksHtml = '';
        if (act.query && act.query.trim() !== '') {
            const searchQuery = encodeURIComponent(act.query);
            linksHtml += `<a href="https://www.google.com/maps/search/?api=1&query=${searchQuery}" target="_blank" class="link-btn">📍 地圖</a>`;
        }
        if (act.links  ) {
            if (act.links.website) linksHtml += `<a href="${act.links.website}" target="_blank" class="link-btn">🌐 官網</a>`;
            if (act.links.transit_map) linksHtml += `<a href="${act.links.transit_map}" target="_blank" class="link-btn">🗺️ 交通圖</a>`;
            if (act.links.sbb) linksHtml += `<a href="${act.links.sbb}" target="_blank" class="link-btn">🚆 SBB</a>`;
            if (act.links.webcam) linksHtml += `<a href="${act.links.webcam}" target="_blank" class="link-btn">📷 攝影機</a>`;
            if (act.links.weather) linksHtml += `<a href="${act.links.weather}" target="_blank" class="link-btn">🌤️ 天氣</a>`;
            if (act.links.blogger) linksHtml += `<a href="${act.links.blogger}" target="_blank" class="link-btn">📝 Blogger</a>`;
            if (act.links.other) linksHtml += `<a href="${act.links.other}" target="_blank" class="link-btn">🔗 其他</a>`;
        }

        let altitudeHtml = '';
        if (act.altitude) {
            const formattedText = act.altitude.replace(/\n/g, '  
');
            altitudeHtml = `<div class="altitude">${formattedText}</div>`;
        }

        timelineContainer.innerHTML += `
            <div class="timeline-item scroll-track" data-index="${i}" data-lat="${act.lat || ''}" data-lng="${act.lng || ''}">
                <div class="time">${act.time}</div>
                <div class="marker-icon">${i + 1}</div>
                <div class="content">
                    <div class="activity-name">${act.activity}</div>
                    ${altitudeHtml}
                    <div class="links">${linksHtml}</div>
                </div>
            </div>
        `;
    });

    // --- 3. 當天備註區塊 ---
    let notesHtml = '';
    const notes = dayData.notes || [];
    notes.forEach((note, nIdx) => {
        notesHtml += `
            <div class="note-item">
                <div class="note-content">
                    <input type="checkbox" ${note.checked ? 'checked' : ''} onchange="toggleNote(${index}, ${nIdx})">
                    <span class="note-text ${note.checked ? 'checked' : ''}">${note.text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>
                </div>
                <div class="note-actions">
                    <button onclick="moveNote(${index}, ${nIdx}, -1)">↑</button>
                    <button onclick="moveNote(${index}, ${nIdx}, 1)">↓</button>
                    <button onclick="openNoteEditModal(${index}, ${nIdx})">編輯</button>
                    <button class="note-delete" onclick="deleteNote(${index}, ${nIdx})">刪除</button>
                </div>
            </div>
        `;
    });

    timelineContainer.innerHTML += `
        <div class="notes-section">
            <div class="notes-header">📝 當天備註 / 準備事項</div>
            <div class="note-input-group">
                <textarea id="new-note-input" rows="2" placeholder="添加一項準備事項 (可按 Enter 換行)..."></textarea>
                <button onclick="addNote(${index})">添加</button>
            </div>
            <div class="note-list">
                ${notesHtml}
            </div>
        </div>
    `;

    updateMapMarkers(dayData);
    setTimeout(setupScrollTracking, 800);
}

// 7. 更新地圖標記
async function updateMapMarkers(dayData) {
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    markers.forEach(m => m.map = null);
    markers = [];
    const bounds = new google.maps.LatLngBounds();

    dayData.activities.forEach((act, i) => {
        if (act.lat && act.lng) {
            const markerDiv = document.createElement('div');
            markerDiv.className = 'custom-map-marker';
            markerDiv.innerText = i + 1;
            const marker = new AdvancedMarkerElement({
                map: map, position: { lat: act.lat, lng: act.lng }, content: markerDiv, title: act.activity
            });
            marker.activityIndex = i; // 綁定索引，解決重疊問題
            markers.push(marker);
            bounds.extend({ lat: act.lat, lng: act.lng });
        }
    });

    if (dayData.accommodation && currentData.accommodations[dayData.accommodation] && !dayData.hide_acc_card) {
        const acc = currentData.accommodations[dayData.accommodation];
        if (acc.lat && acc.lng) {
            const accDiv = document.createElement('div');
            accDiv.className = 'custom-map-marker hotel';
            accDiv.innerText = '🏠';
            const accMarker = new AdvancedMarkerElement({
                map: map, position: { lat: acc.lat, lng: acc.lng }, content: accDiv, title: acc.name
            });
            markers.push(accMarker);
            bounds.extend({ lat: acc.lat, lng: acc.lng });
        }
    }

    if (!bounds.isEmpty()) {
        map.fitBounds(bounds);
        const listener = google.maps.event.addListener(map, "idle", function() { 
            if (map.getZoom() > 14) map.setZoom(14); 
            google.maps.event.removeListener(listener); 
        });
    }
}

// ================= 備註功能邏輯 =================
function addNote(dayIndex) {
    const input = document.getElementById('new-note-input');
    const text = input.value.trim();
    if (!text) return;
    if (!currentData.daily_itinerary[dayIndex].notes) currentData.daily_itinerary[dayIndex].notes = [];
    currentData.daily_itinerary[dayIndex].notes.push({ text: text, checked: false });
    saveCloudData();
}

function toggleNote(dayIndex, noteIndex) {
    currentData.daily_itinerary[dayIndex].notes[noteIndex].checked = !currentData.daily_itinerary[dayIndex].notes[noteIndex].checked;
    saveCloudData();
}

function deleteNote(dayIndex, noteIndex) {
    if(confirm('確定要刪除這項備註嗎？')) {
        currentData.daily_itinerary[dayIndex].notes.splice(noteIndex, 1);
        saveCloudData();
    }
}

function moveNote(dayIdx, noteIdx, dir) {
    const notes = currentData.daily_itinerary[dayIdx].notes;
    if (noteIdx + dir < 0 || noteIdx + dir >= notes.length) return;
    const temp = notes[noteIdx];
    notes[noteIdx] = notes[noteIdx + dir];
    notes[noteIdx + dir] = temp;
    saveCloudData();
}

function openNoteEditModal(dayIdx, noteIdx) {
    editingNoteDayIdx = dayIdx;
    editingNoteIdx = noteIdx;
    document.getElementById('edit-note-content').value = currentData.daily_itinerary[dayIdx].notes[noteIdx].text;
    document.getElementById('note-form-modal').classList.add('active');
}

function closeNoteEditModal() {
    document.getElementById('note-form-modal').classList.remove('active');
}

function saveEditedNote() {
    if (editingNoteDayIdx === null || editingNoteIdx === null) return;
    const text = document.getElementById('edit-note-content').value.trim();
    if (text) {
        currentData.daily_itinerary[editingNoteDayIdx].notes[editingNoteIdx].text = text;
        saveCloudData();
    }
    closeNoteEditModal();
}

function loadNotesSummary() {
    currentDayIndex = 'notes';
    document.querySelector('.map-container').style.display = 'none';
    document.getElementById('day-title').innerText = "備註總結";
    
    const timelineContainer = document.getElementById('timeline-container');
    let html = '';
    let hasAnyNotes = false;

    currentData.daily_itinerary.forEach((day, dIdx) => {
        if (day.notes && day.notes.length > 0) {
            hasAnyNotes = true;
            let notesHtml = '';
            day.notes.forEach((note, nIdx) => {
                notesHtml += `
                    <div class="note-item">
                        <div class="note-content">
                            <input type="checkbox" ${note.checked ? 'checked' : ''} onchange="toggleNote(${dIdx}, ${nIdx})">
                            <span class="note-text ${note.checked ? 'checked' : ''}">${note.text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>
                        </div>
                        <div class="note-actions">
                            <button onclick="moveNote(${dIdx}, ${nIdx}, -1)">↑</button>
                            <button onclick="moveNote(${dIdx}, ${nIdx}, 1)">↓</button>
                            <button onclick="openNoteEditModal(${dIdx}, ${nIdx})">編輯</button>
                            <button class="note-delete" onclick="deleteNote(${dIdx}, ${nIdx})">刪除</button>
                        </div>
                    </div>
                `;
            });

            html += `
                <div class="notes-section" style="margin-bottom: 20px; margin-top: 0;">
                    <div class="notes-header">${day.day_id} · ${day.date} | ${day.route_title}</div>
                    <div class="note-list">${notesHtml}</div>
                </div>
            `;
        }
    });

    timelineContainer.innerHTML = hasAnyNotes ? html : '<div style="padding: 20px; text-align: center; color: #666;">目前沒有任何備註事項。<br>請在每日行程下方添加。</div>';
}

function loadPreTripExpenses() {
    currentDayIndex = 'expense';
    document.querySelector('.map-container').style.display = 'none';
    document.getElementById('day-title').innerText = "支出明細";
    const timelineContainer = document.getElementById('timeline-container');
    timelineContainer.innerHTML = '';
    if (!currentData.pre_trip_expenses) return;

    let html = '';
    currentData.pre_trip_expenses.categories.forEach(cat => {
        let itemsHtml = '';
        cat.items.forEach(item => {
            let tags = '';
            if (item.asiamiles) tags += `<span class="val-tag">亞洲萬里通: ${item.asiamiles}</span>`;
            if (item.total) {
                let totalLabel = "總計";
                if (cat.title.includes('住宿')) totalLabel = "房價總計";
                else if (cat.title.includes('交通')) totalLabel = "總計";
                else if (cat.title.includes('景點')) totalLabel = "CHF";
                tags += `<span class="val-tag">${totalLabel}: ${item.total}</span>`;
            }
            if (item.per_night) tags += `<span class="val-tag">每人每晚: ${item.per_night}</span>`;
            if (item.per_person) tags += `<span class="val-tag highlight">每人: ${item.per_person}</span>`;
            
            itemsHtml += `<div class="expense-row"><div class="expense-name">${item.name}</div><div class="expense-vals">${tags}</div></div>`;
        });
        html += `<div class="expense-container"><div class="expense-category-title">${cat.title}</div><div class="expense-list">${itemsHtml}</div></div>`;
    });
    html += `<div class="expense-total-row">機票、酒店、交通、景點每人總計：<span class="highlight-yellow" style="font-size: 20px; display: inline-block; margin-top: 8px;">HK$${currentData.pre_trip_expenses.summary.total_per_person}</span></div>`;
    timelineContainer.innerHTML = html;
}

function loadWeatherWebcam() {
    currentDayIndex = 'weather';
    document.querySelector('.map-container').style.display = 'none';
    document.getElementById('day-title').innerText = "即時天氣與攝影機";
    const timelineContainer = document.getElementById('timeline-container');
    timelineContainer.innerHTML = '<div style="text-align:center; padding: 20px; color: #666;">資料整理中...</div>';

    const locations = [];
    currentData.daily_itinerary.forEach(day => {
        day.activities.forEach(act => {
            if (act.links && (act.links.webcam || act.links.weather)) {
                if (!locations.find(l => l.name === act.activity)) {
                    locations.push({ name: act.activity, lat: act.lat, lng: act.lng, webcam: act.links.webcam, weatherLink: act.links.weather });
                }
            }
        });
    });

    if (locations.length === 0) {
        timelineContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">目前行程中沒有包含攝影機或天氣連結的景點。<br>請在編輯行程時加入連結。</div>';
        return;
    }

    let html = '<div class="weather-grid">';
    locations.forEach((loc, idx) => {
        let buttonsHtml = '';
        if (loc.webcam) buttonsHtml += '<a href="' + loc.webcam + '" target="_blank" class="link-btn">📷 攝影機</a>';
        if (loc.weatherLink) buttonsHtml += '<a href="' + loc.weatherLink + '" target="_blank" class="link-btn">🌤️ 官方天氣</a>';
        let liveWeatherHtml = '<div class="live-weather" style="color:#999;">無座標資料，無法讀取天氣</div>';
        if (loc.lat && loc.lng) liveWeatherHtml = '<div class="live-weather" id="live-weather-' + idx + '">讀取即時天氣中...</div>';
        html += '<div class="weather-card"><div class="weather-header"><div class="weather-title">' + loc.name + '</div><div class="weather-actions">' + buttonsHtml + '</div></div>' + liveWeatherHtml + '</div>';
    });
    html += '</div>';
    timelineContainer.innerHTML = html;

    locations.forEach(async (loc, idx) => {
        if (loc.lat && loc.lng) {
            try {
                const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + loc.lat + '&longitude=' + loc.lng + '&current=temperature_2m,weather_code&timezone=auto'  );
                const data = await res.json();
                const temp = data.current.temperature_2m;
                const code = data.current.weather_code;
                const weatherInfo = getWeatherDescription(code);
                document.getElementById('live-weather-' + idx).innerHTML = '<div class="weather-temp">' + temp + '°C</div><div class="weather-desc">' + weatherInfo.icon + ' ' + weatherInfo.text + '</div>';
            } catch (e) {
                document.getElementById('live-weather-' + idx).innerHTML = '<span style="color:#999;">無法取得即時天氣</span>';
            }
        }
    });
}

function getWeatherDescription(code) {
    if (code === 0) return { icon: '☀️', text: '晴天' };
    if (code === 1 || code === 2 || code === 3) return { icon: '⛅', text: '多雲' };
    if (code === 45 || code === 48) return { icon: '🌫️', text: '霧' };
    if (code >= 51 && code <= 55) return { icon: '🌧️', text: '毛毛雨' };
    if (code >= 61 && code <= 65) return { icon: '🌧️', text: '雨' };
    if (code >= 71 && code <= 77) return { icon: '🌨️', text: '雪' };
    if (code >= 95 && code <= 99) return { icon: '⛈️', text: '雷雨' };
    return { icon: '☁️', text: '未知' };
}

// ================= 編輯功能邏輯 =================
function checkPasswordAndOpen() {
    if (isAuthenticated) { openListModal(); return; }
    const pwd = prompt("請輸入編輯密碼：");
    if (pwd === "0902") { isAuthenticated = true; openListModal(); } 
    else if (pwd !== null) { alert("密碼錯誤，無法編輯！"); }
}

function openListModal() {
    if (currentDayIndex === 'weather' || currentDayIndex === 'notes') {
        alert("此頁面資料是自動產生的，請到對應的每日行程中編輯！");
        return;
    }

    const container = document.getElementById('edit-list-container');
    container.innerHTML = '';

    const isChecked = currentData.requireViewPassword ? 'checked' : '';
    const pwdToggleHtml = `
        <div class="edit-list-item" style="background: #FFF3E0; border-color: #FFE0B2; margin-bottom: 15px;">
            <div class="edit-list-info">
                <div class="n" style="color: #E65100;">🔒 啟用觀看密碼 (1016)</div>
                <div class="t">開啟後，朋友需輸入密碼才能看行程</div>
            </div>
            <label class="switch">
                <input type="checkbox" id="pwd-toggle" ${isChecked} onchange="toggleViewPassword()">
                <span class="slider round"></span>
            </label>
        </div>
    `;

    if (currentDayIndex === 'expense') {
        document.getElementById('modal-day-title').innerText = `編輯 支出明細`;
        document.querySelector('#list-modal .add-btn').style.display = 'none'; 
        document.querySelector('#list-modal .sort-hint').style.display = 'none';
        container.innerHTML += pwdToggleHtml;

        container.innerHTML += `
            <div class="edit-list-item" style="background: #FFF9C4; border-color: #FFE082; margin-bottom: 15px;">
                <div class="edit-list-info">
                    <div class="t">總計每人支出</div>
                    <div class="n" style="color: #F57F17; font-size: 18px;">HK$${currentData.pre_trip_expenses.summary.total_per_person}</div>
                </div>
                <div class="edit-list-actions">
                    <button onclick="openExpenseSummaryModal()">編輯</button>
                </div>
            </div>
        `;

        currentData.pre_trip_expenses.categories.forEach((cat, cIdx) => {
            container.innerHTML += `<h4 style="margin: 15px 0 10px; color: var(--swiss-red); border-bottom: 1px solid #FFEBEE; padding-bottom: 5px;">${cat.title}</h4>`;
            cat.items.forEach((item, iIdx) => {
                container.innerHTML += `
                    <div class="edit-list-item">
                        <div class="edit-list-info">
                            <div class="n" style="white-space: pre-wrap;">${item.name}</div>
                            <div class="t">${item.total ? '總計: ' + item.total : ''}</div>
                        </div>
                        <div class="edit-list-actions">
                            <button onclick="openExpenseFormModal(${cIdx}, ${iIdx})">編輯</button>
                            <button class="delete-btn" onclick="deleteExpenseItem(${cIdx}, ${iIdx})">刪除</button>
                        </div>
                    </div>
                `;
            });
            container.innerHTML += `<button class="btn-secondary add-btn" style="margin-top: 5px; display: block; width: 100%;" onclick="openExpenseFormModal(${cIdx}, null)">+ 新增 ${cat.title.split(' ')[1] || '項目'}</button>`;
        });

    } else {
        document.querySelector('#list-modal .add-btn').style.display = 'block';
        document.querySelector('#list-modal .sort-hint').style.display = 'block';
        
        const dayData = currentData.daily_itinerary[currentDayIndex];
        document.getElementById('modal-day-title').innerText = `編輯 ${dayData.day_id} 行程`;
        container.innerHTML += pwdToggleHtml;

        if (dayData.accommodation && currentData.accommodations[dayData.accommodation] && !dayData.hide_acc_card) {
            const accName = currentData.accommodations[dayData.accommodation].name;
            container.innerHTML += `
                <div class="edit-list-item" style="background: #E8F5E9; border-color: #C8E6C9;">
                    <div class="edit-list-info">
                        <div class="t">🏠 今晚住宿</div>
                        <div class="n">${accName}</div>
                    </div>
                    <div class="edit-list-actions">
                        <button onclick="openAccFormModal('${dayData.accommodation}')">編輯</button>
                    </div>
                </div>
            `;
        }
        
        dayData.activities.forEach((act, i) => {
            container.innerHTML += `
                <div class="edit-list-item">
                    <div class="edit-list-info">
                        <div class="t">${act.time}</div>
                        <div class="n">${act.activity}</div>
                    </div>
                    <div class="edit-list-actions">
                        <button onclick="openFormModal(${i})">編輯</button>
                        <button class="delete-btn" onclick="deleteActivity(${i})">刪除</button>
                    </div>
                </div>
            `;
        });
    }
    document.getElementById('list-modal').classList.add('active');
}

function closeListModal() { document.getElementById('list-modal').classList.remove('active'); }
function toggleViewPassword() { currentData.requireViewPassword = document.getElementById('pwd-toggle').checked; saveCloudData(); }
function deleteActivity(index) {
    if(confirm('確定要刪除這個行程嗎？')) {
        currentData.daily_itinerary[currentDayIndex].activities.splice(index, 1);
        saveCloudData(); openListModal();
    }
}

function openNewFormModal() {
    editingActivityIndex = null;
    ['time','name','content','map','lat','lng','website','transit-map','sbb','webcam','weather','blogger','other'].forEach(id => {
        document.getElementById('edit-' + id).value = '';
    });
    document.getElementById('form-modal').classList.add('active');
}

function openFormModal(activityIndex) {
    editingActivityIndex = activityIndex;
    const act = currentData.daily_itinerary[currentDayIndex].activities[activityIndex];
    document.getElementById('edit-time').value = act.time || '';
    document.getElementById('edit-name').value = act.activity || '';
    document.getElementById('edit-content').value = act.altitude || '';
    document.getElementById('edit-map').value = act.query || '';
    document.getElementById('edit-lat').value = act.lat || '';
    document.getElementById('edit-lng').value = act.lng || '';
    document.getElementById('edit-website').value = (act.links && act.links.website) ? act.links.website : '';
    document.getElementById('edit-transit-map').value = (act.links && act.links.transit_map) ? act.links.transit_map : '';
    document.getElementById('edit-sbb').value = (act.links && act.links.sbb) ? act.links.sbb : '';
    document.getElementById('edit-webcam').value = (act.links && act.links.webcam) ? act.links.webcam : '';
    document.getElementById('edit-weather').value = (act.links && act.links.weather) ? act.links.weather : '';
    document.getElementById('edit-blogger').value = (act.links && act.links.blogger) ? act.links.blogger : '';
    document.getElementById('edit-other').value = (act.links && act.links.other) ? act.links.other : '';
    document.getElementById('form-modal').classList.add('active');
}

function closeFormModal() { document.getElementById('form-modal').classList.remove('active'); }

function sortActivities(activities) {
    const getTimeValue = (t) => {
        if (!t) return 9999;
        if (t.includes(':')) { const [h, m] = t.split(':'); return parseInt(h) * 60 + parseInt(m); }
        if (t.includes('全日')) return 0;
        if (t.includes('早上') || t.includes('上午')) return 8 * 60;
        if (t.includes('中午')) return 12 * 60;
        if (t.includes('下午')) return 14 * 60;
        if (t.includes('傍晚')) return 17 * 60;
        if (t.includes('晚上')) return 19 * 60;
        return 9999;
    };
    activities.sort((a, b) => getTimeValue(a.time) - getTimeValue(b.time));
}

function saveActivity() {
    const activities = currentData.daily_itinerary[currentDayIndex].activities;
    let act = editingActivityIndex === null ? {} : activities[editingActivityIndex];
    if (editingActivityIndex === null) activities.push(act);
    
    act.time = document.getElementById('edit-time').value;
    act.activity = document.getElementById('edit-name').value;
    act.altitude = document.getElementById('edit-content').value;
    act.query = document.getElementById('edit-map').value;
    
    const latVal = parseFloat(document.getElementById('edit-lat').value);
    const lngVal = parseFloat(document.getElementById('edit-lng').value);
    if (!isNaN(latVal)) act.lat = latVal; else delete act.lat;
    if (!isNaN(lngVal)) act.lng = lngVal; else delete act.lng;
    
    if (!act.links) act.links = {};
    act.links.website = document.getElementById('edit-website').value;
    act.links.transit_map = document.getElementById('edit-transit-map').value;
    act.links.sbb = document.getElementById('edit-sbb').value;
    act.links.webcam = document.getElementById('edit-webcam').value;
    act.links.weather = document.getElementById('edit-weather').value;
    act.links.blogger = document.getElementById('edit-blogger').value;
    act.links.other = document.getElementById('edit-other').value;
    
    ['website','transit_map','sbb','webcam','weather','blogger','other'].forEach(k => {
        if(!act.links[k]) delete act.links[k];
    });
    if(Object.keys(act.links).length === 0) delete act.links;
    
    sortActivities(activities);
    closeFormModal(); openListModal(); saveCloudData();
}

function openAccFormModal(accKey) {
    editingAccKey = accKey;
    const acc = currentData.accommodations[accKey];
    document.getElementById('edit-acc-name').value = acc.name || '';
    document.getElementById('edit-acc-map').value = acc.query || '';
    document.getElementById('edit-acc-lat').value = acc.lat || '';
    document.getElementById('edit-acc-lng').value = acc.lng || '';
    document.getElementById('edit-acc-website').value = acc.website || '';
    document.getElementById('edit-acc-other').value = acc.other || '';
    document.getElementById('acc-form-modal').classList.add('active');
}

function closeAccFormModal() { document.getElementById('acc-form-modal').classList.remove('active'); }

function saveAccommodation() {
    if (!editingAccKey) return;
    const acc = currentData.accommodations[editingAccKey];
    acc.name = document.getElementById('edit-acc-name').value;
    acc.query = document.getElementById('edit-acc-map').value;
    const latVal = parseFloat(document.getElementById('edit-acc-lat').value);
    const lngVal = parseFloat(document.getElementById('edit-acc-lng').value);
    if (!isNaN(latVal)) acc.lat = latVal; else delete acc.lat;
    if (!isNaN(lngVal)) acc.lng = lngVal; else delete acc.lng;
    acc.website = document.getElementById('edit-acc-website').value;
    acc.other = document.getElementById('edit-acc-other').value;
    if(!acc.website) delete acc.website;
    if(!acc.other) delete acc.other;
    closeAccFormModal(); openListModal(); saveCloudData();
}

function openExpenseFormModal(catIdx, itemIdx) {
    editingExpCatIndex = catIdx; editingExpItemIndex = itemIdx;
    if (itemIdx !== null) {
        const item = currentData.pre_trip_expenses.categories[catIdx].items[itemIdx];
        document.getElementById('edit-exp-name').value = item.name || '';
        document.getElementById('edit-exp-total').value = item.total || '';
        document.getElementById('edit-exp-person').value = item.per_person || '';
        document.getElementById('edit-exp-night').value = item.per_night || '';
        document.getElementById('edit-exp-miles').value = item.asiamiles || '';
    } else {
        ['name','total','person','night','miles'].forEach(id => document.getElementById('edit-exp-' + id).value = '');
    }
    document.getElementById('expense-form-modal').classList.add('active');
}

function closeExpenseFormModal() { document.getElementById('expense-form-modal').classList.remove('active'); }

function saveExpenseItem() {
    const cat = currentData.pre_trip_expenses.categories[editingExpCatIndex];
    let item = editingExpItemIndex === null ? {} : cat.items[editingExpItemIndex];
    
    item.name = document.getElementById('edit-exp-name').value;
    item.total = document.getElementById('edit-exp-total').value;
    item.per_person = document.getElementById('edit-exp-person').value;
    item.per_night = document.getElementById('edit-exp-night').value;
    item.asiamiles = document.getElementById('edit-exp-miles').value;
    
    if(!item.total) delete item.total;
    if(!item.per_person) delete item.per_person;
    if(!item.per_night) delete item.per_night;
    if(!item.asiamiles) delete item.asiamiles;
    
    if (editingExpItemIndex === null) cat.items.push(item);
    
    closeExpenseFormModal();
    openListModal();
    saveCloudData();
}

function deleteExpenseItem(catIdx, itemIdx) {
    if(confirm('確定要刪除這個支出項目嗎？')) {
        currentData.pre_trip_expenses.categories[catIdx].items.splice(itemIdx, 1);
        saveCloudData();
        openListModal();
    }
}

function openExpenseSummaryModal() {
    document.getElementById('edit-exp-summary').value = currentData.pre_trip_expenses.summary.total_per_person || '';
    document.getElementById('expense-summary-modal').classList.add('active');
}

function closeExpenseSummaryModal() { 
    document.getElementById('expense-summary-modal').classList.remove('active'); 
}

function saveExpenseSummary() {
    currentData.pre_trip_expenses.summary.total_per_person = document.getElementById('edit-exp-summary').value;
    closeExpenseSummaryModal();
    openListModal();
    saveCloudData();
}

// ================= 滑動聯動地圖功能 =================
function setupScrollTracking() {
    if (scrollObserver) scrollObserver.disconnect();
    const container = document.getElementById('timeline-container');
    const options = { root: container, rootMargin: '-20% 0px -60% 0px', threshold: 0 };

    scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const lat = parseFloat(entry.target.getAttribute('data-lat'));
                const lng = parseFloat(entry.target.getAttribute('data-lng'));
                const idx = parseInt(entry.target.getAttribute('data-index'));

                // 1. 還原所有標記，並把當前行程的標記拉到最上層 + 變色
                markers.forEach(m => {
                    if (m.content) m.content.classList.remove('active-marker');
                    m.zIndex = null;
                    
                    if (m.activityIndex === idx) {
                        m.content.classList.add('active-marker');
                        m.zIndex = 9999; // 讓它浮在最上面，徹底解決重疊問題！
                    }
                });

                // 2. 移動地圖
                if (!isNaN(lat) && !isNaN(lng) && map) {
                    map.panTo({ lat: lat, lng: lng });
                    map.setZoom(15);
                }
            }
        });
    }, options);

    document.querySelectorAll('.scroll-track').forEach(el => scrollObserver.observe(el));
}

