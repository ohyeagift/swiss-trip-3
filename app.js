// 1. 原始行程資料
const travelData = {
    accommodations: {
        "Luzern": { name: "琉森 Bruchstrasse 35b", query: "Bruchstrasse 35b, Luzern", lat: 47.0485, lng: 8.3000 },
        "Interlaken": { name: "因特拉肯 Niesenstrasse 16", query: "Niesenstrasse 16, 3800 Interlaken", lat: 46.6830, lng: 7.8540 },
        "Zermatt": { name: "策馬特 Bachstrasse 90", query: "Bachstrasse 90, 3920 Zermatt", lat: 46.0235, lng: 7.7490 },
        "Zurich": { name: "Hotel City Zürich", query: "Hotel City Zürich, Löwenstrasse 34", lat: 47.3755, lng: 8.5375 }
    },
    daily_itinerary: [
        {
            day_id: "DAY 1", date: "10/16 (五)", route_title: "蘇黎世 ➔ 琉森", accommodation: "Luzern",
            activities: [
                { time: "07:30", activity: "抵達蘇黎世機場", query: "Zurich Airport", lat: 47.4582, lng: 8.5555 },
                { time: "上午", activity: "搭乘火車 Zurich HB to Luzern", query: "Zurich HB", lat: 47.3781, lng: 8.5401 },
                { 
                    time: "下午", activity: "Pilatus 皮拉圖斯峰", altitude: "2,128m", lat: 46.9795, lng: 8.2555,
                    links: { website: "https://www.pilatus.ch/", webcam: "https://www.pilatus.ch/en/discover/pilatus-live", weather: "https://www.meteoswiss.admin.ch/local-forecasts/pilatus/6010.html" }
                },
                { time: "傍晚", activity: "Luzern City Walk 琉森市區漫步", query: "Luzern", lat: 47.0501, lng: 8.3093 }
            ]
        },
        {
            day_id: "DAY 2", date: "10/17 (六 )", route_title: "琉森 ➔ 鐵力士峰", accommodation: "Luzern",
            activities: [
                { time: "09:10", activity: "Luzern to Engelberg", query: "Luzern Bahnhof", lat: 46.8200, lng: 8.4020 },
                { 
                    time: "上午", activity: "Titlis 鐵力士峰", altitude: "3,238m", lat: 46.7720, lng: 8.4260,
                    links: { website: "https://www.titlis.ch/" }
                }
            ]
        },
        {
            day_id: "DAY 3", date: "10/18 (日 )", route_title: "琉森 ➔ 因特拉肯", accommodation: "Interlaken",
            activities: [
                { time: "早上", activity: "Church", query: "Church, Luzern", lat: 47.0501, lng: 8.3093 },
                { 
                    time: "上午", activity: "Rigi 瑞吉山 齒軌火車", altitude: "1,798m", lat: 47.0566, lng: 8.4846,
                    links: { website: "https://www.rigi.ch/" }
                },
                { time: "14:00", activity: "Airbnb 拎行李", query: "Bruchstrasse 35b, Luzern", lat: 47.0485, lng: 8.3000 },
                { time: "15:06", activity: "搭乘黃金列車前往 Interlaken West", query: "Interlaken West", lat: 46.6814, lng: 7.8513 },
                { time: "傍晚", activity: "酒店 Check-in", query: "Niesenstrasse 16, 3800 Interlaken", lat: 46.6830, lng: 7.8540 }
            ]
        },
        {
            day_id: "DAY 4", date: "10/19 (一 )", route_title: "因特拉肯 ➔ 少女峰", accommodation: "Interlaken",
            activities: [
                { time: "上午", activity: "Eismeer (中途參觀)", altitude: "3,160m", lat: 46.5619, lng: 8.0053 },
                { 
                    time: "中午", activity: "Jungfraujoch 少女峰", altitude: "3,454m", lat: 46.5475, lng: 7.9826,
                    links: { website: "https://www.jungfrau.ch/", webcam: "https://www.jungfrau.ch/en-gb/live/webcams/" }
                },
                { time: "下午", activity: "餐廳叫芝士火鍋 & 叫朱古力", query: "Interlaken", lat: 46.6814, lng: 7.8513 }
            ]
        },
        {
            day_id: "DAY 5", date: "10/20 (二 )", route_title: "因特拉肯 ➔ First", accommodation: "Interlaken",
            activities: [
                { 
                    time: "全日", activity: "First (Grindelwald First)", altitude: "2,168m", lat: 46.6606, lng: 8.0535,
                    links: { website: "https://www.jungfrau.ch/en-gb/grindelwaldfirst/" }
                }
            ]
        },
        {
            day_id: "DAY 6", date: "10/21 (三 )", route_title: "因特拉肯 ➔ 雪朗峰", accommodation: "Interlaken",
            activities: [
                { time: "上午", activity: "Lauterbrunnen 盧達本納", lat: 46.5985, lng: 7.9080 },
                { time: "中午", activity: "Mürren 米倫", altitude: "1,638m", lat: 46.5594, lng: 7.8925 },
                { 
                    time: "下午", activity: "Schilthorn 雪朗峰", altitude: "2,970m", lat: 46.5568, lng: 7.8348,
                    links: { website: "https://schilthorn.ch/", webcam: "https://schilthorn.ch/en/Infos/Live", weather: "https://www.meteoswiss.admin.ch/local-forecasts/schilthorn/3825.html" }
                }
            ]
        },
        {
            day_id: "DAY 7", date: "10/22 (四 )", route_title: "伯恩 ➔ 施皮茨", accommodation: "Interlaken",
            activities: [
                { time: "上午", activity: "Bern 伯恩 (首都半日遊)", query: "Bern", lat: 46.9480, lng: 7.4474 },
                { time: "下午", activity: "Spiez 施皮茨", query: "Spiez", lat: 46.6894, lng: 7.6800 },
                { 
                    time: "傍晚", activity: "Harder Kulm 哈德昆觀景台", altitude: "1,322m", lat: 46.6975, lng: 7.8647,
                    links: { website: "https://www.jungfrau.ch/en-gb/harder-kulm/" }
                }
            ]
        },
        {
            day_id: "DAY 8", date: "10/23 (五 )", route_title: "因特拉肯 ➔ 策馬特", accommodation: "Zermatt",
            activities: [
                { time: "07:00", activity: "寄2件行李去 Zurich", query: "Interlaken West", lat: 46.6814, lng: 7.8513 },
                { time: "08:04", activity: "Interlaken West to Zermatt", query: "Zermatt Bahnhof", lat: 46.0207, lng: 7.7491 },
                { time: "下午", activity: "酒店 Check-in", query: "Bachstrasse 90, 3920 Zermatt", lat: 46.0235, lng: 7.7490 },
                { time: "傍晚", activity: "Zermatt City Walk", query: "Zermatt", lat: 46.0190, lng: 7.7460 }
            ]
        },
        {
            day_id: "DAY 9", date: "10/24 (六)", route_title: "策馬特 ➔ 冰川天堂", accommodation: "Zermatt",
            activities: [
                { time: "早上", activity: "Church", query: "Church, Zermatt", lat: 46.0190, lng: 7.7460 },
                { 
                    time: "上午", activity: "Gornergrat 觀景台", altitude: "3,089m", lat: 45.9838, lng: 7.7854,
                    links: { website: "https://www.gornergrat.ch/" }
                },
                { time: "中午", activity: "Riffelsee 利菲爾湖 (看馬特洪峰倒影 )", altitude: "2,757m", lat: 45.9822, lng: 7.7619 },
                { 
                    time: "下午", activity: "Matterhorn Glacier Paradise 冰川天堂", altitude: "3,883m", lat: 45.9383, lng: 7.7300,
                    links: { website: "https://www.matterhornparadise.ch/" }
                }
            ]
        },
        {
            day_id: "DAY 10", date: "10/25 (日 )", route_title: "策馬特 ➔ 蘇黎世", accommodation: "Zurich",
            activities: [
                { time: "早上", activity: "Church", query: "Church, Zurich", lat: 46.0190, lng: 7.7460 },
                { time: "07:28", activity: "Zermatt to Zurich", query: "Zurich HB", lat: 47.3781, lng: 8.5401 },
                { time: "下午", activity: "蘇黎世 City Walk", query: "Zurich", lat: 47.3710, lng: 8.5410 }
            ]
        },
        {
            day_id: "DAY 11", date: "10/26 (一)", route_title: "蘇黎世 ➔ 香港", accommodation: "",
            activities: [
                { time: "早上", activity: "Zurich HB to Zurich Flughafen", query: "Zurich Airport", lat: 47.4582, lng: 8.5555 },
                { time: "上午", activity: "準備去機場", query: "Zurich Airport", lat: 47.4582, lng: 8.5555 },
                { time: "11:55", activity: "搭乘 CX382 航班返回香港", query: "Zurich Airport", lat: 47.4582, lng: 8.5555 }
            ]
        }
    ]
};

