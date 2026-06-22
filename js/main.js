const COLUMN_COUNT = 3;


function showChapters(chapters) {
    const colSize = Math.ceil(chapters.length / COLUMN_COUNT);
    const columns = document.querySelectorAll('.chapter-list');

    for (let i = 0; i < COLUMN_COUNT; i++) {
        createChapterColumnFragment(chapters, i, colSize, columns[i]);
    }


}
function createChapterColumnFragment(chapters, column, size, columnElement) {
    if (!columnElement) return;
    const start = column * size;
    const end = start + size;
    const divFragment = document.createDocumentFragment();
    for (let i = start; i < end && i < chapters.length; i++) {
        const chapter = chapters[i];
        const li = document.createElement('li');
        li.className = 'font-bold';
        li.innerHTML = `
                    <div class="lesson-info flex items-center justify-between gap-2 my-4">

                        <div class="flex gap-2">
                            <div class="chapter-progress chapter-${chapter.id}">
                            <div class="progress-bar">
                                <div class="done"></div>
                            </div>
                            <div class="hide progress-percent">0</div>
                        </div>
                        <a class="lesson-title" href="chapter.html?chapter=${escapeHtml(chapter.slug)}">${escapeHtml(chapter.title)}</a>
                        </div>
                        <div class="lesson justify-self-end">Chapter ${chapter.order}</div>
                    </div>
                   
            `;
        showProgress(li.querySelector(`.chapter-${chapter.id}`), progress?.chapters?.[chapter.id]?.progress ?? 0);
        divFragment.appendChild(li);
    }
    columnElement.appendChild(divFragment);

}
async function init() {
    const chapters = await getChapters();
    if (!chapters) return;
    showChapters(chapters);
    const chapterLessons = await getLessons();
    if (!chapterLessons) return;
    loadProgress(chapterLessons.chapters,progress);
    showProgress(document.querySelector(`.overall-progress`), progress?.progress ?? 0);
    const lastLesson = getLastOpenedLesson();

    if (lastLesson) {
        // show Continue Learning button
    }

}


init();