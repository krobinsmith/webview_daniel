// Song & dance
import Hammer from 'hammerjs';
import dicomParser from 'dicom-parser';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneMath from 'cornerstone-math';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as cornerstoneTools from 'cornerstone-tools';

//
import appState from './appState.js';
import getUrlForImageId from './lib/getUrlForImageId.js';
import mprMetaDataProvider from './lib/mprMetadata/mprMetaDataProvider.js';
import mprImageLoader from './mprImageLoader.js';
import MprTool from './MprTool.js';
import MprMouseWheelTool from './MprMouseWheelTool.js';
import { Widgets } from '@material-ui/icons';
import { import as csTools, store } from 'cornerstone-tools';

export default function(seriesNumber) {
  _setPeerDependencies();
  _initWadoImageLoader();
  _initCornerstoneTools();
  cornerstone.registerImageLoader('mpr', mprImageLoader);
  cornerstone.metaData.addProvider(mprMetaDataProvider);

  // Enable Elements
  const mprAxialSeriesElement = document.getElementById('axial-target');
  const mprCoronalSeriesElement = document.getElementById('coronal-target');
  const mprSagittalSeriesElement = document.getElementById('sagittal-target');

  // store.state.enabledElements = [];
  cornerstone.enable(mprAxialSeriesElement, {
    renderer: 'webgl',
  });

  cornerstone.enable(mprCoronalSeriesElement, {
    renderer: 'webgl',
  });

  cornerstone.enable(mprSagittalSeriesElement, {
    renderer: 'webgl',
  });

  cornerstoneTools.addToolForElement(mprAxialSeriesElement, MprTool, {
    configuration: { rotationAxis: 'Y' },
  });
  cornerstoneTools.addToolForElement(mprCoronalSeriesElement, MprTool, {
    configuration: { rotationAxis: 'X' },
  });
  cornerstoneTools.addToolForElement(mprSagittalSeriesElement, MprTool, {
    configuration: { rotationAxis: 'X' },
  });

  // Track data for this tool using STACK state
  cornerstoneTools.addStackStateManager(mprAxialSeriesElement, ['Mpr']);
  cornerstoneTools.addStackStateManager(mprCoronalSeriesElement, ['Mpr']);
  cornerstoneTools.addStackStateManager(mprSagittalSeriesElement, ['Mpr']);

  // Element Specific Tools
  cornerstoneTools.setToolActiveForElement(
    mprAxialSeriesElement,
    'MprMouseWheel',
    {}
  );
  cornerstoneTools.setToolActiveForElement(
    mprCoronalSeriesElement,
    'MprMouseWheel',
    {}
  );
  cornerstoneTools.setToolActiveForElement(
    mprSagittalSeriesElement,
    'MprMouseWheel',
    {}
  );

  //
  cornerstoneTools.setToolActiveForElement(mprAxialSeriesElement, 'Mpr', {
    mouseButtonMask: 1,
    color: '#9ACD32',
    cosines: '1,0,0,0,1,0',
  });
  cornerstoneTools.setToolActiveForElement(mprCoronalSeriesElement, 'Mpr', {
    mouseButtonMask: 1,
    color: '#0496FF',
    cosines: '1,0,0,0,0,-1',
  });
  cornerstoneTools.setToolActiveForElement(mprSagittalSeriesElement, 'Mpr', {
    mouseButtonMask: 1,
    color: '#EFBDEB',
    cosines: '0,1,0,0,0,-1',
  });
}

function _setPeerDependencies() {
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
  cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
  cornerstoneTools.external.cornerstone = cornerstone;
  cornerstoneTools.external.Hammer = Hammer;
  cornerstoneTools.init();
}

function _initWadoImageLoader() {
  if (window.is_initWadoImageLoader == undefined) {
    window.is_initWadoImageLoader = false;
  } else if (window.is_initWadoImageLoader == false) {
    window.is_initWadoImageLoader = true;
  }

  if (window.is_initWadoImageLoader == false) {
    const config = {
      webWorkerPath:
        '/cornerstone/assets/cornerstoneWADOImageLoaderWebWorker.js',
      taskConfiguration: {
        decodeTask: {
          codecsPath: '/cornerstone/assets/cornerstoneWADOImageLoaderCodecs.js',
        },
      },
    };

    cornerstoneWADOImageLoader.webWorkerManager.initialize(config);
  }
}

function _initCornerstoneTools() {
  cornerstoneTools.init({
    globalToolSyncEnabled: true,
  });

  // Grab Tool Classes
  const LengthTool = cornerstoneTools.LengthTool;
  const ArrowAnnotateTool = cornerstoneTools.ArrowAnnotateTool;
  const TextMarkerTool = cornerstoneTools.TextMarkerTool;
  const ZoomTool = cornerstoneTools.ZoomTool;
  const PanTool = cornerstoneTools.PanTool;
  const RotateTool = cornerstoneTools.RotateTool;
  const WwwcTool = cornerstoneTools.WwwcTool;
  //Grab Tool Classes

  // //Else Grab Tool Classes
  // const StackScrollTool = cornerstoneTools.StackScrollTool;
  // const PanMultiTouchTool = cornerstoneTools.PanMultiTouchTool;
  // const StackScrollMouseWheelTool = cornerstoneTools.StackScrollMouseWheelTool;
  // const ZoomTouchPinchTool = cornerstoneTools.ZoomTouchPinchTool;
  // const ZoomMouseWheelTool = cornerstoneTools.ZoomMouseWheelTool;
  // //Else Grab Tool Classes

  //Add Grab
  cornerstoneTools.addTool(LengthTool);
  cornerstoneTools.addTool(ArrowAnnotateTool);
  const configuration = {
    markers: ['Please enter text'],
    current: 'Please enter text',
    ascending: true,
    loop: true,
  };
  cornerstoneTools.addTool(TextMarkerTool, { configuration });
  cornerstoneTools.addTool(ZoomTool);
  cornerstoneTools.addTool(PanTool);
  cornerstoneTools.addTool(RotateTool);
  cornerstoneTools.addTool(WwwcTool);
  //Add Grab

  // //Else Add Grab
  // cornerstoneTools.addTool(StackScrollTool);
  // cornerstoneTools.addTool(PanMultiTouchTool);
  // cornerstoneTools.addTool(StackScrollMouseWheelTool);
  // cornerstoneTools.addTool(ZoomTouchPinchTool);
  // cornerstoneTools.addTool(ZoomMouseWheelTool);
  // cornerstoneTools.addTool(MprMouseWheelTool);
  // // cornerstoneTools.addTool(MprTool);
  // //Else Add Grab

  // Set Tool Mode
  cornerstoneTools.setToolActive('Length', {});
  cornerstoneTools.setToolActive('ArrowAnnotate', {});
  cornerstoneTools.setToolActive('TextMarker', {});
  cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 2 });
  cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 3 });
  cornerstoneTools.setToolActive('Rotate', { mouseButtonMask: 5 });
  cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 4 });
  //Set Tool Mode

  // //Else Set Tool Mode
  // cornerstoneTools.setToolActive('StackScroll', {});
  // cornerstoneTools.setToolActive("StackScrollMouseWheel", {});
  // cornerstoneTools.setToolActive("PanMultiTouch", {});
  // cornerstoneTools.setToolActive("ZoomTouchPinch", {});
  // //Else Set Tool Mode
}
