import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import View2D from './VTKViewport/View2D';
import getImageData from './lib/getImageData';
import loadImageData from './lib/loadImageData';
import vtkSVGRotatableCrosshairsWidget from './VTKViewport/vtkSVGRotatableCrosshairsWidget';
import vtkInteractorStyleRotatableMPRCrosshairs from './VTKViewport/vtkInteractorStyleRotatableMPRCrosshairs';
import vtkInteractorStyleMPRWindowLevel from './VTKViewport/vtkInteractorStyleMPRWindowLevel';
import { api as dicomwebClientApi } from 'dicomweb-client';
import vtkVolume from 'vtk.js/Sources/Rendering/Core/Volume';
import vtkVolumeMapper from 'vtk.js/Sources/Rendering/Core/VolumeMapper';
import cornerstone from 'cornerstone-core';
import './VTKViewport/initCornerstone.js';

import dcms from './../layers/studies/0.js';

const ROOT_URL =
  window.location.hostname === 'localhost'
    ? window.location.host
    : window.location.hostname;

function loadDataset(imageIds, displaySetInstanceUid) {
  const imageDataObject = getImageData(imageIds, displaySetInstanceUid);

  loadImageData(imageDataObject);
  return imageDataObject;
}

class VTKRotatableCrosshairsExample extends Component {
  state = {
    volumes: [],
    crosshairsTool: true,
    // slabOwn: '1',
  };
  static propTypes = {
    slabShowing: PropTypes.bool,
  };
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    this.apis = [];

    let imageIds = [];

    for (let i = 0; i < dcms.length; i++) {
      imageIds[i] = `dicomweb://${ROOT_URL}/0/${dcms[i]}`;
    }

    const promises = imageIds.map(imageId => {
      return cornerstone.loadAndCacheImage(imageId);
    });

