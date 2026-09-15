// 1. 原始行程資料
const travelData = {
    "accommodations": {
        "Luzern": {
            "name": "琉森Airbnb",
            "query": "Bruchstrasse 35b, Luzern",
            "lat": 47.0485,
            "lng": 8.3
        },
        "Interlaken": {
            "name": "因特拉肯Airbnb",
            "query": "Niesenstrasse 16, 3800 Interlaken",
            "lat": 46.683,
            "lng": 7.854
        },
        "Zermatt": {
            "name": "策馬特民宿 Haus Gornera",
            "query": "Haus Gornera",
            "lat": 46.0179695,
            "lng": 7.745554
        },
        "Zurich": {
            "name": "蘇黎世酒店 Hotel City Zürich",
            "query": "Hotel City Zürich, Löwenstrasse 34",
            "lat": 47.3748796,
            "lng": 8.5338401
        }
    },
    "daily_itinerary": [
        {
            "day_id": "DAY 1",
            "date": "10/16 (五)",
            "route_title": "蘇黎世 ➔ 琉森",
            "accommodation": "Luzern",
            "activities": [
                {
                    "time": "00:25",
                    "activity": "香港國際機場 HKG",
                    "altitude": "CX383\n飛行時間: 13小時05分",
                    "query": ""
                },
                {
                    "time": "07:30",
                    "activity": "蘇黎世機場 ZRH",
                    "query": "Zürich Flughafen",
                    "lat": 47.4500016,
                    "lng": 8.5625424,
                    "altitude": "跟著Train Station標誌走\n穿越一條馬路, 通往火車站的建築\n搭乘手扶梯往下-->Bahn Train\n月台區分為 A、B、C與D, 搵二等艙\n檢票時出示STP+護照\n\n乘搭火車 Zürich Flughafen to Luzern\n1hr10mins",
                    "links": {
                        "other": "https://goldmichellehhh.com/zurich-airport-to-city-train-transport/"
                    }
                },
                {
                    "time": "08:15-09:25",
                    "activity": "琉森火車站 Luzern",
                    "altitude": "",
                    "query": "琉森火車站",
                    "lat": 47.04948718040626,
                    "lng": 8.310375808635806
                },
                {
                    "time": "09:45",
                    "activity": "琉森巴士站 ",
                    "altitude": "1 ) 坐Bus 10 3個站 (8mins)\n    Lucerne Train Station -> Zähringerstrasse\n2) 坐Bus 2 5個站 / Bus 12 4個站 (10mins)\n    Lucerne Train Station -> Hirzenhof\n3) 步行12-15分鐘",
                    "query": "Torbogen Luzern",
                    "lat": 47.0507691,
                    "lng": 8.3102221,
                    "links": {
                        "other": "https://www.vbl.ch/fileadmin/01_vblAG/00_News_Aktuelles/2026_News_Aktuelles/Situationsplan_BHF_DMP.pdf"
                    }
                },
                {
                    "time": "10:00-10:30",
                    "activity": "琉森Airbnb",
                    "altitude": "放低行李\n1 ) 坐Bus 1/ Bus 5 3個站 (9mins)\n    Pilatusplatz -> Kriens, Zentrum Pilatus",
                    "query": "Bruchstrasse 35b",
                    "links": {
                        "other": "https://www.wendyjourney.com/pilatus/"
                    }
                },
                {
                    "time": "11:00",
                    "activity": "纜車站 Kriens ",
                    "altitude": "08:30-17:45\n成人來回 CHF 42 (STP )\n三段路線 兩種纜車 \n1hr",
                    "query": "Kriens 纜車",
                    "lat": 47.0303936,
                    "lng": 8.2779327,
                    "links": {
                        "other": "https://www.wendyjourney.com/pilatus/",
                        "website": "https://pilatus.ch/en/railway-cableways/timetable"
                    }
                },
                {
                    "time": "12:00-14:30",
                    "activity": "皮拉圖斯峰 Pilatus (2,128m )",
                    "altitude": "午餐 + 山上健行",
                    "lat": 46.9795,
                    "lng": 8.2555,
                    "links": {
                        "website": "https://pilatus.ch/en/map",
                        "webcam": "https://pilatus.ch/en/live#c21147",
                        "weather": "https://pilatus.ch/en/live#c21149"
                    },
                    "query": "Pilatus 皮拉圖斯峰"
                },
                {
                    "time": "15:00-16:00",
                    "activity": "纜車站 Fräkmüntegg",
                    "altitude": "滑梯 10:00-16:00\n成人 CHF 9",
                    "query": "X7R2+8G 克林斯 瑞士",
                    "lat": 46.989327,
                    "lng": 8.24956041779,
                    "links": {
                        "website": "https://www.rodelbahn.ch/en/"
                    }
                },
                {
                    "time": "17:00",
                    "activity": "琉森Airbnb",
                    "altitude": "1 ) Kriens附近有1間 Lidl Schweiz超市\n2) Airbnb附近有4-5間超市\n3) 時間早可以睇埋卡貝爾橋, 耶穌會教堂\n\n坐Bus 5 10個站 (11mins)\nKriens, Zentrum Pilatus -> Hirzenhof",
                    "query": ""
                }
            ]
        },
        {
            "day_id": "DAY 2",
            "date": "10/17 (六 )",
            "route_title": "琉森 ➔ 鐵力士峰",
            "accommodation": "Luzern",
            "activities": [
                {
                    "time": "09:10",
                    "activity": "Luzern to Engelberg",
                    "query": "Luzern Bahnhof",
                    "lat": 46.82,
                    "lng": 8.402
                },
                {
                    "time": "上午",
                    "activity": "Titlis 鐵力士峰",
                    "altitude": "3,238m",
                    "lat": 46.772,
                    "lng": 8.426,
                    "links": {
                        "website": "https://www.titlis.ch/"
                    }
                }
            ]
        },
        {
            "day_id": "DAY 3",
            "date": "10/18 (日  )",
            "route_title": "琉森 ➔ 因特拉肯",
            "accommodation": "Interlaken",
            "activities": [
                {
                    "time": "早上",
                    "activity": "Church",
                    "query": "Church, Luzern",
                    "lat": 47.0501,
                    "lng": 8.3093
                },
                {
                    "time": "上午",
                    "activity": "Rigi 瑞吉山 齒軌火車",
                    "altitude": "1,798m",
                    "lat": 47.0566,
                    "lng": 8.4846,
                    "links": {
                        "website": "https://www.rigi.ch/"
                    }
                },
                {
                    "time": "14:00",
                    "activity": "Airbnb 拎行李",
                    "query": "Bruchstrasse 35b, Luzern",
                    "lat": 47.0485,
                    "lng": 8.3
                },
                {
                    "time": "15:06",
                    "activity": "搭乘黃金列車前往 Interlaken West",
                    "query": "Interlaken West",
                    "lat": 46.6814,
                    "lng": 7.8513
                },
                {
                    "time": "傍晚",
                    "activity": "酒店 Check-in",
                    "query": "Niesenstrasse 16, 3800 Interlaken",
                    "lat": 46.683,
                    "lng": 7.854
                }
            ]
        },
        {
            "day_id": "DAY 4",
            "date": "10/19 (一  )",
            "route_title": "因特拉肯 ➔ 少女峰",
            "accommodation": "Interlaken",
            "activities": [
                {
                    "time": "上午",
                    "activity": "Eismeer (中途參觀)",
                    "altitude": "3,160m",
                    "lat": 46.5619,
                    "lng": 8.0053
                },
                {
                    "time": "中午",
                    "activity": "Jungfraujoch 少女峰",
                    "altitude": "3,454m",
                    "lat": 46.5475,
                    "lng": 7.9826,
                    "links": {
                        "website": "https://www.jungfrau.ch/",
                        "webcam": "https://www.jungfrau.ch/en-gb/live/webcams/"
                    }
                },
                {
                    "time": "下午",
                    "activity": "餐廳叫芝士火鍋 & 叫朱古力",
                    "query": "Interlaken",
                    "lat": 46.6814,
                    "lng": 7.8513
                }
            ]
        },
        {
            "day_id": "DAY 5",
            "date": "10/20 (二  )",
            "route_title": "因特拉肯 ➔ First",
            "accommodation": "Interlaken",
            "activities": [
                {
                    "time": "全日",
                    "activity": "First (Grindelwald First)",
                    "altitude": "2,168m",
                    "lat": 46.6606,
                    "lng": 8.0535,
                    "links": {
                        "website": "https://www.jungfrau.ch/en-gb/grindelwaldfirst/"
                    }
                }
            ]
        },
        {
            "day_id": "DAY 6",
            "date": "10/21 (三  )",
            "route_title": "因特拉肯 ➔ 雪朗峰",
            "accommodation": "Interlaken",
            "activities": [
                {
                    "time": "上午",
                    "activity": "Lauterbrunnen 盧達本納",
                    "lat": 46.5985,
                    "lng": 7.908
                },
                {
                    "time": "中午",
                    "activity": "Mürren 米倫",
                    "altitude": "1,638m",
                    "lat": 46.5594,
                    "lng": 7.8925
                },
                {
                    "time": "下午",
                    "activity": "Schilthorn 雪朗峰",
                    "altitude": "2,970m",
                    "lat": 46.5568,
                    "lng": 7.8348,
                    "links": {
                        "website": "https://schilthorn.ch/",
                        "webcam": "https://schilthorn.ch/en/Infos/Live",
                        "weather": "https://www.meteoswiss.admin.ch/local-forecasts/schilthorn/3825.html"
                    }
                }
            ]
        },
        {
            "day_id": "DAY 7",
            "date": "10/22 (四  )",
            "route_title": "伯恩 ➔ 施皮茨",
            "accommodation": "Interlaken",
            "activities": [
                {
                    "time": "上午",
                    "activity": "Bern 伯恩 (首都半日遊)",
                    "query": "Bern",
                    "lat": 46.948,
                    "lng": 7.4474
                },
                {
                    "time": "下午",
                    "activity": "Spiez 施皮茨",
                    "query": "Spiez",
                    "lat": 46.6894,
                    "lng": 7.68
                },
                {
                    "time": "傍晚",
                    "activity": "Harder Kulm 哈德昆觀景台",
                    "altitude": "1,322m",
                    "lat": 46.6975,
                    "lng": 7.8647,
                    "links": {
                        "website": "https://www.jungfrau.ch/en-gb/harder-kulm/"
                    }
                }
            ]
        },
        {
            "day_id": "DAY 8",
            "date": "10/23 (五  )",
            "route_title": "因特拉肯 ➔ 策馬特",
            "accommodation": "Zermatt",
            "activities": [
                {
                    "time": "07:00",
                    "activity": "寄2件行李去 Zurich",
                    "query": "Interlaken West",
                    "lat": 46.6814,
                    "lng": 7.8513
                },
                {
                    "time": "08:04",
                    "activity": "Interlaken West to Zermatt",
                    "query": "Zermatt Bahnhof",
                    "lat": 46.0207,
                    "lng": 7.7491
                },
                {
                    "time": "下午",
                    "activity": "酒店 Check-in",
                    "query": "Bachstrasse 90, 3920 Zermatt",
                    "lat": 46.0235,
                    "lng": 7.749
                },
                {
                    "time": "傍晚",
                    "activity": "Zermatt City Walk",
                    "query": "Zermatt",
                    "lat": 46.019,
                    "lng": 7.746
                }
            ]
        },
        {
            "day_id": "DAY 9",
            "date": "10/24 (六)",
            "route_title": "策馬特 ➔ 冰川天堂",
            "accommodation": "Zermatt",
            "activities": [
                {
                    "time": "早上",
                    "activity": "Church",
                    "query": "Church, Zermatt",
                    "lat": 46.019,
                    "lng": 7.746
                },
                {
                    "time": "上午",
                    "activity": "Gornergrat 觀景台",
                    "altitude": "3,089m",
                    "lat": 45.9838,
                    "lng": 7.7854,
                    "links": {
                        "website": "https://www.gornergrat.ch/"
                    }
                },
                {
                    "time": "中午",
                    "activity": "Riffelsee 利菲爾湖 (看馬特洪峰倒影  )",
                    "altitude": "2,757m",
                    "lat": 45.9822,
                    "lng": 7.7619
                },
                {
                    "time": "下午",
                    "activity": "Matterhorn Glacier Paradise 冰川天堂",
                    "altitude": "3,883m",
                    "lat": 45.9383,
                    "lng": 7.73,
                    "links": {
                        "website": "https://www.matterhornparadise.ch/"
                    }
                }
            ]
        },
        {
            "day_id": "DAY 10",
            "date": "10/25 (日  )",
            "route_title": "策馬特 ➔ 蘇黎世",
            "accommodation": "Zurich",
            "activities": [
                {
                    "time": "早上",
                    "activity": "Church",
                    "query": "Church, Zurich",
                    "lat": 46.019,
                    "lng": 7.746
                },
                {
                    "time": "07:28",
                    "activity": "Zermatt to Zurich",
                    "query": "Zurich HB",
                    "lat": 47.3781,
                    "lng": 8.5401
                },
                {
                    "time": "下午",
                    "activity": "蘇黎世 City Walk",
                    "query": "Zurich",
                    "lat": 47.371,
                    "lng": 8.541
                }
            ]
        },
        {
            "day_id": "DAY 11",
            "date": "10/26 (一)",
            "route_title": "蘇黎世 ➔ 香港",
            "accommodation": "",
            "activities": [
                {
                    "time": "早上",
                    "activity": "Zurich HB to Zurich Flughafen",
                    "query": "Zurich Airport",
                    "lat": 47.4582,
                    "lng": 8.5555
                },
                {
                    "time": "上午",
                    "activity": "準備去機場",
                    "query": "Zurich Airport",
                    "lat": 47.4582,
                    "lng": 8.5555
                },
                {
                    "time": "11:55",
                    "activity": "搭乘 CX382 航班返回香港",
                    "query": "Zurich Airport",
                    "lat": 47.4582,
                    "lng": 8.5555
                }
            ]
        }
    ]
};

