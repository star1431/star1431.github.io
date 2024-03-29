import * as THREE from './modules/lib/three.module.min';
import { basic, initSidebar, initTopbar } from './modules/layouts';
import { initLocaleDatetime, loadImg } from './modules/plugins';
import { mainVisual } from './modules/components/uicommon';

basic();
initSidebar();
initTopbar();
initLocaleDatetime();
// loadImg();
mainVisual();
