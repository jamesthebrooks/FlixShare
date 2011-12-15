<?php

$config = array();
$config['title'] = 'MyDS v2';
$config['path'] = '/ODS/MyDSv2/';
$config['sencha'] = 'sencha-touch-1.1.1/';
$config['manifestfile'] = 'app.manifest';
$config['production'] = false;
$config['minpath'] = '/minify_2.1.3/min/lib/';
$config['scripts'] = 'cached/scripts.js';

/* CSS Files */
$config['css'] = array();
$config['css'][] = $config['sencha'] . 'resources/css/android.css';

/* JavaScript Files */
$config['js'] = array();
if ($config['production']===true) {
  $config['js'][] = $config['sencha'] . 'sencha-touch.js';
} else {
  $config['js'][] = $config['sencha'] . 'sencha-touch-debug.js';
}
$config['js'][] = 'js/Overrides.js';
$config['js'][] = 'js/app.js';

# Models

# Views
$config['js'][] = 'js/views/HomePanel.js';

# Controllers

# Main Viewport
$config['js'][] = 'js/views/ContainerPanel.js';

?>