const DICE_GAME_MAX_ROUNDS = 3;

const DICE_IMAGE_SOURCE_WITH_PLACEHOLDER = './images/dice/dice-{0}.png';
const POPUP_IMAGE_SOURCE_CELEB = './images/celebration.webp';
const POPUP_IMAGE_SOURCE_DENOUN = './images/denouncing.gif';
const POPUP_IMAGE_SOURCE_TIE = './images/cat-cartoon.png';

const CURRENT_ROUND_INFO_TEXT = 'You have {0} left';
const LAST_TRY_TEXT = 'Last try!!!';
const RESULT_MESSAGE_TIE = "Tie. There's no winner this time.";
const RESULT_MESSAGE_TITLE_CELEBRATING = 'Hooray! You won.';
const RESULT_MESSAGE_SUBTITLE_CELEBRATING = 'Congratulations!';
const RESULT_MESSAGE_TITLE_DENOUNCING = 'Game Over';
const RESULT_MESSAGE_SUBTITLE_DENOUNCING = 'Sorry. You did not win this time.';

const $details = $('details');
const $btnRollDice = $('#btn-roll-dice');
const $btnNewGame = $('#btn-new-game');

const $popup = $('#popup-container');
const $btnClosePopup = $('#popup-close-btn');
const $popupImage = $('#popup-image');

const $imgUserDice1 = $('#user-dice-1');
const $imgUserDice2 = $('#user-dice-2');
const $imgCompDice1 = $('#comp-dice-1');
const $imgCompDice2 = $('#comp-dice-2');

const $divUserRoundScore = $('#user-round-score');
const $divUserTotalScore = $('#user-total-score');
const $divCompRoundScore = $('#comp-round-score');
const $divCompTotalScore = $('#comp-total-score');

const $divCurrentRoundText = $('#current-round-text');

const $resultMsgTitle = $('#result-message-title');
const $resultMsgSubTitle = $('#result-message-subtitle');

const userPlayer = new DiceGamePlayer('user');
userPlayer.addDiceToBowl(new Dice());
userPlayer.addDiceToBowl(new Dice());

const computerPlayer = new DiceGamePlayer('computer');
computerPlayer.addDiceToBowl(new Dice());
computerPlayer.addDiceToBowl(new Dice());

const diceGame = new Game(DICE_GAME_MAX_ROUNDS);
diceGame.addPlayer(userPlayer);
diceGame.addPlayer(computerPlayer);

$divCurrentRoundText.text(
  CURRENT_ROUND_INFO_TEXT.replace(
    '{0}',
    `${diceGame.getRemainingRounds()} rounds`
  )
);

$btnClosePopup.click(function (e) {
  setPopupMessageDisplay(false);
});

// Instruction toggling
$details.on('toggle', function (e) {
  const $indicator = $(e.target).find('span');
  if (e.target.open) {
    $indicator.text('[hide]');
  } else {
    $indicator.text('[show]');
  }
});

// Roll Dice button event handling
$btnRollDice.on('click', function (e) {
  if (diceGame.getRemainingRounds() === 0) {
    return;
  }

  diceGame.throwPlayersDiceTogether();
  updateUIDice();
  updateUIScore();
  updateCurrentRoundInfoText();
  if (diceGame.getRemainingRounds() === 0) {
    updateUIResultPopup();
    setPopupMessageDisplay(true);
    $btnRollDice.prop('disabled', true);
  }
});

// New Game button event handling
$btnNewGame.on('click', function (e) {
  diceGame.reset();
  updateUIScore();
  updateUIDice();
  updateCurrentRoundInfoText();
  $btnRollDice.prop('disabled', false);
});

/**
 * Updating images of dice based on current dice pips
 */
function updateUIDice() {
  const [dice1Pips, dice2Pips] = userPlayer.getRoundDicePips();
  if (dice1Pips && dice2Pips) {
    $imgUserDice1.attr(
      'src',
      DICE_IMAGE_SOURCE_WITH_PLACEHOLDER.replace('{0}', dice1Pips)
    );
    $imgUserDice2.attr(
      'src',
      DICE_IMAGE_SOURCE_WITH_PLACEHOLDER.replace('{0}', dice2Pips)
    );
  } else {
    $imgUserDice1.attr(
      'src',
      DICE_IMAGE_SOURCE_WITH_PLACEHOLDER.replace('{0}', 0)
    );
    $imgUserDice2.attr(
      'src',
      DICE_IMAGE_SOURCE_WITH_PLACEHOLDER.replace('{0}', 0)
    );
  }

  const [computerDice1Pips, computerDice2Pips] =
    computerPlayer.getRoundDicePips();

  if (computerDice1Pips && computerDice2Pips) {
    $imgCompDice1.attr(
      'src',
      DICE_IMAGE_SOURCE_WITH_PLACEHOLDER.replace('{0}', computerDice1Pips)
    );
    $imgCompDice2.attr(
      'src',
      DICE_IMAGE_SOURCE_WITH_PLACEHOLDER.replace('{0}', computerDice2Pips)
    );
  } else {
    $imgCompDice1.attr(
      'src',
      DICE_IMAGE_SOURCE_WITH_PLACEHOLDER.replace('{0}', 0)
    );
    $imgCompDice2.attr(
      'src',
      DICE_IMAGE_SOURCE_WITH_PLACEHOLDER.replace('{0}', 0)
    );
  }
}

