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

function loadProgress(chapters,progress) {
    if (!Object.values(progress).length) {
        progress.progress = 0;
        progress.totalChapters = Object.keys(chapters).length;
        progress.chapters = {};
        Object.entries(chapters).forEach(([key, value]) => {
            const lessons = (value?.lessons || []).reduce((obj, e) => {
                // (value?.lessons || []).forEach(e => {
                obj[e.id] = {
                    completedQuestions: [],
                    progress: 0,
                    totalQuestions: 0
                };
                return obj;
                // })
            }, {});
            progress.chapters[key] = {
                chapter: key,
                lessons,
                progress: 0,
                totalLessons: value?.lessons.length || 0
            };

        });
        localStorage.setItem('progress', JSON.stringify(progress));
    }
}


function saveProgress(progress) {
    localStorage.setItem('progress', JSON.stringify(progress));
}

function saveLastOpenedLesson(chapter, lesson) {
    localStorage.setItem('lastOpenedLesson',JSON.stringify({chapter,lesson}));
}

function getLastOpenedLesson() {
    try {
        return JSON.parse(
            localStorage.getItem(LAST_LESSON_KEY)
        );
    } catch {
        return null;
    }
}

function showProgress(progressElement, progress){
    console.log(progressElement);
    progressElement.querySelector(`.progress-bar .done`).style.width = `${progress.toFixed(2)}%`; 
    progressElement.querySelector('.progress-percent').textContent = `${progress.toFixed(2)}`; 
}