// 2. 全局變數與資料初始化
let currentData = JSON.parse(localStorage.getItem('swissTravelData')) || travelData;
let map;
let markers = [];
let currentDayIndex = 0;
let editingActivityIndex = null;

// 3. 初始化 Google Maps
async function initMap() {
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

// 4. 渲染導航 Tabs
function renderTabs() {
    const tabsContainer = document.getElementById('tabs-container');
    tabsContainer.innerHTML = '';

    currentData.daily_itinerary.forEach((day, index) => {
        const btn = document.createElement('button');
        btn.className = `tab-btn ${index === 0 ? 'active' : ''}`;
        btn.innerText = day.day_id;
        btn.onclick = () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadDay(index);
        };
        tabsContainer.appendChild(btn);
    });
}

// 5. 載入特定天數的資料 (更新時間軸與地圖)
async function loadDay(index) {
    currentDayIndex = index;
    const dayData = currentData.daily_itinerary[index];
    
    document.getElementById('day-title').innerText = `${dayData.day_id} · ${dayData.date} | ${dayData.route_title}`;

    const timelineContainer = document.getElementById('timeline-container');
    timelineContainer.innerHTML = '';

    dayData.activities.forEach((act, i) => {
        const searchQuery = encodeURIComponent(act.query || act.activity);
        let linksHtml = `<a href="https://www.google.com/maps/search/?api=1&query=${searchQuery}" target="_blank" class="link-btn">📍 地圖</a>`;
        
        if (act.links ) {
            if (act.links.website) linksHtml += `<a href="${act.links.website}" target="_blank" class="link-btn">🌐 官網</a>`;
            if (act.links.webcam) linksHtml += `<a href="${act.links.webcam}" target="_blank" class="link-btn">📷 攝影機</a>`;
            if (act.links.weather) linksHtml += `<a href="${act.links.weather}" target="_blank" class="link-btn">🌤️ 天氣</a>`;
        }

        const itemHtml = `
            <div class="timeline-item">
                <div class="time">${act.time}</div>
                <div class="marker-icon">${i + 1}</div>
                <div class="content">
                    <div class="activity-name">${act.activity}</div>
                    ${act.altitude ? `<div class="altitude">${act.altitude}</div>` : ''}
                    <div class="links">${linksHtml}</div>
                </div>
            </div>
        `;
        timelineContainer.innerHTML += itemHtml;
    });

    if (dayData.accommodation && currentData.accommodations[dayData.accommodation]) {
        const acc = currentData.accommodations[dayData.accommodation];
        const accSearchQuery = encodeURIComponent(acc.query || acc.name);
        
        timelineContainer.innerHTML += `
            <div class="accommodation-card">
                <div class="acc-icon">🏠</div>
                <div>
                    <div class="acc-title">今晚住宿</div>
                    <div class="acc-name">${acc.name}</div>
                    <div class="links">
                        <a href="https://www.google.com/maps/search/?api=1&query=${accSearchQuery}" target="_blank" class="link-btn">📍 地圖</a>
                    </div>
                </div>
            </div>
        `;
    }

    updateMapMarkers(dayData );
}

