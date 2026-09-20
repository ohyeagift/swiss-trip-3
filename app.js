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
        btn.className = `tab-btn ${index === currentDayIndex && typeof currentDayIndex === 'number' ? 'active' : ''}`;
        btn.innerText = day.day_id;
        btn.onclick = () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadDay(index);
        };
        tabsContainer.appendChild(btn);
    });

    // 加入「支出明細」按鈕
    const expenseBtn = document.createElement('button');
    expenseBtn.className = `tab-btn ${currentDayIndex === 'expense' ? 'active' : ''}`;
    expenseBtn.innerText = "支出明細";
    expenseBtn.onclick = () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        expenseBtn.classList.add('active');
        loadPreTripExpenses();
    };
    tabsContainer.appendChild(expenseBtn);

    // 加入「天氣與攝影機」按鈕
    const weatherBtn = document.createElement('button');
    weatherBtn.className = `tab-btn ${currentDayIndex === 'weather' ? 'active' : ''}`;
    weatherBtn.innerText = "天氣與攝影機";
    weatherBtn.onclick = () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        weatherBtn.classList.add('active');
        loadWeatherWebcam();
    };
    tabsContainer.appendChild(weatherBtn);
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

    dayData.activities.forEach((act, i) => {
        let linksHtml = '';
        if (act.query && act.query.trim() !== '') {
            const searchQuery = encodeURIComponent(act.query);
            linksHtml += `<a href="https://www.google.com/maps/search/?api=1&query=${searchQuery}" target="_blank" class="link-btn">📍 地圖</a>`;
        }
       if (act.links) {
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
            const formattedText = act.altitude.replace(/\n/g, '<br>');
            altitudeHtml = `<div class="altitude">${formattedText}</div>`;
        }

        timelineContainer.innerHTML += `
            <div class="timeline-item scroll-track" data-lat="${act.lat || ''}" data-lng="${act.lng || ''}">
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
    setTimeout(setupScrollTracking, 800); // 延遲 0.8 秒後啟動滑動追蹤
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
            // 組合金額標籤
            let tags = '';
            
            // 1. 先顯示亞洲萬里通
            if (item.asiamiles) tags += `<span class="val-tag">亞洲萬里通: ${item.asiamiles}</span>`;
            
            // 2. 再顯示總計
            if (item.total) {
                // 根據類別名稱，自動切換「總計」的顯示文字
                let totalLabel = "總計";
                if (cat.title.includes('住宿')) totalLabel = "房價總計";
                else if (cat.title.includes('交通')) totalLabel = "總計";
                else if (cat.title.includes('景點')) totalLabel = "CHF";
                
                tags += `<span class="val-tag">${totalLabel}: ${item.total}</span>`;
            }
            
            // 3. 其他項目
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
            機票、酒店、交通、景點每人總計：
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

let editingExpCatIndex = null;
let editingExpItemIndex = null;

function openListModal() {
    // 1. 防錯：如果是天氣頁面，不允許編輯，跳出提示
    if (currentDayIndex === 'weather') {
        alert("天氣與攝影機是自動從行程中抓取的，請到對應的每日行程中編輯連結！");
        return;
    }

    const container = document.getElementById('edit-list-container');
    container.innerHTML = '';

    // --- 密碼開關 (所有頁面共用) ---
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
        // --- 編輯支出明細模式 ---
        document.getElementById('modal-day-title').innerText = `編輯 支出明細`;
        document.querySelector('#list-modal .add-btn').style.display = 'none'; 
        document.querySelector('#list-modal .sort-hint').style.display = 'none';

        container.innerHTML += pwdToggleHtml; // 加入密碼開關

        // 1. 總計區塊
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

        // 2. 各類別項目
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
        // --- 編輯每日行程模式 ---
        document.querySelector('#list-modal .add-btn').style.display = 'block';
        document.querySelector('#list-modal .sort-hint').style.display = 'block';
        
        const dayData = currentData.daily_itinerary[currentDayIndex];
        document.getElementById('modal-day-title').innerText = `編輯 ${dayData.day_id} 行程`;
        
        container.innerHTML += pwdToggleHtml; // 加入密碼開關

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

// --- 新增：支出明細的編輯功能 ---
function openExpenseFormModal(catIdx, itemIdx) {
    editingExpCatIndex = catIdx;
    editingExpItemIndex = itemIdx;
    
    if (itemIdx !== null) {
        const item = currentData.pre_trip_expenses.categories[catIdx].items[itemIdx];
        document.getElementById('edit-exp-name').value = item.name || '';
        document.getElementById('edit-exp-total').value = item.total || '';
        document.getElementById('edit-exp-person').value = item.per_person || '';
        document.getElementById('edit-exp-night').value = item.per_night || '';
        document.getElementById('edit-exp-miles').value = item.asiamiles || '';
    } else {
        document.getElementById('edit-exp-name').value = '';
        document.getElementById('edit-exp-total').value = '';
        document.getElementById('edit-exp-person').value = '';
        document.getElementById('edit-exp-night').value = '';
        document.getElementById('edit-exp-miles').value = '';
    }
    document.getElementById('expense-form-modal').classList.add('active');
}

function closeExpenseFormModal() {
    document.getElementById('expense-form-modal').classList.remove('active');
}

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
    saveCloudData(); // 自動同步到雲端
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
    saveCloudData(); // 自動同步到雲端
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
    document.getElementById('edit-transit-map').value = '';
    document.getElementById('edit-sbb').value = '';
    document.getElementById('edit-webcam').value = '';
    document.getElementById('edit-weather').value = '';
    document.getElementById('edit-blogger').value = '';
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
    act.links.transit_map = document.getElementById('edit-transit-map').value;
    act.links.sbb = document.getElementById('edit-sbb').value;
    act.links.webcam = document.getElementById('edit-webcam').value;
    act.links.weather = document.getElementById('edit-weather').value;
    act.links.blogger = document.getElementById('edit-blogger').value;
    act.links.other = document.getElementById('edit-other').value;
    
    if(!act.links.website) delete act.links.website;
    if(!act.links.transit_map) delete act.links.transit_map;
    if(!act.links.sbb) delete act.links.sbb;
    if(!act.links.webcam) delete act.links.webcam;
    if(!act.links.weather) delete act.links.weather;
    if(!act.links.blogger) delete act.links.blogger;
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

// ================= 滑動聯動地圖功能 =================
let scrollObserver = null;

function setupScrollTracking() {
    if (scrollObserver) scrollObserver.disconnect();
    const container = document.getElementById('timeline-container');
    const options = { root: container, rootMargin: '-20% 0px -60% 0px', threshold: 0 };

    scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const lat = parseFloat(entry.target.getAttribute('data-lat'));
                const lng = parseFloat(entry.target.getAttribute('data-lng'));
                if (!isNaN(lat) && !isNaN(lng) && map) {
                    map.panTo({ lat: lat, lng: lng });
                    map.setZoom(15);
                }
            }
        });
    }, options);

    document.querySelectorAll('.scroll-track').forEach(el => scrollObserver.observe(el));
}

// ================= 天氣與攝影機整合功能 =================
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
                    locations.push({
                        name: act.activity,
                        lat: act.lat,
                        lng: act.lng,
                        webcam: act.links.webcam,
                        weatherLink: act.links.weather
                    });
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
        if (loc.webcam) {
            buttonsHtml += '<a href="' + loc.webcam + '" target="_blank" class="link-btn">📷 攝影機</a>';
        }
        if (loc.weatherLink) {
            buttonsHtml += '<a href="' + loc.weatherLink + '" target="_blank" class="link-btn">🌤️ 官方天氣</a>';
        }

        let liveWeatherHtml = '<div class="live-weather" style="color:#999;">無座標資料，無法讀取天氣</div>';
        if (loc.lat && loc.lng) {
            liveWeatherHtml = '<div class="live-weather" id="live-weather-' + idx + '">讀取即時天氣中...</div>';
        }

        html += '<div class="weather-card">';
        html += '  <div class="weather-header">';
        html += '    <div class="weather-title">' + loc.name + '</div>';
        html += '    <div class="weather-actions">' + buttonsHtml + '</div>';
        html += '  </div>';
        html += '  ' + liveWeatherHtml;
        html += '</div>';
    });
    html += '</div>';
    timelineContainer.innerHTML = html;

    locations.forEach(async (loc, idx) => {
        if (loc.lat && loc.lng) {
            try {
                const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + loc.lat + '&longitude=' + loc.lng + '&current=temperature_2m,weather_code&timezone=auto' );
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