// 2. 全局變數與資料初始化 (使用 _v3 徹底清除舊暫存)
let currentData = JSON.parse(localStorage.getItem('swissTravelData_v3')) || travelData;
let map;
let markers = [];
let currentDayIndex = 0;
let editingActivityIndex = null;
let editingAccKey = null; // 記錄正在編輯的住宿
let isAuthenticated = false; // 密碼驗證狀態

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

    // --- 1. 先加入住宿卡片 (置頂) ---
    if (dayData.accommodation && currentData.accommodations[dayData.accommodation]) {
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
                <div class="acc-right">
                    ${accLinksHtml}
                </div>
            </div>
        `;
    }

    // --- 2. 再加入每日行程 ---
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

        // 【防錯設計】把換行處理獨立拿出來寫，絕對不會再報錯！
        let altitudeHtml = '';
        if (act.altitude) {
            const formattedText = act.altitude.replace(/\n/g, '<br>');
            altitudeHtml = `<div class="altitude">${formattedText}</div>`;
        }

        const itemHtml = `
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
        timelineContainer.innerHTML += itemHtml;
    });

    updateMapMarkers(dayData);
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
        if (acc.lat && acc.lng) {
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
    }

    if (!bounds.isEmpty()) {
        map.fitBounds(bounds);
        const listener = google.maps.event.addListener(map, "idle", function() { 
            if (map.getZoom() > 14) map.setZoom(14); 
            google.maps.event.removeListener(listener); 
        });
    }
}

