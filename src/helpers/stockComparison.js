class StockComparisons {
  static alphabetical(a, b) {
    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
  }

  static addedFirst(a, b) {
    return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
  }

  static addedLast(a, b) {
    return a.key < b.key ? 1 : a.key > b.key ? -1 : 0;
  }

  static previousClose(a, b) {
    return a.previousClose < b.previousClose
      ? 1
      : a.previousClose > b.previousClose ? -1 : 0;
  }

  static dayOpen(a, b) {
    return a.dayOpenPrice < b.dayOpenPrice
      ? 1
      : a.dayOpenPrice > b.dayOpenPrice ? -1 : 0;
  }

  static currentPrice(a, b) {
    return a.currentPrice < b.currentPrice
      ? 1
      : a.currentPrice > b.currentPrice ? -1 : 0;
  }

  static gainers(a, b) {
    let diffA = (a.currentPrice - a.previousClose) / a.previousClose;
    let diffB = (b.currentPrice - b.previousClose) / b.previousClose;

    return diffA < diffB ? 1 : diffA > diffB ? -1 : 0;
  }

  static losers(a, b) {
    let diffA = (a.currentPrice - a.previousClose) / a.previousClose;
    let diffB = (b.currentPrice - b.previousClose) / b.previousClose;

    return diffA < diffB ? -1 : diffA > diffB ? 1 : 0;
  }
}

export default StockComparisons;
