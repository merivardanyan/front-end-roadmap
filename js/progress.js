
let progress = {};
try {
    progress = JSON.parse(localStorage.getItem('progress')) || {};
} catch {
    progress = {};
}
function updateLessonProgress(lesson, question) {
   
    if(lesson.completedQuestions?.includes(question))
        return false;

    lesson.completedQuestions.push(question); 

    if (!lesson.totalQuestions) return false;
    
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

function completeQuestion(chapter , lesson, questionID) {

    const chapterInStorage = progress.chapters?.[chapter];
    const lessonInStorage = chapterInStorage?.lessons?.[lesson];
    if (!lessonInStorage) return;

   
    if (!updateLessonProgress(lessonInStorage, questionID)) return;
    updateChapterProgress(chapterInStorage)
    updateOverallProgress()
    saveProgress(progress);
}

function initializeLesson(chapterSlug,lessonSlug, lessonData){
    const lessonInStorage = progress.chapters?.[chapterSlug]?.lessons?.[lessonSlug];
    if (!lessonInStorage) return;
    if (!lessonInStorage?.totalQuestions && lessonData.questions?.length > 0) {
        lessonInStorage.totalQuestions = lessonData.questions.length
        console.log(lessonInStorage);
    }
    saveProgress(progress)
}
