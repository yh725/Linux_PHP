<?
/*
	작성자 : 이연호
	작성일 : 2020-07-12
	내 용 : 글 작성 / 확인(삭제) 페이지
*/


//인클루드
include "/home/yhc1/public_html/dbcon.php";		// DB connect

$action_mode = "insert";
$action_name = "저장";
if ($_GET['no']) {
	mysqli_select_db($my_con, 'ymd1') or die('DB 연결 실패');

	$sql = "select title, memo, name, i_time, passwd, count(no) cno 
	          from BBS 
			 where save_status='Y' and no=".$_GET['no'] ; 
	$sql.= " order by no asc ";
	$result = mysqli_query($my_con, $sql);
	
	while($v = mysqli_fetch_array($result)) {
			$title = $v['title'];	// 제목
			$memo = $v['memo'];		// 내용
			$name = $v['name'];		// 작성자
			$i_time = $v['i_time'];	// 작성일
			$passwd = $v['passwd'];	// 비밀번호
			$cno = $v['cno'];		// 결과 cnt
	}

	// 삭제되었거나 없는 데이터 접근 예외 처리
	if ($cno == 0) {
		echo "<script>alert('잘못된 접근입니다.')</script>";
		echo "<script>location.replace('index.php')</script>";
		exit;
	}

	if ($_POST['action_mode']=="update") {
		$action_mode = "update";
		$action_name = "수정";
	}else {
		$action_mode = "delete";
		$action_name = "삭제";
	}
}

?>

<html>
<head>
<link rel="icon" href="data:;base64,iVBORw0KGgo=">
<title>웹_프로그래밍 과제</title>
<script>

// 목록으로 이동
function pageGO() {
	location.href="index.php";
}

// 데이터 처리 (저장/수정/삭제)
function dataAction(e) {

	if (form.action_mode.value == "insert") {
		if (form.name.value == null || form.name.value == '') {
			alert("작성자를 입력해주세요.");
			return false;
		}
		if (form.passwd.value == null || form.passwd.value == '') {
			alert("비밀번호를 입력해주세요.");
			return false;
		}
		if (form.title.value == null || form.title.value == '') {
			alert("제목을 입력해주세요.");
			return false;
		}
		if (form.memo.value == null || form.memo.value == '') {
			alert("내용을 입력해주세요.");
			return false;
		}

		form.submit();
			
	}else if (e=="update") {
		
		if (form.passwd.value == null || form.passwd.value == '') {
			alert("비밀번호는 필수입니다.");
			return false;
		}

		if(form.passwdValue.value != "Y") {
			alert("비밀번호를 확인해주세요.");
			return false;
		}

		form.action_mode.value="update";
		form.action = "bbs_data.php?no=<?=$_GET['no']?>";
		form.submit();
	}else if (form.action_mode.value == "update") {
		form.passwdValue.value = "Y";	// 비밀번호 체크 여부

		if (form.name.value == null || form.name.value == '') {
			alert("작성자를 입력해주세요.");
			return false;
		}
		if (form.passwd.value == null || form.passwd.value == '') {
			alert("비밀번호를 입력해주세요.");
			return false;
		}
		if (form.title.value == null || form.title.value == '') {
			alert("제목을 입력해주세요.");
			return false;
		}
		if (form.memo.value == null || form.memo.value == '') {
			alert("내용을 입력해주세요.");
			return false;
		}

		form.submit();
	}else if (form.action_mode.value == "delete") {

		if (form.passwd.value == null || form.passwd.value == '') {
			alert("비밀번호는 필수입니다.");
			return false;
		}

		if(form.passwdValue.value != "Y") {
			alert("비밀번호를 확인해주세요.");
			return false;
		}

		form.submit();
	}else {
		alert("잘못된 접근입니다.");
		return false;
	}
}

// 비밀번호 체크
function passwdChk() {
	// Creating the XMLHttpRequest object
	var request = new XMLHttpRequest();
	// Instantiating the request object
	request.open("POST", "bbs_data_action.php");

	// Defining event listener for readystatechange event
	request.onload = function() {
		// Check if the request is compete and was successful / readyState : 4 : 응답 데이터 전체 수신 , status : 200 : 정상 
		if(this.readyState === 4 && this.status === 200) {
		// Inserting the response from server into an HTML element
			if (this.responseText != "success") {
				alert("비밀번호를 틀렸습니다.");
				form.passwdValue.value = "N";
			}else {
				alert("확인되었습니다.");
				document.getElementsByClassName("btnView")[0].style.display = "block";
				document.getElementsByClassName("btnView")[1].style.display = "block";
				form.passwdValue.value = "Y";
			}
		}
	};
	// Retrieving the form data
	var formData = new FormData(form);

	// Sending the request to the server
	request.send(formData);
}


