'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var Loader = function Loader() {
  return React__default.createElement("div", null, "Loading meeting...");
};
var Props = {
  domain: 'meet.jit.si',
  roomName: /*#__PURE__*/(Math.random() + 0.48151642).toString(36).substring(2)
};
var ContainerStyle = {
  width: '800px',
  height: '400px'
};
var FrameStyle = function FrameStyle(loading) {
  return {
    display: loading ? 'none' : 'block',
    width: '100%',
    height: '100%'
  };
};

var importJitsiApi = function importJitsiApi() {
  return new Promise(function (resolve) {
    try {
      if (window.JitsiMeetExternalAPI) {
        resolve(window.JitsiMeetExternalAPI);
      } else {
        var head = document.getElementsByTagName("head")[0];
        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", "https://meet.jit.si/external_api.js");
        head.addEventListener("load", function (event) {
          if (event.target.nodeName === "SCRIPT") {
            resolve(window.JitsiMeetExternalAPI);
          }
        }, true);
        head.appendChild(script);
      }

      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  });
};

var Jitsi = function Jitsi(props) {
  var _Default$Props$props = _extends({}, Props, {}, props),
      containerStyle = _Default$Props$props.containerStyle,
      frameStyle = _Default$Props$props.frameStyle,
      loadingComponent = _Default$Props$props.loadingComponent,
      onAPILoad = _Default$Props$props.onAPILoad,
      onIframeLoad = _Default$Props$props.onIframeLoad,
      domain = _Default$Props$props.domain,
      roomName = _Default$Props$props.roomName,
      password = _Default$Props$props.password,
      displayName = _Default$Props$props.displayName,
      config = _Default$Props$props.config,
      interfaceConfig = _Default$Props$props.interfaceConfig,
      noSSL = _Default$Props$props.noSSL,
      jwt = _Default$Props$props.jwt,
      devices = _Default$Props$props.devices,
      userInfo = _Default$Props$props.userInfo;

  var _useState = React.useState(true),
      loading = _useState[0],
      setLoading = _useState[1];

  var ref = React.useRef(null);
  var Loader$1 = loadingComponent || Loader;

  var startConference = function startConference(JitsiMeetExternalAPI) {
    try {
      console.log('interfaceConfig', interfaceConfig);
      var options = {
        roomName: roomName,
        parentNode: ref.current,
        configOverwrite: config,
        interfaceConfigOverwrite: interfaceConfig,
        noSSL: noSSL,
        jwt: jwt,
        onLoad: onIframeLoad,
        devices: devices,
        userInfo: userInfo
      };
      var api = new JitsiMeetExternalAPI(domain, options);
      if (!api) throw new Error('Failed to create JitsiMeetExternalAPI istance');
      if (onAPILoad) onAPILoad(api);
      api.addEventListener('videoConferenceJoined', function () {
        setLoading(false);
        api.executeCommand('displayName', displayName);
        if (domain === Props.domain && password) api.executeCommand('password', password);
      });
      /**
       * If we are on a self hosted Jitsi domain, we need to become moderators before setting a password
       * Issue: https://community.jitsi.org/t/lock-failed-on-jitsimeetexternalapi/32060
       */

      api.addEventListener('participantRoleChanged', function (e) {
        if (domain !== Props.domain && password && e.role === 'moderator') api.executeCommand('password', password);
      });
    } catch (error) {
      console.error('Failed to start the conference', error);
    }
  };

  React.useEffect(function () {
    importJitsiApi().then(function (jitsiApi) {
      startConference(jitsiApi);
    })["catch"](function (err) {
      console.error('Jitsi Meet API library not loaded.', err);
    });
  }, []);
  return React__default.createElement("div", {
    id: 'react-jitsi-container',
    style: _extends({}, ContainerStyle, {}, containerStyle)
  }, loading && React__default.createElement(Loader$1, null), React__default.createElement("div", {
    id: 'react-jitsi-frame',
    style: _extends({}, FrameStyle(loading), {}, frameStyle),
    ref: ref
  }));
};

exports.default = Jitsi;
//# sourceMappingURL=react-jitsi.cjs.development.js.map
