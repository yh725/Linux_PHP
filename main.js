// 최초 화면 프론트엔드 생성 JS 소스 - 프로토 타입 방식
function bbs(dataURL, bbsIdName, bbsLimit, pageLimit, pageIdName, btnActiveClassName, isDesc) {

	this.dataURL = dataURL;			// 데이터 URL
	this.bbsIdName = bbsIdName;		// 게시판 영역 아이디명
	this.bbsLimit = bbsLimit;		// 한 화면에 보여줄 게시글 수
	this.pageLimit = pageLimit;		// 한 화면에 보여줄 페이징 개수
	this.pageIdName = pageIdName;	// 페이지 영역 아이디명
	this.btnActiveClassName = btnActiveClassName; // 버튼을 클릭했을때 첨가해줄 클래스명
	this.isDesc = isDesc;			// 번호순 정렬 - Defalut : 내림차순
	this.postCount;					// 총 게시글 수
	this.maxPage;					// 마지막 페이지
	this.currPage = 1;				// 현재 페이지
	this.blockNum = 0;				// 현재 블럭번호
};

// 데이터 불러와서 초기화(Json 통신). 비동기 처리 콜백이용.
bbs.prototype.getBbs = function(pageNum, callback) {
		
		var xhr = new XMLHttpRequest();
		xhr.open('POST', this.dataURL, 'true');	// 전송방식(GET, POST), 주소, true = 비동기 방식 / false = 동기방식
		//xhr.responseType = 'json';				// 데이터 포맷 json / blob - IE 사용 불가능
		xhr.send();

		var bbsLimit = this.bbsLimit;			// 페이지 게시글 수
		var isDesc = this.isDesc;				// 정렬

		// 로드
		xhr.onload = function () {
			//var contents = xhr.response.contents;
			var json = JSON.parse(xhr.responseText);
			var contents = json.contents;
			var postCount = contents.length;		// 게시글 총 개수
			var maxPage = Math.ceil(postCount / bbsLimit);	// 페이지 최대 개수 : 게시글 총 개수 / 게시글 수

			var start = (pageNum - 1) * bbsLimit;		// slice 제외 개수 : (현재 페이지 - 1 ) * 게시글 수

			let bbsArr;		// 게시글 데이터 담을 배열

			// 페이지에 따라 데이터 자르기
			// 내림차순
			if(isDesc == "DESC") {
				if(pageNum === maxPage) {
					// slice 0 부터 (게시글 총 개수 - 제외 개수)
					bbsArr = contents.slice(0, postCount - start).reverse() 
				}else {
					// slice (게시글 총 개수 - 페이지 게시글 수 - 제외 개수) 부터 (게시글 총 개수 - 제외 개수) 까지
					bbsArr = contents.slice(postCount - bbsLimit - start, postCount - start).reverse() 
				}
			// 오름차순
			}else {
				if(pageNum === maxPage) {
					// slice 제외 개수 부터 게시글 총 개수 까지
					bbsArr = contents.slice(start, postCount);
				}else {
					// slice 제외 개수 부터 제외 개수 + 페이지 게시글 수 까지
					bbsArr = contents.slice(start, start + Number(bbsLimit));
				}
			}

			// 콜백
			callback({
				postCount : postCount, maxPage : maxPage, bbsArr : bbsArr	// 게시글 총 개수, 페이지 최대 개수, 데이터 배열
			});
		}
}

// 게시판 구현
bbs.prototype.printBbs = function(e){
	var theadStr = "<thead><tr><th width=\"10%\">게시물 번호</th><th>제목</th><th width=\"20%\">작성자</th><th width=\"15%\">작성일</th></tr></thead>";
	let tbodyStr = "<tbody>";

	for (let i = 0; i < e.bbsArr.length; i++) {
		tbodyStr += "<tr><td>"+e.bbsArr[i].no+"</td><td id=\"tdAlign\"><a href='bbs_data.php?no="+e.bbsArr[i].no+"'>"+e.bbsArr[i].title+"</a></td><td>"+e.bbsArr[i].name+"</td><td>"+e.bbsArr[i].i_time+"</td></tr>";
	}
	
	tbodyStr += "</tbody>";
	document.getElementById('bbs1').innerHTML = (theadStr + tbodyStr);
}