// ================= 編輯與匯出功能邏輯 =================

// 0. 密碼驗證
function checkPasswordAndOpen() {
    if (isAuthenticated) {
        openListModal();
        return;
    }
    const pwd = prompt("請輸入編輯密碼：");
    if (pwd === "0902") {
        isAuthenticated = true;
        openListModal();
    } else if (pwd !== null) {
        alert("密碼錯誤，無法編輯！");
    }
}

// 1. 打開該日的行程列表
function openListModal() {
    const dayData = currentData.daily_itinerary[currentDayIndex];
    document.getElementById('modal-day-title').innerText = `編輯 ${dayData.day_id} 行程`;
    
    const container = document.getElementById('edit-list-container');
    container.innerHTML = '';

    // 加入編輯住宿的按鈕 (置頂)
    if (dayData.accommodation && currentData.accommodations[dayData.accommodation]) {
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

function closeListModal() {
    document.getElementById('list-modal').classList.remove('active');
}

// 2. 刪除行程
function deleteActivity(index) {
    if(confirm('確定要刪除這個行程嗎？')) {
        currentData.daily_itinerary[currentDayIndex].activities.splice(index, 1);
        localStorage.setItem('swissTravelData_v3', JSON.stringify(currentData));
        openListModal();
        loadDay(currentDayIndex);
    }
}

// 3. 打開「新增」表單
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

// 4. 打開「編輯」表單
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

function closeFormModal() {
    document.getElementById('form-modal').classList.remove('active');
}

// 5. 智慧時間排序邏輯
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

// 6. 儲存編輯/新增內容
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
    localStorage.setItem('swissTravelData_v3', JSON.stringify(currentData));
    closeFormModal();
    openListModal();
    loadDay(currentDayIndex);
}

// --- 新增：編輯住宿相關邏輯 ---
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

function closeAccFormModal() {
    document.getElementById('acc-form-modal').classList.remove('active');
}

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
    
    localStorage.setItem('swissTravelData_v3', JSON.stringify(currentData));
    closeAccFormModal();
    openListModal();
    loadDay(currentDayIndex);
}

// 7. 匯出資料 (複製到剪貼簿)
function exportData() {
    const dataStr = JSON.stringify(currentData, null, 4);
    
    fetch('app.js')
        .then(response => response.text())
        .then(text => {
            const regex = /const travelData = \{[\s\S]*?\n\};\n\n\/\/ 2\. 全局變數/;
            const newCode = text.replace(regex, `const travelData = ${dataStr};\n\n// 2. 全局變數`);
            
            const tempInput = document.createElement("textarea");
            tempInput.value = newCode;
            document.body.appendChild(tempInput);
            tempInput.select();
            
            try {
                document.execCommand("copy");
                alert("✅ 完整的 app.js 程式碼已複製！\n\n請到 GitHub 打開 app.js，全選並貼上即可同步給朋友。");
            } catch (err) {
                alert("複製失敗，請手動複製。");
            }
            
            document.body.removeChild(tempInput);
        })
        .catch(err => {
            alert("無法讀取原始檔案，請確認網頁環境。");
        });
}
