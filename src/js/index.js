import * as $ from 'jquery';
import Post from '@modules/Post';
import '@/styles/styles.css';
import '@/styles/less.less';
import '@/styles/scss.scss';
import '@/js/babel';

import WebPackLogo from '@/assets/logo.png';
import xmlFile from '@/assets/data.xml';
import csvFile from '@/assets/omon-minsk.csv';
import json from '@/assets/json-file.json';

const post = new Post('Webpack Post Title', WebPackLogo);

$('pre').html(post.toString());

console.log('Post to String:', post.toString());
console.log('JSON: ', json);
console.log('XML: ', xmlFile);
console.log('CSV: ', csvFile);