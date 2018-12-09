//大屏主页
$(document).ready(function () {
    $('#diction').load('/ZHGIS/Contradiction/Disputes');
    $('#special').load('/ZHGIS/Special/Spepopulations');
    $('#Focus').load('/ZHGIS/KeyPersonnel/KeyPerson');
    $('#sum').load('/ZHGIS/Actual/Actpopulation');
    $('#minor').load('/ZHGIS/Minor/Children');
    $('#youth').load('/ZHGIS/KeyYouth/Focus');
    $('#TimeMap').load('/ZHGIS/Map/MapCenter');
    $('#centerleft').load("/ZHGIS/MiddleLeft/MiddLeft");
    $('#centerright').load("/ZHGIS/MiddleRight/MiddleRight");

})