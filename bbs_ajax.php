<?
/*
	작성자 : 이연호
	작성일 : 2020-07-10
	내 용 : 데이터 ajax 응답 (Josn 형태)
*/

//인클루드
include "/home/yhc1/public_html/dbcon.php";		// DB connect


mysqli_select_db($my_con, 'ymd1') or die('DB 연결 실패');

$sql = "select * 
          from BBS 
		 where save_status='Y' 
		 order by no asc ";
$result = mysqli_query($my_con, $sql);


$result_array = array();

while($v = mysqli_fetch_array($result)){
	$json_array = array (
		"no" => $v['no'],			// 번호
		"title" => urlencode($v['title']),		// 제목
		"memo" => urlencode(str_replace("\r", "\\n", str_replace("\r\n", "\\n",($v['memo'])))),	// 내용 + 개행문자 처리
		"name" => urlencode($v['name']),		// 작성자
		"i_time" => $v['i_time']	// 작성일
	);

	array_push($result_array, $json_array);
}

$content_array = array("contents" => $result_array);

echo urldecode(json_encode($content_array));


// DB close
mysqli_close($my_con);

?>