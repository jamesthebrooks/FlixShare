<?php

function myMin($js) {
  require_once 'minify_2.1.3/min/lib/JSMin.php';
  return JSMin::minify($js);
}

function createManifest($config) {
  if ($config['production'] == true) {
    ob_start();

    echo "CACHE MANIFEST\n\n";
    echo "# DATE " . date('Y-m-d H:i:s') . "\n";
    echo "index.html\n";

    foreach($config['css'] as $css)
      echo $css . "\n";

    if ($config['production']) {
      echo $config['scripts'] = 'cached/scripts.js' . "\n";
    } else {
      foreach($config['js'] as $js)
        echo $js . "\n";
    }
    echo "\nNETWORK:\n*";

    $manifestContents = trim(ob_get_clean());

    $fh = fopen($config['manifestfile'], 'w') or
            die("I cannot open '" . $config['manifestfile']);
    fwrite($fh, $manifestContents);
    fclose($fh);

  } else {
    if (file_exists($config['manifestfile'])) {
      unlink($config['manifestfile']);
    }
  }
}
?>