</script>
<style type="text/css">
	
	#writeTable { border-collapse:collapse;border-top:2px solid #231f20;}
	#writeTable td {
		font-size:13px;color:#3e3e3e;
		height:43px;
		border-bottom:1px solid #efefef;
	}
	.tdTitle { background-color:#dddddd; text-align:center;}
	.btnView { display:none;}
</style>

</head>

<body>
	<form name="form" action="bbs_data_action.php" method="post">
	<input type="hidden" name="action_mode" value="<?=$action_mode?>" />
	<input type="hidden" name="no" value="<?=$_GET['no']?>" />
	<input type="hidden" name="passwdValue" value="N" />
	<table id="writeTable" width="100%">
		<?if ($action_mode == "insert") {?>
		<tr>
			<td class="tdTitle" width="12.5%" align="center">작성자</td>
			<td width="25%"><input type="text" name="name" /></td>
			<td class="tdTitle" width="12.5%" align="center">비밀번호</td>
			<td width="25%"><input type="password" name="passwd" /></td>
		</tr>
		<tr>
		</tr>
		<tr>
			<td class="tdTitle" align="center">제목</td>
			<td colspan="3"><input type="text" size ="80" name="title" /></td>
		</tr>
		<tr height="500">
			<td class="tdTitle" align="center">내용</td>
			<td colspan="3"><textarea name="memo" cols="80" rows="30" style="overflow-x:hidden;overflow-y:auto;"></textarea></td>
		</tr>
		<?} else if($action_mode == "update"){?>
		<tr>
			<td class="tdTitle" width="12.5%">작성자</td>
			<td width="25%"><input type="text" name="name" value="<?=$name?>" /></td>
			<td class="tdTitle" width="12.5%">비밀번호</td>
			<td width="25%"><input type="password" name="passwd" value="<?=$passwd?>" /></td>
		</tr>
		<tr>
		</tr>
		<tr>
			<td class="tdTitle">제목</td>
			<td colspan="3"><input type="text" size ="80" name="title" value="<?=$title?>" /></td>
		</tr>
		<tr height="500">
			<td class="tdTitle">내용</td>
			<td colspan="5" ><textarea name="memo" cols="80" rows="30" style="overflow-x:hidden;overflow-y:auto;"><?=$memo?></textarea></td>
		</tr>
		<?} else {?>
		<tr>
			<td class="tdTitle" width="12.5%">작성자</td>
			<td width="12.5%" align="center"><?=$name?></td>
			<td class="tdTitle" width="12.5%">작성일</td>
			<td width="12.5%" align="center"><?=$i_time?></td>
			<td class="tdTitle" width="12.5%">비밀번호</td>
			<td width="25%"><input type="password" name="passwd" /><input type="button" onclick="passwdChk();" value="확인" /></td>
		</tr>
		<tr>
		</tr>
		<tr>
			<td class="tdTitle">제목</td>
			<td colspan="5"><?=$title?></td>
		</tr>
		<tr height="500">
			<td class="tdTitle">내용</td>
			<td colspan="5" ><textarea name="memo" cols="80" rows="30" style="background-color:transparent; border:0; filter: chroma(color=ffffff); overflow-x:hidden;overflow-y:auto;";" readonly><?=$memo?></textarea></td>
		</tr>
		<?} ?>
	</table>
	<table width="30%" align="center">
		<tr height="20px">
			<td></td>
		</tr>
		<tr align="center">
			<td><input type="button" onclick="pageGO();" value="목록으로" /></td>
			<?if ($action_mode == "delete") {?>
			<td class="btnView"><input type="button" onclick="dataAction('update');" value="수정" /><td>
			<td class="btnView"> <input type="button" onclick="dataAction();" value="<?=$action_name?>" /><td>
			<?}else {?>
			<td> <input type="button" onclick="dataAction();" value="<?=$action_name?>" 
			/><td>
			<?}?>
		</tr>
	</table>
	</form>
</body>
</html>

<?

// DB close
mysqli_close($my_con);

?>