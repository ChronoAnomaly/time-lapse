(function() {

  function SettingsLoadingPage() {
    //Load elements
    this.progressMessageElement = document.getElementById('progress-message');
    this.loadSettingsBox = document.getElementById('load-settings-box');
    this.scanWebcamsBox = document.getElementById('scan-webcams-box');
    this.checksBox = document.getElementById('perform-checks-box');
    this.buttonBox = document.getElementById('button-box');
    this.showErrorsButton = this.buttonBox.querySelector('.btn-fail');
    this.loadingBlock = document.getElementById('loading-block');

    //Data variables
    this.collectedInfo = {};
  }

  SettingsLoadingPage.prototype.run = function() {
    var self = this;

    // Reads only once and caches the data...should be fine though for our current use
    // will only update the file on exit of the program or possibly just keep these
    // as default values to always load
    var config = require('./config/config.json');
    self.handleSettingsLoaded(config);

    this.showErrorsHandler = function(e) {
      e.preventDefault();
      self.handleShowErrorsButton();
    };

    //Upon click, show any error messages. Should only be visible if errors
    this.showErrorsButton.addEventListener('click', this.showErrorsHandler);
  };

  SettingsLoadingPage.prototype.handleSettingsLoaded = function(data) {
    var self = this;

    //Save settings!
    var jsonData = JSON.stringify(data);
    console.log(data);
    sessionStorage.setItem('settings', jsonData);
    this.collectedInfo.settings = data;

    this.loadSettingsBox.classList.add('complete');
    this.loadSettingsBox.innerHTML = '<img src="images/checkmark.svg"/><span>Load Settings</span>';

    this.testWebcam(function(result) {
      self.handleWebcamTestFinished(result);
    });
  };

  SettingsLoadingPage.prototype.handleWebcamTestFinished = function(result) {
    this.collectedInfo.isWebcamConnected = result.webcam;

    this.scanWebcamsBox.classList.add('complete');
    this.scanWebcamsBox.innerHTML = '<img src="images/checkmark.svg"/><span>Scan Webcams</span>';

    this.performChecks();
  };

  SettingsLoadingPage.prototype.performChecks = function() {
    this.checksBox.classList.add('complete');
    this.checksBox.innerHTML = '<img src="images/checkmark.svg"/><span>Perform Checks</span>';

    //If webcam isn't connected OR selecte printer is offline... show them
    //the button to show errors... we'll populate only if they click.
    if (!this.collectedInfo.isWebcamConnected || !this.collectedInfo.isSelectedPrinterOnline) {
      this.showErrorsButton.classList.remove('hidden');
    }

    this.buttonBox.classList.add('visible');
  };

  SettingsLoadingPage.prototype.handleShowErrorsButton = function() {
    var self = this;

    var transListener = function() {
      self.showErrorsButton.querySelector('span').innerHTML = 'Recheck Errors';
      self.showErrorsButton.removeEventListener('click', self.showErrorsHandler);

      var html = '';
      if (!self.collectedInfo.isWebcamConnected) {
        html += '<p class="error-item">No webcam was found connected.</p>';
      }

      self.loadingBlock.innerHTML = html;

      self.loadingBlock.removeEventListener('webkitTransitionEnd', transListener);
      self.loadingBlock.classList.remove('ani-hidden');
    };
    this.loadingBlock.classList.add('ani-hidden');
    this.loadingBlock.addEventListener('webkitTransitionEnd', transListener);
  };

  /**
     * Tests whether a webcam is connected and user-accepted. Callback returns an object
     * with a single object with a property <code>webcam</code>, a boolean value of whether
     * a webcam is connected or not and an <code>error</code> message that only applies
     * to failure to connect to a webcam.
     * @param function callback
     */
  SettingsLoadingPage.prototype.testWebcam = function(callback) {
    //TODO: merge into Webcam utilities... allows loose coupling to details
    var streaming = false;

    navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

    navigator.getMedia({
      video: {
        mandatory: {
          minWidth: 1280,
          minHeight: 720
        }
      },
      audio: false
    }, function(stream) {
      //SUCCESS!
      //This is just a test; release webcam when done!
      if (stream.active) {
        var tracks = stream.getTracks();
        for (var i = 0; i < tracks.length; i++) {
          tracks[i].stop();
        }
      }

      if (callback !== null) {
        callback({webcam: true, error: {}});
      }
    }, function(err) {
      if (callback !== null) {
        callback({webcam: false, error: err});
      }
    });
  };

  //Export to global scope
  window.SettingsLoadingPage = SettingsLoadingPage;
})();