/**
 * Updating UI for score number with number counting effect
 * @param {*} $uiElement The UI element to set text to
 * @param {*} newScore The score number to be displayed
 */
function updateScoreWithCountingEffect($uiElement, newScore) {
  const animate = ($uiElement, fromNumber, toNumber) => {
    if (toNumber === 0) {
      $uiElement.text(toNumber);
      return;
    }

    if (fromNumber >= toNumber) {
      return;
    }

    $uiElement.text(++fromNumber);
    setTimeout(() => {
      requestAnimationFrame(() => animate($uiElement, fromNumber, toNumber));
    }, 40);
  };

  const oldScore = parseInt($uiElement.text());
  requestAnimationFrame(() => animate($uiElement, oldScore, newScore));
}

/**
 * Updating UI for scores.
 */
function updateUIScore() {
  const userRoundScore = userPlayer.getRoundScore();
  $divUserRoundScore.text(userRoundScore);

  const compRoundScore = computerPlayer.getRoundScore();
  $divCompRoundScore.text(compRoundScore);

  const userTotalScore = userPlayer.getTotalScore();
  updateScoreWithCountingEffect($divUserTotalScore, userTotalScore);

  const compTotalScore = computerPlayer.getTotalScore();
  updateScoreWithCountingEffect($divCompTotalScore, compTotalScore);
}

/**
 * Updating information message shown below game
 * table.
 */
function updateCurrentRoundInfoText() {
  const remainingRounds = diceGame.getRemainingRounds();

  if (remainingRounds > 1) {
    message = CURRENT_ROUND_INFO_TEXT.replace(
      '{0}',
      `${remainingRounds} rounds`
    );
  } else if (remainingRounds === 1) {
    message = CURRENT_ROUND_INFO_TEXT.replace(
      '{0}',
      `${remainingRounds} round`
    ).concat(`. ${LAST_TRY_TEXT}`);
  } else {
    const userScore = userPlayer.getTotalScore();
    const computerScore = computerPlayer.getTotalScore();
    if (userScore === computerScore) {
      message = RESULT_MESSAGE_TIE;
    } else if (userScore > computerScore) {
      message = RESULT_MESSAGE_TITLE_CELEBRATING;
    } else {
      message = RESULT_MESSAGE_TITLE_DENOUNCING;
    }
  }

  $divCurrentRoundText.text(message);
}

/**
 * Updating UI for popup message.
 */
function updateUIResultPopup() {
  const userScore = userPlayer.getTotalScore();
  const computerScore = computerPlayer.getTotalScore();

  if (userScore === computerScore) {
    $popupImage.attr('src', POPUP_IMAGE_SOURCE_TIE);
    $resultMsgTitle.text(RESULT_MESSAGE_TIE);
  } else if (userScore > computerScore) {
    $resultMsgTitle.text(RESULT_MESSAGE_TITLE_CELEBRATING);
    $resultMsgSubTitle.text(RESULT_MESSAGE_SUBTITLE_CELEBRATING);
    $popupImage.attr('src', POPUP_IMAGE_SOURCE_CELEB);
  } else {
    $resultMsgTitle.text(RESULT_MESSAGE_TITLE_DENOUNCING);
    $resultMsgSubTitle.text(RESULT_MESSAGE_SUBTITLE_DENOUNCING);
    $popupImage.attr('src', POPUP_IMAGE_SOURCE_DENOUN);
  }
}

/**
 * Set the visibility of message popup.
 * @param {*} display `true` to show. `false` to hide.
 */
function setPopupMessageDisplay(display) {
  const setFadeInEffect = (opacity) => {
    if (opacity > 1) {
      $popup.css('opacity', 1);
      return;
    }

    $popup.css('opacity', opacity);
    opacity += 0.03;
    requestAnimationFrame(() => setFadeInEffect(opacity));
  };

  if (display) {
    $popup.removeClass('hide');
    $popup.addClass('show');
    setFadeInEffect(0);
  } else {
    $popup.removeClass('show');
    $popup.addClass('hide');
  }
}
