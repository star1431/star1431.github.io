import { displaySearch } from '../components/search-display';
import { setHeaderScrollHandler } from '../components/header-scrolling';

export function initTopbar() {
  displaySearch();
  setHeaderScrollHandler();
}
