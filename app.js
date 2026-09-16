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

// 1. 初始化 (由 Google Maps API 載入後觸發)
async function initMap() {
    document.getElementById('day-title').innerText = "雲端資料載入中...";
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
            headers: { 'X-Master-Key': API_KEY }
        } );
        const result = await response.json();
        currentData = result.record;
        
        if (currentData.requireViewPassword === undefined) {
            currentData.requireViewPassword = true;
        }
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
        zoom: 8,
        center: { lat: 46.8182, lng: 8.2275 },
        mapId: "DEMO_MAP_ID",
        disableDefaultUI: true,
        zoomControl: true
    });
    renderTabs();
    loadDay(0);
}

// 4. 儲存資料到雲端
async function saveCloudData() {
    document.getElementById('day-title').innerText = "雲端同步中...";
    try {
        await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY
            },
            body: JSON.stringify(currentData )
        });
        loadDay(currentDayIndex);
    } catch (error) {
        alert("儲存失敗，請檢查網路連線！");
    }
}

// 5. 渲染導航 Tabs
function renderTabs() {
    const tabsContainer = document.getElementById('tabs-container');
    tabsContainer.innerHTML = '';
    currentData.daily_itinerary.forEach((day, index) => {
        const btn = document.createElement('button');
        btn.className = `tab-btn ${index === currentDayIndex && currentDayIndex !== 'expense' ? 'active' : ''}`;
        btn.innerText = day.day_id;
        btn.onclick = () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadDay(index);
        };
        tabsContainer.appendChild(btn);
    });

    // 加入「事前支出」按鈕
    const expenseBtn = document.createElement('button');
    expenseBtn.className = `tab-btn ${currentDayIndex === 'expense' ? 'active' : ''}`;
    expenseBtn.innerText = "事前支出";
    expenseBtn.onclick = () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        expenseBtn.classList.add('active');
        loadPreTripExpenses();
    };
    tabsContainer.appendChild(expenseBtn);
}