// 페이징 구현
bbs.prototype.printPage = function(){
	
	var pageLimit = this.pageLimit;		// 페이징 제한 개수
	var blockNum = this.blockNum;		// 현재 블럭번호
	var maxPage = this.maxPage;			// 마지막 페이지
	var pageId = this.pageIdName;		// 페이지 영역 아이디명

	var pstart = Number(pageLimit * blockNum) + Number(1);	// 페이지 시작 Num: (제한 개수 * 현재 블럭) + 1

	let pcount;	// 페이지 마지막

	// ((페이지 제한 개수 * 현재 블럭) + 페이지 제한 개수) > 마지막 페이지
	if ((Number(pageLimit * blockNum) + Number(pageLimit)) > maxPage) {
		pcount = maxPage;
	}else {
		pcount = Number(pageLimit * blockNum) + Number(pageLimit);
	}

	let str = "<font><br/><input type=\"button\" value = \"글 작성\" onclick=\"bssInsert()\"><br/><br/>";
		
	str += "총 게시글 수 : " + this.postCount +"<br/><br/>";

	
	str += "<button class ='fristBtn prev' id= '" + pageId + 'fristBtn' + "'>처음</button>";

	str += "<button class ='pageBtn prev' id= '" + pageId + 'prevBtn' + "'>이전</button>";


	for (let i = pstart; i <= pcount; i++) {
		str += "<button class = 'pageBtn " + pageId + "' id =" + pageId + i +">" + i + "</button>";
	}

	str += "<button class ='pageBtn next' id= '" + pageId + 'nextBtn' + "'>다음</button>";

	str += "<button class ='lastBtn next' id= '" + pageId + 'lastBtn' + "'>마지막</button>";

	document.getElementById(pageId).innerHTML = str;

	// this 사용 변수
	var that = this;

	// 다음
	document.getElementById(pageId + 'nextBtn').addEventListener('click',function(){
			function nextBbs(){
				that.nextBbs();
			}
			nextBbs();
		});

	// 이전
	document.getElementById(pageId + 'prevBtn').addEventListener('click',function(){
			function prevBbs(){
				that.prevBbs();
			}
			prevBbs();
		});

	// 처음
	document.getElementById(pageId + 'fristBtn').addEventListener('click',function(){
			function fristBbs(){
				that.fristBbs();
			}
			fristBbs();
		});

	// 마지막
	document.getElementById(pageId + 'lastBtn').addEventListener('click',function(){
			function lastBbs(){
				that.lastBbs();
			}
			lastBbs();
		});

	// 클로저 사용
	for (let i = pstart; i <= pcount; i++){
		(function(m) {document.getElementById(pageId + i).addEventListener('click',function(){
			function pickBbs(m){
				that.pickBbs(m);
			}
			pickBbs(m);
		}); })(i);
	}

	if(this.currPage == 1) {
		document.getElementById(pageId + this.currPage).style.color = "red";
		document.getElementById(pageId + 'fristBtn').style.display  = "none";
		document.getElementById(pageId + 'prevBtn').style.display  = "none";
	}else if (this.currPage == maxPage) {
		document.getElementById(pageId + 'lastBtn').style.display  = "none";
		document.getElementById(pageId + 'nextBtn').style.display  = "none";
	}else {
		document.getElementById(pageId + 'fristBtn').style.display  = "inline";
		document.getElementById(pageId + 'prevBtn').style.display  = "inline";
		document.getElementById(pageId + 'lastBtn').style.display  = "inline";
		document.getElementById(pageId + 'nextBtn').style.display  = "inline";
	}
};

