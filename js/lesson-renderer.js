function lessonSummary(summary) {
    const points = summary || [];
    if (!points.length) return null;

    const box = document.createElement('div');
    box.className = 'summary-box';

    const heading = document.createElement('h3');
    heading.className = 'text-xl font-bold mb-2';
    heading.textContent = 'Quick Summary';
    box.appendChild(heading);

    const ul = document.createElement('ul');
    ul.className = 'summary-list';
    points.forEach(point => {
        const li = document.createElement('li');
        li.textContent = point;
        ul.appendChild(li);
    });
    box.appendChild(ul);
    return box;
}

function lessonMedia(media) {
    if (!media) return null;

    const wrap = document.createElement('div');
    wrap.className = `media media-${media.type || 'image'}`;

    if (media.src) {
        const img = document.createElement('img');
        img.src = media.src;
        img.alt = media.alt || '';
        img.loading = 'lazy';
        wrap.appendChild(img);
    } else {
        wrap.classList.add('media-placeholder');
        const label = document.createElement('span');
        label.textContent = media.alt || `${media.type || 'image'} coming soon`;
        wrap.appendChild(label);
    }
    return wrap;
}

function lessonSteps(section) {
    const ol = document.createElement('ol');
    ol.className = 'steps-list';
    (section?.items || []).forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ol.appendChild(li);
    });
    return ol;
}

function lessonKeyTerms(section) {
    const wrap = document.createElement('div');
    wrap.className = 'terms';
    (section?.terms || []).forEach(term => {
        const termDiv = document.createElement('div');
        termDiv.className = 'term';

        const word = document.createElement('h4');
        word.className = 'text-lg font-bold word';
        word.textContent = term?.word ?? '';
        word.innerHTML += `<img src="images/hint.svg" alt="hint" class="hint-icon">`;

        const def = document.createElement('span');
        def.className = 'text-gray-700 hint';
        def.textContent = term?.definition ?? '';

        word.appendChild(def);
        termDiv.appendChild(word);
        wrap.appendChild(termDiv);
    });
    return wrap;
}

function lessonSection(section) {
    const div = document.createElement('div');
    div.className = section.type;

    if (section.title) {
        const h3 = document.createElement('h3');
        h3.className = 'text-xl font-bold mb-2';
        h3.textContent = section.title;
        div.appendChild(h3);
    }

    if (section.text) {
        const p = document.createElement('p');
        p.className = 'text-gray-700';
        p.textContent = section.text;
        div.appendChild(p);
    }

    if (section.type === 'steps') {
        div.appendChild(lessonSteps(section));
    }

    if (section.type === 'key-terms') {
        div.appendChild(lessonKeyTerms(section));
    }

    const media = lessonMedia(section.media);
    if (media) div.appendChild(media);

    return div;
}

function showLesson(lesson) {
    const container = document.querySelector('.explanation_container');
    container.replaceChildren();

    const summary = lessonSummary(lesson?.summary);
    if (summary) container.appendChild(summary);

    (lesson?.sections || []).forEach(section => {
        container.appendChild(lessonSection(section));
    });

    (lesson?.questions || []).forEach(question => {
        container.appendChild(lessonQuestions(question, lesson?.chapterId, lesson?.id));
    });
}

function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function lessonQuestions(question, chapter, lesson) {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';

    const baseOptions = (question?.options || []).map((text, index) => ({ text, index }));

    const heading = document.createElement('h4');
    heading.className = 'text-lg font-bold';
    heading.textContent = question?.text ?? '';
    questionDiv.appendChild(heading);

    const optionsWrap = document.createElement('div');
    optionsWrap.className = 'grid grid-cols-2 gap-2 py-2 flex-wrap';
    questionDiv.appendChild(optionsWrap);

    const explanationEl = document.createElement('p');
    explanationEl.className = 'explanation hide text-gray-700 mt-2';
    explanationEl.textContent = question?.explanation ?? '';
    questionDiv.appendChild(explanationEl);

    let solved = false;

    function render() {
        optionsWrap.replaceChildren();
        shuffle(baseOptions).forEach(opt => {
            const el = document.createElement('div');
            el.className = 'answer w-3/6';
            el.textContent = opt.text;
            el.addEventListener('click', () => {
                if (solved) return;
                if (opt.index === question.answer) {
                    solved = true;
                    el.classList.add('correct');
                    explanationEl.classList.remove('hide');
                    completeQuestion(chapter, lesson, question.id);
                    showProgress(document.querySelector('.chapter-progress'), progress?.chapters?.[chapter]?.progress ?? 0);
                    showProgress(document.querySelector(`.lesson-${lesson}`), progress?.chapters?.[chapter]?.lessons?.[lesson]?.progress ?? 0);
                } else {
                    el.classList.add('incorrect');
                    setTimeout(render, 1000);
                }
            });
            optionsWrap.appendChild(el);
        });
    }

    render();
    return questionDiv;
}
