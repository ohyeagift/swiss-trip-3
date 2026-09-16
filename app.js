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
        loadDay(currentDayIndex); // 重新載入畫面
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

// 6. 載入特定天數的資料
async function loadDay(index) {
    currentDayIndex = index;
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
        if (acc.website ) accLinksHtml += `<a href="${acc.website}" target="_blank" class="link-btn">🌐 官網</a>
