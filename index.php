<?
/*
	작성자 : 이연호
	작성일 : 2020-07-09
	구 성 : Naver Cloud Platform CentOS 7.3 / Apache 2.4 / PHP 7.0 / MySQL 8.0
	내 용 : 기본 화면
*/


//인클루드
include "/home/yhc1/public_html/dbcon.php";		// DB connect
include "/home/yhc1/public_html/setting.php";	// 설정 값 저장

?>


<html>
<head>
<link rel="icon" href="data:;base64,iVBORw0KGgo=">
<title>웹_프로그래밍</title>
<style type="text/css">
	a:link { color: black; text-decoration: none;}
	a:visited { color: black; text-decoration: none;}
	a:hover { color: black; text-decoration: underline;}
	.board { border-collapse:collapse;width:100%;border-top:2px solid #231f20;}
	.board th { background:#ffc025;height:43px;font-size:13px;color:#231f20; border-right:1px solid #ffffff; padding:12px;}
	.board td {font-size:13px;color:#3e3e3e;height:43px;border-bottom:1px solid #efefef;text-align:center;}
	#bbsTable tr { vertical-align: top;}
	#bbsTable td { padding:12px ;}
	#tdAlign {text-align:left;}
	button { 
		border: 0px solid black; 
		background-color: rgba(0,0,0,0); 
		color: black; 
		padding: 5px;
	;}
</style>
<script>
function bssInsert() {
	location.href="bbs_data.php";
}

function setting() {
	if (form.bbsCnt.value > 100) {
		alert("게시글 최대 개수는 100개입니다.");
		return false;
	}
	if (form.pgCnt.value > 20) {
		alert("페이지 최대 개수는 20개입니다.");
		return false;
	}

	form.submit();
}


</script>
</head>
<body>
	<form name="form" action="<?=$_SERVER['PHP_SELF']?>" method="post">
	<table align="right">
		<tr>
			<td>게시글 개수 : <input class="txtCnt" type="text" style="text-align: center;" name="bbsCnt" id="bbsCnt" size="1" value="<?=$_SESSION['bbsCnt']?>" /></td>
			<td>페이징 개수 : <input class="txtCnt" type="text" style="text-align: center;" name="pgCnt" id="pgCnt" size="1" value="<?=$_SESSION['pgCnt']?>" /></td>
			<td>정렬 :
				<select name="orderByAD" id="orderByAD">
					<option value="DESC" <?if($_SESSION['orderByAD']=="DESC") echo "selected"?>>내림차순</option>
					<option value="ASC" <?if($_SESSION['orderByAD']=="ASC") echo "selected"?>>오름차순</option>
				</select>
			</td>
			<td><input type="button" value="설정변경" onclick="setting()"/></td>
		</tr>
	</table>
	</form>
	<article>
		<table id="bbsTable" width="100%">
			<tr>
				<td height="<?=($_SESSION['bbsCnt'] * 50)?>">
					<!--게시판 구현 영역-->
					<table class="board" id="bbs1" width="100%"></table>
				</td>
			</tr>
			<tr class="pgTr" align = "center">
				<td height="50">
					<!--페이징 구현 영역-->
					<div class="paging" id="pg1"></div>
				</td>
			</tr>
		</table>
	</article> 
	<script src="main.js"></script>
</body>
</html>

<?
// DB close
mysqli_close($my_con);
?>
