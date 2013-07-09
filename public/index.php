<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en-US">
<head>
	<meta charset="utf-8" />
	<title>imapyoumap</title>
	<link rel="shortcut icon" href="assets/images/favicon.ico">
	<link rel="stylesheet" type="text/css" href="assets/css/main.css">
</head>

<body>
	<script>
		document.body.style.visibility = 'hidden';
	</script>

	<!-- third-party -->
	<script src="assets/js/third-party/modernizr-latest.js"></script>
	<script src="assets/js/third-party/paper-full.min.js"></script>
	<script src="assets/js/third-party/PerspectiveTransform.min.js"></script>
	<script src="assets/js/third-party/greensock/TweenMax.min.js"></script>
	<script src="assets/js/third-party/greensock/plugins/ScrollToPlugin.min.js"></script>

	<!-- project js -->
	<?php 
	 $USE_STATIC_JS = true;
	 print '<script src="http://localhost:9810/compile?id=imapyoumap&mode=SIMPLE"></script>';
	?> 

	<!--
	{% if USE_STATIC_JS == true %}
		<script src="assets/js/imym-compiled.js"></script>
	{% else %}
		<script src="http://localhost:9810/compile?id=imapyoumap&mode=SIMPLE"></script>
	{% endif %}
	-->

	<!-- execute the main js-->
	<script>
		document.body.style.visibility = 'visible';
		imym.main();
	</script>
</body>
</html>
