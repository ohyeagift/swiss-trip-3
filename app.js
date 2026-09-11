// 1. 行程資料 (您可以隨時在這裡新增/修改行程)
const travelData = {
    accommodations: {
        "Luzern": { name: "琉森Airbnb, Bruchstrasse 35b", lat: 47.0497810810647, lng: 8.300931992893938 },
        "Interlaken": { name: "因特拉肯Airbnb, Niesenstrasse 16", lat: 46.68289010140746, lng: 7.853981496756942 },
        "Zermatt": { name: "策馬特 Haus Gornera, Bachstrasse 90", lat: 46.01801255700013, lng: 7.745654656757409 },
        "Zurich": { name: "蘇黎世 Hotel City Zürich, Löwenstrasse 34", lat: 47.37502358530974, lng: 8.53643189805861 }
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
            day_id: "DAY 3", date: "10/18 (日)", route_title: "琉森 ➔ 因特拉肯", accommodation: "Interlaken",
            activities: [
                { time: "早上", activity: "Church", lat: 47.0501, lng: 8.3093 },
                { 
                    time: "上午", activity: "Rigi 瑞吉山 齒軌火車", altitude: "1,798m", lat: 47.0566, lng: 8.4846,
                    links: { website: "https://www.rigi.ch/" }
                },
                { time: "14:00", activity: "Airbnb 拎行李", lat: 47.0485, lng: 8.3000 },
                { time: "15:06", activity: "搭乘黃金列車前往 Interlaken West", lat: 46.6814, lng: 7.8513 },
                { time: "傍晚", activity: "酒店 Check-in", lat: 46.6830, lng: 7.8540 }
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
                { time: "下午", activity: "餐廳叫芝士火鍋 & 叫朱古力", lat: 46.6814, lng: 7.8513 }
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
            day_id: "DAY 7", date: "10/22 (四)", route_title: "伯恩 ➔ 施皮茨", accommodation: "Interlaken",
            activities: [
                { time: "上午", activity: "Bern 伯恩 (首都半日遊)", lat: 46.9480, lng: 7.4474 },
                { time: "下午", activity: "Spiez 施皮茨", lat: 46.6894, lng: 7.6800 },
                { 
                    time: "傍晚", activity: "Harder Kulm 哈德昆觀景台", altitude: "1,322m", lat: 46.6975, lng: 7.8647,
                    links: { website: "https://www.jungfrau.ch/en-gb/harder-kulm/" }
                }
            ]
        },
        {
            day_id: "DAY 8", date: "10/23 (五 )", route_title: "因特拉肯 ➔ 策馬特", accommodation: "Zermatt",
            activities: [
                { time: "07:00", activity: "寄2件行李去 Zurich", lat: 46.6814, lng: 7.8513 },
                { time: "08:04", activity: "Interlaken West to Zermatt", lat: 46.0207, lng: 7.7491 },
                { time: "下午", activity: "酒店 Check-in", lat: 46.0235, lng: 7.7490 },
                { time: "傍晚", activity: "Zermatt City Walk", lat: 46.0190, lng: 7.7460 }
            ]
        },
        {
            day_id: "DAY 9", date: "10/24 (六)", route_title: "策馬特 ➔ 冰川天堂", accommodation: "Zermatt",
            activities: [
                { time: "早上", activity: "Church", lat: 46.0190, lng: 7.7460 },
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
                { time: "早上", activity: "Church", lat: 46.0190, lng: 7.7460 },
                { time: "07:28", activity: "Zermatt to Zurich", lat: 47.3781, lng: 8.5401 },
                { time: "下午", activity: "蘇黎世 City Walk", lat: 47.3710, lng: 8.5410 }
            ]
        },
        {
            day_id: "DAY 11", date: "10/26 (一)", route_title: "蘇黎世 ➔ 香港", accommodation: "",
            activities: [
                { time: "早上", activity: "Zurich HB to Zurich Flughafen", lat: 47.4582, lng: 8.5555 },
                { time: "上午", activity: "準備去機場", lat: 47.4582, lng: 8.5555 },
                { time: "11:55", activity: "搭乘 CX382 航班返回香港", lat: 47.4582, lng: 8.5555 }
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
