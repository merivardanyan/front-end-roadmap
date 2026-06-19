
let progress = {};
try {
    progress = JSON.parse(localStorage.getItem('progress')) || {};
} catch {
    progress = {};
}
function loadProgress(chapters) {
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


function saveProgress() {
    localStorage.setItem('progress', JSON.stringify(progress));
}
function updateLessonProgress(lesson, question) {
   
    if(lesson.completedQuestions?.includes(question))
        return false;

    lesson.completedQuestions.push(question); 

    
    lesson.progress =
        (lesson.completedQuestions.length /
        lesson.totalQuestions) * 100;

    return true;
}
function updateChapterProgress(chapter) {
    if (!chapter.totalLessons) {
        chapter.progress = 0;
        return;
    }
    const chapterLessons = Object.values(chapter?.lessons) || [];
    chapter.progress = (chapterLessons.reduce((s, e) => s + e.progress, 0) / chapter.totalLessons);
}
function updateOverallProgress() {
    if (!progress.totalChapters) {
        progress.progress = 0;
        return;
    }
    const chapters = (Object.values(progress?.chapters)) || [];
    progress.progress = ((chapters.reduce((s, e) => s + e.progress, 0)) / (progress.totalChapters * 100));
}

function completeQuestion(questionCount = 0, chapter = 'core-web-foundations', lesson = 'how-the-web-works', questionID = "q3") {

    const chapterInStorage = progress.chapters?.[chapter];
    const lessonInStorage = chapterInStorage?.lessons?.[lesson];
    if (!lessonInStorage) return;

   
    if (!updateLessonProgress(lessonInStorage, questionID)) return;
    updateChapterProgress(chapterInStorage)
    updateOverallProgress()
    saveProgress()
}

function initializeLesson(chapterSlug,lessonSlug, lessonData){
    const lessonInStorage = progress.chapters?.[chapterSlug]?.lessons?.[lessonSlug];
     if (!lessonInStorage?.totalQuestions && lessonData.questions?.length > 0) {
        lessonInStorage.totalQuestions = lessonData.questions.length
    }
    saveProgress()
}
