import React, { Component } from 'react';
import './App.css';
import { useState, useEffect } from 'react';
import Photo from './components/photo/photo';
import Layer1 from './components/layers/index';
import VTKRotatableCrosshairsExample from './components/vtkLayer/VTKRotatableCrosshairsExample.js';
import ThreeD from './components/threeD';
import Stomat from './components/stomat';
import PhotoNav from './nav/photoNav';
import LayerNav from './nav/LayerNav';
import SplittedScreens from './nav/SplittedScreens';
import ThreeDNav from './nav/threeDNav';
import StomatNav from './nav/stomatNav';
import Dialogopen from './components/Dialog';
import { SettingsInputAntennaTwoTone } from '@material-ui/icons';

function WebViewer() {
  const [userMode, setUserMode] = useState('scrolling');
  const [imageMode, setImageMode] = useState('axial');
  const [roll, setRoll] = useState({ vFlip: false, hFlip: false, rotation: 0 });
  const [slab, setSlab] = useState(false);
  const [Dialog, setDialog] = useState(false);
  const [NavActive, setNavActive] = useState('1');
  let newTmp = '1';

  const handleRoll = dir => {
    if (dir === 'hori') {
      setRoll(prevState => ({ ...prevState, hFlip: !prevState.hFlip }));
    } else if (dir === 'vert') {
      setRoll(prevState => ({ ...prevState, vFlip: !prevState.vFlip }));
    } else if (dir === 'left') {
      setRoll(prevState => ({
        ...prevState,
        rotation: prevState.rotation - 90 == -360 ? 0 : prevState.rotation - 90,
      }));
    } else if (dir === 'right') {
      setRoll(prevState => ({
        ...prevState,
        rotation: prevState.rotation + 90 == 360 ? 0 : prevState.rotation + 90,
      }));
    }
  };

  const handleUserMode = mode => {
    setUserMode(mode);
    setSlab(false);
  };

  const handleImageMode = mode => {
    setImageMode(mode);
  };

  const handleSetSlab = () => {
    if (slab) setSlab(false);
    else setSlab(true);
    setUserMode('3D');
  };

  const setNavActivity = index => {
    setNavActive(index);
  };

  const MoveToRight = (holderId, contentId) => {
    var holder = document.getElementById(holderId);
    var content = document.getElementById(contentId);
    var visibleWidth = holder.offsetWidth;
    var contentWidth = content.offsetWidth;
    var left = parseInt(content.style.marginLeft.replace('px', ''));
    var currWidth = contentWidth + left;
    if (visibleWidth < currWidth) {
      var swipeBtnWidth = 17;
      var marginLeft = left - (visibleWidth - swipeBtnWidth * 2);
      marginLeft = Math.max(
        marginLeft,
        -1 * (contentWidth + 2 * swipeBtnWidth - visibleWidth)
      );
      content.style.marginLeft = marginLeft + 'px';
    }
    return false;
  };

  const MoveToLeft = (holderId, contentId) => {
    var holder = document.getElementById(holderId);
    var content = document.getElementById(contentId);
    var visibleWidth = holder.offsetWidth;
    var contentWidth = content.offsetWidth;
    var left = parseInt(content.style.marginLeft.replace('px', ''));
    if (left < 0) {
      var swipeBtnWidth = 17;
      var marginLeft = left + visibleWidth - swipeBtnWidth;
      if (marginLeft > 0) {
        marginLeft = 0;
      }
      content.style.marginLeft = marginLeft + 'px';
    }
    return false;
  };

  const Identify = () => {
    switch (NavActive) {
      case '1':
        return (
          <PhotoNav
            handleRoll={handleRoll}
            setUserMode={handleUserMode}
            mode={userMode}
          />
        );
      case '2':
        return (
          <LayerNav
            handleRoll={handleRoll}
            setUserMode={handleUserMode}
            setImageMode={handleImageMode}
            mode={userMode}
            setSlab={handleSetSlab}
            slab={slab}
          />
        );
      case '3':
        return <ThreeDNav />;
      case '4':
        return <StomatNav />;
      case '5':
        return (
          <PhotoNav handleRoll={handleRoll} setUserMode={handleUserMode} />
        );
    }
  };

  const Identify_content = () => {
    switch (NavActive) {
      case '1':
        return <Photo userRoll={roll} userMode={userMode} />;
      case '2':
        if (userMode === '3D') {
          return <VTKRotatableCrosshairsExample slabShowing={slab} />;
        } else
          return (
            <Layer1 roll={roll} userMode={userMode} imageMode={imageMode} />
          );
      case '3':
        return <ThreeD />;
      case '4':
        return <Stomat />;
      case '5':
        return <SplittedScreens roll={roll} userMode={userMode} />;
    }
  };

  const ShowDialog = () => {
    switch (Dialog) {
      case true:
        return <Dialogopen />;
        break;
      case false:
        return null;
    }
  };
  const openDialog = () => {
    setDialog(!Dialog);
  };

  useEffect(() => {
    setUserMode(userMode);
  }, [userMode]);

  return (
    <div>
      <button
        id="left_arrow"
        onClick={() => MoveToLeft('nav-header', 'header')}
      >
        {'<'}
      </button>
      <button
        id="right_arrow"
        onClick={() => MoveToRight('nav-header', 'header')}
      >
        {'>'}
      </button>
      <div
        style={{
          position: 'absolute',
          left: '0px',
          width: '100%',
          background: '#cccccc',
          overflow: 'hidden',
        }}
      >
        <div
          id="nav-header"
          style={{ width: '100%', overflow: 'hidden', height: '96px' }}
        >
          {Identify()}
        </div>
      </div>
      <div id="content1">
        <div style={{ height: '100%' }}>
          <div id="nav_item">
            <div
              className="nav flex-column nav-pills"
              id="v-pills-tab"
              role="tablist"
              aria-orientation="vertical"
            >
              <div
                id="btnWindows"
                className="windows Rect32"
                title="Series selection"
                onClick={openDialog}
              ></div>
              <a
                className="nav-list"
                id={NavActive == '1' ? 'Navselected' : ''}
                role="tab"
                aria-selected="true"
                onClick={() => setNavActivity('1')}
              >
                <p className="nav_txt">2D</p>
              </a>
              <a
                className="nav-list"
                id={NavActive == '2' ? 'Navselected' : ''}
                role="tab"
                aria-selected="false"
                onClick={() => setNavActivity('2')}
              >
                <p className="nav_txt">MPR</p>
              </a>
              <a
                className="nav-list"
                id={NavActive == '3' ? 'Navselected' : ''}
                role="tab"
                aria-selected="false"
                onClick={() => setNavActivity('3')}
              >
                <p className="nav_txt">3D</p>
              </a>
              <a
                className="nav-list"
                id={NavActive == '4' ? 'Navselected' : ''}
                role="tab"
                aria-selected="false"
                onClick={() => setNavActivity('4')}
              >
                <p className="nav_txt">Dental</p>
              </a>
              <a
                className="nav-list"
                id={NavActive == '5' ? 'Navselected' : ''}
                role="tab"
                aria-selected="false"
                onClick={() => setNavActivity('5')}
              >
                <p className="nav_txt">Link</p>
              </a>
            </div>
          </div>
          <div id="nav_content">
            {ShowDialog(Dialog)}
            <div
              style={{
                position: 'absolute',
                marginTop: '0',
                width: '100%',
                height: '100%',
                display: 'inline-block',
              }}
            >
              {Identify_content()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebViewer;
