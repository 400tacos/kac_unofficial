const ROWS_PER_PAGE = 50;
var page = 0;
var highlight = -1;

var MASTER_STANDINGS = KAC_STANDINGS;
var FREE_STANDINGS = [];
var WOMEN_STANDINGS = [];

var dataToRender = FREE_STANDINGS;
var renderedRegion = 0;

var sortedBySong = 0;

var viewMode = 0;

var MAX_SCORES;

// qualifier value constants

let FINALIST = 1;

function decompressData(data) {

    for (var i = 0; i < data.length; i++) {

        var row = data[i];
        row.dancer_name = row.name;
        row.qual_region = row.region;
//        row.qual_value = row.c;
        row.song1_score = row.score0;
        row.song2_score = row.score1;
        row.song3_score = row.score2;
        row.song4_score = row.score3;
        row.song5_score = row.score4;
        row.song6_score = row.score5;
        row.song7_score = row.score6;
        row.song8_score = row.score7;
        row.song9_score = row.score8;
        row.song10_score = row.score9;
        row.song11_score = row.score10;
        row.song12_score = row.score11;
        row.song13_score = row.score12;
        row.song14_score = row.score13;
        row.song15_score = row.score14;
        row.total_score = 0;
        for (var j = 1; j <= 15; j++) {
            row.total_score += row['song'+j+'_score'];
        }
        delete row.a;
        delete row.b;
//        delete row.c;
        delete row.d;
        delete row.e;
        delete row.f;
        delete row.g;
        delete row.h;
        delete row.i;
        delete row.j;
        delete row.k;
        delete row.l;
        delete row.m;
        delete row.n;
        delete row.o;
        delete row.p;
        delete row.q;
        delete row.r;
    }

}

function bucketMasterData() {

    // empty regional arrays

    FREE_STANDINGS = [];
    WOMEN_STANDINGS = [];

    for (var i = 0; i < MASTER_STANDINGS.length; i++) {

        var row = MASTER_STANDINGS[i];
        let region = row.qual_region;
        switch (region) {
            case 1:
                FREE_STANDINGS.push(row);
                break;
            case 2:
                WOMEN_STANDINGS.push(row);
                break;
        }
    }
    onFirstSort = false;
}

function renderStandingsTable() {

    let fragment = document.createDocumentFragment();

    var maxTotal = 0;
    for (var i = 0; i < MAX_SCORES.length; i++) { maxTotal += MAX_SCORES[i]; }

    let table = $('#tbl-standings');

    for (var i = 0; i < ROWS_PER_PAGE; i++) {
        
        if (page*ROWS_PER_PAGE + i >= dataToRender.length) {
            break;
        }

        let standing = dataToRender[page*ROWS_PER_PAGE + i];
        var totalScore = standing.total_score;

        let tr = document.createElement('tr');
        tr.id = 'highlight-' + (page*ROWS_PER_PAGE + i);
        tr.className = 'tr-standings';

        tr.appendChild( td('td-standing', page*ROWS_PER_PAGE + i + 1));
        tr.appendChild( playerTd('td-name', standing.dancer_name, standing.qual_region, standing.qual_value));
        tr.appendChild( scoreTd('td-total-score', totalScore, maxTotal, 0));
        
        for (var j = 0; j < 15; j++) {
            tr.appendChild( scoreTd('td-group' + Math.floor(j/8+1) + '-score', standing['song'+(j+1)+'_score'], MAX_SCORES[j], j+1));
        }

        fragment.append(tr);
    }

    $('#tbl-standings .tr-standings').remove();
    table.append(fragment);

}

function td(className, text) {

    let td = document.createElement('td');
    td.className = className;
    td.innerHTML = text;
    return td;
}

function scoreTd(baseClassName, pScore, maxScore, songIdx) {

    let td = document.createElement('td');
    var auxClassName = '';
    if (sortedBySong != 0 && songIdx != sortedBySong) {
        auxClassName = ' unsorted';
    }
    td.className = baseClassName + auxClassName;
    
    if (maxScore) {

        let lDiv = document.createElement('div');
        lDiv.className = 'div-left-score';
        lDiv.innerHTML = commaizeScore(pScore || 0);
        if (viewMode == 1) $(lDiv).hide();

        let rDiv = document.createElement('div');
        rDiv.className = 'div-right-score';
        rDiv.innerHTML = '(' + commaizeScore(parseInt((pScore || 0)) - parseInt(maxScore)) + ')';
        if (viewMode == 1) $(rDiv).show();

        td.appendChild(lDiv);
        td.appendChild(rDiv);

    } else {

        let lDiv = document.createElement('div');
        lDiv.className = 'div-no-score';
        lDiv.innerHTML = '-';

        td.appendChild(lDiv);

    }

    return td;
}

function playerTd(className, dancerName, region, qualType) {

    let td = document.createElement('td');
    td.className = className + ' ' + 'region-' + region + '-bg';

    var profileLink = profileLinks[dancerName];

    let lDiv = document.createElement('div');
    lDiv.className = 'div-left-name';
    if (profileLink) {
        lDiv.innerHTML = '<a href="/profile/' + profileLink + '"> ' + dancerName + '</a>';
    } else {
        lDiv.innerHTML = dancerName;
    }

    let rDiv = document.createElement('div');
    rDiv.className = 'div-right-region';
//    rDiv.innerHTML = region % 5 == 0 ? 'NA' : region % 5 == 1 ? 'JPE' : region % 5 == 2 ? 'JPW' : region % 5 == 3 ? 'AS' : region % 5 == 4 ? 'KR' : '?';
    if (qualType == FINALIST) {
        rDiv.innerHTML += '\u2B50';
    }

    td.appendChild(lDiv);
    td.appendChild(rDiv);

    return td;
}

