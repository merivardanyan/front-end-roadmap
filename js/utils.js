const STORAGE_KEY = 'progress';
const CACHE_NAME = 'lessons-v1';
async function fetchWithCache(url) {
    try {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(url);
        if (cached && cached.ok) return cached.json();
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        cache.put(url, response.clone());
        return response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str ?? '';
    return div.innerHTML;
}

async function getChapters() {
    try {
        let data = await fetch('json/chapters.json');
        if (!data.ok) {
            throw new Error(`HTTP error! status: ${data.status}`);
        }
        data = await data.json();
        if (Object.keys(data?.chapters || {}).length === 0){
            throw new Error('Invalid chapters data');
        }

        return data?.chapters;}
    catch (error) {
        console.error('Error fetching chapters data:', error);
    }

}



async function getChapterLessons(chapter) {
    if (!chapter) {
        return;
    }
    try {
        const data = await fetchWithCache(`json/lessons.json`);
        if (!data?.chapters?.[chapter]) {
            return;
        }
        return data.chapters[chapter];
    }
    catch (error) {
        console.error('Error fetching chapters data:', error);
        return;
    }

}

async function getLessons(){
    try {
        let data = await fetch('json/lessons.json');
        if (!data.ok) {
            throw new Error(`HTTP error! status: ${data.status}`);
        }
        data = await data.json();
        if (!data?.chapters) {
            throw new Error('Invalid chapters data', data);
        }
        return data;
        
    }
    catch (error) {
        console.error('Error fetching chapters data:', error);
    }
}