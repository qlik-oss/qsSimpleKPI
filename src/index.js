import './qlik-multi-kpi.less';
import getStore from './createStore';
import { deselectAllEntries } from './selections.actions';
import initialProperties from './initialProperties';

const global = window;
// const defined = global.requirejs && global.requirejs.defined;
const define = (global && global.define) || define;

// let dependencies = [
//   'module',
//   'qlik',
//   'general.services/show-service/show-service',
//   'general.utils/drag-and-drop-service'
// ]
//   .map(path => {
//     const isDependencyDefined = defined(path)
//     || path === 'module'
//     || path === 'general.utils/drag-and-drop-service'
//     || path === 'general.services/show-service/show-service';
//     if(isDependencyDefined)
//       return path;
//     else if(path === 'qlik' && defined('js/qlik'))
//     {
//       return 'js/qlik';
//     }
//     else {
//       return null;
//     }
//   });
// console.log('dependencies', dependencies);

define(["module", "qlik", "general.services/show-service/show-service", "general.utils/drag-and-drop-service"],
  function (module, qlik, ShowService, DragDropService, React) {
    console.log(arguments);
    
    let definition = require('./definition')({ ShowService });
    let { paint, beforeDestroy } = require('./paint')({ qlik, DragDropService });

    return {
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
      paint,
      support: {
        snapshot: false,
        export: true,
        exportData: true
      },
      beforeDestroy: function(){
        let id = this.options.id;
        beforeDestroy(id);
      },
      clearSelectedValues(){
        const id = this.options.id;
        const store = getStore(id);
        store.dispatch(deselectAllEntries());
      }
    };
  });
