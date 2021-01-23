(function (global) {
  'use strict';

  var UI = global.UI || {};

  function ResultView(result_selector, card_selector, filialen_model) {
    this.result_view = document.querySelector(result_selector);
    this.card = document.querySelector(card_selector);
    this.filialen_model = filialen_model;
  }

  ResultView.prototype.addResultByNumber = function (filiaal_number) {

    if (this.result_view.innerHTML !== '') this.result_view.innerHTML = '';
    var db_response = this.filialen_model.getFiliaalByNumber(filiaal_number);

    db_response.then(function (filiaal) {
      this.result_view.appendChild(generateResultView(
        this,
        filiaal,
        this.filialen_model
      )
    );
  }.bind(this), function(error) {
      this.generateFeedback(error);
    }.bind(this));
  };

  ResultView.prototype.addEditButtonHandler = function(fn){
    this.editButtonHandler = fn;
  };

  ResultView.prototype.removeResult = function() {
    this.card.setAttribute('hidden', 'hidden');
    this.result_view.innerHTML = '';
  };

function generateResultView (result_view, filiaal, filialen_model) {
  var result = document.createElement('li');
  result.classList = 'result-list-item';
  var filiaal_body_text = document.createElement('p');
  filiaal_body_text.classList = 'filiaal-details';

  var result_text = '';
  for (var key in filiaal) {
    result_text +=
      '<span class="filiaal-key">' + key +
      ':</span > ' + '<span class="filiaal-value">' + filiaal[key] +'</span><br>';
  }

  filiaal_body_text.innerHTML = result_text;
  result.appendChild(filiaal_body_text);
  var edit_button = document.createElement('button');
  var delete_button = document.createElement('button');

  unhideElement(result_view.card);

  edit_button.classList = "btn btn-info";
  edit_button.innerText = 'Aanpassen';
  edit_button.addEventListener('click', function() {
    result_view.removeResult();
    result_view.editButtonHandler(filiaal);
  });

  delete_button.classList = 'btn btn-danger';
  delete_button.innerText = 'Verwijderen';
  delete_button.addEventListener('click', function() {
    var confirmed = confirm("Filiaal echt verwijderen?");
    if (confirmed) {
      filialen_model.deleteFiliaalByNumber(filiaal.filiaalnummer, function() {
        var message = '<span class="filiaal-deleted">Filiaal verwijderd</span>';
        result_view.generateFeedback(message);
      });
    }
  });

  result.appendChild(edit_button);
  result.appendChild(delete_button);
  return result;
}

ResultView.prototype.generateFeedback = function(feedback) {
  this.result_view.innerHTML = '';
  var feedback_msg = document.createElement('p');
  feedback_msg.innerHTML = feedback;
  unhideElement(this.card);
  this.result_view.appendChild(feedback_msg);
};

function unhideElement(element) {
  element.removeAttribute('hidden');
}

UI.ResultView = ResultView;
global.UI = UI;

})(window);
