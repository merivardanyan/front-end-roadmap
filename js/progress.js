const progress = JSON.parse(window.localStorage.getItem('progress')) || {};

function loadProgress(chapters) {
    progress.progress = 0;
    progress.chapters = {};
    Object.entries(chapters).forEach(([key, value]) => {
        console.log(key, value.lessons);
        const lessons = (value?.lessons || []).reduce((obj, e) => (
            (value?.lessons || []).forEach(e => {
                lessons[e.id] = {
                    completedQuestions: [],
                    progress: 0,
                    totalQuestions: 0
                };
            })
        ), {});
        progress.chapters[key] = {
            chapter: key,
            lessons,
            progress: 0,
            pending: 0
        };

    });
    console.log(progress);
    localStorage.setItem('progress', JSON.stringify(progress));
}

function loadChapterProgress(chapter) {
    progress.chapters[chapter].pending = Object.values(progress.chapters[chapter].lessons).filter(e => e.progress === 0).length
}

function saveProgress() {
    localStorage.setItem('progress', JSON.stringify(progress));
}
function updateLessonProgress(lesson, question) {

    if (lesson.completedQuestions.indexOf(question) > -1) return false;
    lesson.completedQuestions.push(question);
    lesson.progress = lesson.completedQuestions.length
    return true
}
function updateChapterProgress(chapter, lesson) {
    const chapterProgress = Object.values(progress.chapters[chapter]?.lessons).reduce((obj, e) => {
        obj.progress += e.progress;
        obj.totalQuestions += e.totalQuestions;
        return obj
    }, { progress: 0, totalQuestions: 0 });
    progress.chapters[chapter].progress = chapterProgress.progress / chapterProgress.totalQuestions * 100;
    saveProgress()
}
function updateOverallProgress() {
    const overallProgress = Object.values(progress.chapters).reduce((obj, e) => {
        obj.progress += e.progress;
        obj.pending += e.pending;
        return obj
    }, { progress: 0, pending: 0 });
    progress.progress = overallProgress.progress / overallProgress.pending;
    saveProgress()
}

function completeQuestion(chapter, lesson, question){
    const chapterPercentage = 100 / Object.values(chapters).length;

    updateLessonProgress(chapter, lesson, question);
    updateChapterProgress(chapter, lesson);
    updateOverallProgress();
}

// the progress saving logic is not completed