    Promise.all(promises).then(() => {
      // const displaySetInstanceUid = '12345';

      // const imageDataObject = getImageData(imageIds, displaySetInstanceUid);
      const ctImageDataObject = loadDataset(imageIds, 'ctDisplaySet');

      // const onAllPixelDataInsertedCallback = () => {
      //   const { actor } = createActorMapper(imageDataObject.vtkImageData);

      //   const rgbTransferFunction = actor
      //     .getProperty()
      //     .getRGBTransferFunction(0);

      //   const low = voi.windowCenter - voi.windowWidth / 2;
      //   const high = voi.windowCenter + voi.windowWidth / 2;

      //   rgbTransferFunction.setMappingRange(low, high);

      //   this.setState({
      //     vtkImageData: imageDataObject.vtkImageData,
      //     volumes: [actor],
      //     cornerstoneViewportData,
      //     labelMapInputData,
      //     colorLUT: segmentationModule.getters.colorLUT(0),
      //     globalOpacity: segmentationModule.configuration.fillAlpha,
      //     outlineThickness: segmentationModule.configuration.outlineThickness,
      //   });
      // };

      //   imageDataObject.onAllPixelDataInserted(onAllPixelDataInsertedCallback);
      // });

      // const ctImageDataObject = loadDataset(ctImageIds, 'ctDisplaySet');

      const onAllPixelDataInsertedCallback = () => {
        const ctImageData = ctImageDataObject.vtkImageData;

        const range = ctImageData
          .getPointData()
          .getScalars()
          .getRange();

        const mapper = vtkVolumeMapper.newInstance();
        const ctVol = vtkVolume.newInstance();
        const rgbTransferFunction = ctVol
          .getProperty()
          .getRGBTransferFunction(0);

        mapper.setInputData(ctImageData);
        mapper.setMaximumSamplesPerRay(2000);
        rgbTransferFunction.setRange(range[0], range[1]);
        ctVol.setMapper(mapper);

        this.setState({
          volumes: [ctVol],
        });
      };

      ctImageDataObject.onAllPixelDataInserted(onAllPixelDataInsertedCallback);
    });
    // this.handleSlabThicknessChange(this.props.slab);
  }

  async componentDidUpdate() {
    // this.handleSlabThicknessChange(this.props.slab);
  }

  storeApi = viewportIndex => {
    return api => {
      this.apis[viewportIndex] = api;

      window.apis = this.apis;

      const apis = this.apis;
      const renderWindow = api.genericRenderWindow.getRenderWindow();

      // Add rotatable svg widget
      api.addSVGWidget(
        vtkSVGRotatableCrosshairsWidget.newInstance(),
        'rotatableCrosshairsWidget'
      );

      const istyle = vtkInteractorStyleRotatableMPRCrosshairs.newInstance();

      // add istyle
      api.setInteractorStyle({
        istyle,
        configuration: {
          apis,
          apiIndex: viewportIndex,
        },
      });

      // set blend mode to MIP.
      const mapper = api.volumes[0].getMapper();
      if (mapper.setBlendModeToMaximumIntensity) {
        mapper.setBlendModeToMaximumIntensity();
      }

      api.setSlabThickness(0.1);

      renderWindow.render();

      // Its up to the layout manager of an app to know how many viewports are being created.
      if (apis[0] && apis[1] && apis[2]) {
        const api = apis[0];

        apis.forEach((api, index) => {
          api.svgWidgets.rotatableCrosshairsWidget.setApiIndex(index);
          api.svgWidgets.rotatableCrosshairsWidget.setApis(apis);
        });

        api.svgWidgets.rotatableCrosshairsWidget.resetCrosshairs(apis, 0);
      }
    };
  };

  handleSlabThicknessChange(evt) {
    const value = Number(evt.target.value);
    const valueInMM = value / 10;
    const apis = this.apis;

    apis.forEach(api => {
      const renderWindow = api.genericRenderWindow.getRenderWindow();

      api.setSlabThickness(valueInMM);
      renderWindow.render();
    });
  }

  toggleTool = () => {
    let { crosshairsTool } = this.state;
    const apis = this.apis;

    crosshairsTool = !crosshairsTool;

    apis.forEach((api, apiIndex) => {
      let istyle;

      if (crosshairsTool) {
        istyle = vtkInteractorStyleRotatableMPRCrosshairs.newInstance();
      } else {
        istyle = vtkInteractorStyleMPRWindowLevel.newInstance();
      }

      // // add istyle
      api.setInteractorStyle({
        istyle,
        configuration: { apis, apiIndex },
      });
    });

    this.setState({ crosshairsTool });
  };

  toggleCrosshairs = () => {
    const { displayCrosshairs } = this.state;
    const apis = this.apis;

    const shouldDisplayCrosshairs = !displayCrosshairs;

    apis.forEach(api => {
      const { svgWidgetManager, svgWidgets } = api;
      svgWidgets.rotatableCrosshairsWidget.setDisplay(shouldDisplayCrosshairs);

      svgWidgetManager.render();
    });

    this.setState({ displayCrosshairs: shouldDisplayCrosshairs });
  };

  resetCrosshairs = () => {
    const apis = this.apis;

    apis.forEach(api => {
      api.resetOrientation();
    });

    // Reset the crosshairs
    apis[0].svgWidgets.rotatableCrosshairsWidget.resetCrosshairs(apis, 0);
  };

  render() {
    if (!this.state.volumes || !this.state.volumes.length) {
      return <h4 style={{ color: 'gray' }}>Loading...</h4>;
    }
    const str_value = this.props.slabShowing;
    console.log(str_value);

    return (
      <div className="cornerstone-container">
        <div id="mpr-list-left" className="mpr-list">
          <div
            className="slab-container"
            style={{ visibility: str_value ? 'visible' : 'hidden' }}
          >
            <label htmlFor="set-slab-thickness">SlabThickness: </label>
            <input
              id="set-slab-thickness"
              type="range"
              name="points"
              min="1"
              max="5000"
              onChange={this.handleSlabThicknessChange.bind(this)}
            />
            <button onClick={this.toggleCrosshairs}>
              {this.state.displayCrosshairs
                ? 'Hide Crosshairs'
                : 'Show Crosshairs'}
            </button>
            <button onClick={this.toggleTool}>
              {this.state.crosshairsTool
                ? 'Switch To WL/Zoom/Pan/Scroll'
                : 'Switch To Crosshairs'}
            </button>
            <button onClick={this.resetCrosshairs}>reset crosshairs</button>
          </div>
          <div className="cornerstone-element">
            <View2D
              className="item mpr-item"
              volumes={this.state.volumes}
              onCreated={this.storeApi(0)}
              orientation={{ sliceNormal: [0, 0, 1], viewUp: [0, -1, 0] }}
              showRotation={true}
            />
          </div>
        </div>
        <div id="mpr-list-right" className="mpr-list">
          <div className="cornerstone-element">
            <View2D
              volumes={this.state.volumes}
              onCreated={this.storeApi(1)}
              orientation={{ sliceNormal: [0, 1, 0], viewUp: [0, 0, 1] }}
              showRotation={true}
            />
          </div>
          <div className="cornerstone-element">
            <View2D
              volumes={this.state.volumes}
              onCreated={this.storeApi(2)}
              orientation={{ sliceNormal: [-1, 0, 0], viewUp: [0, 0, 1] }}
              showRotation={true}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default VTKRotatableCrosshairsExample;
