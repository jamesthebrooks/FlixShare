<?php
  require_once 'inc/config.php';
  require_once 'inc/helpers.php';
  ob_start();
?>
<!DOCTYPE html>
<html<?php echo ($config['production']) ? ' manifest="app.manifest"' : ''; ?>>
<head>
  <meta charset="utf-8" />
  <title>MyDS</title>
  <?php
    foreach($config['css'] as $css)
      echo '<link rel="stylesheet" href="' . $css . '" type="text/css">';
    if ($config['production']===true) {
      $script = "";
      $file = fopen($config['scripts'],'w');
      if ($file) {
        $c=0;
        foreach($config['js'] as $js) {
          if ($c===0) {
            $script .= file_get_contents($js);
          } else {
            $script .= myMin(file_get_contents($js));
          }
          $c++;
        }
        fwrite($file,$script);
        echo '<script type="text/javascript" src="' . $config['scripts'] . '"></script>';
      }
      fclose($file);
    } else {
      foreach($config['js'] as $js) {
        echo '<script type="text/javascript" src="' . $js . '"></script>';
      }
    }
  ?>
</head>
<body></body>
</html>
<?php
  $html = ob_get_contents();
  ob_end_clean();
  $index = fopen('index.html','w');
  if ($index) {
    fwrite($index, $html);
    fclose($index);
  }
  sleep(5);
  //echo $html;
  if ($config['production']) {
    createManifest($config);
  }
?>
<h3>Your New Application Has Been Generated</h3>
<ul>
  <li>index.html has been built</li>
  <li>The manifest file was built if config is set to production mode</li>
  <li>CSS has been added</li>
  <li>JavaScript has been added and optionally minified and aggregated</li>
</ul>