// 6. 載入特定天數的資料
async function loadDay(index) {
    currentDayIndex = index;
    document.querySelector('.map-container').style.display = 'block';
    const dayData = currentData.daily_itinerary[index];
    document.getElementById('day-title').innerText = `${dayData.day_id} · ${dayData.date} | ${dayData.route_title}`;
    const timelineContainer = document.getElementById('timeline-container');
    timelineContainer.innerHTML = '';

    if (dayData.accommodation && currentData.accommodations[dayData.accommodation] && !dayData.hide_acc_card) {
        const acc = currentData.accommodations[dayData.accommodation];
        let accLinksHtml = '';
        if (acc.query && acc.query.trim() !== '') {
            const accSearchQuery = encodeURIComponent(acc.query);
            accLinksHtml += `<a href="https://www.google.com/maps/search/?api=1&query=${accSearchQuery}" target="_blank" class="link-btn">📍 地圖</a>`;
        }
        if (acc.website ) accLinksHtml += `<a href="${acc.website}" target="_blank" class="link-btn">🌐 官網</a>`;
        if (acc.other) accLinksHtml += `<a href="${acc.other}" target="_blank" class="link-btn">🔗 其他</a>`;

        timelineContainer.innerHTML += `
            <div class="accommodation-card">
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

    dayData.activities.forEach((act, i) => {
        let linksHtml = '';
        if (act.query && act.query.trim() !== '') {
            const searchQuery = encodeURIComponent(act.query);
            linksHtml += `<a href="https://www.google.com/maps/search/?api=1&query=${searchQuery}" target="_blank" class="link-btn">📍 地圖</a>`;
        }
        if (act.links ) {
            if (act.links.website) linksHtml += `<a href="${act.links.website}" target="_blank" class="link-btn">🌐 官網</a>`;
            if (act.links.webcam) linksHtml += `<a href="${act.links.webcam}" target="_blank" class="link-btn">📷 攝影機</a>`;
            if (act.links.weather) linksHtml += `<a href="${act.links.weather}" target="_blank" class="link-btn">🌤️ 天氣</a>`;
            if (act.links.other) linksHtml += `<a href="${act.links.other}" target="_blank" class="link-btn">🔗 其他</a>`;
        }

        let altitudeHtml = '';
        if (act.altitude) {
            const formattedText = act.altitude.replace(/\n/g, '<br>');
            altitudeHtml = `<div class="altitude">${formattedText}</div>`;
        }

        timelineContainer.innerHTML += `
            <div class="timeline-item">
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
    updateMapMarkers(dayData);
}
// --- 新增：載入事前支出明細 (Mobile First 列表版) ---
function loadPreTripExpenses() {
    currentDayIndex = 'expense';
    document.querySelector('.map-container').style.display = 'none'; // 隱藏地圖，騰出空間
    document.getElementById('day-title').innerText = "支出明細";
    
    const timelineContainer = document.getElementById('timeline-container');
    timelineContainer.innerHTML = '';

    if (!currentData.pre_trip_expenses) return;

    let html = '';
    currentData.pre_trip_expenses.categories.forEach(cat => {
        let itemsHtml = '';
        cat.items.forEach(item => {
            // 組合金額標籤 (移除 note 備註)
            let tags = '';
            if (item.total) tags += `<span class="val-tag">房價總計: ${item.total}</span>`;
            if (item.per_night) tags += `<span class="val-tag">每晚: ${item.per_night}</span>`;
            if (item.per_person) tags += `<span class="val-tag highlight">每人: ${item.per_person}</span>`;
            
            itemsHtml += `
                <div class="expense-row">
                    <div class="expense-name">${item.name}</div>
                    <div class="expense-vals">${tags}</div>
                </div>
            `;
        });

        html += `
            <div class="expense-container">
                <div class="expense-category-title">${cat.title}</div>
                <div class="expense-list">
                    ${itemsHtml}
                </div>
            </div>
        `;
    });

    html += `
        <div class="expense-total-row">
            機票、酒店、交通、門票每人總計：
            <span class="highlight-yellow" style="font-size: 20px; display: inline-block; margin-top: 8px;">HK$${currentData.pre_trip_expenses.summary.total_per_person}</span>
        </div>
    `;

    timelineContainer.innerHTML = html;
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
            markers.push(marker);
            bounds.extend({ lat: act.lat, lng: act.lng });
        }
    });

    if (dayData.accommodation && currentData.accommodations[dayData.accommodation]) {
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

// ================= 編輯功能邏輯 =================
function checkPasswordAndOpen() {
    if (isAuthenticated) { openListModal(); return; }
    const pwd = prompt("請輸入編輯密碼：");
    if (pwd === "0902") { isAuthenticated = true; openListModal(); } 
    else if (pwd !== null) { alert("密碼錯誤，無法編輯！"); }
}

function openListModal() {
        if (currentDayIndex === 'expense') {
        alert("事前支出明細請直接在 JSONBin 後台修改資料。");
        return;
    }
    const dayData = currentData.daily_itinerary[currentDayIndex];
    document.getElementById('modal-day-title').innerText = `編輯 ${dayData.day_id} 行程`;
    const container = document.getElementById('edit-list-container');
    container.innerHTML = '';

    const isChecked = currentData.requireViewPassword ? 'checked' : '';
    container.innerHTML += `
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
    document.getElementById('list-modal').classList.add('active');
}

function closeListModal() { document.getElementById('list-modal').classList.remove('active'); }

function toggleViewPassword() {
    currentData.requireViewPassword = document.getElementById('pwd-toggle').checked;
    saveCloudData();
}

function deleteActivity(index) {
    if(confirm('確定要刪除這個行程嗎？')) {
        currentData.daily_itinerary[currentDayIndex].activities.splice(index, 1);
        saveCloudData();
        openListModal();
    }
}

function openNewFormModal() {
    editingActivityIndex = null;
    document.getElementById('edit-time').value = '';
    document.getElementById('edit-name').value = '';
    document.getElementById('edit-content').value = '';
    document.getElementById('edit-map').value = '';
    document.getElementById('edit-lat').value = '';
    document.getElementById('edit-lng').value = '';
    document.getElementById('edit-website').value = '';
    document.getElementById('edit-webcam').value = '';
    document.getElementById('edit-weather').value = '';
    document.getElementById('edit-other').value = '';
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
    document.getElementById('edit-webcam').value = (act.links && act.links.webcam) ? act.links.webcam : '';
    document.getElementById('edit-weather').value = (act.links && act.links.weather) ? act.links.weather : '';
    document.getElementById('edit-other').value = (act.links && act.links.other) ? act.links.other : '';
    document.getElementById('form-modal').classList.add('active');
}

function closeFormModal() { document.getElementById('form-modal').classList.remove('active'); }

function sortActivities(activities) {
    const getTimeValue = (t) => {
        if (!t) return 9999;
        if (t.includes(':')) {
            const [h, m] = t.split(':');
            return parseInt(h) * 60 + parseInt(m);
        }
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
    act.links.webcam = document.getElementById('edit-webcam').value;
    act.links.weather = document.getElementById('edit-weather').value;
    act.links.other = document.getElementById('edit-other').value;
    
    if(!act.links.website) delete act.links.website;
    if(!act.links.webcam) delete act.links.webcam;
    if(!act.links.weather) delete act.links.weather;
    if(!act.links.other) delete act.links.other;
    if(Object.keys(act.links).length === 0) delete act.links;
    
    sortActivities(activities);
    closeFormModal();
    openListModal();
    saveCloudData(); // 儲存到雲端
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
    
    closeAccFormModal();
    openListModal();
    saveCloudData(); // 儲存到雲端
}
