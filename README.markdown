# Chained [![Build Status](https://travis-ci.org/tuupola/jquery_chained.png?branch=master)](https://travis-ci.org/tuupola/jquery_chained)

Chained is simple plugin for chained selects. It works with both jQuery and Zepto. You can choose from two different versions. Use jquery.chained.js if you do not want to make external queries for setting content of child selects. This version uses classnames of select options to decide content.

For more complex scenarios maintaining option tag classnames will get cumbersome. Also if you want to make queries against database use jquery.chained.remote.js instead. This version makes an external AJAJ query and uses the returned JSON to build child selects.

## Simple usage

Child selects are chained to parent select. All selects must have an id attribute. Child select options must have class names which match option values of parent select. When user selects something in parent select the options in child select are updated. Options which have matching classname with parents currently selected option will stay visible. Others are hidden.

First you must include jQuery or Zepto and Chained in your code:

```html
<script src="jquery.js"></script>
<script src="jquery.chained.js"></script>
```

If you are using Zepto you must also include the optional selector module.

```html
<script src="zepto.js"></script>
<script src="zepto-selector.js"></script>
<script src="jquery.chained.js"></script>
```

Then lets assume you have the following HTML code:

```html
<select id="mark" name="mark">
  <option value="">--</option>
  <option value="bmw">BMW</option>
  <option value="audi">Audi</option>
</select>
<select id="series" name="series">
  <option value="">--</option>
  <option value="series-3" class="bmw">3 series</option>
  <option value="series-5" class="bmw">5 series</option>
  <option value="series-6" class="bmw">6 series</option>
  <option value="a3" class="audi">A3</option>
  <option value="a4" class="audi">A4</option>
  <option value="a5" class="audi">A5</option>
</select>
```

You can now chain the series to mark. There are two different ways to do it. Choose yourself if you prefer more english like or shorter version. I prefer the shorter version.

```javascript
$("#series").chained("#mark"); /* or $("#series").chainedTo("#mark");
```

## Chaining to multiple parents

One child can have two parents. Available options in child which chained to multiple parents depend on one or both of the parents selected values. To make child select depend on values of both parents use classname like <code>first\second</code>.

Here is code for fourth select. Note how diesel engine is available only for BMW 3 and 5 series Sedans. This is achieved by using classnames <code>series-3\sedan</code> and <code>series-5\sedan</code>.

```html
<select id="engine" name="engine">
  <option value="">--</option>
  <option value="25-petrol" class="series-3 a3 a4">2.5 petrol</option>
  <option value="30-petrol" class="series-3 series-5 series-6 a3 a4 a5">3.0 petrol</option>
  <option value="30-diesel" class="series-3\sedan series-5\sedan a5">3.0 diesel</option>
</select>
```
```javascript
$("#series").chained("#mark");
$("#model").chained("#series");
$("#engine").chained("#series, #model");
```

## Usage with AJAX

For instructions on how how to build selects using JSON data, see the [project homepage](http://www.appelsiini.net/projects/chained).

# License

All code licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).

# Changelog

### 0.9.9

* Do not trigger change event if value of select does not change ([Brendon Muir](https://github.com/brendon))

### 0.9.8

* Rename "values" setting to more logical "depends".

### 0.9.7

* Removed unneeded files when installing with Bower.

### 0.9.6

* Zepto support.
* Bower support.
* Ability to bootstrap selects by passing JSON data in settings. Avoids making the initial AJAX calls.
* Alternate but prettier syntax for remote version. Allow you to pass all settings as one hash.
* Optionally send additional values of non chained inputs when using remote version

### 0.9.5

* Fix bug [#12](https://github.com/tuupola/jquery_chained/issues/12). Minified versions were missing trailing semicolon;
* Support for Travis and Grunt.

### 0.9.4

* Remote version now uses name attribute instead id when sending AJAJ query.

### 0.9.3

* Also support remote JSON to be array of arrays ([Marco Mariani](https://github.com/mmariani))

### 0.9.2

* Support for [jQuery plugin repository](http://plugins.jquery.com/)

### 0.9.1

* Allow options to be preselected in HTML ([Nathan Gray](https://github.com/kolibrie))

### 0.9.0

* Initial release
