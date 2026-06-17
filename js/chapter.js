


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

function showChapters(arr, chapter) {
    const chapter_list = document.querySelector('.chapter-list');
    chapter_list.replaceChildren();
    const divfrag = document.createDocumentFragment();
    (arr || []).forEach(lesson => {
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
    console.log(result);
    if (!result) {
        chapterNotFound();
        return;
    }
    showChapters(result?.lessons, chapter);

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
    `;
    const answersButtons = questionDiv.querySelectorAll('.answer');
    let answerLocked = false;
    answersButtons.forEach((answer, ind) => answer.addEventListener('click', () => {
        if (!answerLocked) {
            if (ind + 1 === question.answer) {
                answer.classList.add('correct');
            }
            else {
                answer.classList.add('incorrect');
                setTimeout(() => {
                    answerLocked = false;
                    answer.classList.remove('incorrect');

                }, 2000);
            }
            answerLocked = true;
        }


    }))
    return questionDiv;
}
function lessonExercises() { }

// check answer in question not finished
// progress saves on localstorage not finished
function saveProgress(){

}
function loadProgress(){
    
}
init();