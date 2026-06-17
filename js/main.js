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
                    <div class="lesson-info flex items-center gap-2">

                        <input class="lesson-checkbox-input" type="checkbox" id="${escapeHtml(chapter.slug)}"
                            name="${escapeHtml(chapter.slug)}" />
                        <label for="${escapeHtml(chapter.slug)}" class="checkbox">
                        </label>
                        <a class="lesson-title" href="chapter.html?chapter=${escapeHtml(chapter.slug)}">${escapeHtml(chapter.title)}</a>
                        <div class="lesson">Chapter ${chapter.order}</div>
                    </div>
                    <div class="flex justify-center py-2">
                    <svg class="w-6 h-6">
                        <use href="#arrow-down"></use>
                    </svg>
                </div>
            `;
        divFragment.appendChild(li);
    }
    columnElement.appendChild(divFragment);

}
async function init(){
    const chapters = await getChapters();
    if(!chapters) return;
    showChapters(chapters);
    const chapterLessons = await getLessons();
    console.log(chapterLessons)
    loadProgress(chapterLessons.chapters);
}
init();