function gotoPage(nextPage) {

    page = nextPage;
    $('.btn-page-item').removeClass('selected');
    $('#btn-page-' + nextPage).addClass('selected');
    renderStandingsTable();

    if (highlight > -1) {
        let jumpRow = document.getElementById('highlight-'+highlight);
        if (jumpRow) {
            setTimeout(function() {     // terrible hack to work around swal focus bug, please don't judge me
                jumpRow.scrollIntoView();
                jumpRow.classList.add('highlight');
            }, 100);
        }
    }
}

function renderPageNav() {
    
    let pageNav = $('#div-page-nav');
    pageNav.empty();
    for (var i = 0; i < dataToRender.length/ROWS_PER_PAGE; i++) {
        
        let pageItem = document.createElement('button');

        pageItem.className = 'btn-page-item';
        pageItem.id = 'btn-page-' + i;
        pageItem.setAttribute('onclick', 'gotoPage(' + i + ');');
        pageItem.innerHTML = (i+1);

        pageNav.append(pageItem);
    }

        let pageItem = document.createElement('button');

        pageItem.className = 'btn-page-item';
        pageItem.id = 'btn-page-search';
        pageItem.setAttribute('onclick', 'searchPlayer();');

        let searchIcon = document.createElement('img');
        searchIcon.className = 'img-search-btn';
        searchIcon.src = '/img/search.png';
        pageItem.appendChild(searchIcon);

        pageNav.append(pageItem);

}

function searchPlayer() {
    
    swal.fire({
        title: xpstr.SEARCH_PLAYER_TITLE,
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: xpstr.SEARCH,
        cancelButtonText: xpstr.CANCEL,
        showLoaderOnConfirm: true,
        preConfirm: (inputName) => {

            var jumpIdx = -1;
            let uppercaseInputName = inputName.toUpperCase();

            for (var i = 0; i < dataToRender.length; i++) {
                if (dataToRender[i].dancer_name === uppercaseInputName) {
                    jumpIdx = i;
                    break;
                }
            }

            return {jumpIdx : jumpIdx, searchName : inputName};
        },
        allowOutsideClick: () => !swal.isLoading(),
        animation: false,

    }).then((result) => {

        let jumpIdx = result.value.jumpIdx;
        let searchName = result.value.searchName;

        if (jumpIdx > -1) {
            this.highlight = jumpIdx;
            this.gotoPage(Math.floor(jumpIdx/ROWS_PER_PAGE));
            this.highlight = -1;
        } else {
            swal.fire({
                title: xpstr.PLAYER_NOT_FOUND_MSG_name.replace('{name}', encodeURI(searchName))
            })
        }
    });
}

function switchTable(regionId) {

    $('.div-filter').removeClass('selected-filter');

    if (regionId == 1) {
        dataToRender = FREE_STANDINGS;
    } else if (regionId == 2) {
        dataToRender = WOMEN_STANDINGS;
    }

    renderedRegion = regionId;
    renderPageNav();
    $('#filter-region-' + regionId).addClass('selected-filter');

    // calculate max scores

    MAX_SCORES = [];
    var songs = dataToRender == WOMEN_STANDINGS ? KAC_SONGS_CATEGORY_2 :
        KAC_SONGS;
    for (var i = 0; i < songs.length; i++) {
        var song = songs[i];
        MAX_SCORES[i] = (song.notes + song.holds) * 3;
        
        $('#img-banner-'+(i+1)).attr('src', './img/banners/' + song.song_id + '.jpg');
        $('#img-banner-'+(i+1)).parent().attr('href', 'https://3icecream.com/ddr/song_details/' + song.song_id);
    }

    // switch jackets
}

function toggleScoreMode() {

    showLoadingDialog();

    setTimeout(function() {

        $('.td-group1-score, .td-group2-score, .td-total-score').each(function(idx, element) {
            let l = $(this).find('.div-left-score');
            let r = $(this).find('.div-right-score');
            if (l.is(":visible")) {
                l.hide();
                r.show();
                $('#div-toggle-score-mode').text(xpstr.USE_SCORE_VIEW_MODE);
                viewMode = 1;
                document.cookie = 'viewmode=delta;';
            } else {
                l.show();
                r.hide();
                $('#div-toggle-score-mode').text(xpstr.USE_DELTA_VIEW_MODE);
                viewMode = 0;
                document.cookie = 'viewmode=abs;';
            }
        });

        hideLoadingDialog();

    }, 200);
}

function sortMasterDataBySongScore(songNum) {
    
    if (songNum <= 0 || songNum > KAC_SONGS.length || songNum == sortedBySong) {

        songNum = 0;
        MASTER_STANDINGS = KAC_STANDINGS;

    } else {


        let scoreKey = 'song' + songNum + '_score';
        MASTER_STANDINGS = [];

        for (var i = 0; i < KAC_STANDINGS.length; i++) {

            let row = KAC_STANDINGS[i];
            let insScore = row[scoreKey]
        
            if (i == 0) {

                MASTER_STANDINGS.push(row);

            } else {

                for (var j = 0; j < i+1; j++) {
                
                    if (j == i) {
                        MASTER_STANDINGS.push(row);
                        break;
                    }

                    if (insScore > MASTER_STANDINGS[j][scoreKey]) {
                        MASTER_STANDINGS.splice(j, 0, row);
                        break;
                    }

                }
            }
        }

    }

    sortedBySong = songNum;

    bucketMasterData();
    switchTable(renderedRegion);
    gotoPage(0);
}
