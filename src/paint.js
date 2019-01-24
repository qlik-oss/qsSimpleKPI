import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import qlik from 'qlik';
import StatisticBlock from './statisticBlock';
import NumberFormatter from './numberFormatter';
import { deselectAllEntries } from './selections.actions';
import getStore from './createStore';

const DEFAULT_AUTO_FORMAT = "0A";
let wasZoomedId;
let numberFormatter;
let localeInfo;
let elements = {};

export default {
  doPaint,
  beforeDestroy
};

function beforeDestroy (id){
  ReactDOM.unmountComponentAtNode(elements[id]);
}

function doPaint ($element, layout) {
  let self = this;
  let qId = layout.qInfo.qId;
  elements[qId] = $element[0];

  if(!localeInfo) {
    localeInfo = (self.backendApi && self.backendApi.localeInfo);
    if(!localeInfo)
      try {
        const app = qlik.currApp();
        if(app)
          localeInfo = app.model.layout.qLocaleInfo;
      } catch(err) {
        console.log(err);
      }
  }
  if (!numberFormatter) {
    numberFormatter = getNumberFormatter(localeInfo, NumberFormatter);
  }

  const State = {
    isInEditMode: self.inEditState && self.inEditState.bind(self),
    isInAnalysisMode: self.inAnalysisState && self.inAnalysisState.bind(self)
  };

  const PromiseClass = qlik.Promise || window.Promise; // for backward compatibility
  // It waits for all promises before "print" (after the styles has been loaded, see. component.js)
  return PromiseClass.all([
    new PromiseClass(function(resolve) {
      unmountIfZoomed($element, layout, self);

      try {
        const qId = layout.qInfo.qId;
        const store = getStore(qId);
        store.dispatch(deselectAllEntries());
        ReactDOM.render(
          <Provider store={store}>
            <StatisticBlock
              kpis={layout.qHyperCube}
              options={{
                ...layout.qInfo,
                ...layout.options,
                numberFormatter,
                DEFAULT_AUTO_FORMAT
              }}
              services={{
                State,
                Qlik: qlik,
                QlikComponent: self,
                PrintResolver: resolve
              }}
              element={$element[0]}
            />
          </Provider>,
          $element[0]
        );
      } catch (error) {
        console.log(error);
      }
      finally{
        // Sense's undo/redo function waits for this promise to resolve,
        // if it doesn't resolve, you cannot undo.
        // There does not seem to be a reason for the code above to be inside a promise,
        // and it does not always resolve after repainting.
        // Therefore, we have resorted to the cowboy hack below. Enjoy!
        resolve();
      }
    })
  ]);
}

function getNumberFormatter(localeInfo, NumberFormatter) {
  if(localeInfo && NumberFormatter) {
    let decimalSeparator = localeInfo.qDecimalSep;
    let thousandSep = localeInfo.qThousandSep;
    return new NumberFormatter(localeInfo, DEFAULT_AUTO_FORMAT, thousandSep, decimalSeparator, 'U');
  } else {
    return undefined;
  }
}

function unmountIfZoomed($element, layout, { options }) {
  if((options && options.isZoomed && wasZoomedId !== layout.qInfo.qId)
  || (options && !options.isZoomed && wasZoomedId === layout.qInfo.qId)){
    ReactDOM.unmountComponentAtNode(($element)[0]);
    if(options.isZoomed)
      wasZoomedId = layout.qInfo.qId;
    else
      wasZoomedId = undefined;
  }
}