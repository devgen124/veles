'use strict';
// слайдер
(function () {
  var _slider = document.querySelector('.slider'); // основный элемент блока
  var _wrapper = _slider.querySelector('.slider__wrapper'); // обертка для .slider-item
  var _items = _slider.querySelectorAll('.slider__item'); // элементы (.slider-item)
  var _controls = _slider.querySelectorAll('.slider__control'); // элементы управления
  var _controlLeft = _slider.querySelector('.slider__control--left'); // кнопка "LEFT"
  var _controlRight = _slider.querySelector('.slider__control--right'); // кнопка "RIGHT"
  var _quantity = _slider.querySelector('.slider__quantity'); // вывод общего кол-ва слайдов
  var _order = _slider.querySelector('.slider__order'); // вывод порядка текущего слайда
  var _position = 1; // позиция активного элемента
  var _transform = 0; // индекс транфсформации .slider_wrapper

  var position = {
    min: 1,
    max: _items.length
  };

  var _transformItem = function (direction) {
    if (direction === 'right') {
      _position++;
      _transform--;

      if (_controlLeft.disabled) {
        _controlLeft.disabled = false;
      }
      if (!_controlRight.disabled && _position === position.max) {
        _controlRight.disabled = true;
      }
    }
    if (direction === 'left') {
      _position--;
      _transform++;

      if (_controlRight.disabled) {
        _controlRight.disabled = false;
      }
      if (!_controlLeft.disabled && _position === position.min) {
        _controlLeft.disabled = true;
      }
    }
    _order.textContent = _position;
    _wrapper.style.transform = 'translateX(' + _transform * 100 + '%)';
  };

  // обработчик события click для кнопок "назад" и "вперед"
  var _controlClick = function (e) {
    if (e.target.classList.contains('slider__control') && !e.target.disabled) {
      e.preventDefault();
      var direction = e.target.classList.contains('slider__control--right') ? 'right' : 'left';
      _transformItem(direction);
    }
  };

  var _setUpListeners = function () {
    // добавление к кнопкам "назад" и "вперед" обработчика _controlClick для события click
    _controls.forEach(function (item) {
      item.addEventListener('click', _controlClick);
    });
  };

  // инициализация
  _quantity.textContent = _items.length;
  _setUpListeners();
})();

// мобильное меню

(function () {
  var _toggler = document.querySelector('.page-header__toggler');
  var _promo = document.querySelector('.promo');
  var _header = document.querySelector('.page-header');

  var _toggleMenu = function () {
    _toggler.classList.toggle('page-header__toggler--close');
    _header.classList.toggle('page-header--popup');
    _promo.classList.toggle('promo--hidden');
  };

  _toggler.addEventListener('click', _toggleMenu);
})();

// валидация формы

(function () {
  var KeyCode = {
    BACKSPACE: 8,
    ESCAPE: 27,
    ENTER: 13
  };

  var cbSection = document.querySelector('.consult');

  function validateCallbackForm(section) {
    var form = section.querySelector('form');
    var telInput = form.querySelector('input[type="tel"]');
    var swap;


    telInput.addEventListener('focus', function () {
      telInput.value = swap || '+7(';
    });

    telInput.addEventListener('blur', function () {
      telInput.value = '';
    });

    telInput.addEventListener('input', function () {
      if (telInput.value.match(/\+$|\+7$|\+7\([^\d]/)) {
        telInput.value = '+7('; // не допускает значений '+', '+7' и ввода после скобки нечисловых значений
      }
      if (!telInput.value.match(/\)/)) { // проверка на наличие закрывающей скобки
        if (telInput.value.match(/\+7\(\d+/)) {
          telInput.value = telInput.value.match(/\+7\(\d+/); // записывает в значение поля вводимые числа и блокирует ввод нечисловых значений
        }

        if (telInput.value.match(/\+7\(\d{3}/)) { // добавляет скобку после ввода 3 чисел
          telInput.value += ')';
        }
      } else {
        telInput.value = telInput.value.match(/\+7\(\d{3}\)\d{0,7}/);
      }

      telInput.addEventListener('keydown', function (evt) {
        if (evt.keyCode === KeyCode.BACKSPACE && telInput.value.match(/\+7\(\d{3}\)$/)) { // добавляет возможность удалять закрывающую скобку и число перед ней
          telInput.value = telInput.value.slice(0, -1);
        }
      });

      telInput.addEventListener('change', function () {
        swap = telInput.value;
      });
    });

    telInput.addEventListener('invalid', function () {
      telInput.setCustomValidity('Значение поля должно быть в формате: +7(999)9999999');
    });

  }

  validateCallbackForm(cbSection);
})();
