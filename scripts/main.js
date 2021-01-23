(function (global) {
  'use strict';

  var FILIAAL_INPUT_SELECTOR = 'filiaal-invoer';
  var RESULT_CONTAINER = '[data-role="result-container"]';
  var RESULT_CARD_SELECTOR = '[data-role="result-card"]';
  var NEW_FILIAAL_FORM_SELECTOR = '[data-role="add-filiaal-form"]';
  var NEW_FILIAAL_BUTTON_SELECTOR = '[data-role="add-filiaal"]';

  var FilialenModel = Models.FilialenModel;
  var InputView = UI.InputView;
  var ResultView = UI.ResultView;
  var AddFiliaalWidget = UI.AddFiliaalWidget;

  var input_view = new InputView(FILIAAL_INPUT_SELECTOR);
  var filialen_model = new FilialenModel(firebase.database());
  var result_view = new ResultView(
    RESULT_CONTAINER,
    RESULT_CARD_SELECTOR,
    filialen_model
  );
  var add_filiaal_widget = new AddFiliaalWidget(
    NEW_FILIAAL_BUTTON_SELECTOR,
    NEW_FILIAAL_FORM_SELECTOR,
    filialen_model
  );

  input_view.addKeyUpHandler(
    result_view.addResultByNumber.bind(result_view),
    add_filiaal_widget.hideForm.bind(add_filiaal_widget)
  );

  result_view.addEditButtonHandler(
    add_filiaal_widget.preFillForm.bind(add_filiaal_widget)
  );

  add_filiaal_widget.addClickHandler(result_view.removeResult.bind(result_view));

  add_filiaal_widget.addSubmitHandler(result_view.generateFeedback.bind(result_view));

})(window);
