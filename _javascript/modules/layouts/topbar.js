import { displaySearch } from '../components/search-display';
import { headerScrollHandler } from '../components/uicommon';

export function initTopbar() {
  displaySearch();
  headerScrollHandler();
}
