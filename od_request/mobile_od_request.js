

let currentTab = 1
function showContent(tabId, tabNum, clickedButton) {
  selectedTab = tabNum
  let newTabValue = selectedTab - currentTab
  movingTabs(newTabValue);
  currentTab = selectedTab

  var allButtons = document.querySelectorAll('.tab-btn');
  allButtons.forEach(function (button) {
    button.classList.remove('isActive');
    button.style.fontWeight = 'normal';
  });
  clickedButton.classList.add('isActive');
  clickedButton.style.color = '#5f96d8';

  var line = document.getElementById('actbtn');
  if (line) {
    line.style.borderBottom = 'none';
  }
  var tabBox = document.querySelector('.tab-box');
  var lineElement = document.querySelector('.line');
  var button = document.querySelector('[data-tab="' + tabId + '"]');

  // Hide all tab contents and adjust the line position
  var tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(function (content) {
    content.classList.remove('active');
  });
  var buttonRect = button.getBoundingClientRect();
  var tabBoxRect = tabBox.getBoundingClientRect();
  var offsetLeft = buttonRect.left - tabBoxRect.left;

  lineElement.style.width = button.offsetWidth + 'px';
  lineElement.style.transform = 'translateX(' + offsetLeft + 'px)';

  // Show the selected tab content
  var selectedTab = document.getElementById(tabId);
  if (selectedTab) {
    selectedTab.classList.add('active');
  }
  switch (tabId) {
    case 'activity':
      handleActivity();
      break;
    case 'notes':
      handleNotes();
      break;
    default:
      break;
  }
}

function movingTabs(value) {
  const cards = document.querySelectorAll('.tab-content');
  cards.forEach((card, index) => {
    card.classList.remove('moving-left', 'moving-right');
    if (value > 0) {
      card.classList.add('moving-left');

    } else if (value < 0) {
      card.classList.add('moving-right');

    } else {
      card.classList.remove('moving-left', 'moving-right');
    }
  });
}

function LineAdjust() {
  var line = document.getElementById('actbtn');
  if (line) {
    line.style.borderBottom = '4px solid #311212';
  }
}

function handleActivity() {

}

function handleNotes() {
  
}

let qafServiceLoaded = setInterval(() => {
  if (window.QafService) {
   
  }
}, 10);