// 다음 버튼 액션
bbs.prototype.nextBbs = function(){

	document.getElementById(this.pageIdName + this.currPage).style.color="black";

	// 현재 페이지, 최대 페이지, 페이지 제한 개수, 현재 블럭
	var currPage = this.currPage; 
	var maxPage = this.maxPage; 
	var pageLimit = this.pageLimit;
	var blockNum = this.blockNum;
	
	// 현재 페이지가 마지막 페이지라면 그대로 리턴
	if (this.currPage >= maxPage ) {
		document.getElementById(this.pageIdName + maxPage).style.color="red";
		return;
	}else {
		// (페이지 제한 개수 * 현재 블럭 + 1) < (현재 페이지 + 1)
		if (pageLimit * Number(blockNum + 1) < Number(currPage + 1)) {
			this.blockNum = Number(this.blockNum + 1);
			this.printPage();	// 페이징 재 구현
		}

		document.getElementById(this.pageIdName + 'fristBtn').style.display  = "inline";
		document.getElementById(this.pageIdName + 'prevBtn').style.display  = "inline";

		// 현재 페이지 영역 acitveClass 제거
		this.removeBtn(currPage);
	
		// 다음 페이지 영역 acitveClass 추가
		this.activeBtn(currPage + 1);
	
		// 게시판 재구현
		this.buildBbs(++this.currPage);

		if(this.currPage == maxPage) {
			document.getElementById(this.pageIdName + 'lastBtn').style.display  = "none";
			document.getElementById(this.pageIdName + 'nextBtn').style.display  = "none";
		}else {
			document.getElementById(this.pageIdName + 'fristBtn').style.display  = "inline";
			document.getElementById(this.pageIdName + 'prevBtn').style.display  = "inline";
		}

	}
}

// 이전 버튼 액션
bbs.prototype.prevBbs = function(){

	document.getElementById(this.pageIdName + this.currPage).style.color="black";

	// 현재 페이지, 최대 페이지, 현재 블럭
	var currPage = this.currPage; 
	var pageLimit = this.pageLimit;
	var blockNum = this.blockNum;
	
	// 현재 페이지가 처음이라면 그대로 리턴
	if (this.currPage <= 1) {
		document.getElementById(this.pageIdName + 1).style.color="red";
		return;
	}else {
		// ((현재 페이지 - 1) <= 현재 페이지 * 현재 블럭)
		if ((currPage - 1) <= pageLimit * blockNum) {
			this.blockNum = Number(this.blockNum - 1);
			this.printPage();
		}
		
		// 현재 페이지 영역 acitveClass 제거
		this.removeBtn(currPage);

		// 이전 페이지 영역 acitveClass 추가
		this.activeBtn(currPage-1);

		// 게시판 재구현
		this.buildBbs(--this.currPage);

		if(this.currPage == 1) {
			document.getElementById(this.pageIdName + 'fristBtn').style.display  = "none";
			document.getElementById(this.pageIdName + 'prevBtn').style.display  = "none";
		}else {
			document.getElementById(this.pageIdName + 'lastBtn').style.display  = "inline";
			document.getElementById(this.pageIdName + 'nextBtn').style.display  = "inline";
		}
	}
}

// 처음 버튼 액션
bbs.prototype.fristBbs = function(){

	document.getElementById(this.pageIdName + this.currPage).style.color="black";

	// 현재 페이지 영역 acitveClass 제거
	this.removeBtn(this.currPage);

	// 초기화
	this.currPage = 1; 
	this.blockNum = 0;

	// 페이징 재 구현
	this.printPage();	

	// 다음 페이지 영역 acitveClass 추가
	this.activeBtn(1);

	// 게시판 재구현
	this.buildBbs(this.currPage);


}

// 마지막 버튼 액션
bbs.prototype.lastBbs = function(){



	// 현재 페이지 영역 acitveClass 제거
	this.removeBtn(this.currPage);

	// 마지막 set
	this.currPage = this.maxPage; 
	this.blockNum = Math.ceil(this.maxPage / this.pageLimit) - 1;	// 마지막 블럭(블럭은 0부터 시작)

	// 페이징 재 구현
	this.printPage();	

	// 이전 페이지 영역 acitveClass 추가
	this.activeBtn(this.currPage);

	// 게시판 재구현
	this.buildBbs(this.currPage);

}

