(function (global) {
  'use strict';

  var ENTER_KEY = 13;

  var UI = global.UI || {};

  function InputView(input_element_selector) {
    this.input_element = document.getElementById(input_element_selector);
  }

  InputView.prototype.addKeyUpHandler = function(process_fn, hide_form, edit_form) {
    this.input_element.addEventListener('keyup', function(e) {
      var input_field_value = e.target.value;
      if (e.keyCode === ENTER_KEY && input_field_value !== '') {
        process_fn(Number(input_field_value), edit_form);
        e.target.value = '';
        hide_form();
      }
    });
  };

  UI.InputView = InputView;
  global.UI = UI;
})(window);
