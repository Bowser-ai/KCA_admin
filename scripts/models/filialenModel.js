(function (global) {
  'use strict';

  var Models = global.Models || {};

  function FilialenModel(database) {
    this.database = database;
    this.db_root= database.ref();
  }

  FilialenModel.prototype.getFiliaalByNumber = function (filiaal_number) {
    return getBaseDataBasePromise(this, filiaal_number).then(function (snapshot) {
      if (!snapshot.exists()) return Promise.reject("geen filiaal gevonden!");
      return getSnapShotValue(snapshot);
    });
  };

  FilialenModel.prototype.addFiliaal = function (filiaal, completion_cb) {
    return this.getFiliaalByNumber(filiaal.filiaalnummer).then(function(filiaal_promise) {
      if (filiaal.filiaalnummer === filiaal_promise.filiaalnummer) {
        throw new Error("filiaalnummer bestaat al, kan deze niet toevoegen");
      }
    },function() {
        this.db_root.push(filiaal, completion_cb);
    }.bind(this));
  };

  FilialenModel.prototype.updateFiliaal = function(filiaal, completion_cb) {
    return getBaseDataBasePromise(this, filiaal.filiaalnummer).then(function(snapshot) {
      try {
        if (filiaal.filiaalnummer === getSnapShotValue(snapshot).filiaalnummer) {
          return this.database.ref(getSnapShotKey(snapshot)).update(filiaal, completion_cb);
        } else {
          throw new Error('Het is beter het filiaalnummer niet te veranderen');
        }
      }catch(error) {
        throw new Error('Het is beter het filiaalnummer niet te veranderen');
      }
    }.bind(this));
  };

  FilialenModel.prototype.deleteFiliaalByNumber = function (filiaal_number, completion_cb) {
    return getBaseDataBasePromise(this, filiaal_number).then(function(snapshot) {
      rejectPromise(snapshot);
      return this.database.ref(getSnapShotKey(snapshot)).remove(completion_cb);
    }.bind(this));
  };

  function getBaseDataBasePromise(this_model, filiaal_number) {
    return this_model.db_root.orderByChild('filiaalnummer')
      .equalTo(filiaal_number)
      .once('value');
  }

  function rejectPromise(snapshot) {
    if (!snapshot.exists()) return Promise.reject("geen filiaal gevonden!");
  }

  function getSnapShotKey(snapshot) {
    return Object.keys(snapshot.val())[0];
  }

  function getSnapShotValue(snapshot) {
    return Object.values(snapshot.val())[0];
  }

  Models.FilialenModel = FilialenModel;
  global.Models = Models;
})(window);