// 페이지 선택 액션
bbs.prototype.pickBbs = function(pickNum){

	document.getElementById(this.pageIdName + this.currPage).style.color="black";
	
	this.removeBtn(this.currPage);		// 이전 페이지 영역 acitveClass 제외
	this.currPage = pickNum;			// 선택 페이지
	this.activeBtn(pickNum);			// 선택 페이지 영역 acitveClass 추가
	this.buildBbs(this.currPage);		// 게시판 재구현

	if(this.currPage == 1) {
		document.getElementById(this.pageIdName + this.currPage).style.color = "red";
		document.getElementById(this.pageIdName + 'fristBtn').style.display  = "none";
		document.getElementById(this.pageIdName + 'prevBtn').style.display  = "none";
		document.getElementById(this.pageIdName + 'lastBtn').style.display  = "inline";
		document.getElementById(this.pageIdName + 'nextBtn').style.display  = "inline";
	}else if (this.currPage == this.maxPage) {
		document.getElementById(this.pageIdName + 'lastBtn').style.display  = "none";
		document.getElementById(this.pageIdName + 'nextBtn').style.display  = "none";
		document.getElementById(this.pageIdName + 'fristBtn').style.display  = "inline";
		document.getElementById(this.pageIdName + 'prevBtn').style.display  = "inline";
	}else {
		document.getElementById(this.pageIdName + 'fristBtn').style.display  = "inline";
		document.getElementById(this.pageIdName + 'prevBtn').style.display  = "inline";
		document.getElementById(this.pageIdName + 'lastBtn').style.display  = "inline";
		document.getElementById(this.pageIdName + 'nextBtn').style.display  = "inline";
	}
}

// 현재 페이지 영역 acitveClass 제외
bbs.prototype.removeBtn = function(n){
	
	// 현재 페이지 - 페이지 제한 개수 * 현재 블럭 - 1
	n = n - this.pageLimit * this.blockNum - 1;
	if(n == this.pageLimit) n = n - 1;
	if(n === -1) n = 0;
	var pageBtnEle = document.getElementsByClassName(this.pageIdName);	// 페이지 영역 버튼 클래스
	var check = new RegExp("(\\s|^)" + this.btnActiveClassName + "(\\s|$)");
	pageBtnEle[n].className = pageBtnEle[n].className.replace(check, " ").trim();
}

// 다음/이전/선택 페이지 영역 acitveClass 추가
bbs.prototype.activeBtn = function(n){

	// 페이지 제한 개수 * 현재 블럭 - 1
	n = n - this.pageLimit * this.blockNum - 1;
	var pageBtnEle = document.getElementsByClassName(this.pageIdName);	// 페이지 영역 버튼 클래스
	pageBtnEle[n].className += " " + this.btnActiveClassName; 
}

// 현재 페이지로 게시판 재구현
bbs.prototype.buildBbs = function(currPage){

	var that = this;
	this.getBbs(currPage, function(e){
		function printBbs(){
			that.printBbs(e);
		}
		printBbs();
	});

	
	document.getElementById(this.pageIdName + this.currPage).style.color="red";
}

var bbsCnt = document.getElementById("bbsCnt").value;		// 게시글 개수
var pgCnt = document.getElementById("pgCnt").value;			// 페이징 개수
var orderByAD = document.getElementById("orderByAD").value;	// 정렬
// 생성자 세팅(데이터 경로, 게시판 영역 아이디, 게시글 개수, 페이징 개수, 페이지 영역 아이디, 버튼 클릭시 클래스명, 정렬)
var board1 = new bbs('bbs_ajax.php', 'bbs1', bbsCnt, pgCnt, 'pg1', 'active', orderByAD);


// 최초 수행
(function(){
	var setInitBbs = function(obj){
		obj.getBbs(1, function(e){
			obj.postCount = e.postCount;	// 데이터로부터 받은 총 게시글 수
			obj.maxPage = e.maxPage;		// 데이터로부터 받은 개수로 계산 한 최대 페이지 수 
			obj.printPage();				// 페이징 구현
			obj.printBbs(e);				// 게시판 구현
			obj.activeBtn(1);				// 현재 페이지 (최초 1세팅)
		})
	};

	//구현
	setInitBbs(board1);
})();