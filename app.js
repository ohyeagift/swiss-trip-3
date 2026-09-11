// 1. 行程資料 (您可以隨時在這裡新增/修改行程)
const travelData = {
    accommodations: {
        "Luzern": { name: "琉森 Bruchstrasse 35b", lat: 47.0485, lng: 8.3000 },
        "Interlaken": { name: "因特拉肯 Niesenstrasse 16", lat: 46.6830, lng: 7.8540 },
        "Zermatt": { name: "策馬特 Bachstrasse 90", lat: 46.0235, lng: 7.7490 },
        "Zurich": { name: "蘇黎世 Löwenstrasse 34", lat: 47.3755, lng: 8.5375 }
    },
    daily_itinerary: [
        {
            day_id: "DAY 1", date: "10/16 (五)", route_title: "蘇黎世 ➔ 琉森", accommodation: "Luzern",
            activities: [
                { time: "07:30", activity: "抵達蘇黎世機場", lat: 47.4582, lng: 8.5555 },
                { time: "上午", activity: "搭乘火車 Zurich HB to Luzern", lat: 47.3781, lng: 8.5401 },
                { 
                    time: "下午", activity: "Pilatus 皮拉圖斯峰", altitude: "2,128m", lat: 46.9795, lng: 8.2555,
                    links: { website: "https://www.pilatus.ch/", webcam: "https://www.pilatus.ch/en/discover/pilatus-live", weather: "https://www.meteoswiss.admin.ch/local-forecasts/pilatus/6010.html" }
                },
                { time: "傍晚", activity: "Luzern City Walk 琉森市區漫步", lat: 47.0501, lng: 8.3093 }
            ]
        },
        {
            day_id: "DAY 2", date: "10/17 (六 )", route_title: "琉森 ➔ 鐵力士峰", accommodation: "Luzern",
            activities: [
                { time: "09:10", activity: "Luzern to Engelberg", lat: 46.8200, lng: 8.4020 },
                { 
                    time: "上午", activity: "Titlis 鐵力士峰", altitude: "3,238m", lat: 46.7720, lng: 8.4260,
                    links: { website: "https://www.titlis.ch/" }
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
        }
        // 您可以繼續依照這個格式補齊其他天數的資料...
    ]
};

// 2. 全局變數
let map;
let markers = [];
let currentDayIndex = 0;

// 3. 初始化 Google Maps (由 HTML 中的 callback 觸發 )
async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    
    map = new Map(document.getElementById("map"), {
        zoom: 8,
        center: { lat: 46.8182, lng: 8.2275 }, // 瑞士中心點
        mapId: "DEMO_MAP_ID", // 使用 AdvancedMarkerElement 需要 mapId
        disableDefaultUI: true, // 隱藏預設 UI 讓手機版更乾淨
        zoomControl: true
    });

    renderTabs();
    loadDay(0);
}

// 4. 渲染導航 Tabs
function renderTabs() {
    const tabsContainer = document.getElementById('tabs-container');
    tabsContainer.innerHTML = '';

    travelData.daily_itinerary.forEach((day, index) => {
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
    const dayData = travelData.daily_itinerary[index];
    
    // 更新頂部標題
    document.getElementById('day-title').innerText = `${dayData.day_id} · ${dayData.date} | ${dayData.route_title}`;

    // 更新時間軸
    const timelineContainer = document.getElementById('timeline-container');
    timelineContainer.innerHTML = '';

    dayData.activities.forEach((act, i) => {
        // 已修改：將 dir (導航) 改為 search (單純顯示地圖位置)，並將文字改為「地圖」
        let linksHtml = `<a href="https://www.google.com/maps/search/?api=1&query=${act.lat},${act.lng}" target="_blank" class="link-btn">📍 地圖</a>`;
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
                    ${act.altitude ? `<div class="altitude">海拔 ${act.altitude}</div>` : ''}
                    <div class="links">${linksHtml}</div>
                </div>
            </div>
        `;
        timelineContainer.innerHTML += itemHtml;
    });

    // 加入住宿卡片
    if (dayData.accommodation && travelData.accommodations[dayData.accommodation]) {
        const acc = travelData.accommodations[dayData.accommodation];
        // 已修改：在住宿卡片中加入地圖按鈕，並微調對齊方式
        timelineContainer.innerHTML += `
            <div class="accommodation-card" style="align-items: flex-start;">
                <div class="acc-icon" style="margin-top: 2px;">🏠</div>
                <div>
                    <div class="acc-title">今晚住宿</div>
                    <div class="acc-name">${acc.name}</div>
                    <div class="links">
                        <a href="https://www.google.com/maps/search/?api=1&query=${acc.lat},${acc.lng}" target="_blank" class="link-btn">📍 地圖</a>
                    </div>
                </div>
            </div>
        `;
    }

    // 更新地圖標記
    updateMapMarkers(dayData );
}

// 6. 更新地圖標記
async function updateMapMarkers(dayData) {
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    // 清除舊標記
    markers.forEach(m => m.map = null);
    markers = [];

    const bounds = new google.maps.LatLngBounds();

    // 加入行程標記 (紅色數字)
    dayData.activities.forEach((act, i) => {
        if (act.lat && act.lng) {
            const markerDiv = document.createElement('div');
            markerDiv.className = 'custom-map-marker';
            markerDiv.innerText = i + 1; // 顯示順序數字

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

    // 加入住宿標記 (綠色房屋)
    if (dayData.accommodation && travelData.accommodations[dayData.accommodation]) {
        const acc = travelData.accommodations[dayData.accommodation];
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

    // 自動縮放地圖以顯示所有標記
    if (!bounds.isEmpty()) {
        map.fitBounds(bounds);
        // 避免單一標記時縮放過大
        const listener = google.maps.event.addListener(map, "idle", function() { 
            if (map.getZoom() > 14) map.setZoom(14); 
            google.maps.event.removeListener(listener); 
        });
    }
}
