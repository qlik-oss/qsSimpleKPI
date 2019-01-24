import './qlik-multi-kpi.less';
import getStore from './createStore';
import { deselectAllEntries } from './selections.actions';
import initialProperties from './initialProperties';
import definition from './definition';
import paint from './paint';

export default {
  initialProperties,
  data: {
    dimensions: {
      min: 0,
      max: 1
    },
    measures: {
      min: 1,
      max: 15
    },
  },
  definition,
  paint: function ($element, layout) {
    try {
      paint.doPaint($element, layout);
    }
    catch (e) {
      console.error(e); // eslint-disable-line no-console
      throw e;
    }
  },
  support: {
    snapshot: false,
    export: true,
    exportData: true
  },
  beforeDestroy: function(){
    let id = this.options.id;
    paint.beforeDestroy(id);
  },
  clearSelectedValues(){
    const id = this.options.id;
    const store = getStore(id);
    store.dispatch(deselectAllEntries());
  }
};