// 6. 更新地圖標記
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
                map: map,
                position: { lat: act.lat, lng: act.lng },
                content: markerDiv,
                title: act.activity
            });
            markers.push(marker);
            bounds.extend({ lat: act.lat, lng: act.lng });
        }
    });

    if (dayData.accommodation && currentData.accommodations[dayData.accommodation]) {
        const acc = currentData.accommodations[dayData.accommodation];
        const accDiv = document.createElement('div');
        accDiv.className = 'custom-map-marker hotel';
        accDiv.innerText = '🏠';

        const accMarker = new AdvancedMarkerElement({
            map: map,
            position: { lat: acc.lat, lng: acc.lng },
            content: accDiv,
            title: acc.name
        });
        markers.push(accMarker);
        bounds.extend({ lat: acc.lat, lng: acc.lng });
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

// 1. 打開該日的行程列表
function openListModal() {
    const dayData = currentData.daily_itinerary[currentDayIndex];
    document.getElementById('modal-day-title').innerText = `編輯 ${dayData.day_id} 行程`;
    
    const container = document.getElementById('edit-list-container');
    container.innerHTML = '';
    
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

function closeListModal() {
    document.getElementById('list-modal').classList.remove('active');
}

// 2. 刪除行程
function deleteActivity(index) {
    if(confirm('確定要刪除這個行程嗎？')) {
        currentData.daily_itinerary[currentDayIndex].activities.splice(index, 1);
        localStorage.setItem('swissTravelData', JSON.stringify(currentData));
        openListModal(); // 刷新列表
        loadDay(currentDayIndex); // 刷新背景主畫面
    }
}

// 3. 打開「新增」表單 (清空欄位)
function openNewFormModal() {
    editingActivityIndex = null; // null 代表這是新增的行程
    
    document.getElementById('edit-time').value = '';
    document.getElementById('edit-name').value = '';
    document.getElementById('edit-content').value = '';
    document.getElementById('edit-map').value = '';
    document.getElementById('edit-website').value = '';
    document.getElementById('edit-webcam').value = '';
    document.getElementById('edit-weather').value = '';
    
    document.getElementById('form-modal').classList.add('active');
}

// 4. 打開「編輯」表單 (填入現有資料)
function openFormModal(activityIndex) {
    editingActivityIndex = activityIndex;
    const act = currentData.daily_itinerary[currentDayIndex].activities[activityIndex];
    
    document.getElementById('edit-time').value = act.time || '';
    document.getElementById('edit-name').value = act.activity || '';
    document.getElementById('edit-content').value = act.altitude || '';
    document.getElementById('edit-map').value = act.query || act.activity || '';
    
    document.getElementById('edit-website').value = (act.links && act.links.website) ? act.links.website : '';
    document.getElementById('edit-webcam').value = (act.links && act.links.webcam) ? act.links.webcam : '';
    document.getElementById('edit-weather').value = (act.links && act.links.weather) ? act.links.weather : '';
    
    document.getElementById('form-modal').classList.add('active');
}

function closeFormModal() {
    document.getElementById('form-modal').classList.remove('active');
}

// 5. 智慧時間排序邏輯
function sortActivities(activities) {
    const getTimeValue = (t) => {
        if (!t) return 9999; // 沒有時間排最後
        if (t.includes(':')) {
            const [h, m] = t.split(':');
            return parseInt(h) * 60 + parseInt(m); // 轉換為分鐘數
        }
        // 處理中文時間描述
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

// 6. 儲存編輯/新增內容
function saveActivity() {
    const activities = currentData.daily_itinerary[currentDayIndex].activities;
    let act;
    
    if (editingActivityIndex === null) {
        // 新增模式
        act = {};
        activities.push(act);
    } else {
        // 編輯模式
        act = activities[editingActivityIndex];
    }
    
    act.time = document.getElementById('edit-time').value;
    act.activity = document.getElementById('edit-name').value;
    act.altitude = document.getElementById('edit-content').value;
    act.query = document.getElementById('edit-map').value;
    
    if (!act.links) act.links = {};
    act.links.website = document.getElementById('edit-website').value;
    act.links.webcam = document.getElementById('edit-webcam').value;
    act.links.weather = document.getElementById('edit-weather').value;
    
    // 清理空連結
    if(!act.links.website) delete act.links.website;
    if(!act.links.webcam) delete act.links.webcam;
    if(!act.links.weather) delete act.links.weather;
    if(Object.keys(act.links).length === 0) delete act.links;
    
    // 執行自動排序
    sortActivities(activities);
    
    // 儲存並刷新
    localStorage.setItem('swissTravelData', JSON.stringify(currentData));
    closeFormModal();
    openListModal();
    loadDay(currentDayIndex);
}
