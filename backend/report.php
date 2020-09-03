<?php
header('Access-Control-Allow-Credentials: true');
include './config.php';
mysqli_set_charset($link, "utf8");
function getReport()
{
    global $todayUnixReport;
    global $link;
    $query = "SELECT * FROM kamishibaiAnswers";
    mysqli_set_charset($link, "utf8");
    $result = mysqli_query($link, $query) or die(mysqli_error($link));

    for ($data = []; $row = mysqli_fetch_assoc($result); $data[] = $row);
    $result = '<div class="table-wrapper">
    <table class="fl-table">';
    foreach ($data as $elem) {
        $result .= '<tr>';
        $result .= '<td>' . $elem['id'] . '</td>
            <td>' . $elem['owner'] . '</td>
            <td>' . gmdate("d.m.y", (($elem['date']) * 86400)) . '</td>
            <td>' . $elem['question'] . '</td>
            <td>' . $elem['answer'] . '</td>
            <td>' . $elem['location'] . '</td>
            <td>' . $elem['type'] . '</td>';
        $result .= '
        </tr>';
    }
    $result .= '</table>';
    
    print_r('
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kamishibai Report</title>
        <link rel="stylesheet" href="../style/index.css" />
    <link
      rel="shortcut icon"
      href="../src/img/favicon.ico"
      type="image/x-icon"
    />
    </head>
    <body>
        
    </body>
    </html>
    ');
    print_r(gmdate("d.m.y",$todayUnixReport*86400));
    print_r('');
    print_r($result);
};
getReport();
