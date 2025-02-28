var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _Validator_static, checkIsPositiveInteger_fn, checkIsInLottoNumberRange_fn, _numbers, _LottoShop_static, createLottoNumber_fn, _winNumbers, _bonusNumber, _LottoCompany_instances, getMatchCount_fn, checkBonusNumber_fn, getRank_fn;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const MIN_LOTTO_NUMBER = 1;
const MAX_LOTTO_NUMBER = 45;
const LOTTO_LENGTH = 6;
const LOTTO_PRICE = 1e3;
const NO_WINNING = "당첨 없음";
const COMMAND = {
  yes: "y",
  no: "n"
};
const ERROR_MESSAGES_DEFAULT = "[ERROR]";
const LOTTO_NUMBER_LENGTH = 6;
const BONUS_NUMBER_LENGTH = 1;
const appendErrorPrefix = (message) => `${ERROR_MESSAGES_DEFAULT} ${message}`;
const ERROR_MESSAGES = {
  purchaseAmount: {
    positiveInteger: appendErrorPrefix("양의 정수를 입력해주세요."),
    thousandUnit: appendErrorPrefix(
      `${LOTTO_PRICE.toLocaleString()}단위로 입력해주세요.`
    )
  },
  winNumber: {
    unique: appendErrorPrefix("중복되지 않은 숫자로 입력해주세요."),
    range: appendErrorPrefix(
      `당첨 번호를 ${LOTTO_NUMBER_LENGTH}개의 ${MIN_LOTTO_NUMBER}~${MAX_LOTTO_NUMBER} 사이의 정수로 입력해주세요.`
    )
  },
  bonusNumber: {
    unique: appendErrorPrefix("당첨 번호와 중복되지 않게 입력해주세요."),
    range: appendErrorPrefix(
      `보너스 번호를 ${BONUS_NUMBER_LENGTH}개의 ${MIN_LOTTO_NUMBER}~${MAX_LOTTO_NUMBER} 사이의 정수로 입력해주세요.`
    )
  },
  retry: {
    yesOrNo: appendErrorPrefix(
      `${COMMAND.yes} 또는 ${COMMAND.no}을 입력해주세요.`
    )
  }
};
const INPUT_MESSAGES = {
  alreadyPurchased: () => "이미 구매한 로또가 있습니다. 그래도 구매하시겠습니까?"
};
const LOTTO_RANK = {
  1: { winNumber: 6, isBonusNumberRequired: false, prize: 2e9 },
  2: { winNumber: 5, isBonusNumberRequired: true, prize: 3e7 },
  3: { winNumber: 5, isBonusNumberRequired: false, prize: 15e5 },
  4: { winNumber: 4, isBonusNumberRequired: false, prize: 5e4 },
  5: { winNumber: 3, isBonusNumberRequired: false, prize: 5e3 }
};
function generateRandomNumber(start, end) {
  return Math.floor(Math.random() * (end + 1 - start)) + start;
}
function generateUniqueRandomValue(array, { start, end }) {
  const randomNumber = generateRandomNumber(start, end);
  if (array.includes(randomNumber))
    return generateUniqueRandomValue(array, { start, end });
  return randomNumber;
}
function generateUniqueNumbers({ start, end }, length) {
  return new Array(length).fill(null).reduce((prev) => {
    const uniqueRandomValue = generateUniqueRandomValue(prev, { start, end });
    return [...prev, uniqueRandomValue];
  }, []);
}
function checkUniqueArray(array) {
  return array.length === new Set(array).size;
}
function getIntersectCount(array1, array2) {
  return array1.filter((value) => array2.includes(value)).length;
}
class Validator {
  static validatePurchaseAmount(purchaseAmount) {
    if (!__privateMethod(this, _Validator_static, checkIsPositiveInteger_fn).call(this, purchaseAmount)) {
      throw new Error(ERROR_MESSAGES.purchaseAmount.positiveInteger);
    }
    if (purchaseAmount % LOTTO_PRICE !== 0) {
      throw new Error(ERROR_MESSAGES.purchaseAmount.thousandUnit);
    }
  }
  static validateWinNumbers(winNumbers2) {
    if (winNumbers2.length !== 6 || winNumbers2.some(
      (number) => !__privateMethod(this, _Validator_static, checkIsInLottoNumberRange_fn).call(this, number) || !__privateMethod(this, _Validator_static, checkIsPositiveInteger_fn).call(this, number)
    )) {
      throw new Error(ERROR_MESSAGES.winNumber.range);
    }
    if (!checkUniqueArray(winNumbers2)) {
      throw new Error(ERROR_MESSAGES.winNumber.unique);
    }
  }
  static validateBonusNumber(bonusNumber, winNumbers2) {
    if (!__privateMethod(this, _Validator_static, checkIsPositiveInteger_fn).call(this, bonusNumber) || !__privateMethod(this, _Validator_static, checkIsInLottoNumberRange_fn).call(this, bonusNumber)) {
      throw new Error(ERROR_MESSAGES.bonusNumber.range);
    }
    if (winNumbers2.includes(bonusNumber)) {
      throw new Error(ERROR_MESSAGES.bonusNumber.unique);
    }
  }
  static validateRetry(retryCommand) {
    if (retryCommand !== COMMAND.yes && retryCommand !== COMMAND.no) {
      throw new Error(ERROR_MESSAGES.retry.yesOrNo);
    }
  }
}
_Validator_static = new WeakSet();
checkIsPositiveInteger_fn = function(value) {
  return !Number.isNaN(value) && value > 0 && Number.isInteger(value);
};
checkIsInLottoNumberRange_fn = function(value) {
  return value >= MIN_LOTTO_NUMBER && value <= MAX_LOTTO_NUMBER;
};
__privateAdd(Validator, _Validator_static);
class Lotto {
  constructor(numbers) {
    __privateAdd(this, _numbers);
    __privateSet(this, _numbers, numbers.sort((a, b) => a - b));
  }
  get numbers() {
    return __privateGet(this, _numbers);
  }
}
_numbers = new WeakMap();
class LottoShop {
  static purchaseLotto(purchaseAmount) {
    const purchaseCount = purchaseAmount / LOTTO_PRICE;
    Validator.validatePurchaseAmount(purchaseAmount);
    return new Array(purchaseCount).fill(null).map(() => new Lotto(__privateMethod(this, _LottoShop_static, createLottoNumber_fn).call(this)));
  }
}
_LottoShop_static = new WeakSet();
createLottoNumber_fn = function() {
  return generateUniqueNumbers(
    { start: MIN_LOTTO_NUMBER, end: MAX_LOTTO_NUMBER },
    LOTTO_LENGTH
  );
};
__privateAdd(LottoShop, _LottoShop_static);
function qs(selector, scope = document) {
  if (!selector) throw "no selector";
  return scope.querySelector(selector);
}
function qsAll(selector, scope = document) {
  if (!selector) throw "no selector";
  return scope.querySelectorAll(selector);
}
class Component {
  constructor(element, props = {}) {
    this.element = element;
    this.props = { ...props };
    if (!element) throw "no element";
    this.setUp();
    this.setEvent();
    this.render();
  }
  setEvent() {
  }
  setUp() {
  }
  render() {
    this.element.innerHTML = this.template();
    this.mounted();
  }
  template() {
    return "";
  }
  mounted() {
  }
  addEvent(eventType, selector, callback, element = this.element) {
    const children = [...qsAll(selector, element)];
    const isTarget = (element2) => children.includes(element2) || element2.closest(selector);
    element.addEventListener(eventType, (event) => {
      if (isTarget(event.target)) callback(event);
    });
  }
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }
}
class Button extends Component {
  template() {
    const {
      size = "medium",
      text,
      className = "",
      type = "button"
    } = this.props;
    const sizeStyle = {
      small: "button-small",
      medium: "button-medium",
      large: "button-large"
    };
    return `
      <button class="button ${sizeStyle[size]} ${className}" type="${type}">
        ${text}
      </button>
    `;
  }
  setEvent() {
    const { onClick } = this.props;
    if (onClick) {
      this.addEvent("click", ".button", onClick);
    }
  }
}
class AmountInput extends Component {
  template() {
    return `
        <header class="main-header title">🎱 내 번호 당첨 확인 🎱</header> 
        <section class="amount-input-section">
          <h2 class="amount-input-section-title body">
            구입할 금액을 입력해주세요
          </h2>
          <article>
          <form class="amount-input-form">
            <input
              type="number"
              class="amount-input placeholder"
              placeholder="금액"
              autofocus
            />
            <div class="amount-input-button-container"></div>
            </form>
          </article>
        </section>`;
  }
  mounted() {
    new Button(qs(".amount-input-button-container"), {
      text: "구입",
      size: "small",
      className: "amount-input-button",
      type: "submit",
      onClick: this.handleFormSubmit.bind(this)
    });
  }
  getPurchaseAmount() {
    const amountInput = qs(".amount-input");
    const purchaseAmount = Number(amountInput.value);
    Validator.validatePurchaseAmount(purchaseAmount);
    return purchaseAmount;
  }
  getLottoList(purchaseAmount) {
    const lottoList = LottoShop.purchaseLotto(purchaseAmount);
    this.props.setLottoList({ lottoList });
  }
  handleFormSubmit(event) {
    event.preventDefault();
    this.handleButtonClick();
  }
  handleButtonClick() {
    try {
      const purchaseAmount = this.getPurchaseAmount();
      const hasLottoList = this.props.state.lottoList.length === void 0;
      if (hasLottoList && !confirm(INPUT_MESSAGES.alreadyPurchased())) {
        return;
      }
      this.getLottoList(purchaseAmount);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }
}
class LottoList extends Component {
  template() {
    return `
    <section class="lotto-detail-layout">
          <span class="lotto-detail-title body">총 ${this.props.lottoList.length}개를 구매하였습니다.</span>
          <div class="lotto-detail-list">
            <div class="lotto-detail-item body">
              ${this.props.lottoList.map((lotto) => {
      return `
              <span class="lotto-detail-item-number"
                ><img src="/src/assets/ic_admit_one.png" />${lotto.numbers.join(
        ", "
      )}</span
              >
              `;
    }).join("")}
            </div>
          </div>
        </section>
    `;
  }
}
class StatisticsModal extends Component {
  template() {
    return `
    <dialog class='statistics-dialog'>
        <div class='statistics-dialog-contents'>
          <form class='statistics-dialog-close-form'>
            <button class='dialog-close-btn'>X</button>
          </form>
          <h2 class='statistics-title lotto-subtitle'>🏆 당첨 통계 🏆</h2>
          <div class='statistics-table'>
            <div class='statistics-label body'>
              <span class='awards-label'>일치 갯수</span>
              <span class='prize-label'>당첨금</span>
              <span class='count-label'>당첨 갯수</span>
            </div>
            <ul>
            ${this.getStatisticsTemplate()}
            </ul>
          </div>
          <div class='earning-rate'>당신의 총 수익률은 ${this.earningRate()}%입니다.
          </div>
          <form class='statistics-dialog-retry-form'>
            <button class='retry-btn'>다시 시작하기</button>
          </form>
        </div>
      </dialog>  
    `;
  }
  mounted() {
    new Button(qs(".statistics-dialog-retry-form"), {
      text: "다시 시작하기",
      size: "small",
      className: "retry-btn",
      type: "submit",
      onClick: this.handleButtonClick.bind(this)
    });
  }
  handleButtonClick() {
    this.props.reset();
  }
  earningRate() {
    const { lottoResults, lottoList } = this.props;
    if (!lottoResults) return 0;
    const { profit } = lottoResults;
    const totalPurchaseAmount = lottoList.lottoList.length * 1e3;
    return (profit / totalPurchaseAmount * 100).toFixed(1);
  }
  getStatisticsTemplate() {
    const { ranks } = this.props.lottoResults || { ranks: [] };
    return Object.entries(LOTTO_RANK).map(([rank, { winNumber, isBonusNumberRequired, prize }]) => {
      const matchDescription = isBonusNumberRequired ? `${winNumber}개 + 보너스볼` : `${winNumber}개`;
      const count = ranks ? ranks.filter((r) => r === rank).length : 0;
      return `
          <li class='statistics'>
            <span class='awards'>${matchDescription}</span>
            <span class='prize'>${prize.toLocaleString()}원</span>
            <span class='count'>${count}개</span>
          </li>`;
    }).join("");
  }
}
class LottoCompany {
  constructor(winNumbers2, bonusNumber) {
    __privateAdd(this, _LottoCompany_instances);
    __privateAdd(this, _winNumbers);
    __privateAdd(this, _bonusNumber);
    __privateSet(this, _winNumbers, winNumbers2);
    __privateSet(this, _bonusNumber, bonusNumber);
  }
  calculateLottoRanks(purchasedLottos) {
    return purchasedLottos.map((lotto) => {
      const winningLottoCount = __privateMethod(this, _LottoCompany_instances, getMatchCount_fn).call(this, lotto.numbers, __privateGet(this, _winNumbers));
      const isBonusNumber = __privateMethod(this, _LottoCompany_instances, checkBonusNumber_fn).call(this, lotto.numbers);
      const rank = __privateMethod(this, _LottoCompany_instances, getRank_fn).call(this, winningLottoCount, isBonusNumber);
      return rank;
    });
  }
  calculateTotalProfit(lottoRanks) {
    return lottoRanks.reduce(
      (prev, cur) => cur === NO_WINNING ? prev : prev + LOTTO_RANK[cur].prize,
      0
    );
  }
}
_winNumbers = new WeakMap();
_bonusNumber = new WeakMap();
_LottoCompany_instances = new WeakSet();
getMatchCount_fn = function(lottoNumbers, winNumbers2) {
  return getIntersectCount(lottoNumbers, winNumbers2);
};
checkBonusNumber_fn = function(lottoNumbers) {
  return lottoNumbers.includes(__privateGet(this, _bonusNumber));
};
getRank_fn = function(winningLottoCount, isBonusNumber) {
  const rank = Object.keys(LOTTO_RANK).find((currentRank) => {
    const lottoRankInfo = LOTTO_RANK[currentRank];
    return lottoRankInfo.winNumber === winningLottoCount && (lottoRankInfo.isBonusNumberRequired ? isBonusNumber : true);
  });
  return rank ?? NO_WINNING;
};
class UserInput extends Component {
  template() {
    return `
    <h2 class="user-input-title body">
      지난 주 당첨번호 6개와 보너스 번호 1개를 입력해주세요.
    </h2>
    <form class="user-input-form">
      <section class="user-input-section">
        <article class="user-input-win-article body">
          <p class="body">당첨 번호</p>
          ${Array(6).fill("").map(
      (_, i) => `
              <input type="text" class="user-input win-number" data-index="${i}" maxlength="2" />
            `
    ).join("")}
        </article>
        <article class="user-input-bonus-article body">
          <span class="body">보너스 번호</span>
          <input type="number" class="user-input bonus-number" />
        </article>
      </section>
      <section class="results-button-layout">
      </section>
    </form>
  `;
  }
  mounted() {
    new Button(qs(".results-button-layout"), {
      text: "결과 확인하기",
      size: "large",
      className: "results-button",
      type: "submit",
      onClick: this.handleButtonClick.bind(this)
    });
    const firstWinNumberInput = qs(".win-number");
    if (firstWinNumberInput) {
      firstWinNumberInput.focus();
    }
  }
  getWinNumberInputs() {
    const winNumberInputs = qsAll(".win-number");
    const winNumbers2 = Array.from(winNumberInputs).map(
      (input) => Number(input.value)
    );
    Validator.validateWinNumbers(winNumbers2);
    return winNumbers2;
  }
  getBonusNumberInput(winNumbers2) {
    const bonusNumberInput2 = qs(".bonus-number");
    const bonusNumber = Number(bonusNumberInput2.value);
    Validator.validateBonusNumber(bonusNumber, winNumbers2);
    return bonusNumber;
  }
  handleButtonClick(event) {
    try {
      event.preventDefault();
      const winNumbers2 = this.getWinNumberInputs();
      const bonusNumber = this.getBonusNumberInput(winNumbers2);
      const lottoCompany = new LottoCompany(winNumbers2, bonusNumber);
      const lottoRanks = lottoCompany.calculateLottoRanks(
        this.props.lottoList.lottoList
      );
      const totalProfit = lottoCompany.calculateTotalProfit(lottoRanks);
      if (this.props.onResult) {
        this.props.onResult({ lottoRanks, totalProfit });
      }
      this.props.openModal();
    } catch (error) {
      console.error("error", error);
      alert(error.message);
      winNumbers.forEach((input) => {
        input.value = "";
      });
      bonusNumberInput.value = "";
    }
  }
}
class App extends Component {
  constructor() {
    super(qs("#app"));
  }
  setUp() {
    this.initialState = { lottoList: [] };
    this.state = this.initialState;
  }
  template() {
    return `
      <header id="header-layout">
        <h1 class="header-layout-title title">🎱 행운의 로또</h1>
      </header>
      <main id="main-layout">
        <div class="amount-input-layout"></div>
        <section class="lotto-detail-layout"></section>
        <div class="user-input-layout"></div>
      </main>
      <div class='statistics-modal'></div>
      <footer class="footer lotto-caption">Copyright 2023. woowacourse</footer>
      `;
  }
  mounted() {
    const {
      state: { lottoList },
      setLottoList
    } = this;
    new AmountInput(qs(".amount-input-layout"), {
      setLottoList: setLottoList.bind(this),
      state: this.state
    });
    if (lottoList.length !== 0) {
      new LottoList(qs(".lotto-detail-layout"), lottoList);
      new UserInput(qs(".user-input-layout"), {
        lottoList,
        onResult: this.handleLottoResult.bind(this),
        openModal: this.openModal.bind(this)
      });
      new StatisticsModal(qs(".statistics-modal"), {
        lottoResults: this.state.lottoResults,
        lottoList,
        reset: this.reset.bind(this)
      });
    }
  }
  setLottoList(lottoList) {
    this.setState({ lottoList });
  }
  handleLottoResult({ lottoRanks, totalProfit }) {
    this.setState({
      lottoResults: {
        ranks: lottoRanks,
        profit: totalProfit
      }
    });
  }
  openModal() {
    qs(".statistics-dialog").showModal();
  }
  reset() {
    this.setState(this.initialState);
  }
}
new App(qs("#app"));
