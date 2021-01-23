(function (global) {
  'use strict';

  var UI = global.UI || {};

  function AddFiliaalWidget(widget_selector, form_selector, filialen_model) {
    this.add_filiaal_widget = document.querySelector(widget_selector);
    this.form = document.querySelector(form_selector);
    this.filialen_model = filialen_model;
    this.edit_filiaal = false;
  }

  AddFiliaalWidget.prototype.addClickHandler = function(fn) {
    this.add_filiaal_widget.addEventListener('click', function() {
      this.form.reset();
      this.form.removeAttribute('hidden');
      fn();
    }.bind(this));
  };

  AddFiliaalWidget.prototype.hideForm = function() {
    this.form.setAttribute('hidden', 'hidden');
  };

  AddFiliaalWidget.prototype.preFillForm = function(filiaal) {
    this.edit_filiaal = true;
    this.form.removeAttribute('hidden');
    var input_fields = Array.prototype.slice.call(document.querySelectorAll('input'));
    input_fields.forEach(function(input_field) {
      input_field.value = filiaal[input_field.name];
    });
  };

  AddFiliaalWidget.prototype.addSubmitHandler = function(feed_back_fn) {
    this.form.addEventListener('submit', function(e) {
      e.preventDefault();
      var input_fields = Array.prototype.slice.call(
        this.form.querySelectorAll('input')
      );
      var filiaal = {};
      input_fields.forEach(function(input_field) {
        filiaal[input_field.name] = 
			  input_field.name === 'filiaalnummer'  ? Number(input_field.value) : 
			  String(input_field.value);
      });
      if (this.edit_filiaal) {
        this.filialen_model.updateFiliaal(filiaal, function() {
          var message = '<span class="filiaal-added">' +
                        'filiaal is aangepast in de database' +
                        '</span>';
          feed_back_fn(message);
        }).catch(feed_back_fn);

        this.form.setAttribute('hidden', 'hidden');
        this.edit_filiaal = false;

      } else {

        this.filialen_model.addFiliaal(filiaal, function() {
          var message = '<span class="filiaal-added">' +
                          'filiaal is toegevoegd aan de database' +
                          '</span>';
          feed_back_fn(message);
        })
        .catch(feed_back_fn);
      }
    }.bind(this));
  };

  UI.AddFiliaalWidget = AddFiliaalWidget;
  global.UI = UI;
})(window);
