


function chapterNotFound() {
    document.querySelector('.chapter-list').textContent = 'Sorry, we couldn\'t find the chapter you\'re looking for. Please check the URL and try again.';
}

function showChapters(arr, chapter, chapterTitle) {
    const chapter_list = document.querySelector('.chapter-list');
    chapter_list.replaceChildren();
    const divfrag = document.createDocumentFragment();
    document.querySelector('.chapter-title').textContent = chapterTitle;
    const chapterHtmlEl = document.querySelector(`.chapter-progress`);
    showProgress(chapterHtmlEl, progress?.chapters?.[chapter]?.progress ?? 0);
    (arr || []).forEach(lesson => {
        const li = document.createElement('li');
        li.className = 'font-bold';
        li.innerHTML = `
                        <div class="lesson-info flex items-center gap-2 my-2">
                            <div class="lesson-progress lesson-${lesson?.id}">
                                <div class="progress-bar">
                                    <div class="done"></div>
                                </div>
                                <div class="hide progress-percent"></div>
                            </div>
                            <span class="lesson-title">${escapeHtml(lesson?.title)}</span>
                            <div class="lesson">Lesson ${escapeHtml(String(lesson?.order))}</div>
                        </div>  
                `;
        showProgress(li.querySelector(`.lesson-${lesson?.id}`), progress?.chapters?.[chapter]?.lessons?.[lesson?.id]?.progress ?? 0);
        li.addEventListener('click', async () => {
            try {
                const data = await fetchWithCache(`json/lessons/${chapter}/${lesson?.id}.json`);
                saveLastOpenedLesson(chapter, lesson?.id);
                showLesson(data);
                initializeLesson(chapter, lesson?.id, data)

            } catch (error) {
                chapterNotFound();
                console.error('Error fetching lesson data:', error);
            }
        })

        divfrag.appendChild(li);

    })
    chapter_list.appendChild(divfrag);

}

async function init() {
    const chapter = new URLSearchParams(window.location.search).get('chapter') || '';
    const result = await getChapterLessons(chapter);
    if (!result) {
        chapterNotFound();
        return;
    }
    showChapters(result?.lessons, chapter, result?.title);

}

init();