
async function getChapterLessons(chapter) {
    if (!chapter) {
        return;
    }
    try {
        const data = await fetchWithCache(`json/lessons.json`);
        if (!data?.chapters?.[chapter]) {
            return;
        }
        showChapters(data.chapters[chapter].lessons, chapter);
        return data.chapters[chapter];
    }
    catch (error) {
        console.error('Error fetching chapters data:', error);
        return;
    }

}
async function fetchWithCache(url) {
    try {
        const cache = await caches.open('lessons-v1');
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
function chapterNotFound() {
    // document.querySelector('.chapter-title').textContent = `Unknown Chapter`;
    document.querySelector('.chapter-list').textContent = 'Sorry, we couldn\'t find the chapter you\'re looking for. Please check the URL and try again.';
}

function showLesson(lesson) {
    const explanation_container = document.querySelector('.explanation_container');
    explanation_container.innerHTML = ``;
    (lesson?.sections || []).forEach(section => {
        const section_div = document.createElement('div');
        section_div.className = section.type;
        section_div.innerHTML = `
            <h3 class="text-xl font-bold mb-2">${escapeHtml(section?.title)}</h3>
            <p class="text-gray-700">${escapeHtml(section?.text)}</p>
        `;
        if (section.type === 'key-terms') {
            section_div.appendChild(lessonKeyTerms(section));
        }

        explanation_container.appendChild(section_div);
    });
    if ((lesson?.questions || []).length > 0) {
        lesson?.questions.forEach(question => {
            explanation_container.appendChild(lessonQuestions(question));

        })
    }
}
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str ?? '';
    return div.innerHTML;
}
function showChapters(arr, chapter) {
    const chapter_list = document.querySelector('.chapter-list');
    chapter_list.replaceChildren();
    const divfrag = document.createDocumentFragment();
    arr.forEach(lesson => {
        const li = document.createElement('li');
        li.className = 'font-bold';
        li.innerHTML = `
                        <div class="lesson-info flex items-center gap-2 my-2">
                            <input class="lesson-checkbox-input" type="checkbox" id="${escapeHtml(lesson?.slug)}"
                                name="${escapeHtml(lesson?.slug)}" />
                            <label for="${escapeHtml(lesson?.slug)}" class="checkbox">
                            </label>
                            <span class="lesson-title">${escapeHtml(lesson?.title)}</span>
                            <div class="lesson">Lesson ${escapeHtml(String(lesson?.order))}</div>
                        </div>  
                `;
        li.addEventListener('click', async () => {
            try {
                const data = await fetchWithCache(`json/lessons/${chapter}/${lesson?.id}.json`);
                showLesson(data);
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
    }
}

function lessonKeyTerms(section) {
    const terms = section?.terms || [];
    const terms_div = document.createElement('div');
    terms_div.className = 'terms';
    terms.forEach(term => {
        const term_div = document.createElement('div');
        term_div.className = 'term';
        term_div.innerHTML = `
                    <h4 class="text-lg font-bold">${escapeHtml(term?.word)}</h4>
                    <p class="text-gray-700">${escapeHtml(term?.definition)}</p>
                `;
        terms_div.appendChild(term_div);
    });
    return terms_div;
}

function lessonQuestions(question) {
    const questionDiv = document.createElement('div');
    const answers = (question?.options || []).map(e => `<div class="answer w-3/6">${escapeHtml(e)}</div>`).join('');
    questionDiv.className = 'question';

    questionDiv.innerHTML = `
        <h4 class="text-lg font-bold">${escapeHtml(question?.text)}</h4>
        <div class="grid grid-cols-2 gap-2 py-2 flex-wrap">
           ${answers}
        </div>
            <button class="btn">Show Answer</button>

        <p class="text-gray-700">${escapeHtml(question?.answer)}</p>
    `;
    questionDiv.querySelectorAll('.answer').forEach((answer, ind) => answer.addEventListener('click', () => {
        answer.classList.toggle('active');
        if (ind + 1 === question.answer) {
            answer.classList.add('correct');
        }
    }))
    return questionDiv;
}
function lessonExercises() { }
function lessonTopics() { }

init();